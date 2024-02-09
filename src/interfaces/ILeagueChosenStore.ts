import type { Countries } from "@/stores/leagueChosen";

export interface ILeagueChosenStore {
  countryChosen: Countries,
  divisionChosen: string,

  chooseLeague (country: Countries, division: string): void
}