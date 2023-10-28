import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: getTokenCookie('access_token') || '',
    tokenExpiresAt: getTokenCookie('token_expires_at') || Date.now(),
  }),
  actions: {
    setAccessToken(token: string, expiresAt: number) {
      this.accessToken = token;
      this.tokenExpiresAt = expiresAt;
      setTokenCookie('access_token', token);
      setTokenCookie('token_expires_at', this.tokenExpiresAt.toString());
    },
  },
})

function getTokenCookie(name: string): string | null {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName.trim() === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

function setTokenCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}`;
}
