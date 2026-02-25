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
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, writeBatch, serverTimestamp, getDocs } from 'firebase/firestore';
import { isBefore, subHours } from 'date-fns';

export default function Home() {
    const { toast } = useToast();
    const AFFILIATE_URL = 'https://moy.auraodin.com/redirect.aspx?pid=166680&bid=1733';

    // --- Caching Logic ---
    const { user } = useUser();
    const firestore = useFirestore();

    const [isSyncing, setIsSyncing] = useState(false);
    const [componentError, setComponentError] = useState<string | null>(null);

    // Memoize Firestore references
    const syncStateRef = useMemoFirebase(() => firestore ? doc(firestore, 'system', 'syncState') : null, [firestore]);
    const matchesCollectionRef = useMemoFirebase(() => firestore ? collection(firestore, 'matches') : null, [firestore]);
    
    // Subscribe to sync state and matches collection
    const { data: syncState, isLoading: isSyncLoading } = useDoc(syncStateRef);
    const { data: cachedMatches, isLoading: areMatchesLoading, error: matchesError } = useCollection<Match>(matchesCollectionRef);

    // Effect to handle one-time affiliate ad
    useEffect(() => {
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
    }, [toast]);

    // Effect to sync data with API if cache is stale
    useEffect(() => {
        if (!firestore || isSyncLoading) {
            return; // Wait for dependencies
        }

        const lastSync = syncState?.lastSync?.toDate();
        const needsSync = !lastSync || isBefore(lastSync, subHours(new Date(), 24));

        if (needsSync && user && !isSyncing) {
            const syncData = async () => {
                setIsSyncing(true);
                setComponentError(null);
                try {
                    const newMatches = await getUpcomingEvents();

                    if (newMatches && newMatches.length > 0) {
                        const batch = writeBatch(firestore);
                        const oldMatchesSnapshot = await getDocs(matchesCollectionRef!);
                        oldMatchesSnapshot.forEach(doc => batch.delete(doc.ref));

                        newMatches.forEach(match => {
                            const matchDocRef = doc(firestore, 'matches', match.id);
                            // Convert Date objects to Timestamps or ISO strings if they exist
                            const serializableMatch = JSON.parse(JSON.stringify(match));
                            batch.set(matchDocRef, serializableMatch);
                        });

                        batch.set(syncStateRef!, { lastSync: serverTimestamp() });
                        await batch.commit();
                    } else {
                        const batch = writeBatch(firestore);
                        batch.set(syncStateRef!, { lastSync: serverTimestamp() });
                        await batch.commit();
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
    
    const error = componentError || matchesError?.message;
    const isLoading = areMatchesLoading || isSyncing || isSyncLoading;
    const matches = cachedMatches ?? [];

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
                        {isSyncing ? 'Syncing latest matches...' : 'Loading upcoming matches...'}
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
                    <p className="mt-1 text-sm">There are no new matches scheduled in the top leagues, or a sync is in progress.</p>
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
