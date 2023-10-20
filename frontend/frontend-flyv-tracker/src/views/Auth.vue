<template>
    <div>
        <p v-if="isAuthenticating">Authenticating...</p>
        <p v-else-if="isAuthenticated">Success!</p>
        <p v-else>Error</p>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isAuthenticating = ref(false);
const isAuthenticated = ref(false);

async function auth() {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
        isAuthenticating.value = true;

        try {
            const formData = new URLSearchParams({
                client_id: import.meta.env.VITE_CLIENT_ID,
                client_secret: import.meta.env.VITE_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code.toString(),
                redirect_uri: 'http://localhost:5173/auth',
            });

            const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            if (tokenResponse.ok) {
                const tokenData = await tokenResponse.json();
                const access = tokenData.access_token;

                isAuthenticated.value = true;
                isAuthenticating.value = false;

                await fetchUserInfo(access);
                await fetchGuilds(access);

            } else {
                console.error('Fehler beim Token-Austausch');
                isAuthenticating.value = false;
            }
        } catch (error) {
            console.error(error);
            isAuthenticating.value = false;
        }
    }
}

async function fetchUserInfo(access: string) {
    const userInfoResponse = await fetch('https://discord.com/api/v10/users/@me', {
        headers: {
            'Authorization': `Bearer ${access}`,
        },
    });

    if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();

        console.log(userInfo);
    } else {
        console.error('Fehler beim Abrufen der Benutzerinformationen');
        isAuthenticating.value = false;
    }
}

async function fetchGuilds(access: string) {
    const url = 'https://discord.com/api/v10/users/@me/guilds';
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access}`,
            },
        });
        if (response.ok) {
            const guilds = await response.json();
            console.log('guilds', guilds);
            return guilds;
        } else {
            console.log(response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error('Error', error);
        return null;
    }
};


onMounted(async () => {
    await auth();
});
</script>

<style scoped></style>