<template>
  <div class="login-container">
    <div class="login-content">
      <h1 class="login-title">Login with Discord</h1>
      <button class="login-button" @click="loginWithDiscord">Login</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
function loginWithDiscord() {
  const url = import.meta.env.DEV ?
  'https://discord.com/api/oauth2/authorize?client_id=1160542994269741087&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2F%23%2Fauth&response_type=code&scope=identify%20guilds%20guilds.members.read'
  :
  'https://discord.com/api/oauth2/authorize?client_id=1160542994269741087&redirect_uri=https%3A%2F%2Fdiscord-lurker.com%2F%23%2Fauth&response_type=code&scope=guilds%20identify%20guilds.members.read'

  window.location.href = url;
}
</script>


<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-content {
  text-align: center;
}

.login-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.login-button {
  background-color: #7289da;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.login-button:hover {
  background-color: #677bc4;
}
</style>