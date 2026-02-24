'use client';
    
import { useEffect, useState } from 'react';
import { getFixtures } from '@/lib/api-sports';
import { mapApiFixtureToMatch } from '@/lib/api-sports-mappers';
import type { Match } from '@/lib/types';
import { MatchList } from '@/components/matches/match-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import { ShareCard } from '@/components/sharing/share-card';
import { BetNowCard } from '@/components/betting/bet-now-card';

export default function Home() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMatches = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fixtureData = await getFixtures();
                
                const hasErrors = fixtureData && (Array.isArray(fixtureData.errors) ? fixtureData.errors.length > 0 : Object.keys(fixtureData.errors).length > 0);

                if (!fixtureData || hasErrors) {
                    const errorKey = hasErrors ? Object.keys(fixtureData.errors)[0] : '';
                    const errorMessage = hasErrors ? fixtureData.errors[errorKey as any] : 'Could not fetch match data.';
                    throw new Error(typeof errorMessage === 'string' ? errorMessage : 'An unexpected API error occurred.');
                }

                if (fixtureData.results > 0) {
                    const fetchedMatches: Match[] = fixtureData.response
                        .map(mapApiFixtureToMatch)
                        .sort((a, b) => new Date(a.kickOff).getTime() - new Date(b.kickOff).getTime());
                    setMatches(fetchedMatches);
                } else {
                    setMatches([]);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'An unknown error occurred.';
                setError(message);
                console.error("Failed to fetch matches:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatches();
    }, []);


    if (error) {
         return (
             <div className="container py-6 sm:py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>API Error</AlertTitle>
                    <AlertDescription>
                       Could not load match data from the API. {error}
                    </AlertDescription>
                </Alert>
            </div>
          );
    }

    if (isLoading) {
        return (
            <div className="container py-6 sm:py-8">
                <div className="flex justify-center items-center py-24 text-muted-foreground bg-card rounded-lg border gap-4">
                    <LoaderCircle className="h-6 w-6 animate-spin" />
                    <h3 className="text-lg font-semibold text-foreground">
                        Loading upcoming matches...
                    </h3>
                </div>
            </div>
        );
    }
    
    if (!matches || matches.length === 0) {
        return (
            <div className="container py-6 sm:py-8">
                <div className="text-center py-24 text-muted-foreground bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold text-foreground">No upcoming matches found.</h3>
                    <p className="mt-1 text-sm">There are no new matches scheduled for today.</p>
                </div>
                 <div className="mt-8">
                    <ShareCard />
                </div>
            </div>
        );
    }

    const leagues = [...new Set(matches.map(match => match.league))].sort();

    return (
        <div className="container py-6 sm:py-8">
            <div className="space-y-8">
                <MatchList matches={matches} leagues={leagues} />
                <div className="grid md:grid-cols-2 gap-8">
                    <BetNowCard />
                    <ShareCard />
                </div>
            </div>
        </div>
    );
}
