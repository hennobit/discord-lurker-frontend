<template>
    <div class="filter-panel">
        <label class="filter-label">
            Show Bots
            <input type="checkbox" class="checkbox-bots" @change="updateShowBots">
        </label>
    </div>
</template>

<script lang="ts" setup>
import { useFilterStore } from '@/stores/filterStore';

const filterStore = useFilterStore();

function updateShowBots() {
    filterStore.isShowBots = !filterStore.isShowBots
}
</script>

<style scoped>
.filter-panel {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 1rem;
}

.filter-label {
    font-weight: 600;
}

.checkbox-bots {
    margin-left: 0.5rem;
    transform: scale(1.5);
}
</style>
