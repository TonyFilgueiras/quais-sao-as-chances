// store.ts
import { defineStore } from 'pinia'

export const leagueConfig = {
  'brasileirao-a': 'brasileirao-a',
  'premier-a': 'premier-a',
} as const;

export type Leagues = typeof leagueConfig[keyof typeof leagueConfig];

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