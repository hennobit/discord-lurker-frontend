<template>
    <p>
        Bot is <span class="info">{{ botStatus }}</span> and running since
        <span class="info">{{ runningSince }}</span> with
        <span class="info-downtime" @mouseenter="showDowntimeDetails = true" @mouseleave="showDowntimeDetails = false">{{ downtimes.length  }}
            <div id="downtime-div" v-if="showDowntimeDetails" @mouseenter="showDowntimeDetails = true"
                @mouseleave="showDowntimeDetails = false">
                <p v-if="downtimes.length > 0" v-for="(downtime, index) in downtimes" class="downtime-time">
                    {{ index + 1}}. {{ downtime.from }} - {{ downtime.to }}
                </p>
                <p v-else>No downtimes.</p>
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
const downtimes = ref([] as { from: string, to: string }[]);

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
            runningSince.value = data.runningSince;
        })
        .catch(error => {
            console.error('Fehler bei der Anfrage an /runningsince:', error);
        });
};

async function getDowntimes(): Promise<void> {
    await fetch('http://localhost:3000/downtimes')
        .then(response => response.json())
        .then(data => {
            downtimes.value = data.downtimes;
            console.log(downtimes.value);
        })
        .catch(error => {
            console.error('Fehler bei der Anfrage an /downtimes:', error);
        });
};

onMounted(() => {
    getBotStatus();
    getRunningSinceDate();
    getDowntimes();
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
    white-space: nowrap;
    position: absolute;
    top: 20px;
    left: 0;
    color: white;
    background-color: rgb(255, 90, 90);
    padding: 0.5rem;
    border-radius: 0.4rem;
    z-index: 1;
}

.downtime-time {
    font-weight: bolder;
}
</style>