export default interface ITable {
    id: number
    position: number
    logo: string
    team_name: string
    description: string | null
    matches: number
    wins: number
    draws: number
    losses: number
    goal_difference: number
    points: number
}