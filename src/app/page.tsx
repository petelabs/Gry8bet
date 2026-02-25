'use client';
    
import { useEffect, useState } from 'react';
import { getUpcomingEvents } from '@/lib/the-sports-db';
import type { Match } from '@/lib/types';
import { MatchList } from '@/components/matches/match-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import { ShareCard } from '@/components/sharing/share-card';
import { BetNowCard } from '@/components/betting/bet-now-card';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';

export default function Home() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();
    const AFFILIATE_URL = 'https://moy.auraodin.com/redirect.aspx?pid=166680&bid=1733';

    useEffect(() => {
        const adShown = localStorage.getItem('affiliate_ad_shown');
        if (!adShown) {
            // Use a timeout to avoid overwhelming the user on first load
            const timer = setTimeout(() => {
                toast({
                    title: "Best Odds Guaranteed!",
                    description: "Ready to bet? Get the best odds on all matches with our trusted partner, 22Bet.",
                    duration: 15000,
                    action: (
                        <ToastAction altText="Bet Now" onClick={() => window.open(AFFILIATE_URL, '_blank')}>
                            Bet Now
                        </ToastAction>
                    ),
                });
                localStorage.setItem('affiliate_ad_shown', 'true');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [toast]);

    useEffect(() => {
        const fetchMatches = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const fetchedMatches = await getUpcomingEvents();
                
                if (fetchedMatches.length > 0) {
                     const sortedMatches = fetchedMatches
                        .sort((a, b) => new Date(a.kickOff).getTime() - new Date(b.kickOff).getTime());
                    setMatches(sortedMatches);
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
                    <p className="mt-1 text-sm">There are no new matches scheduled in the top leagues.</p>
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
