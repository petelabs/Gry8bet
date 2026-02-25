import type { Match, Team, TheSportsDBEvent, TheSportsDBTeam } from './types';
import { format, parse } from 'date-fns';

// Helper to combine date and time from TheSportsDB into a valid ISO string
function combineDateAndTime(dateStr: string, timeStr: string): string {
    if (!dateStr || !timeStr) return new Date().toISOString();
    // TheSportsDB times can be 'HH:mm:ss' or 'HH:mm'
    const timeFormat = timeStr.length > 5 ? 'HH:mm:ss' : 'HH:mm';
    const parsedDate = parse(`${dateStr} ${timeStr}`, `yyyy-MM-dd ${timeFormat}`, new Date());
    return parsedDate.toISOString();
}

export function mapSportsDBEventToMatch(
  event: TheSportsDBEvent,
  teamLogosMap: Map<string, { id: string, logoUrl: string }>
): Match {
  
  const placeholderLogo = 'https://www.thesportsdb.com/images/shared/placeholders/football_placeholder.png';
  const homeTeamInfo = teamLogosMap.get(event.strHomeTeam);
  const awayTeamInfo = teamLogosMap.get(event.strAwayTeam);
    
  const homeTeam: Team = {
    id: homeTeamInfo?.id || event.idHomeTeam,
    name: event.strHomeTeam,
    logoUrl: homeTeamInfo?.logoUrl || placeholderLogo,
    logoImageHint: 'team logo',
  };

  const awayTeam: Team = {
    id: awayTeamInfo?.id || event.idAwayTeam,
    name: event.strAwayTeam,
    logoUrl: awayTeamInfo?.logoUrl || placeholderLogo,
    logoImageHint: 'team logo',
  };
  
  const kickOff = combineDateAndTime(event.dateEvent, event.strTime);

  return {
    id: event.idEvent,
    date: event.dateEvent,
    homeTeam,
    awayTeam,
    kickOff: kickOff,
    league: event.strLeague,
    stadium: event.strVenue || 'N/A',
  };
}

export function mapSportsDBEventWithTeamDetailsToMatch(
  event: TheSportsDBEvent,
  homeTeamDetail: TheSportsDBTeam,
  awayTeamDetail: TheSportsDBTeam
): Match {
  const homeTeam: Team = {
    id: homeTeamDetail.idTeam,
    name: event.strHomeTeam,
    logoUrl: homeTeamDetail.strTeamBadge || 'https://www.thesportsdb.com/images/shared/placeholders/football_placeholder.png',
    logoImageHint: 'team logo',
  };

  const awayTeam: Team = {
    id: awayTeamDetail.idTeam,
    name: event.strAwayTeam,
    logoUrl: awayTeamDetail.strTeamBadge || 'https://www.thesportsdb.com/images/shared/placeholders/football_placeholder.png',
    logoImageHint: 'team logo',
  };

  const kickOff = combineDateAndTime(event.dateEvent, event.strTime);

  return {
    id: event.idEvent,
    date: event.dateEvent,
    homeTeam,
    awayTeam,
    kickOff: kickOff,
    league: event.strLeague,
    stadium: event.strVenue || 'N/A',
  };
}
