import type { TheSportsDBEventsResponse, TheSportsDBTeamsResponse, TheSportsDBEvent } from './types';
import { mapSportsDBEventToMatch, mapSportsDBEventWithTeamDetailsToMatch } from './the-sports-db-mappers';

const API_KEY = process.env.NEXT_PUBLIC_THESPORTSDB_API_KEY;
const API_URL = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

// Define a list of popular leagues to fetch data for
const POPULAR_LEAGUES = [
    { id: '4328', name: 'English Premier League' },
    { id: '4335', name: 'Spanish La Liga' },
    { id: '4332', name: 'Italian Serie A' },
    { id: '4331', name: 'German Bundesliga' },
    { id: '4334', name: 'French Ligue 1' },
    { id: '4396', name: 'USA Major League Soccer' },
    { id: '4346', name: 'Brazilian Serie A' },
    { id: '4480', name: 'UEFA Champions League' },
    { id: '4481', name: 'UEFA Europa League' },
    { id: '4767', name: 'Copa Libertadores' },
    { id: '4421', name: 'Japanese J League' },
];


async function fetchFromSportsDB<T>(endpoint: string, params: Record<string, string>): Promise<T | null> {
    if (!API_KEY || API_KEY === '123') {
        const errorMessage = 'TheSportsDB API key is not configured or is using the default placeholder.';
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/${endpoint}?${queryString}`;
    
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

export async function getUpcomingEvents() {
    const teamLogosMap = new Map<string, { id: string, logoUrl: string }>();
    let allEvents: TheSportsDBEvent[] = [];

    // 1. Fetch all teams for all popular leagues to build a comprehensive logo map
    const teamPromises = POPULAR_LEAGUES.map(league => 
        fetchFromSportsDB<TheSportsDBTeamsResponse>('search_all_teams.php', { l: league.name })
    );
    const teamResponses = await Promise.all(teamPromises);

    for (const teamsResponse of teamResponses) {
        if (teamsResponse && teamsResponse.teams) {
            for (const team of teamsResponse.teams) {
                if (!teamLogosMap.has(team.strTeam)) {
                    teamLogosMap.set(team.strTeam, { id: team.idTeam, logoUrl: team.strTeamBadge });
                }
            }
        }
    }

    // 2. Fetch the next events for each league
    const eventPromises = POPULAR_LEAGUES.map(league => 
        fetchFromSportsDB<TheSportsDBEventsResponse>('eventsnextleague.php', { id: league.id })
    );
    const eventResponses = await Promise.all(eventPromises);

    for (const eventsResponse of eventResponses) {
        if (eventsResponse && eventsResponse.events) {
            allEvents.push(...eventsResponse.events);
        }
    }

    // 3. Map events to the internal Match type
    const matches = allEvents.map(event => mapSportsDBEventToMatch(event, teamLogosMap));
    
    // Remove duplicates just in case (e.g. a team is in multiple concurrent competitions)
    const uniqueMatches = Array.from(new Map(matches.map(m => [m.id, m])).values());

    return uniqueMatches;
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
