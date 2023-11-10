<template>
    <div>
        <p v-if="isAuthenticating">Authenticating...</p>
        <p v-else-if="isAuthenticated">Success!</p>
        <p v-else>Error</p>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { useAuthStore } from '@/stores/authStore';
import { fetchUserInfo, useUserStore } from '@/stores/userStore';
import { ref, onMounted } from 'vue';

const isAuthenticating = ref(false);
const isAuthenticated = ref(false);
//deploytest2
async function auth() {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
        isAuthenticating.value = true;

        try {
            const formData = new URLSearchParams({
                client_id: "1160542994269741087",
                client_secret: await getSecret(),
                grant_type: 'authorization_code',
                code: code.toString(),
                redirect_uri: import.meta.env.DEV ? 'http://localhost:5173/#/auth' : 'https://discord-lurker.com/#/auth',
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
                const expiresAt = Date.now() + tokenData.expires_in * 1000;

                useAuthStore().setAccessToken(access, expiresAt);
                console.log('set Access Token in Auth.vue', access);

                isAuthenticated.value = true;
                isAuthenticating.value = false;

                const userInfo = await fetchUserInfo(access);
                if (userInfo) {
                    useUserStore().setUserData(userInfo);
                }
                // what is this???
                if (window.location.search.includes('code=')) {
                    const newUrl = window.location.href.split('?')[0] + '#/dashboard';
                    window.history.replaceState({}, document.title, newUrl);
                }
                router.push('/dashboard');
            } else {
                console.error('Error Token Response', tokenResponse);
                isAuthenticating.value = false;
            }
        } catch (error) {
            console.error(error);
            isAuthenticating.value = false;
        }
    }
}

async function getSecret(): Promise<string> {
    const url = (import.meta.env.DEV ? import.meta.env.VITE_IP_LOCALHOST : import.meta.env.VITE_IP_PROD) + "/secret";
    const response = await fetch(url);
    const secret = response.text();
    return secret;
}

onMounted(async () => {
    await auth();
});
</script>

<style scoped></style>