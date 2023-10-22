import type { Server } from '@/interfaces/Server';
import { defineStore } from 'pinia';

export const useGuildsStore = defineStore({
    id: 'guilds',
    state: () => ({
        guilds: [] as Server[]
    }),
    getters: {
        getGuilds: (state) => state.guilds
    },
    actions: {
        setGuilds(guilds: Server[]) {
            this.guilds = guilds;
        }
    }
});
