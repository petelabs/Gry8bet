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
    analysisPoints: string[];
  };
};
