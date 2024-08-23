import type ITable from "@/interfaces/ITable";
import type IFixtures from "@/interfaces/IFixtures";

export default function updateTeamFixtures(team: ITable, option: string, fixtures: IFixtures[]): IFixtures[] {
  return fixtures.map((fixture) => {
    if (fixture.status !== "FT") { 
      switch (option) {
        case "homeWins":
          if (fixture.home_team === team.team_name) {
            fixture.result = "home";
            fixture.home_score = 1;
            fixture.away_score = 0;
          }
          break;
        case "homeTies":
          if (fixture.home_team === team.team_name) {
            fixture.result = "draw";
            fixture.home_score = 1;
            fixture.away_score = 1;
          }
          break;
        case "homeLoses":
          if (fixture.home_team === team.team_name) {
            fixture.result = "away";
            fixture.home_score = 0;
            fixture.away_score = 1;
          }
          break;
        case "awayWins":
          if (fixture.away_team === team.team_name) {
            fixture.result = "away";
            fixture.away_score = 1;
            fixture.home_score = 0;
          }
          break;
        case "awayTies":
          if (fixture.away_team === team.team_name) {
            fixture.result = "draw";
            fixture.home_score = 1;
            fixture.away_score = 1;
          }
          break;
        case "awayLoses":
          if (fixture.away_team === team.team_name) {
            fixture.result = "home";
            fixture.away_score = 0;
            fixture.home_score = 1;
          }
          break;
        case "allWins":
          if (fixture.home_team === team.team_name) {
            fixture.result = "home";
            fixture.home_score = 1;
            fixture.away_score = 0;
          } else if (fixture.away_team === team.team_name) {
            fixture.result = "away";
            fixture.away_score = 1;
            fixture.home_score = 0;
          }
          break;
        case "allTies":
          if (fixture.home_team === team.team_name || fixture.away_team === team.team_name) {
            fixture.result = "draw";
            fixture.home_score = 1;
            fixture.away_score = 1;
          }
          break;
        case "allLoses":
          if (fixture.home_team === team.team_name) {
            fixture.result = "away";
            fixture.home_score = 0;
            fixture.away_score = 1;
          } else if (fixture.away_team === team.team_name) {
            fixture.result = "home";
            fixture.away_score = 0;
            fixture.home_score = 1;
          }
          break;
      }
    }
    return fixture;
  });
}
