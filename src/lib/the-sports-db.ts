import type { TheSportsDBEventsResponse, TheSportsDBTeamsResponse, TheSportsDBEvent } from './types';
import { mapSportsDBEventToMatch, mapSportsDBEventWithTeamDetailsToMatch } from './the-sports-db-mappers';
import { isAfter, parse } from 'date-fns';

const API_KEY = process.env.NEXT_PUBLIC_THESPORTSDB_API_KEY;
// Updated to V2 API as per user's request. The key is part of the URL for v2.
const API_URL = `https://www.thesportsdb.com/api/v2/json/${API_KEY}`;

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
    { id: '4329', name: 'English Championship' },
    { id: '4337', name: 'Dutch Eredivisie' },
    { id: '4344', name: 'Portuguese Primeira Liga' },
    { id: '4350', name: 'Mexican Liga MX' },
    { id: '4347', name: 'Argentinian Liga Profesional' },
    { id: '5018', name: 'UEFA Europa Conference League'},
    { id: '4356', name: 'Australian A-League'},
    { id: '4358', name: 'Turkish Super Lig'},
];


async function fetchFromSportsDB<T>(endpoint: string, params?: Record<string, string>): Promise<T | null> {
    if (!API_KEY || API_KEY === '123') {
        throw new Error('TheSportsDB API key is not configured. Please add the NEXT_PUBLIC_THESPORTSDB_API_KEY to your environment variables to see matches.');
    }

    let url = `${API_URL}/${endpoint}`;
    if (params) {
        const queryString = new URLSearchParams(params).toString();
        if (queryString) {
            url += `?${queryString}`;
        }
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Throw an error with the status to be caught by the calling function
            throw new Error(`TheSportsDB request failed with status: ${response.status}`);
        }
        const data = await response.json();
        // TheSportsDB returns { events: null } or { teams: null } for no results, so we check for that.
        if (data.events === null || data.teams === null || data.results === null || data.event === null) {
            return { ...data, events: [], teams: [], results: [], event: [] }; // Return an empty array structure
        }
        return data as T;
    } catch (error) {
        console.error(`Error fetching from TheSportsDB endpoint ${endpoint}:`, error);
        // Re-throw the error to be handled by the UI component
        throw error;
    }
}

export async function getUpcomingEvents() {
    const teamLogosMap = new Map<string, { id: string, logoUrl: string }>();
    let allEvents: TheSportsDBEvent[] = [];

    // 1. Fetch all teams for all popular leagues to build a comprehensive logo map
    const teamPromises = POPULAR_LEAGUES.map(league => 
        fetchFromSportsDB<TheSportsDBTeamsResponse>('lookup_all_teams.php', { id: league.id })
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

    // 2. Fetch upcoming events for each league
    const eventPromises = POPULAR_LEAGUES.map(league =>
        // Use eventsnextleague.php to get upcoming matches, which is often more friendly to free API keys
        fetchFromSportsDB<TheSportsDBEventsResponse>('eventsnextleague.php', { id: league.id })
    );
    const eventResponses = await Promise.all(eventPromises);

    for (const eventsResponse of eventResponses) {
        if (eventsResponse && eventsResponse.events) {
            allEvents.push(...eventsResponse.events);
        }
    }

    // 3. Filter for events with a valid date, map to the internal Match type, and sort
    const matches = allEvents
        .filter(event => {
            if (!event.dateEvent || !event.strTime) return false;
            // TheSportsDB times can be 'HH:mm:ss' or 'HH:mm'
            const timeFormat = event.strTime.length > 5 ? 'HH:mm:ss' : 'HH:mm';
            try {
                const eventDate = parse(`${event.dateEvent} ${event.strTime}`, `yyyy-MM-dd ${timeFormat}`, new Date());
                // Only include matches that are in the future
                return isAfter(eventDate, new Date());
            } catch (e) {
                console.warn(`Could not parse date for event ${event.idEvent}: ${event.dateEvent} ${event.strTime}`);
                return false;
            }
        })
        .map(event => mapSportsDBEventToMatch(event, teamLogosMap));
    
    // Remove duplicates and sort by date
    const uniqueMatches = Array.from(new Map(matches.map(m => [m.id, m])).values())
        .sort((a, b) => new Date(a.kickOff).getTime() - new Date(b.kickOff).getTime());

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
    const query = `${teamAName.replace(/ /g, '_')}_vs_${teamBName.replace(/ /g, '_')}`;
    const response = await fetchFromSportsDB<TheSportsDBEventsResponse>(`search/event/${query}`);
    return response?.event || [];
}
