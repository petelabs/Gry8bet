import type { TheSportsDBEventsResponse, TheSportsDBTeamsResponse, TheSportsDBEvent } from './types';
import { mapSportsDBEventToMatch, mapSportsDBEventWithTeamDetailsToMatch } from './the-sports-db-mappers';

const API_KEY = process.env.NEXT_PUBLIC_THESPORTSDB_API_KEY;
const API_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;
const PREMIER_LEAGUE_ID = '4328';
const PREMIER_LEAGUE_NAME = 'English Premier League';

async function fetchFromSportsDB<T>(endpoint: string, params: Record<string, string>): Promise<T | null> {
    if (!API_KEY) {
        console.error('TheSportsDB API key is not configured.');
        throw new Error('API key is not configured.');
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/${endpoint}?${queryString}`;
    console.log(`Fetching from TheSportsDB: ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`TheSportsDB request failed with status: ${response.status}`);
            return null;
        }
        const data = await response.json();
        // TheSportsDB returns { events: null } or { teams: null } for no results, so we check for that.
        if (data.events === null || data.teams === null || data.results === null || data.event === null) {
            return { ...data, events: [], teams: [], results: [], event: [] }; // Return an empty array structure
        }
        return data as T;
    } catch (error) {
        console.error(`Error fetching from TheSportsDB endpoint ${endpoint}:`, error);
        throw error;
    }
}

export async function getUpcomingPremierLeagueEvents() {
    // 1. Fetch all teams to get their logos
    const teamsResponse = await fetchFromSportsDB<TheSportsDBTeamsResponse>('search_all_teams.php', { l: PREMIER_LEAGUE_NAME });
    const teamLogosMap = new Map<string, { id: string, logoUrl: string }>();
    if (teamsResponse && teamsResponse.teams) {
        for (const team of teamsResponse.teams) {
            teamLogosMap.set(team.strTeam, { id: team.idTeam, logoUrl: team.strTeamBadge });
        }
    }

    // 2. Fetch the next 15 events
    const eventsResponse = await fetchFromSportsDB<TheSportsDBEventsResponse>('eventsnextleague.php', { id: PREMIER_LEAGUE_ID });
    
    if (!eventsResponse || !eventsResponse.events) {
        return [];
    }

    // 3. Map events to the internal Match type
    const matches = eventsResponse.events.map(event => mapSportsDBEventToMatch(event, teamLogosMap));

    return matches;
}

export async function getEventDetailsById(eventId: string) {
    const eventResponse = await fetchFromSportsDB<TheSportsDBEventsResponse>('lookupevent.php', { id: eventId });
    const event = eventResponse?.events?.[0];

    if (!event) return null;

    // Fetch details for both teams to get logos
    const homeTeamResponse = await fetchFromSportsDB<TheSportsDBTeamsResponse>('lookupteam.php', { id: event.idHomeTeam });
    const awayTeamResponse = await fetchFromSportsDB<TheSportsDBTeamsResponse>('lookupteam.php', { id: event.idAwayTeam });
    
    const homeTeam = homeTeamResponse?.teams?.[0];
    const awayTeam = awayTeamResponse?.teams?.[0];

    if (!homeTeam || !awayTeam) return null; // Or handle missing team data gracefully

    return mapSportsDBEventWithTeamDetailsToMatch(event, homeTeam, awayTeam);
}

export async function getLast5EventsForTeam(teamId: string): Promise<TheSportsDBEvent[]> {
    const response = await fetchFromSportsDB<TheSportsDBEventsResponse>('eventslast.php', { id: teamId });
    return response?.results || [];
}

export async function getH2HEvents(teamAName: string, teamBName: string): Promise<TheSportsDBEvent[]> {
    const response = await fetchFromSportsDB<TheSportsDBEventsResponse>('searchevents.php', { e: `${teamAName}_vs_${teamBName}` });
    return response?.event || [];
}
