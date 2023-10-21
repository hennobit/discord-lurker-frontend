<template>
    <div class="server-card" @click="goToUserTable">
        <img :src="getServerIconUrl()" alt="Server Icon" id="server-icon">
        <p id="server-name">{{ server.name }}</p>
    </div>
</template>
  
<script setup lang="ts">
import type { Server } from '@/interfaces/Server';
import router from '@/router';
import { ref } from 'vue';

const props = defineProps<{
    server: Server;
}>();

const server = ref(props.server);

function getServerIconUrl() {
    if (!props.server.icon) {
        return 'https://bulma.io/images/placeholders/128x128.png';
    }

    const iconUrl = `https://cdn.discordapp.com/icons/${props.server.id}/${props.server.icon}.png`;

    return iconUrl;
}

function goToUserTable() {
    router.push({
        name: 'Data',
        params: { serverId: server.value.id }, 
        query: { serverName: server.value.name } 
    });
}
</script>
  
<style scoped>
.server-card {
    border: 1px solid #ddd;
    border-radius: 1rem;
    padding: 20px;
    text-align: center;
    width: auto;
    height: auto;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    cursor: pointer;
}

.server-card img {
    max-width: 100px;
    max-height: 100px;
    margin: 0 auto;
}

#server-icon {
    border-radius: 1rem;
    box-shadow: 0 0 15px rgb(138, 138, 138, 0.7);
}

#server-name {
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    font-size: large;
    letter-spacing: .5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
  