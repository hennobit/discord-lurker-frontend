<template>
  <div id="container">
    <h1>FLYV-Discord-Tracker</h1>
    <UserTable></UserTable>
  </div>
</template>

<script setup lang="ts">
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
