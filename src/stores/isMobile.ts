// store.ts
import { defineStore } from 'pinia'

export const useIsMobileStore = defineStore('mobile', {
  state() {
    return {
      isMobile: false,
      isScreenSmall: false,
    }
  },
  actions: {
    checkIfIsMobile() {
      if (screen.width <= 760) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    },
    checkIfScreenIsSmall() {
      if (screen.width <= 400) {
        this.isScreenSmall = true
      } else {
        this.isScreenSmall = false
      }  
    }
  }

})