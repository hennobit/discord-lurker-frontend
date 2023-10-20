<template>
  <main>
    <router-view/>
  </main>
  <!--div id="container" v-if="false">
    <h1>FLYV-Discord-Tracker</h1>
    <BotStatusVue></BotStatusVue>
    <UserTable></UserTable>
  </!--div>
  <Login-- v-else></Login-->
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BotStatusVue from './components/BotStatus.vue';
import UserTable from './components/UserTable.vue'
import Login from './components/Login.vue'

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
