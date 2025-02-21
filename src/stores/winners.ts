import { defineStore } from 'pinia'

export const useWinnersStore = defineStore('winners', {
  state() {
    return {
      brazil: {
        libertadoresWinner: 0,
        copaDoBrasilWinner: 0,
        serieA: {
          libertadoresWinnerTableSpot: 20,
          copaDoBrasilWinnerTableSpot: 20,
          libertadoresSpot: 4,
          preLibertadoresSpot: 6,
          sulAmericanaSpot: 12,
          relegation: 4,
        },
        serieB: {
          promotion: 4,
          relegation: 4,
        }
      },
      england: {
        FACupWinner: 0,
        premier: {
          FACupWinnerTableSpot: 20,
          championsSpot: 4,
          europaSpot: 5,
          relegation: 3,
        }
      },
      spain: {
        copaDelReyWinner: 0,
        laLiga: {
          championsSpot: 4,
          europaSpot: 5,
          relegation: 3,
        }
      }
    }
  },
  actions: {
    updateWinnersTablePosition(libertadoresTableSpot: number, copaDoBrasilWinnerTableSpot: number, FACupWinnerTableSpot: number ){
      this.brazil.serieA.copaDoBrasilWinnerTableSpot = copaDoBrasilWinnerTableSpot
      this.brazil.serieA.libertadoresWinnerTableSpot = libertadoresTableSpot
      this.england.premier.FACupWinnerTableSpot = FACupWinnerTableSpot
    },
    libertadoresSpots() {
      this.brazil.serieA.libertadoresSpot = 4
      this.brazil.serieA.preLibertadoresSpot = 6
      this.brazil.serieA.sulAmericanaSpot = 12
      if (this.brazil.serieA.libertadoresWinnerTableSpot <= 4) {
        this.brazil.serieA.libertadoresSpot += 1
        this.brazil.serieA.preLibertadoresSpot += 1
        this.brazil.serieA.sulAmericanaSpot += 1
      } else if (this.brazil.serieA.libertadoresWinnerTableSpot > 4 &&this.brazil.serieA.libertadoresWinnerTableSpot <= 6) {
        this.brazil.serieA.preLibertadoresSpot += 1
        this.brazil.serieA.sulAmericanaSpot += 1
      } else if (this.brazil.serieA.libertadoresWinnerTableSpot > 6 && this.brazil.serieA.libertadoresWinnerTableSpot <= 12) {
        this.brazil.serieA.sulAmericanaSpot += 1
      }
      if (this.brazil.serieA.copaDoBrasilWinnerTableSpot <= 4) {
        this.brazil.serieA.libertadoresSpot += 1
        this.brazil.serieA.preLibertadoresSpot += 1
        this.brazil.serieA.sulAmericanaSpot += 1
      } else if (this.brazil.serieA.copaDoBrasilWinnerTableSpot > 4 &&this.brazil.serieA.copaDoBrasilWinnerTableSpot <= 6) {
        this.brazil.serieA.preLibertadoresSpot += 1
        this.brazil.serieA.sulAmericanaSpot += 1
      } else if (this.brazil.serieA.copaDoBrasilWinnerTableSpot > 6 && this.brazil.serieA.copaDoBrasilWinnerTableSpot <= 12) {
        this.brazil.serieA.sulAmericanaSpot += 1
      }
    },
    setWinners(libertadores: number, copaDoBrasil: number, country: string) {
      this.brazil.libertadoresWinner = libertadores

      if (country == "brazil") {
        this.brazil.copaDoBrasilWinner = copaDoBrasil
        
      } else if (country == "england") {
        this.england.FACupWinner = copaDoBrasil
        
      }
    },
    championsSpots() {
      this.england.premier.championsSpot = 4
      this.england.premier.europaSpot = 5
      if (this.england.premier.FACupWinnerTableSpot <= 5) {
        this.england.premier.europaSpot += 1
      }
    },
  }
})