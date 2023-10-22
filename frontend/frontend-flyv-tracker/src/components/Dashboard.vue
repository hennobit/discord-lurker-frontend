<template>
  <div>
    <p>Hey, {{ userName }}!</p>

    <h2>Your Servers:</h2>
    <div class="server-grid">
      <ServerCard v-for="guild in guilds" :key="guild.id" :server="guild" :active-bot="guild.isBotPresent" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Server } from '@/interfaces/Server';
import { useUserStore } from '@/stores/userStore';
import ServerCard from '@/components/ServerCard.vue';
import { useAuthStore } from '@/stores/authStore';
import { onMounted, ref, watch } from 'vue';

const guilds = ref<Server[]>([]);
const userStore = useUserStore();
const userName = userStore.global_name;

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
      const servers: Server[] = await response.json();
      guilds.value = servers;
      await getGuildsWithBotOnIt();
    }
    return null;

  } catch (error) {
    console.error('Error', error);
    return null;
  }
}

async function getGuildsWithBotOnIt(): Promise<string[]> {
  const serverIds = guilds.value.map((guild) => guild.id);
  try {
    const url = (import.meta.env.DEV ? import.meta.env.VITE_IP_LOCALHOST : import.meta.env.VITE_IP_PROD) + "/checkservers";
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serverIds,
      }),
    });

    if (response.ok) {
      const responseJson = await response.json();
      const serverIds: string[] = responseJson.serverIds;
      guilds.value.forEach((guild) => {
        if (serverIds.includes(guild.id)) {
          guild.isBotPresent = true;
        } else {
          guild.isBotPresent = false;
        }
      });

      // sort guilds by bot presence
      guilds.value.sort((a, b) => {
        if (a.isBotPresent && !b.isBotPresent) {
          return -1; 
        } else if (!a.isBotPresent && b.isBotPresent) {
          return 1; 
        } else {
          return 0; 
        }
      });

      return responseJson;
    }

  } catch (error) {
    console.error('Error', error);
  }
  return [];
}

onMounted(async () => {
  await fetchGuilds(useAuthStore().accessToken);
  await getGuildsWithBotOnIt();
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

