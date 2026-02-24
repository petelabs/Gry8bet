import type { Match } from './types';
import { addHours, addDays, formatISO } from 'date-fns';

const now = new Date();

export const matches: Match[] = [
  {
    id: '1',
    homeTeam: { name: 'Manchester United', logoUrl: 'https://picsum.photos/seed/101/100/100', logoImageHint: 'team logo' },
    awayTeam: { name: 'Chelsea', logoUrl: 'https://picsum.photos/seed/102/100/100', logoImageHint: 'team logo' },
    kickOff: formatISO(addHours(now, 2)),
    league: 'Premier League',
    stadium: 'Old Trafford',
  },
  {
    id: '2',
    homeTeam: { name: 'Liverpool', logoUrl: 'https://picsum.photos/seed/103/100/100', logoImageHint: 'team logo' },
    awayTeam: { name: 'Manchester City', logoUrl: 'https://picsum.photos/seed/104/100/100', logoImageHint: 'team logo' },
    kickOff: formatISO(addDays(now, 1)),
    league: 'Premier League',
    stadium: 'Anfield',
  },
  {
    id: '3',
    homeTeam: { name: 'Real Madrid', logoUrl: 'https://picsum.photos/seed/105/100/100', logoImageHint: 'team logo' },
    awayTeam: { name: 'Barcelona', logoUrl: 'https://picsum.photos/seed/106/100/100', logoImageHint: 'team logo' },
    kickOff: formatISO(addDays(now, 2)),
    league: 'La Liga',
    stadium: 'Santiago Bernabéu',
  },
  {
    id: '4',
    homeTeam: { name: 'Bayern Munich', logoUrl: 'https://picsum.photos/seed/107/100/100', logoImageHint: 'team logo' },
    awayTeam: { name: 'Borussia Dortmund', logoUrl: 'https://picsum.photos/seed/108/100/100', logoImageHint: 'team logo' },
    kickOff: formatISO(addDays(now, 3)),
    league: 'Bundesliga',
    stadium: 'Allianz Arena',
  },
];

export const leagues = [...new Set(matches.map(match => match.league))];
