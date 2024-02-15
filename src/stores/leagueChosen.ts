// store.ts
import { defineStore } from 'pinia'

export const leagueConfig = {
  'brazil': 'brazil',
  'league': 'league',
} as const;

export type Countries = typeof leagueConfig[keyof typeof leagueConfig];

export const useLeagueChosenStore = defineStore('leagueChosen', {
  state() {
    return {
      countryChosen: 'brazil' as Countries,
      divisionChosen: "serie-a"
    }
  },
  actions: {
    chooseLeague(country: Countries, division: string) {
      this.countryChosen = country;
      this.divisionChosen = division
    }
  }

})