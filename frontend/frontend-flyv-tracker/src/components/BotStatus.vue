<template>
    <p>
        Bot is <span class="info">{{ botStatus }}</span> and running since
        <span class="info">{{ runningSince }}</span> with
        <span class="info-downtime" @mouseenter="showDowntimeDetails = true" @mouseleave="showDowntimeDetails = false">2
            <div id="downtime-div" v-if="showDowntimeDetails" @mouseenter="showDowntimeDetails = true"
                @mouseleave="showDowntimeDetails = false">
                <p>
                    1. Downtime 14.10.2021 12:00 - 14.10.2021 13:00<br>
                    2. Downtime 14.10.2021 14:00 - 14.10.2021 15:00</p>
            </div>
        </span>
        downtimes
    </p>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useBotStatusStore } from '@/stores/botStatusStore';

const botStatusStore = useBotStatusStore();
const botStatus = ref(botStatusStore.status);
const runningSince = ref('');
const showDowntimeDetails = ref(false);

watch(() => botStatusStore.status, (newStatus) => {
    botStatus.value = newStatus;
});

async function getBotStatus(): Promise<void> {
    await fetch('http://localhost:3000/heartbeat')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'online') {
                botStatusStore.setStatus('online');
                return;
            }
            botStatusStore.setStatus('offline');
        })
        .catch(error => {
            console.error('Fehler bei der Anfrage an /heartbeat:', error);
        });
};

async function getRunningSinceDate(): Promise<void> {
    await fetch('http://localhost:3000/runningsince')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            runningSince.value = data.runningSince;
            console.log(runningSince.value);
        })
        .catch(error => {
            console.error('Fehler bei der Anfrage an /runningsince:', error);
        });
};

onMounted(() => {
    getBotStatus();
    getRunningSinceDate();
    setInterval(getBotStatus, 5000);
});

</script>

<style scoped>
.info {
    font-weight: bold;
}

.info-downtime {
    font-weight: bold;
    text-decoration: underline;
    position: relative;
}

#downtime-div {
    position: absolute;
    top: 20px;
    left: 0;
    color: white;
    background-color: rgb(255, 90, 90);
    width: 21.3rem;
    padding: 0.5rem;
    border-radius: 0.4rem;
    z-index: 1;
}
</style>