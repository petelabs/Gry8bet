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
