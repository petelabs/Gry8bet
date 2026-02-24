export type Team = {
  name: string;
  logoUrl: string;
  logoImageHint: string;
};

export type Match = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  kickOff: string; // ISO string
  league: string;
  stadium: string;
  prediction: {
    outcome: 'Home Win' | 'Draw' | 'Away Win';
    score: string; // e.g., "2-1"
    confidence: 'High' | 'Medium' | 'Low';
    winProbability: number; // e.g., 0.85 for 85%
    analysisPoints: string[];
  };
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
