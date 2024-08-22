import type IFixtures from "@/interfaces/IFixtures";
import type IPositionChances from "@/interfaces/IPositionChances";
import type ITable from "@/interfaces/ITable";
import type { Countries } from "@/stores/leagueChosen";
import { sendProgress } from "@/worker";

interface Score {
  [team: string]: number;
}

interface Possibility {
  [key: number]: Score[];
}

export function updateTable(table: ITable[], fixtures: IFixtures[]) {
  const standings: ITable[] = JSON.parse(JSON.stringify(table)); // Deep copy
  standings.forEach((team) => {
    team.losses = 0;
    team.wins = 0;
    team.draws = 0;
    team.losses = 0;
    team.matches = 0;
    team.points = 0;
    team.goal_difference = 0
  });
  fixtures.map((fixture) => {
    if (fixture.result) {
      const homeTeam = fixture.home_team;
      const awayTeam = fixture.away_team;
      updateStandings(standings, homeTeam, fixture.home_score!, fixture.away_score!);
      updateStandings(standings, awayTeam, fixture.away_score!, fixture.home_score!);
    } // Sort standings by points and then by wins
    sortStandings(standings);

    // Update positions
    standings.forEach((team, index) => {
      team.position = index + 1;
    });
  });
  return standings;
}

export function updateStandings(standings: ITable[], team: string, scored: number, conceded: number): void {
  const existingTeam = standings.find((standing) => standing.team_name === team);

  if (existingTeam) {
    // Update existing team's points
    existingTeam.matches += 1;
    if (scored > conceded) {
      existingTeam.points += 3;
      existingTeam.wins += 1;
      existingTeam.goal_difference += scored - conceded;
    } else if (conceded > scored) {
      existingTeam.losses += 1;
      existingTeam.goal_difference -= conceded - scored;
    } else {
      existingTeam.points += 1;
      existingTeam.draws += 1;
    }
  }
}

export function randomizeOutcome(
  fixtures: IFixtures[],
  leagueStandings: ITable[],
  copaDoBrasilWinner: string,
  libertadoresWinner: string,
  FACupWinner: string,
  preLibertadoresSpot: number,
  sulAmericanaSpot: number,
  championsSpot: number,
  europaSpot: number,
  countryChosen: Countries,
  divisionChosen: string,
  numOutcomes: number,
  weighted: boolean
): IPositionChances {
  const positionCounts: IPositionChances = {
    first: {},
    libertadores: {},
    promotion: {},
    sulAmericana: {},
    relegation: {},
    championsLeague: {},
    europaLeague: {},
  };
  let progress = 0;
  for (let i = 0; i < numOutcomes; i++) {
    const standings: ITable[] = JSON.parse(JSON.stringify(leagueStandings)); // Deep copy
    for (let j = 0; j < fixtures.length; j++) {
      const currentFixture = fixtures[j];
      // Calculate chancesAtWinning based on positions
      const homeTeamPosition = standings.find((team) => team.team_name === currentFixture.home_team)?.position || 0;
      const awayTeamPosition = standings.find((team) => team.team_name === currentFixture.away_team)?.position || 0;
      const chancesAtWinning = homeTeamPosition - awayTeamPosition;

      // Set homeWinProbability proportionally to chancesAtWinning
      let homeWinProbability = 0.33; // Default value
      let drawProbability = 0.66;
      if (chancesAtWinning < 0) {
        homeWinProbability += Math.abs(chancesAtWinning / 7) * 0.1; // Decrease for away advantage
        drawProbability += Math.abs(chancesAtWinning / 7) * 0.1;
      } else if (chancesAtWinning > 0) {
        homeWinProbability -= (chancesAtWinning / 7) * 0.1; // Increase for home advantage
        drawProbability -= (chancesAtWinning / 7) * 0.1;
      }
      if (!currentFixture.result) {
        let randomizedScore = "";
        if (weighted) {
          randomizedScore = getWeightedScores(homeWinProbability, drawProbability);
        } else {
          const possibleScores = ["1x0", "0x0", "0x1"];
          randomizedScore = possibleScores[Math.floor(Math.random() * 3)];
        }

        const scoreHome = parseInt(randomizedScore.split("x")[0]);
        const scoreAway = parseInt(randomizedScore.split("x")[1]);

        updateStandings(standings, currentFixture.home_team, scoreHome, scoreAway);
        updateStandings(standings, currentFixture.away_team, scoreAway, scoreHome);
      } else if (currentFixture.result === "home") {
        updateStandings(standings, currentFixture.home_team, 1, 0);
        updateStandings(standings, currentFixture.away_team, 0, 1);
      } else if (currentFixture.result === "draw") {
        updateStandings(standings, currentFixture.home_team, 0, 0);
        updateStandings(standings, currentFixture.away_team, 0, 0);
      } else if (currentFixture.result === "away") {
        updateStandings(standings, currentFixture.home_team, 0, 1);
        updateStandings(standings, currentFixture.away_team, 1, 0);
      }
    }

    // Sort standings by points and then by wins
    sortStandings(standings);

    // Update positions
    updatePositions(
      standings,
      positionCounts,
      copaDoBrasilWinner,
      libertadoresWinner,
      FACupWinner,
      preLibertadoresSpot,
      sulAmericanaSpot,
      championsSpot,
      europaSpot,
      countryChosen,
      divisionChosen,
      leagueStandings
    );

    progress = Math.round((i * 100) / numOutcomes);
    sendProgress(progress);
  }
  return positionCounts;
}

function updatePositions(
  standings: ITable[],
  positionCounts: IPositionChances,
  copaDoBrasilWinner: string,
  libertadoresWinner: string,
  FACupWinner: string,
  preLibertadoresSpot: number,
  sulAmericanaSpot: number,
  championsSpot: number,
  europaSpot: number,
  countryChosen: Countries,
  divisionChosen: string,
  leagueStandings: ITable[]
) {
  standings.forEach((team, index) => {
    team.position = index + 1;

    switch (countryChosen) {
      case "brazil":
        switch (divisionChosen) {
          case "serieA":
            if (team.position === 1) {
              positionCounts.first[team.team_name] = (positionCounts.first[team.team_name] || 0) + 1;
              positionCounts.libertadores[team.team_name] = (positionCounts.libertadores[team.team_name] || 0) + 1;
            } else if (team.position <= preLibertadoresSpot || team.team_name === copaDoBrasilWinner || team.team_name === libertadoresWinner) {
              positionCounts.libertadores[team.team_name] = (positionCounts.libertadores[team.team_name] || 0) + 1;
            } else if (team.position <= sulAmericanaSpot && team.team_name !== copaDoBrasilWinner && team.team_name !== libertadoresWinner) {
              positionCounts.sulAmericana[team.team_name] = (positionCounts.sulAmericana[team.team_name] || 0) + 1;
            }
            if (team.position > leagueStandings.length - 4) {
              positionCounts.relegation[team.team_name] = (positionCounts.relegation[team.team_name] || 0) + 1;
            }
            break;
          case "serieB":
            if (team.position === 1) {
              positionCounts.first[team.team_name] = (positionCounts.first[team.team_name] || 0) + 1;
              positionCounts.promotion[team.team_name] = (positionCounts.promotion[team.team_name] || 0) + 1;
            } else if (team.position <= 4) {
              positionCounts.promotion[team.team_name] = (positionCounts.promotion[team.team_name] || 0) + 1;
            } else if (team.position > leagueStandings.length - 4) {
              positionCounts.relegation[team.team_name] = (positionCounts.relegation[team.team_name] || 0) + 1;
            }
        }
        break;
      case "england":
        switch (divisionChosen) {
          case "premier-league":
            if (team.position === 1) {
              positionCounts.first[team.team_name] = (positionCounts.first[team.team_name] || 0) + 1;
              positionCounts.championsLeague[team.team_name] = (positionCounts.championsLeague[team.team_name] || 0) + 1;
            } else if (team.position <= championsSpot) {
              positionCounts.championsLeague[team.team_name] = (positionCounts.championsLeague[team.team_name] || 0) + 1;
            } else if (team.position <= europaSpot || team.team_name === FACupWinner) {
              positionCounts.europaLeague[team.team_name] = (positionCounts.europaLeague[team.team_name] || 0) + 1;
            }
            if (team.position > leagueStandings.length - 4) {
              positionCounts.relegation[team.team_name] = (positionCounts.relegation[team.team_name] || 0) + 1;
            }
            break;
        }
    }
  });
}

export function getWeightedScores(homeWinProbability: number, drawProbability: number): string {
  // Adjust the probabilities based on homeWinProbability
  let weightedScore: string;
  const randomNumber = Math.random();

  // Adjust the probabilities based on homeWinProbability
  if (randomNumber < homeWinProbability) {
    weightedScore = "1x0"; // Higher probability for 1x0
  } else if (randomNumber < drawProbability && randomNumber > homeWinProbability) {
    weightedScore = "0x0"; // Higher probability for 0x0
  } else {
    weightedScore = "0x1";
  }

  return weightedScore;
}

export function* generateAllPossibilities(fixtures: IFixtures[]): Generator<Possibility, void, void> {
  const startTime = performance.now();

  try {
    let possibilities: Possibility[] = [{}];

    for (let index = 0; index < fixtures.length; index++) {
      const currentFixture = fixtures[index];
      const newPossibilities: Possibility[] = [];

      for (const outcome of ["1x0", "0x0", "0x1"]) {
        const [homeScore, awayScore] = outcome.split("x").map(Number);

        for (const possibility of possibilities) {
          const updatedPossibility: Possibility = {
            ...possibility,
            [currentFixture.id]: [
              ...(possibility[currentFixture.id] || []),
              { [currentFixture.home_team]: homeScore, [currentFixture.away_team]: awayScore },
            ],
          };

          newPossibilities.push(updatedPossibility);

          // Yield the updated possibility
          yield updatedPossibility;
        }
      }

      possibilities = newPossibilities;
    }

    const endTime = performance.now();
    console.log(`Total time: ${endTime - startTime} milliseconds`);
  } catch (err) {
    console.error(err);
  }
}
function sortStandings(standings: ITable[]) {
  standings.sort((a, b) => {
    if (a.points !== b.points) {
      return b.points - a.points;
    } else if (a.wins !== b.wins) {
      return b.wins - a.wins;
    } else {
      return b.goal_difference - a.goal_difference;
    }
  });
}
