import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: 'test', 
  }),
  getters: {
    getAccessToken: (state) => state.accessToken,
  },
  actions: {
    setAccessToken(token: string) {
      this.accessToken = token;
    },
  },
})
