export interface IWinnersStore {
  libertadoresWinner: string;
  libertadoresWinnerTableSpot: number;
  copaDoBrasilWinner: string;
  copaDoBrasilWinnerTableSpot: number;
  libertadoresSpot: number;
  preLibertadoresSpot: number;
  sulAmericanaSpot: number;

  updateWinnersTablePosition(libertadoresTableSpot: number, copaDoBrasilWinnerTableSpot: number): void;
  libertadoresSpots(): void;
}

