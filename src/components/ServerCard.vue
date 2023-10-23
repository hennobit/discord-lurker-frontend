<template>
    <div class="server-card" @click="goToUserTable" :class="{ 'inactive-server': !activeBot }">
        <img :src="getServerIconUrl()" alt="Server Icon" id="server-icon">
        <p id="server-name">{{ server.name }}</p>
    </div>
</template>
    
<script setup lang="ts">
import type { Server } from '@/interfaces/Server';
import router from '@/router';
import { defineProps } from 'vue';

const props = defineProps<{
    server: Server,
    activeBot: boolean;
}>();

function getServerIconUrl() {
    if (!props.server.icon) {
        return 'https://bulma.io/images/placeholders/128x128.png';
    }

    const iconUrl = `https://cdn.discordapp.com/icons/${props.server.id}/${props.server.icon}.png`;

    return iconUrl;
}

function goToUserTable() {
    if (!props.activeBot) {
        return;
    }
    router.push({
        name: 'Data',
        params: { serverId: props.server.id },
        query: { serverName: props.server.name }
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
    box-shadow: 0 0 15px rgba(138, 138, 138, 0.7);
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

.inactive-server {
    background-color: #ccc;
    filter: grayscale(50%) blur(1px);
    cursor: not-allowed;
}
</style>
  