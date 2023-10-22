<template>
  <div id="container">
    <h1 id="greetings">Hey, {{ userName }}!</h1>

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
import { onMounted, ref } from 'vue';
import { useGuildsStore } from '@/stores/guildsStore';

const guilds = ref<Server[]>([]);
const userStore = useUserStore();
const userName = userStore.global_name;

async function fetchGuilds(access: string) {
  guilds.value = useGuildsStore().guilds;

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
      if (servers.length === guilds.value.length) {
        return;
      }
      guilds.value = servers;
      await getGuildsWithBotOnIt();
    }
    return;

  } catch (error) {
    console.error('Error', error);
    return;
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

      useGuildsStore().setGuilds(guilds.value);
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
#container {
  padding: 5rem;
  text-align: left;
}

.server-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 2rem;
}

#greetings {
  font-size: 2rem;
  font-weight: 700;
  font-family: Helvetica;
  letter-spacing: 1px;
}
</style>

