<template>
    <div id="table-container">
        <input type="text" id="filter-bar" placeholder="Filter" v-model="filterText" @input="() => getFilteredUsers()">
        <table :class="botStatus === 'offline' ? 'grey-table' : ''">
            <thead>
                <tr>
                    <th @click="sortTable('username')">Username <font-awesome-icon icon="fa-solid fa-sort" class="icon" />
                    </th>
                    <th @click="sortTable('status')">Status <font-awesome-icon icon="fa-solid fa-sort" class="icon" /></th>
                    <th @click="sortTable('unmuted_time')">Mic. Open <font-awesome-icon icon="fa-solid fa-sort"
                            class="icon" /></th>
                    <th @click="sortTable('total_time_muted')">Mic. Muted <font-awesome-icon icon="fa-solid fa-sort"
                            class="icon" /></th>
                    <th @click="sortTable('total_time_sound_muted')">Sound Muted <font-awesome-icon icon="fa-solid fa-sort"
                            class="icon" /></th>
                    <th @click="sortTable('voice_channel')">Voice Channel <font-awesome-icon icon="fa-solid fa-sort"
                            class="icon" /></th>
                    <th @click="sortTable('total_time')">Total Time in Channel <font-awesome-icon icon="fa-solid fa-sort"
                            class="icon" /></th>
                    <th @click="sortTable('online_total')">Online Total <font-awesome-icon icon="fa-solid fa-sort"
                            class="icon" /></th>
                    <th @click="sortTable('idle_total')">Idle Total <font-awesome-icon icon="fa-solid fa-sort"
                            class="icon" /></th>
                    <th @click="sortTable('dnd_total')">Do Not Disturb Total <font-awesome-icon icon="fa-solid fa-sort"
                            class="icon" /></th>
                    <th @click="sortTable('percentage_total')">% of Online Time on Discord<font-awesome-icon
                            icon="fa-solid fa-sort" class="icon" /></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in filteredUsers" :key="user.user_id">
                    <td>{{ user.username }}</td>
                    <td>{{ getUserStatusIcon(user.status) }}</td>
                    <td>{{ formatTime(user.unmuted_time) }}</td>
                    <td>{{ formatTime(user.total_time_muted) }}</td>
                    <td>{{ formatTime(user.total_time_sound_muted) }}</td>
                    <td>{{ user.voice_channel }}</td>
                    <td>{{ formatTime(user.total_time) }}</td>
                    <td>{{ formatTime(user.online_total) }} </td>
                    <td>{{ formatTime(user.idle_total) }} </td>
                    <td>{{ formatTime(user.dnd_total) }} </td>
                    <td>{{ user.percentage_total }}%</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { useBotStatusStore } from '@/stores/botStatusStore';
import type { User } from '@/interfaces/User';

const props = defineProps<{
    serverId: string;
}>();

const users = ref<User[]>([]);
const filteredUsers = ref<User[]>([]);
const filterText = ref("");
const sortColumn = ref<string>(''); // The column to sort by
const sortDirection = ref<number>(1); // The direction to sort by (1 = ascending, -1 = descending)
const botStatusStore = useBotStatusStore();
const botStatus = ref(botStatusStore.status);

let manualSort: boolean = false;

function getUserData(): void {
    const requestData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ serverId: props.serverId })
    };
    const url = (import.meta.env.DEV ? import.meta.env.VITE_IP_LOCALHOST : import.meta.env.VITE_IP_PROD) + "/users";
    fetch(url, requestData)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then((data) => {
            // Beide füllen. users als Cache und filteredUsers als Filter
            manualSort = false;
            users.value = data;
            users.value.forEach(user => {
                const percentage = Math.round(user.total_time / (user.online_total + user.idle_total + user.dnd_total) * 100);
                user.percentage_total = percentage ? percentage : 0;
            });

            filteredUsers.value = [...users.value];

            getFilteredUsers();
            sortTable(sortColumn.value as keyof User);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

function getUserStatusIcon(status: string) {
    if (status == 'online') {
        return '🟢';
    } else if (status == 'offline') {
        return '⚫';
    } else if (status == 'idle') {
        return '🟡';
    } else if (status == 'dnd') {
        return '🔴';
    }
}

function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function getFilteredUsers() {
    filteredUsers.value = users.value.filter(user => {
        return user.username.toLowerCase().includes(filterText.value.toLowerCase());
    });
}

function sortTable(column: keyof User) {
    if (sortColumn.value === column) {
        if (manualSort) {
            sortDirection.value = -sortDirection.value;
        }
    } else {
        sortColumn.value = column;
        sortDirection.value = 1;
    }

    filteredUsers.value.sort((a, b) => {
        const aValue = a[column];
        const bValue = b[column];

        if (column === 'status') {
            const statusOrder = ['online', 'idle', 'dnd', 'offline'];

            const aStatusIndex = statusOrder.indexOf(String(aValue));
            const bStatusIndex = statusOrder.indexOf(String(bValue));

            if (aStatusIndex < bStatusIndex) {
                return -sortDirection.value;
            }
            if (aStatusIndex > bStatusIndex) {
                return sortDirection.value;
            }
            return 0;
        }

        if (aValue < bValue) {
            return -sortDirection.value;
        }
        if (aValue > bValue) {
            return sortDirection.value;
        }
        return 0;
    });
    manualSort = true;
};

function handleScroll() {
    const firstTh = document.querySelector("table th:first-child") as HTMLTableCellElement;
    const lastTh = document.querySelector("table th:last-child") as HTMLTableCellElement;

    if (firstTh && lastTh) {
        // 187 is the height of the table header in my case, just testing
        if (window.scrollY > 187) {
            firstTh.style.borderTopLeftRadius = "0";
            lastTh.style.borderTopRightRadius = "0";
        } else {
            firstTh.style.borderTopLeftRadius = "10px";
            lastTh.style.borderTopRightRadius = "10px";
        }
    }
}

watch(() => botStatusStore.status, (newStatus) => {
    botStatus.value = newStatus;
});

onMounted(() => {
    getUserData();
    setInterval(getUserData, 5000);
    window.addEventListener('scroll', handleScroll);
});
</script>

<style scoped>
table {
    display: block;
    border-collapse: collapse;
    border-radius: 10px;
    width: 85%;
    border-style: hidden;
    box-shadow: 0 0 10px 2px #666;
    white-space: nowrap;
    overflow-x: scroll;
}

table th:first-child {
    border-top-left-radius: 10px;
}

table th:last-child {
    border-top-right-radius: 10px;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}

th {
    color: white;
    background-color: #252536;
    font-weight: bold;
    cursor: pointer;
    -webkit-user-select: none;
    /* Safari */
    -ms-user-select: none;
    /* IE 10 and IE 11 */
    user-select: none;
    /* Standard syntax */
    top: 0;
    position: sticky;
}

th:hover {
    background-color: rgba(57, 57, 73, 0.9);
}

#table-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    padding: 2rem;
}

#filter-bar {
    margin-bottom: 2rem;
    width: 85%;
    height: 3rem;
    font-size: 1.5rem;
    color: rgb(175, 175, 175);
    border-radius: 8rem;
    border: 2.5px solid rgb(175, 175, 175);
    text-align: start;
    padding-left: 1rem;
}

.icon {
    padding-left: 3px;
}

.grey-table {
    background-color: #ccc;
    filter: grayscale(100%) blur(2px);
}
</style>