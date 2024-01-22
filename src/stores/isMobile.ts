// store.ts
import { defineStore } from 'pinia'

export const useIsMobileStore = defineStore('mobile', {
  state() {
    return {
      isMobile: false,
    }
  },
  actions: {
    checkIfIsMolile() {
      if (screen.width <= 760) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    },
  }

})