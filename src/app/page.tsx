'use client';

import { useEffect, useState, useMemo } from 'react';
import { getUpcomingEvents } from '@/lib/the-sports-db';
import type { Match } from '@/lib/types';
import { MatchList } from '@/components/matches/match-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import { ShareCard } from '@/components/sharing/share-card';
import { BetNowCard } from '@/components/betting/bet-now-card';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useProPlan } from '@/hooks/use-pro-plan';

export default function Home() {
    const { toast } = useToast();
    const AFFILIATE_URL = 'https://moy.auraodin.com/redirect.aspx?pid=166680&bid=1733';

    // --- State Management ---
    const { isPro } = useProPlan();
    const [matches, setMatches] = useState<Match[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Effect to load matches directly from the API
    useEffect(() => {
        const loadMatches = async () => {
            setIsLoading(true);
            setError(null);
            try {
                console.log("Fetching matches directly from API...");
                const apiMatches = await getUpcomingEvents();

                if (apiMatches && apiMatches.length > 0) {
                    setMatches(apiMatches);
                } else {
                    // API returned no matches
                    setMatches([]);
                }
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to load match data.';
                console.error('Match Loading Error:', err);
                setError(message);
                setMatches([]); // Set to empty array on error to show "No matches"
            } finally {
                setIsLoading(false);
            }
        };

        loadMatches();
        // This effect should run once on component mount
    }, []);


    // Effect for one-time affiliate ad
    useEffect(() => {
        if (isPro) return; // Don't show ads for Pro users
        const adShown = localStorage.getItem('affiliate_ad_shown');
        if (!adShown) {
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
    }, [toast, isPro]);


    if (error) {
         return (
             <div className="container py-6 sm:py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                       Could not load match data. {error}
                    </AlertDescription>
                </Alert>
            </div>
          );
    }

    if (isLoading || matches === null) {
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
    
    if (matches.length === 0) {
        return (
            <div className="container py-6 sm:py-8">
                <div className="text-center py-24 text-muted-foreground bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold text-foreground">No matches found.</h3>
                    <p className="mt-1 text-sm">There are no matches to display at this time. Please check back later.</p>
                </div>
                 <div className="mt-8">
                    {!isPro && <ShareCard />}
                </div>
            </div>
        );
    }

    const leagues = [...new Set(matches.map(match => match.league))].sort();

    return (
        <div className="container py-6 sm:py-8">
            <div className="space-y-8">
                <MatchList matches={matches} leagues={leagues} />
                {!isPro && (
                  <div className="grid md:grid-cols-2 gap-8">
                      <BetNowCard />
                      <ShareCard />
                  </div>
                )}
            </div>
        </div>
    );
}
