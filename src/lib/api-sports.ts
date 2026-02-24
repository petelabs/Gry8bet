'use server';

import type { ApiSportsPredictionResponse } from './types';

const API_URL = 'https://v3.football.api-sports.io';

export async function getPrediction(fixtureId: string): Promise<ApiSportsPredictionResponse | null> {
  const apiKey = process.env.API_SPORTS_KEY;
  if (!apiKey) {
    console.error('API Sports key is not configured in .env file.');
    throw new Error('API key is not configured. Please add API_SPORTS_KEY to your .env file.');
  }

  const url = `${API_URL}/predictions?fixture=${fixtureId}`;
  console.log(`Fetching prediction from: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-apisports-key': apiKey,
      },
      // Using cache: 'no-store' to ensure fresh data, as sports data is time-sensitive.
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`API-Sports request failed with status: ${response.status}`, data);
      return null;
    }

    if (data.results === 0 || !data.response || data.response.length === 0) {
        console.warn(`No prediction data found for fixture ${fixtureId}`, data);
        return null;
    }

    return data as ApiSportsPredictionResponse;
  } catch (error) {
    console.error('Error fetching prediction from API-Sports:', error);
    return null;
  }
}
