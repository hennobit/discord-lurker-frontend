import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filter', {
  state: () => ({
    isShowBots: false,
  }),
});
