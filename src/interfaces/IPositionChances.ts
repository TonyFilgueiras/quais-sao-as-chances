export default interface IPositionChances {
  first: { [team: string]: number };
  libertadores: { [team: string]: number };
  promotion: { [team: string]: number };
  sulAmericana: { [team: string]: number };
  relegation: { [team: string]: number };

  championsLeague: { [team: string]: number };
  europaLeague: { [team: string]: number };
}
