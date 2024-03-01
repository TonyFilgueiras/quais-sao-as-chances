import type ITable from "@/interfaces/ITable";

export interface ITeamOptions {
  logo?: string,
  label: string,
  value: string | ITable,
}

export const teamOptions: ITeamOptions[] = [
  {
    label: "Ganhar jogos de casa",
    value: "homeWins",
  },
  {
    label: "Empatar jogos de casa",
    value: "homeTies",
  },
  {
    label: "Perder jogos de casa",
    value: "homeLoses",
  },
  {
    label: "Ganhar jogos como visitante",
    value: "awayWins",
  },
  {
    label: "Empatar jogos como visitante",
    value: "awayTies",
  },
  {
    label: "Perder jogos como visitante",
    value: "awayLoses",
  },
  {
    label: "Ganhar todos os jogos",
    value: "allWins",
  },
  {
    label: "Empatar todos os jogos",
    value: "allTies",
  },
  {
    label: "Perder todos os jogos",
    value: "allLoses",
  },
]