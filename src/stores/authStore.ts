import { defineStore } from 'pinia'
import { getCookie, setCookie } from './CookieHandler';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: getCookie('access_token') || '',
    tokenExpiresAt: getCookie('token_expires_at') || Date.now(),
  }),
  actions: {
    setAccessToken(token: string, expiresAt: number) {
      setCookie('access_token', token);
      setCookie('token_expires_at', expiresAt.toString());
    },
  },
})
