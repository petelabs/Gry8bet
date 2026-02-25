'use client';

import { useEffect, useState, useMemo } from 'react';
import { getUpcomingEvents } from '@/lib/the-sports-db';
import type { Match, Prediction } from '@/lib/types';
import { MatchList } from '@/components/matches/match-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import { ShareCard } from '@/components/sharing/share-card';
import { BetNowCard } from '@/components/betting/bet-now-card';
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, writeBatch, serverTimestamp, getDocs } from 'firebase/firestore';
import { isBefore, subHours } from 'date-fns';
import { useProPlan } from '@/hooks/use-pro-plan';

export default function Home() {
    const { toast } = useToast();
    const AFFILIATE_URL = 'https://moy.auraodin.com/redirect.aspx?pid=166680&bid=1733';

    // --- Caching & State Management ---
    const { user } = useUser();
    const firestore = useFirestore();
    const { isPro } = useProPlan();

    const [isSyncing, setIsSyncing] = useState(false);
    const [componentError, setComponentError] = useState<string | null>(null);
    const [fallbackMatches, setFallbackMatches] = useState<Match[] | null>(null);
    const [isFallbackLoading, setIsFallbackLoading] = useState(false);

    // Memoize Firestore references
    const syncStateRef = useMemoFirebase(() => firestore ? doc(firestore, 'system', 'syncState') : null, [firestore]);
    const matchesCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'matches') : null, [firestore]);
    const predictionsCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'predictions') : null, [firestore]);
    
    // Subscribe to sync state and matches collection
    const { data: syncState, isLoading: isSyncLoading } = useDoc(syncStateRef);
    const { data: cachedMatches, isLoading: areMatchesLoading, error: matchesError } = useCollection<Match>(matchesCollectionRef);
    const { data: cachedPredictions } = useCollection<Prediction>(predictionsCollectionRef);

    // Effect to handle one-time affiliate ad
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

    // Effect to sync data to Firestore if cache is stale (for authenticated users only)
    useEffect(() => {
        if (!firestore || isSyncLoading || !user || isSyncing) {
            return; // Wait for dependencies & only run for authenticated users
        }

        const lastSync = syncState?.lastSync?.toDate();
        const needsSync = !lastSync || isBefore(lastSync, subHours(new Date(), 24));

        if (needsSync) {
            const syncData = async () => {
                setIsSyncing(true);
                setComponentError(null);
                console.log('Authenticated user triggering data sync...');
                try {
                    const newMatches = await getUpcomingEvents();

                    if (newMatches && newMatches.length > 0) {
                        const batch = writeBatch(firestore);
                        const oldMatchesSnapshot = await getDocs(matchesCollectionRef!);
                        oldMatchesSnapshot.forEach(doc => batch.delete(doc.ref));

                        newMatches.forEach(match => {
                            const matchDocRef = doc(firestore, 'matches', match.id);
                            const serializableMatch = JSON.parse(JSON.stringify(match));
                            batch.set(matchDocRef, serializableMatch);
                        });

                        batch.set(syncStateRef!, { lastSync: serverTimestamp() });
                        await batch.commit();
                        console.log('Sync complete. Wrote new matches to Firestore.');
                    } else {
                        // Still update timestamp even if no matches are found, to prevent constant re-fetching
                        const batch = writeBatch(firestore);
                        batch.set(syncStateRef!, { lastSync: serverTimestamp() });
                        await batch.commit();
                        console.log('Sync attempted, but API returned no matches. Timestamp updated.');
                    }
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Failed to sync match data.';
                    console.error('Sync Error:', err);
                    setComponentError(message);
                } finally {
                    setIsSyncing(false);
                }
            };
            syncData();
        }
    }, [syncState, isSyncLoading, user, isSyncing, firestore, matchesCollectionRef, syncStateRef]);

    // Effect to fetch directly from API if Firestore cache is empty on load
    useEffect(() => {
        if (!areMatchesLoading && (!cachedMatches || cachedMatches.length === 0) && !isSyncing) {
            const fetchFallbackData = async () => {
                console.log("Cache is empty. Fetching directly from API as a fallback.");
                setIsFallbackLoading(true);
                try {
                    const newMatches = await getUpcomingEvents();
                    setFallbackMatches(newMatches);
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Failed to fetch fallback match data.';
                    console.error('Fallback Fetch Error:', err);
                    setComponentError(message);
                } finally {
                    setIsFallbackLoading(false);
                }
            };

            fetchFallbackData();
        }
    }, [areMatchesLoading, cachedMatches, isSyncing]);
    
    const error = componentError || matchesError?.message;
    // Use cached matches if available, otherwise use the fallback matches.
    const matches = (cachedMatches && cachedMatches.length > 0) ? cachedMatches : (fallbackMatches ?? []);
    // The app is loading if any of the data sources are still fetching, AND we don't have any matches to show yet.
    const isLoading = (areMatchesLoading || isSyncing || isFallbackLoading) && matches.length === 0;

    const highConfidencePicks = useMemo(() => {
        if (!cachedPredictions) return new Set<string>();
        return new Set(
            cachedPredictions
                .filter(p => p.confidenceScore >= 85)
                .map(p => p.id)
        );
    }, [cachedPredictions]);

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
    
    if (matches.length === 0) {
        return (
            <div className="container py-6 sm:py-8">
                <div className="text-center py-24 text-muted-foreground bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold text-foreground">No upcoming matches found.</h3>
                    <p className="mt-1 text-sm">There are no new matches scheduled in the top leagues. Please check back later.</p>
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
                <MatchList matches={matches} leagues={leagues} highConfidencePicks={highConfidencePicks} />
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
