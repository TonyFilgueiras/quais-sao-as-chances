export interface IWinnersStore {
  brazil:{
    libertadoresWinner: string;
    copaDoBrasilWinner: string;
    serieA: {
      libertadoresWinnerTableSpot: number;
      copaDoBrasilWinnerTableSpot: number;
      libertadoresSpot: number;
      preLibertadoresSpot: number;
      sulAmericanaSpot: number;
      relegation: number,
    },
    serieB: {
      promotion: number,
      relegation: number
    }
  
  },
  england: {
    FACupWinner: string
    premierLeague: {
      FACupWinnerTableSpot: number
      championsSpot: number
      europaSpot: number
      relegation: number
    }
  }

  updateWinnersTablePosition(libertadoresTableSpot: number, copaDoBrasilWinnerTableSpot: number, FACupWinnerTableSpot: number): void;
  libertadoresSpots(): void;
  championsSpots(): void
}

