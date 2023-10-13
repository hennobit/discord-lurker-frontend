<template>
    <p>Bot Status: {{ botStatus }}</p>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch} from 'vue';
import { useBotStatusStore } from '@/stores/botStatusStore';

const botStatusStore = useBotStatusStore();
const botStatus = ref( botStatusStore.status);

watch(() => botStatusStore.status, (newStatus) => {
    botStatus.value = newStatus;
});

async function getBotStatus(): Promise<void> {
    await fetch('http://localhost:3000/heartbeat')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'online') {
                botStatusStore.setStatus('🟢');
                return;
            }
            botStatusStore.setStatus('🔴');
        })
        .catch(error => {
            console.error('Fehler bei der Anfrage an /heartbeat:', error);
        });
};

onMounted(() => {
    getBotStatus();
    setInterval(getBotStatus, 5000);
});

</script>

<style scoped></style>