<template>
    <div id="container">
        <h1>{{ serverName }}</h1>
        <BotStatus :server-id="serverId"></BotStatus>
        <UserTable :server-id="serverId"></UserTable>
    </div>
</template>

<script lang="ts" setup>
import UserTable from '@/components/UserTable.vue';
import BotStatus from '@/components/BotStatus.vue';

const props = defineProps<{
    serverId: string;
    serverName: string;
}>();

</script>

<style scoped>
#container {
    display: flex;
    align-items: center;
    flex-direction: column;
    max-height: 100vh;
}
</style>
