import { randomizeOutcome } from "@/services/calculatePossibilities";

self.onmessage = (event) => {
  const data = event.data;

  if (data.type === "randomizeOutcome") {
    const [fixtures, leagueStandings, piniastore,numOutcomes, weighted] = data.payload;
    const parsedLeagueStandings = typeof leagueStandings === 'string' ? JSON.parse(leagueStandings) : leagueStandings;
    const parsedPiniaStore = typeof piniastore === 'string' ? JSON.parse(piniastore) : piniastore;
    const parsedFixtures = typeof fixtures === 'string' ? JSON.parse(fixtures) : fixtures;
    const results = randomizeOutcome(parsedFixtures, parsedLeagueStandings, parsedPiniaStore,numOutcomes, weighted);
    self.postMessage(results);
  }
};
