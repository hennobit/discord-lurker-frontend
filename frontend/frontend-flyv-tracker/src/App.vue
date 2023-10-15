<template>
  <div id="container" v-if="authorized">
    <h1>FLYV-Discord-Tracker</h1>
    <BotStatusVue></BotStatusVue>
    <UserTable></UserTable>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BotStatusVue from './components/BotStatus.vue';
import UserTable from './components/UserTable.vue'

const authorized = ref(false);
const password = import.meta.env.VITE_PASSWORD;

if (prompt("Password") != password) {
  alert("Wrong");
} else {
  authorized.value = true;
}

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
