import type { Match } from './types';
import { addHours, addDays, formatISO } from 'date-fns';

const now = new Date();

export const matches: Match[] = [
  {
    id: '1038198', // Man Utd vs Chelsea, 2023-12-06
    homeTeam: { name: 'Manchester United', logoUrl: 'https://picsum.photos/seed/101/100/100', logoImageHint: 'team logo' },
    awayTeam: { name: 'Chelsea', logoUrl: 'https://picsum.photos/seed/102/100/100', logoImageHint: 'team logo' },
    kickOff: formatISO(addHours(now, 2)),
    league: 'Premier League',
    stadium: 'Old Trafford',
  },
  {
    id: '1038202', // Liverpool vs Man City, 2024-03-10
    homeTeam: { name: 'Liverpool', logoUrl: 'https://picsum.photos/seed/103/100/100', logoImageHint: 'team logo' },
    awayTeam: { name: 'Manchester City', logoUrl: 'https://picsum.photos/seed/104/100/100', logoImageHint: 'team logo' },
    kickOff: formatISO(addDays(now, 1)),
    league: 'Premier League',
    stadium: 'Anfield',
  },
  {
    id: '1048352', // Real Madrid vs Barcelona, 2024-04-21
    homeTeam: { name: 'Real Madrid', logoUrl: 'https://picsum.photos/seed/105/100/100', logoImageHint: 'team logo' },
    awayTeam: { name: 'Barcelona', logoUrl: 'https://picsum.photos/seed/106/100/100', logoImageHint: 'team logo' },
    kickOff: formatISO(addDays(now, 2)),
    league: 'La Liga',
    stadium: 'Santiago Bernabéu',
  },
  {
    id: '1045330', // Bayern Munich vs Dortmund, 2024-03-30
    homeTeam: { name: 'Bayern Munich', logoUrl: 'https://picsum.photos/seed/107/100/100', logoImageHint: 'team logo' },
    awayTeam: { name: 'Borussia Dortmund', logoUrl: 'https://picsum.photos/seed/108/100/100', logoImageHint: 'team logo' },
    kickOff: formatISO(addDays(now, 3)),
    league: 'Bundesliga',
    stadium: 'Allianz Arena',
  },
];

export const leagues = [...new Set(matches.map(match => match.league))];
