import type { Match, Team, ApiSportsFixture } from './types';

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

  return {
    id: apiFixture.fixture.id.toString(),
    homeTeam,
    awayTeam,
    kickOff: apiFixture.fixture.date,
    league: apiFixture.league.name,
    stadium: apiFixture.fixture.venue.name || 'N/A',
  };
}
