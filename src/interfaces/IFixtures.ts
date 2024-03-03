export default interface IFixtures {
    id: number;
    date: string
    round: number
    home_logo: string;
    home_team: string;
    home_score: number | null;
    away_logo: string;
    away_team: string;
    away_score: number | null;
    homeTeamWinning: boolean
    homeTeamLosing: boolean
    awayTeamWinning: boolean
    awayTeamLosing: boolean
    drawing: boolean
    result?: "home" | "draw" | "away"
}
