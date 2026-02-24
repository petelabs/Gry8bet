export type Team = {
  name: string;
  logoUrl: string;
  logoImageHint: string;
};

export type Match = {
  id: string;
  date: string; // The date of the match in 'yyyy-MM-dd' format
  homeTeam: Team;
  awayTeam: Team;
  kickOff: string; // ISO string
  league: string;
  stadium: string;
};

export type Continent = 'Africa' | 'America' | 'Europe' | 'Asia' | 'Oceania';

export type BettingSite = {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
  logoImageHint: string;
  continents: Continent[];
  description: string;
};

// Types for API-Sports Prediction Response
export type ApiSportsPrediction = {
  winner: {
    id: number | null;
    name: string | null;
    comment: string | null;
  };
  advice: string;
  percent: {
    home: string;
    draw: string;
    away: string;
  };
};

export type ApiSportsH2H = {
  fixture: {
    id: number;
    // other fixture details
  };
  teams: {
    home: { id: number; name: string; winner: boolean | null; };
    away: { id: number; name: string; winner: boolean | null; };
  };
};

export type ApiSportsResponseData = {
  predictions: ApiSportsPrediction;
  teams: {
    home: { id: number; name: string; last_5: { form: string } };
    away: { id: number; name: string; last_5: { form: string } };
  };
  comparison: {
    // comparison data
    [key: string]: any;
  };
  h2h: ApiSportsH2H[];
};

export type ApiSportsPredictionResponse = {
  get: string;
  parameters: { fixture: string };
  errors: any[] | { [key: string]: string };
  results: number;
  response: ApiSportsResponseData[];
};

// Types for API-Sports Fixture Response
export type ApiSportsFixture = {
    fixture: {
        id: number;
        date: string;
        venue: {
            name: string | null;
            city: string | null;
        };
    };
    league: {
        id: number;
        name: string;
        country: string;
        logo: string;
        flag: string | null;
        season: number;
    };
    teams: {
        home: {
            id: number;
            name: string;
            logo: string;
            winner: boolean | null;
        };
        away: {
            id: number;
            name: string;
            logo: string;
            winner: boolean | null;
        };
    };
};

export type ApiSportsFixtureResponse = {
    get: string;
    parameters: { [key: string]: string };
    errors: any[] | { [key: string]: string };
    results: number;
    response: ApiSportsFixture[];
};
