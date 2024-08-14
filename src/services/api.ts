import axios, { type AxiosResponse } from "axios";
import type { Championships, Fixture, Response, Standing, TeamStanding } from "@/interfaces/IApiData";
import type ITable from "@/interfaces/ITable";
import type IFixtures from "@/interfaces/IFixtures";
import type ILeagueInfo from "@/interfaces/ILeagueInfo";

const API_URL = "https://v3.football.api-sports.io";
const API_TOKEN = import.meta.env.VITE_API_KEY;

type Division = {
  [key: string]: number;
};

type Countries = {
  [key: string]: Division;
};

const availableChampionships: Countries = {
  brazil: {
    serieA: 71,
    serieB: 72,
  },
  // You can add more countries and divisions as needed
};

// Fetch all championships
export const fetchChampionships = async (): Promise<Championships[]> => {
  try {
    const response: AxiosResponse<Championships[]> = await axios.get(`${API_URL}/leagues`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching championships:", error);
    throw error;
  }
};

export const fetchChampionshipStandings = async (
  country: keyof Countries,
  division: keyof typeof availableChampionships['brazil'],
  season: number
): Promise<{ leagueInfo: ILeagueInfo; standingsTable: ITable[] }> => {
  try {
    const championshipId = availableChampionships[country][division];
    const response = await axios.get<Response>(`${API_URL}/standings`, {
      params: {
        league: championshipId,
        season: season,
      },
      headers: {
        "x-rapidapi-key": API_TOKEN,
        "x-rapidapi-host": "v3.football.api-sports.io",
      },
    });

    const data: Standing = response.data.response[0];

    const leagueInfo: ILeagueInfo = {
      logo: data.league.logo,
      name: data.league.name,
      flag: data.league.flag,
      year: data.league.season,
    };

    const standingsTable: ITable[] = data.league.standings[0].map((teamStanding: TeamStanding) => ({
      position: teamStanding.rank,
      logo: teamStanding.team.logo,
      team_name: teamStanding.team.name,
      description: teamStanding.description,
      matches: teamStanding.all.played,
      wins: teamStanding.all.win,
      draws: teamStanding.all.draw,
      losses: teamStanding.all.lose,
      goal_difference: teamStanding.goalsDiff,
      points: teamStanding.points,
    }));

    return { leagueInfo, standingsTable };
  } catch (error) {
    console.error(`Error fetching championship standings for ${country} ${division}:`, error);
    throw error;
  }
};

export const fetchChampionshipFixtures = async (country: keyof Countries, division: keyof Division, season: number): Promise<IFixtures[]> => {
  try {
    const championshipId = availableChampionships[country][division];
    const response = await axios.get<Response>(`${API_URL}/fixtures`, {
      params: {
        league: championshipId,
        season: season,
      },
      headers: {
        "x-rapidapi-key": API_TOKEN,
        "x-rapidapi-host": "v3.football.api-sports.io",
      },
    });

    const data: Fixture[] = response.data.response;

    // Helper function to format the date and adjust time zone by -3 hours
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
    
      let hours = date.getUTCHours() - 3;
      let day = date.getUTCDate();
    
      // Adjust if hours are negative (i.e., wrap to the previous day)
      if (hours < 0) {
        hours += 24;
        day -= 1;
      }
    
      const adjustedDay = String(day).padStart(2, "0");
      const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // getUTCMonth() is zero-based
      const adjustedHours = String(hours).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    
      // Extract the last two digits of the year
      const year = String(date.getUTCFullYear()).slice(-2);
    
      return `${adjustedDay}/${month}/${year} ${adjustedHours}:${minutes}`;
    };
    

    // Transform API data into IFixtures format
    const fixturesTable: IFixtures[] = data
      .filter((fixture: Fixture) => fixture.fixture.status.short !== "FT")
      .map((fixture: Fixture) => {
        // Extract the round number from the round string
        const roundMatch = fixture.league.round.match(/\d+$/);
        const roundNumber = roundMatch ? parseInt(roundMatch[0]) : null;

        return {
          id: fixture.fixture.id,
          date: formatDate(fixture.fixture.date), // Format the date
          round: roundNumber!, // Use the extracted round number
          home_logo: fixture.teams.home.logo,
          home_team: fixture.teams.home.name,
          home_score: fixture.goals.home, // If you want to include the actual score
          away_logo: fixture.teams.away.logo,
          away_team: fixture.teams.away.name,
          away_score: fixture.goals.away, // If you want to include the actual score
          homeTeamWinning: false,
          homeTeamLosing: false,
          awayTeamWinning: false,
          awayTeamLosing: false,
          drawing: false,
          status: fixture.fixture.status.short,
          result:
            fixture.goals.home > fixture.goals.away
              ? "home"
              : fixture.goals.away > fixture.goals.home
              ? "away"
              : fixture.goals.away == fixture.goals.home && fixture.goals.away != null
              ? "draw"
              : undefined,
        };
      });

    return fixturesTable;
  } catch (error) {
    console.error(`Error fetching championship fixtures for ${country} ${division}:`, error);
    throw error;
  }
};
