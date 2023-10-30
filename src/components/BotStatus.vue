<template>
    <p>
        Bot is <span class="info">{{ botStatus }}</span> and tracks this server since
        <span class="info">{{ trackingSince }}</span> with
        <span class="info-downtime" @mouseenter="showDowntimeDetails = true" @mouseleave="showDowntimeDetails = false">{{
            downtimes.length }}
            <div id="downtime-div" v-if="showDowntimeDetails" @mouseenter="showDowntimeDetails = true"
                @mouseleave="showDowntimeDetails = false">
                <p v-if="downtimes.length > 0" v-for="(downtime, index) in downtimes" class="downtime-time">
                    {{ index + 1 }}. {{ downtime.from }} - {{ downtime.to }}
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

const props = defineProps<{
    serverId: string;
}>();

const botStatusStore = useBotStatusStore();
const botStatus = ref(botStatusStore.status);
//const runningSince = ref('');
const trackingSince = ref('');
const showDowntimeDetails = ref(false);
const downtimes = ref([] as { from: string, to: string; }[]);

watch(() => botStatusStore.status, (newStatus) => {
    botStatus.value = newStatus;
});

async function getBotStatus(): Promise<void> {
    const url = (import.meta.env.DEV ? import.meta.env.VITE_IP_LOCALHOST : import.meta.env.VITE_IP_PROD) + "/heartbeat";
    await fetch(url)
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

async function getTrackingSince() {
    const url = (import.meta.env.DEV ? import.meta.env.VITE_IP_LOCALHOST : import.meta.env.VITE_IP_PROD) + "/trackingsince";
    // we need to create a post request with the server id
    const requestData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ serverId: props.serverId })
    };
    await fetch(url, requestData)
        .then(response => response.json())
        .then(data => {
            trackingSince.value = new Date(data.trackingSince).toLocaleString();
        })
        .catch(error => {
            console.error('Fehler bei der Anfrage an /trackingsince:', error);
        });
}

/*async function getRunningSinceDate(): Promise<void> {
    const url = (import.meta.env.DEV ? import.meta.env.VITE_IP_LOCALHOST : import.meta.env.VITE_IP_PROD) + "/runningsince";
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            runningSince.value = data.runningSince;
        })
        .catch(error => {
            console.error('Fehler bei der Anfrage an /runningsince:', error);
        });
};*/

async function getDowntimes(): Promise<void> {
    const url = (import.meta.env.DEV ? import.meta.env.VITE_IP_LOCALHOST : import.meta.env.VITE_IP_PROD) + "/downtimes";
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            downtimes.value = data.downtimes;
        })
        .catch(error => {
            console.error('Fehler bei der Anfrage an /downtimes:', error);
        });
};

onMounted(() => {
    getBotStatus();
    //getRunningSinceDate();
    getTrackingSince();
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
    border-radius: 0.4rem;
    z-index: 1;
}

.downtime-time {
    font-weight: bolder;
}

p {
    text-align: center;
}
</style>