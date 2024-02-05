// store.ts
import { defineStore } from 'pinia'

export type Leagues = "brasileirao-a" | 'premier-a'

export const useLeagueChosenStore = defineStore('leagueChosen', {
  state() {
    return {
      leagueChosen: 'brasileirao-a' as Leagues,
    }
  },
  actions: {
    chooseLeague(league: Leagues) {
      this.leagueChosen = league;
    }
  }

})