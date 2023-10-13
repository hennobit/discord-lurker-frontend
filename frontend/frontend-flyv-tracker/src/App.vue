<template>
  <div id="container">
    <h1>FLYV-Discord-Tracker</h1>
    <BotStatusVue></BotStatusVue>
    <UserTable></UserTable>
  </div>
</template>

<script setup lang="ts">
import BotStatusVue from './components/BotStatus.vue';
import UserTable from './components/UserTable.vue'

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
