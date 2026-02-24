import { getFixtures } from '@/lib/api-sports';
import { mapApiFixtureToMatch } from '@/lib/api-sports-mappers';
import { MatchList } from '@/components/matches/match-list';
import type { Match } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default async function Home() {
  const fixtureData = await getFixtures();

  if (!fixtureData || (!fixtureData.response && !fixtureData.errors)) {
      return (
         <div className="container py-6 sm:py-8">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>API Error</AlertTitle>
                <AlertDescription>
                   Could not fetch match data. The API may be unavailable.
                </AlertDescription>
            </Alert>
        </div>
      );
  }
  
  const hasErrors = Array.isArray(fixtureData.errors) ? fixtureData.errors.length > 0 : Object.keys(fixtureData.errors).length > 0;
  if (hasErrors) {
      const errorKey = Object.keys(fixtureData.errors)[0];
      const errorMessage = fixtureData.errors[errorKey as any];
      return (
         <div className="container py-6 sm:py-8">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>API Error</AlertTitle>
                <AlertDescription>
                    {typeof errorMessage === 'string' ? errorMessage : 'An unexpected error occurred while fetching matches.'}
                </AlertDescription>
            </Alert>
        </div>
      )
  }

  if (fixtureData.results === 0) {
    return (
        <div className="container py-6 sm:py-8">
            <div className="text-center py-24 text-muted-foreground bg-card rounded-lg border">
                <h3 className="text-lg font-semibold text-foreground">No upcoming matches found for today.</h3>
                <p className="mt-1 text-sm">Please check back later.</p>
            </div>
        </div>
    );
  }

  const matches: Match[] = fixtureData.response.map(mapApiFixtureToMatch);
  const leagues = [...new Set(matches.map(match => match.league))].sort();

  return (
    <div className="container py-6 sm:py-8">
      <MatchList matches={matches} leagues={leagues} />
    </div>
  );
}
