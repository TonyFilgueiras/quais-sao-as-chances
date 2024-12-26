import type { ILeagueChosenStore } from "@/interfaces/ILeagueChosenStore";
import type ITable from "@/interfaces/ITable";
import type { IWinnersStore } from "@/interfaces/IWinnersStore";

export default function createCompetitionChecker(league: ILeagueChosenStore, winnersStore: IWinnersStore, table: ITable[]) {
  return function (team: ITable) {
    const { position, team_name } = team;
    const { brazil, england } = winnersStore;
    const { serieA, serieB } = brazil;
    const {premier} = england
    switch (league.countryChosen) {
      case "brazil":
        switch (league.divisionChosen) {
          case "serieA":
            if (
              (position > 1 && position <= serieA.libertadoresSpot) ||
              team_name === brazil.libertadoresWinner ||
              team_name === brazil.copaDoBrasilWinner
            ) {
              return "libertadores";
            }
            else if (
              position > serieA.libertadoresSpot &&
              position <= serieA.preLibertadoresSpot &&
              team_name !== brazil.libertadoresWinner &&
              team_name !== brazil.copaDoBrasilWinner
            ) {
              return "preLibertadores";
            }
            else if (
              position > serieA.preLibertadoresSpot &&
              position <= serieA.sulAmericanaSpot &&
              team_name !== brazil.libertadoresWinner &&
              team_name !== brazil.copaDoBrasilWinner
            ) {
              return "sulAmericana";
            }

            if (position > table.length - serieA.relegation && team_name !== brazil.libertadoresWinner && team_name !== brazil.copaDoBrasilWinner) {
              return "relegation";
            }
            break;
          case "serieB":
            if (
              (position > 1 && position <= serieB.promotion) ||
              team_name === brazil.libertadoresWinner ||
              team_name === brazil.copaDoBrasilWinner
            ) {
              return "promotion";
            }
            if (position > table.length - serieB.relegation && team_name !== brazil.libertadoresWinner && team_name !== brazil.copaDoBrasilWinner) {
              return "relegation";
            }
            break
          default:
            return '';
        }
        break;
      case "england":
        switch (league.divisionChosen) {
          case "premier":
            if (
              (position > 1 && position <= premier.championsSpot)
            ) {
              return "libertadores";
            }
            else if (
              (position > premier.championsSpot &&
              position <= premier.europaSpot) ||
              team_name === england.FACupWinner
            ) {
              return "sulAmericana";
            } else if (
              position > table.length - premier.relegation && team_name !== england.FACupWinner
            ) {
              return "relegation"
            }
        }
        break
      default:
        return '';
    }
  };
}
