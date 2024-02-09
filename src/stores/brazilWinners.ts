import { defineStore } from "pinia";
import { useWinnersStore } from "./winners";

export const useBrazilWinnersStore = defineStore('brazilWinners', {
  ...useWinnersStore(),
  state: () => ({   
    
  }),
  actions: {
    
  }
})