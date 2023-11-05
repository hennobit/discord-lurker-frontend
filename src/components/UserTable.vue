<template>
    <div id="table-container">
        <input type="text" id="filter-bar" placeholder="Filter" v-model="filterText" @input="() => updateFilteredUsers()">
        <FilterPanel></FilterPanel>
        <table id="table">
            <thead>
                <tr>
                    <th @click="sortTable('username')">Username</th>
                    <th @click="sortTable('status')">Status </th>
                    <th @click="sortTable('unmuted_time')">Mic. Open </th>
                    <th @click="sortTable('total_time_muted')">Mic. Muted </th>
                    <th @click="sortTable('total_time_sound_muted')">Sound Muted </th>
                    <th @click="sortTable('voice_channel')">Voice Channel </th>
                    <th @click="sortTable('total_time')">Total Time in Channel </th>
                    <th @click="sortTable('online_total')">Online Total </th>
                    <th @click="sortTable('idle_total')">Idle Total </th>
                    <th @click="sortTable('dnd_total')">Do Not Disturb Total </th>
                    <th @click="sortTable('percentage_total')">% of Online Time on Discord</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in filteredUsers" :key="user.user_id">
                    <td>
                        <div class="user-info">
                            <span class="username">{{ user.username }}</span>
                            <flair v-if="user.is_bot === 1" :name="'Bot'" :color="'#7da3f5'"></flair>
                        </div>
                    </td>
                    <td>{{ getUserStatusIcon(user.status) }}</td>
                    <td>{{ formatTime(user.unmuted_time) }}</td>
                    <td>{{ formatTime(user.total_time_muted) }}</td>
                    <td>{{ formatTime(user.total_time_sound_muted) }}</td>
                    <td>{{ user.voice_channel }}</td>
                    <td>{{ formatTime(user.total_time) }}</td>
                    <td>{{ formatTime(user.online_total) }}</td>
                    <td>{{ formatTime(user.idle_total) }}</td>
                    <td>{{ formatTime(user.dnd_total) }}</td>
                    <td>{{ user.percentage_total }}%</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import type { User } from '@/interfaces/User';
import FilterPanel from './FilterPanel.vue';
import Flair from './Flair.vue';
import { useFilterStore } from '@/stores/filterStore';

const props = defineProps<{
    serverId: string;
}>();

const filterStore = useFilterStore()

const users = ref<User[]>([]);
const filteredUsers = ref<User[]>([]);
const filterText = ref("");
const sortColumn = ref<string>(''); // The column to sort by
const sortDirection = ref<number>(1); // The direction to sort by (1 = ascending, -1 = descending)

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
            console.log(filteredUsers);

            updateFilteredUsers();
            sortTable(sortColumn.value as keyof User);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

function getUserStatusIcon(status: string) {
    if (status === 'online') {
        return '🟢';
    } else if (status === 'offline') {
        return '⚫';
    } else if (status === 'idle') {
        return '🟡';
    } else if (status === 'dnd') {
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

function updateFilteredUsers() {
    console.log("update die scheiße")
    filteredUsers.value = users.value.filter((user) => {
        const isBotFilter = filterStore.isShowBots ? true : !user.is_bot;
        const textFilter = user.username.toLowerCase().includes(filterText.value.toLowerCase());
        return isBotFilter && textFilter;
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

/*function handleScroll() {
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
}*/

watch(() => filterStore.isShowBots, () => {
    updateFilteredUsers();
});

onMounted(() => {
    getUserData();
    setInterval(getUserData, 5000);
});
</script>

<style scoped>
table {
    display: block;
    border-collapse: collapse;
    border-radius: 10px;
    max-width: 100%;
    max-height: 80%;
    border-style: hidden;
    box-shadow: 0 0 10px 2px #666;
    white-space: nowrap;
    overflow: auto;
}

th:first-child {
    border-top-left-radius: 10px;
}

th:last-child {
    border-top-right-radius: 10px;
}

th:first-child,
td:first-child {
    position: -webkit-sticky;
    position: sticky;
    left: 0;
    z-index: 1;
    background-color: rgb(255, 255, 255);
}

th:first-child {
    z-index: 2;
    background-color: #252536;
}

th,
td {
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
    top: 0;
    position: sticky;
    z-index: 1;
}

th:hover {
    background-color: rgba(57, 57, 73, 0.9);
}

tr {
    border-style: hidden;
}

tr:nth-child(odd) td:first-child {
    background-color: #ffffff;
}

tr:nth-child(even) td:first-child {
    background-color: #dedede;
}

tr:nth-child(odd) {
    background-color: #ffffff;
}

tr:nth-child(even) {
    background-color: #dedede;
}

#table-container {
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    max-width: 100%;
    height: 90vh;
    margin-top: 1.3rem;
    padding: 0 2rem;
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

.user-info {
    display: flex;
}

.username {
    flex: 1;
}
</style>