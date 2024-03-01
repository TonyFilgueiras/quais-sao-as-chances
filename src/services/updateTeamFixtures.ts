import type ITable from "@/interfaces/ITable";
import type IFixtures from "@/interfaces/IFixtures";

export default function updateTeamFixtures(team: ITable, option: string, fixtures: IFixtures[]) : IFixtures[] {
    return fixtures.map((fixture) => {
        switch (option) {
            case "homeWins":
                fixture.result = fixture.home_team === team.team_name ? "home" : fixture.result;
                break;
            case "homeTies":
                fixture.result = fixture.home_team === team.team_name ? "draw" : fixture.result;
                break;
            case "homeLoses":
                fixture.result = fixture.home_team === team.team_name ? "away" : fixture.result;
                break;
            case "awayWins":
                fixture.result = fixture.away_team === team.team_name ? "away" : fixture.result;
                break;
            case "awayTies":
                fixture.result = fixture.away_team === team.team_name ? "draw" : fixture.result;
                break;
            case "awayLoses":
                fixture.result = fixture.away_team === team.team_name ? "home" : fixture.result;
                break;
            case "allWins":
                if (fixture.home_team === team.team_name) fixture.result = "home";
                else if (fixture.away_team === team.team_name) fixture.result = "away";
                break;
            case "allTies":
                if (fixture.home_team === team.team_name || fixture.away_team === team.team_name) fixture.result = "draw";
                break;
            case "allLoses":
                if (fixture.home_team === team.team_name) fixture.result = "away";
                else if (fixture.away_team === team.team_name) fixture.result = "home";
                break;
        }
        return fixture;
    });
}
