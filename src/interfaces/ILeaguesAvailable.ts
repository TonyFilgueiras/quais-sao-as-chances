import type { Countries } from "@/stores/leagueChosen";

export default interface ILeaguesAvailable{
  name: string,
  country: Countries,
  division: string,
  img: string,
}