// store.ts
import { defineStore } from 'pinia'

export const useWinnersStore = defineStore('winners', {
  state() {
    return {
      libertadoresWinner: 'Fluminense',
      libertadoresWinnerTableSpot: 20,
      copaDoBrasilWinner: 'Sao Paulo',
      copaDoBrasilWinnerTableSpot: 20,
      libertadoresSpot : 4,
      preLibertadoresSpot : 6,
      sulAmericanaSpot : 12,
    }
  },
  actions: {
    updateWinnersTablePosition(libertadoresTableSpot: number, copaDoBrasilWinnerTableSpot: number ){
      this.copaDoBrasilWinnerTableSpot = copaDoBrasilWinnerTableSpot
      this.libertadoresWinnerTableSpot = libertadoresTableSpot
    },
    libertadoresSpots() {
      this.libertadoresSpot = 4
      this.preLibertadoresSpot = 6
      this.sulAmericanaSpot = 12
      if (this.libertadoresWinnerTableSpot <= 4) {
        this.libertadoresSpot += 1
        this.preLibertadoresSpot += 1
        this.sulAmericanaSpot += 1
      } else if (this.libertadoresWinnerTableSpot > 4 &&this.libertadoresWinnerTableSpot <= 6) {
        this.preLibertadoresSpot += 1
        this.sulAmericanaSpot += 1
      } else if (this.libertadoresWinnerTableSpot > 6 && this.libertadoresWinnerTableSpot <= 12) {
        this.sulAmericanaSpot += 1
      }
      if (this.copaDoBrasilWinnerTableSpot <= 4) {
        this.libertadoresSpot += 1
        this.preLibertadoresSpot += 1
        this.sulAmericanaSpot += 1
      } else if (this.copaDoBrasilWinnerTableSpot > 4 &&this.copaDoBrasilWinnerTableSpot <= 6) {
        this.preLibertadoresSpot += 1
        this.sulAmericanaSpot += 1
      } else if (this.copaDoBrasilWinnerTableSpot > 6 && this.copaDoBrasilWinnerTableSpot <= 12) {
        this.sulAmericanaSpot += 1
      }
    }
  }

  // const setWinners = (libertadores: string, copaDoBrasil: string) => {
  //   state.libertadoresWinner = libertadores
  //   state.copaDoBrasilWinner = copaDoBrasil
  // }
  // const setWinnersTablePosition = (libertadoresTableSpot: number, copaDoBrasilTableSpot: number) => {
  //   console.log('Setting winners table positions:', libertadoresTableSpot, copaDoBrasilTableSpot);
  //   state.libertadoresWinnerTableSpot = libertadoresTableSpot;
  //   state.copaDoBrasilWinnerTableSpot = copaDoBrasilTableSpot;
  //   console.log('Updated winners table positions:', state.libertadoresWinnerTableSpot, state.copaDoBrasilWinnerTableSpot);
  // }

  // return {
  //   ...state,
  //   setWinners,
  //   setWinnersTablePosition,
  // }
})