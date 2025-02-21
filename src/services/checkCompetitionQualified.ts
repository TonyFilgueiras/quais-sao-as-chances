import type { ILeagueChosenStore } from "@/interfaces/ILeagueChosenStore";
import type ITable from "@/interfaces/ITable";
import type { IWinnersStore } from "@/interfaces/IWinnersStore";

export default function createCompetitionChecker(league: ILeagueChosenStore, winnersStore: IWinnersStore, table: ITable[]) {
  return function (team: ITable) {
    const { position, id } = team;
    const { brazil, england } = winnersStore;
    const { serieA, serieB } = brazil;
    const { premier } = england;
    switch (league.countryChosen) {
      case "brazil":
        switch (league.divisionChosen) {
          case "serieA":
            if (
              (position > 1 && position <= serieA.libertadoresSpot) ||
              (id === brazil.libertadoresWinner && position !== 1) ||
              (id === brazil.copaDoBrasilWinner && position !== 1)
            ) {
              return "libertadores";
            } else if (
              position > serieA.libertadoresSpot &&
              position <= serieA.preLibertadoresSpot &&
              id !== brazil.libertadoresWinner &&
              id !== brazil.copaDoBrasilWinner
            ) {
              return "preLibertadores";
            } else if (
              position > serieA.preLibertadoresSpot &&
              position <= serieA.sulAmericanaSpot &&
              id !== brazil.libertadoresWinner &&
              id !== brazil.copaDoBrasilWinner
            ) {
              return "sulAmericana";
            }

            if (position > table.length - serieA.relegation && id !== brazil.libertadoresWinner && id !== brazil.copaDoBrasilWinner) {
              return "relegation";
            }
            break;
          case "serieB":
            if (
              (position > 1 && position <= serieB.promotion) ||
              id === brazil.libertadoresWinner ||
              id === brazil.copaDoBrasilWinner
            ) {
              return "promotion";
            }
            if (position > table.length - serieB.relegation && id !== brazil.libertadoresWinner && id !== brazil.copaDoBrasilWinner) {
              return "relegation";
            }
            break;
          default:
            return "";
        }
        break;
      case "england":
        switch (league.divisionChosen) {
          case "premier":
            if (position > 1 && position <= premier.championsSpot) {
              return "libertadores";
            } else if ((position > premier.championsSpot && position <= premier.europaSpot) || id === england.FACupWinner) {
              return "sulAmericana";
            } else if (position > table.length - premier.relegation && id !== england.FACupWinner) {
              return "relegation";
            }
        }
        break;
      default:
        return "";
    }
  };
}
