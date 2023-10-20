import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authenticated: false, 
  }),
  getters: {
    isAuthenticated: (state) => state.authenticated,
  },
  actions: {
    setLoggedInStatus(status: boolean) {
      this.authenticated = status;
    },
  },
})
