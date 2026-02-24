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
    prediction: {
      outcome: 'Home Win',
      score: '2-1',
      confidence: 'High',
      winProbability: 0.85,
      analysisPoints: [
        'Strong home form for Manchester United.',
        'Chelsea missing key striker due to injury.',
        'Historical data shows United has an edge in this fixture at home.',
      ],
    },
  },
  {
    id: '2',
    homeTeam: { name: 'Liverpool', logoUrl: 'https://picsum.photos/seed/103/100/100', logoImageHint: 'team logo' },
    awayTeam: { name: 'Manchester City', logoUrl: 'https://picsum.photos/seed/104/100/100', logoImageHint: 'team logo' },
    kickOff: formatISO(addDays(now, 1)),
    league: 'Premier League',
    stadium: 'Anfield',
    prediction: {
      outcome: 'Draw',
      score: '2-2',
      confidence: 'Medium',
      winProbability: 0.65,
      analysisPoints: [
        'Both teams are in excellent scoring form.',
        "Liverpool's defense has been shaky in recent games.",
        'Manchester City has a poor record at Anfield.',
      ],
    },
  },
  {
    id: '3',
    homeTeam: { name: 'Real Madrid', logoUrl: 'https://picsum.photos/seed/105/100/100', logoImageHint: 'team logo' },
    awayTeam: { name: 'Barcelona', logoUrl: 'https://picsum.photos/seed/106/100/100', logoImageHint: 'team logo' },
    kickOff: formatISO(addDays(now, 2)),
    league: 'La Liga',
    stadium: 'Santiago Bernabéu',
    prediction: {
      outcome: 'Home Win',
      score: '2-0',
      confidence: 'Medium',
      winProbability: 0.7,
      analysisPoints: [
        'Real Madrid is on a 5-match winning streak at home.',
        'Barcelona has key midfielders suspended for this match.',
        'Recent El Clásico matches at Bernabéu have favored the home team.',
      ],
    },
  },
  {
    id: '4',
    homeTeam: { name: 'Bayern Munich', logoUrl: 'https://picsum.photos/seed/107/100/100', logoImageHint: 'team logo' },
    awayTeam: { name: 'Borussia Dortmund', logoUrl: 'https://picsum.photos/seed/108/100/100', logoImageHint: 'team logo' },
    kickOff: formatISO(addDays(now, 3)),
    league: 'Bundesliga',
    stadium: 'Allianz Arena',
    prediction: {
      outcome: 'Home Win',
      score: '4-1',
      confidence: 'High',
      winProbability: 0.9,
      analysisPoints: [
        "Bayern has been dominant at home all season.",
        'Dortmund struggles defensively against top-tier attacks.',
        "Bayern's top scorer is in record-breaking form.",
      ],
    },
  },
];

export const leagues = [...new Set(matches.map(match => match.league))];
