import { defineStore } from 'pinia';

export const useBotStatusStore = defineStore({
  id: 'botStatus',
  state: () => ({
    status: 'unknown',
  }),
  actions: {
    setStatus(newStatus: string) {
      this.status = newStatus;
    },
  },
});
