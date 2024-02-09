import type { ILeagueChosenStore } from "@/interfaces/ILeagueChosenStore";
import type ITable from "@/interfaces/ITable";
import type { IWinnersStore } from "@/interfaces/IWinnersStore";

export default function createCompetitionChecker(league: ILeagueChosenStore, winnersStore: IWinnersStore, table: ITable[]) {
  return function (team: ITable) {
    const { position, team_name } = team;
    const { brazil } = winnersStore;
    const { serieA } = brazil;
    switch (league.countryChosen) {
      case "brazil":
        switch (league.divisionChosen) {
          case "serie-a":
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
          case "serie-b":
            if (
              (position > 1 && position <= serieA.libertadoresSpot) ||
              team_name === brazil.libertadoresWinner ||
              team_name === brazil.copaDoBrasilWinner
            ) {
              return "promotion";
            }
            if (position > table.length - serieA.relegation && team_name !== brazil.libertadoresWinner && team_name !== brazil.copaDoBrasilWinner) {
              return "relegation";
            }
            break
          default:
            return '';
        }
        break;
      default:
        return '';
    }
  };
}
