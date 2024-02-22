import { randomizeOutcome } from "@/services/calculatePossibilities";

self.onmessage = (event) => {
  const data = event.data;

  if (data.type === "randomizeOutcome") {
    const [fixtures, leagueStandings, copaDoBrasilWinner, libertadoresWinner, FACupWinner, preLibertadoresSpot, sulAmericanaSpot,championsSpot,europaSpot,countryChosen, divisionChosen,numOutcomes, weighted] = data.payload;
    const parsedLeagueStandings = typeof leagueStandings === 'string' ? JSON.parse(leagueStandings) : leagueStandings;
    const parsedFixtures = typeof fixtures === 'string' ? JSON.parse(fixtures) : fixtures;
    const results = randomizeOutcome(parsedFixtures, parsedLeagueStandings, copaDoBrasilWinner, libertadoresWinner,FACupWinner,preLibertadoresSpot,sulAmericanaSpot,championsSpot,europaSpot,countryChosen, divisionChosen,numOutcomes, weighted);
    self.postMessage({type: "results", results});
  }
};

export function sendProgress(progress: number) {
  postMessage({ type: "progress", progress });
}