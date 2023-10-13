import { defineStore } from 'pinia';

export const useBotStatusStore = defineStore({
  id: 'botStatus',
  state: () => ({
    status: '❔',
  }),
  actions: {
    setStatus(newStatus: string) {
      this.status = newStatus;
    },
  },
});
