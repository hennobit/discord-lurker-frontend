import { defineStore } from 'pinia';
import { getCookie, setCookie } from './CookieHandler';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    id: getCookie('user_id') || '',
    username: '',
    avatar: '',
    discriminator: '',
    public_flags: 0,
    premium_type: 0,
    flags: 0,
    banner: null as string | null,
    accent_color: null as string | null, 
    global_name: getCookie('global_name') || '',
    avatar_decoration_data: null as any | null,
    banner_color: null as string | null, 
    mfa_enabled: false,
    locale: 'en',
  }),
  getters: {
  },
  actions: {
    setUserData(userData: DiscordUser) {
      this.id = userData.id;
      this.username = userData.username;
      this.avatar = userData.avatar;
      this.discriminator = userData.discriminator;
      this.public_flags = userData.public_flags;
      this.premium_type = userData.premium_type;
      this.flags = userData.flags;
      this.banner = userData.banner;
      this.accent_color = userData.accent_color;
      this.global_name = userData.global_name;
      this.avatar_decoration_data = userData.avatar_decoration_data;
      this.banner_color = userData.banner_color;
      this.mfa_enabled = userData.mfa_enabled;
      this.locale = userData.locale;
      setCookie('user_id', userData.id);
      setCookie('global_name', userData.global_name);
    },
  },
});

export async function fetchUserInfo(access: string): Promise<DiscordUser | null> {
  const userInfoResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
          'Authorization': `Bearer ${access}`,
      },
  });

  if (userInfoResponse.ok) {
      const userInfo = await userInfoResponse.json();
      return userInfo;
  }

  console.error('Error User Info Response', userInfoResponse);
  return null;
}
