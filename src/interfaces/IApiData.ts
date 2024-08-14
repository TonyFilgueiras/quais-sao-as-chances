export interface Response {
  get: string;
  parameters: any;
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: any[];
}

export interface Championships {
  league: League;
  country: Country;
  seasons: Season[];
}

interface League {
  id: number;
  name: string;
  type: string;
  logo: string;
}

interface Country {
  name: string;
  code: string;
  flag: string;
}

interface Season {
  year: number;
  start: string;
  end: string;
  current: boolean;
  [key: string]: any; // Allowing any additional properties
}

export interface Standing {
  league: LeagueStanding;
}

interface LeagueStanding {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  standings: TeamStanding[][];
}

export interface TeamStanding {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string | null;
  all: Performance;
  home: Performance;
  away: Performance;
  update: string;
  [key: string]: any; // Allowing any additional properties
}

interface Performance {
  played: number;
  win: number;
  draw: number;
  lose: number;
  goals: {
    for: number;
    against: number;
  };
}

export interface Fixture {
  fixture: FixtureDetails;
  league: LeagueInfo;
  teams: Teams;
  goals: Goals;
  score: Score;
  result?: "home" | "draw" | "away";
}

interface FixtureDetails {
  id: number;
  referee: string;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first: number;
    second: number;
  };
  venue: {
    id: number | null;
    name: string;
    city: string;
  };
  status: {
    long: string;
    short: string;
    elapsed: number;
  };
}

interface LeagueInfo {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
}

interface Teams {
  home: Team;
  away: Team;
}

interface Team {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

interface Goals {
  home: number;
  away: number;
}

interface Score {
  halftime: Goals;
  fulltime: Goals;
  extratime: Goals;
  penalty: Goals;
}
