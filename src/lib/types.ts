export type Team = {
  id: string;
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


// Types for TheSportsDB API
export interface TheSportsDBEvent {
    idEvent: string;
    strEvent: string;
    strLeague: string;
    strHomeTeam: string;
    strAwayTeam: string;
    idHomeTeam: string;
    idAwayTeam: string;
    intHomeScore: string | null;
    intAwayScore: string | null;
    dateEvent: string;
    strTime: string;
    strVenue: string;
    strThumb: string | null;
}

export interface TheSportsDBTeam {
    idTeam: string;
    strTeam: string;
    strTeamBadge: string;
    // other team properties
}

export interface TheSportsDBEventsResponse {
    events: TheSportsDBEvent[];
    results: TheSportsDBEvent[]; // for last 5 events
    event: TheSportsDBEvent[]; // for H2H
}

export interface TheSportsDBTeamsResponse {
    teams: TheSportsDBTeam[];
}
