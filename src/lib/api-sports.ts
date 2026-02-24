import type { ApiSportsPredictionResponse, ApiSportsFixtureResponse } from './types';
import { format } from 'date-fns';

const API_URL = 'https://v3.football.api-sports.io';

async function fetchFromApiSports<T extends { errors: any[] | { [key: string]: string } }>(endpoint: string, params: Record<string, string>): Promise<T | null> {
    const apiKey = process.env.NEXT_PUBLIC_API_SPORTS_KEY;
    if (!apiKey) {
        console.error('API Sports key is not configured in .env file.');
        throw new Error('API key is not configured. Please add NEXT_PUBLIC_API_SPORTS_KEY to your .env file.');
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `${API_URL}/${endpoint}?${queryString}`;
    console.log(`Fetching from API-Sports: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-apisports-key': apiKey,
            },
            // Caching is handled by our cron job logic, so we fetch fresh data here.
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`API-Sports request failed with status: ${response.status}`, data);
            return null;
        }
        
        const hasErrors = Array.isArray(data.errors) ? data.errors.length > 0 : Object.keys(data.errors).length > 0;
        if (hasErrors) {
            console.error('API-Sports returned an error:', data.errors);
            return data as T;
        }

        if (data.results === 0) {
            console.warn(`No data found for endpoint ${endpoint} with params ${JSON.stringify(params)}`);
        }

        return data as T;
    } catch (error) {
        console.error(`Error fetching from API-Sports endpoint ${endpoint}:`, error);
        return null;
    }
}


export async function getPrediction(fixtureId: string): Promise<ApiSportsPredictionResponse | null> {
  return fetchFromApiSports<ApiSportsPredictionResponse>('predictions', { fixture: fixtureId });
}

export async function getFixtures(): Promise<ApiSportsFixtureResponse | null> {
    const today = format(new Date(), 'yyyy-MM-dd');
    return fetchFromApiSports<ApiSportsFixtureResponse>('fixtures', { date: today, status: 'NS' });
}

export async function getFixtureById(fixtureId: string): Promise<ApiSportsFixtureResponse | null> {
    return fetchFromApiSports<ApiSportsFixtureResponse>('fixtures', { id: fixtureId });
}
