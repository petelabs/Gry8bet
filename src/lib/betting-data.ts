import type { BettingSite } from './types';

export const bettingSites: BettingSite[] = [
  {
    id: '6',
    name: '22Bet',
    url: 'https://moy.auraodin.com/redirect.aspx?pid=166680&bid=1733',
    logoUrl: 'https://picsum.photos/seed/22b/200/200',
    logoImageHint: '22bet logo',
    continents: ['Africa', 'Asia', 'Europe'],
    description: 'A popular international betting site offering a wide range of sports markets, live betting, and casino games.'
  },
  {
    id: '1',
    name: 'Betway',
    url: 'https://betway.com',
    logoUrl: 'https://picsum.photos/seed/bw/200/200',
    logoImageHint: 'betway logo',
    continents: ['Africa', 'America', 'Europe'],
    description: 'A global online gambling company with a strong presence in Africa and Europe, offering sports betting, casino, and esports.'
  },
  {
    id: '2',
    name: '1xBet',
    url: 'https://1xbet.com',
    logoUrl: 'https://picsum.photos/seed/1x/200/200',
    logoImageHint: '1xbet logo',
    continents: ['Africa', 'Asia', 'Europe'],
    description: 'Known for its wide range of betting markets and high odds, 1xBet is very popular across Africa and Asia.'
  },
  {
    id: '3',
    name: 'DraftKings',
    url: 'https://draftkings.com',
    logoUrl: 'https://picsum.photos/seed/dk/200/200',
    logoImageHint: 'draftkings logo',
    continents: ['America'],
    description: 'A leader in the US market, offering daily fantasy sports, sports betting, and an online casino.'
  },
  {
    id: '4',
    name: 'FanDuel',
    url: 'https://fanduel.com',
    logoUrl: 'https://picsum.photos/seed/fd/200/200',
    logoImageHint: 'fanduel logo',
    continents: ['America'],
    description: 'A major competitor in the US, providing a top-tier mobile betting experience for sports and fantasy.'
  },
  {
    id: '5',
    name: 'SportyBet',
    url: 'https://sportybet.com',
    logoUrl: 'https://picsum.photos/seed/sb/200/200',
    logoImageHint: 'sportybet logo',
    continents: ['Africa'],
    description: 'A mobile-first platform with a huge user base in several African countries, known for its simple interface.'
  }
];

export const continents = [...new Set(bettingSites.flatMap(site => site.continents))];
