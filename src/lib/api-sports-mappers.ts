import type { Match, Team, ApiSportsFixture } from './types';
import { format } from 'date-fns';

export function mapApiFixtureToMatch(apiFixture: ApiSportsFixture): Match {
  const homeTeam: Team = {
    name: apiFixture.teams.home.name,
    logoUrl: apiFixture.teams.home.logo,
    logoImageHint: 'team logo',
  };

  const awayTeam: Team = {
    name: apiFixture.teams.away.name,
    logoUrl: apiFixture.teams.away.logo,
    logoImageHint: 'team logo',
  };

  const kickOffDate = new Date(apiFixture.fixture.date);

  return {
    id: apiFixture.fixture.id.toString(),
    date: format(kickOffDate, 'yyyy-MM-dd'),
    homeTeam,
    awayTeam,
    kickOff: apiFixture.fixture.date,
    league: apiFixture.league.name,
    stadium: apiFixture.fixture.venue.name || 'N/A',
  };
}
