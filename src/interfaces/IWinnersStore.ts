export interface IWinnersStore {
  brazil:{
    libertadoresWinner: number;
    copaDoBrasilWinner: number;
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
    FACupWinner: number
    premier: {
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

