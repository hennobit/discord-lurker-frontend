<template>
    <div id="container">
        <h1>{{ serverName }}</h1>
        <BotStatus></BotStatus>
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
    width: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>
