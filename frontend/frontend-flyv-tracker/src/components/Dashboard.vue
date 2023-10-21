<template>
  <div>
    <p>Hey, {{ userName }}!</p>

    <h2>Deine Server:</h2>
    <div class="server-grid">
      <ServerCard v-for="server in servers" :key="server.id" :server="server" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Server } from '@/interfaces/Server';
import { useUserStore } from '@/stores/userStore';
import ServerCard from '@/components/ServerCard.vue';
import { useAuthStore } from '@/stores/authStore';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();
const userName = userStore.global_name;

const servers = ref<Server[]>([]);

async function fetchGuilds(access: string): Promise<Server[] | null> {
  const url = 'https://discord.com/api/v10/users/@me/guilds';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access}`,
      },
    });
    if (response.ok) {
      const guilds: Server[] = await response.json();
      console.log('guilds', guilds);
      return guilds;
    }
    console.log(response.status, response.statusText);
    return null;

  } catch (error) {
    console.error('Error', error);
    return null;
  }
}

/*async function checkBotMembership(token: string, server: Server) {
  const url = `https://discord.com/api/v10/guilds/${server.id}/members/@me`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bot ${token}`,
      },
    });

    if (response.ok) {
      console.log('Bot ist Mitglied auf Server:', server.name);
      return;
    }
    if (response.status === 403) {
      console.log('Bot ist kein Mitglied auf Server:', server.name);
      return;
    }

    console.error('Fehler beim Überprüfen der Mitgliedschaft auf Server:', server.name);

  } catch (error) {
    console.error('Fehler beim Überprüfen der Mitgliedschaft auf Server:', server.name, error);
  }
}*/

onMounted(async () => {
  const token = useAuthStore().accessToken;
  const loadedServers = await fetchGuilds(token);
  if (loadedServers) {
    servers.value = loadedServers;
    /*for (const server of servers.value) {
      await checkBotMembership(token, server);
    }*/
  }
});
</script>

<style scoped>
.server-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 5rem;
}
</style>

