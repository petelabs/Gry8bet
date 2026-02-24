'use client';
    
import { useEffect, useState } from 'react';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { doc, getDoc, setDoc, writeBatch, serverTimestamp, collection, query, orderBy } from 'firebase/firestore';
import { getFixtures } from '@/lib/api-sports';
import { mapApiFixtureToMatch } from '@/lib/api-sports-mappers';
import type { Match } from '@/lib/types';
import { MatchList } from '@/components/matches/match-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SYNC_INTERVAL = 1 * 60 * 60 * 1000; // 1 hour

export default function Home() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        if (isUserLoading || !user || !firestore) {
            return;
        }

        const syncMatches = async () => {
            const syncStateRef = doc(firestore, 'system', 'syncState');
            try {
                const syncDoc = await getDoc(syncStateRef);
                if (syncDoc.exists()) {
                    const lastSync = syncDoc.data().lastSync.toDate();
                    const now = new Date();
                    if (now.getTime() - lastSync.getTime() < SYNC_INTERVAL) {
                        console.log(`Sync skipped, last sync was less than ${SYNC_INTERVAL / (60 * 1000)} minutes ago.`);
                        return;
                    }
                }
                
                setIsSyncing(true);
                toast({ title: "Syncing latest matches..." });

                const fixtureData = await getFixtures();

                const hasErrors = fixtureData && (Array.isArray(fixtureData.errors) ? fixtureData.errors.length > 0 : Object.keys(fixtureData.errors).length > 0);

                if (!fixtureData || hasErrors) {
                    const errorKey = hasErrors ? Object.keys(fixtureData.errors)[0] : '';
                    const errorMessage = hasErrors ? fixtureData.errors[errorKey as any] : 'Could not fetch match data.';
                    throw new Error(typeof errorMessage === 'string' ? errorMessage : 'An unexpected API error occurred.');
                }
                
                const batch = writeBatch(firestore);

                if (fixtureData.results > 0) {
                    const matches: Match[] = fixtureData.response.map(mapApiFixtureToMatch);
                    matches.forEach(match => {
                        const matchRef = doc(firestore, 'matches', match.id);
                        batch.set(matchRef, match, { merge: true });
                    });
                    toast({ title: "Sync Complete", description: `${matches.length} matches have been updated.` });
                } else {
                    toast({ title: "Sync Complete", description: "No new upcoming matches found." });
                }
                
                batch.set(syncStateRef, { lastSync: serverTimestamp() });
                await batch.commit();

            } catch (error) {
                console.error('Error during match synchronization:', error);
                const message = error instanceof Error ? error.message : 'An unknown error occurred during sync.';
                toast({ variant: 'destructive', title: "Sync Failed", description: message });
            } finally {
                setIsSyncing(false);
            }
        };

        syncMatches();
    }, [user, isUserLoading, firestore, toast]);

    const matchesQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        // Fetch all matches from the cache and order them by kick-off time.
        return query(
            collection(firestore, 'matches'),
            orderBy('kickOff')
        );
    }, [firestore]);

    const { data: matches, isLoading: isLoadingMatches, error: matchesError } = useCollection<Match>(matchesQuery);

    if (matchesError) {
         return (
             <div className="container py-6 sm:py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Database Error</AlertTitle>
                    <AlertDescription>
                       Could not load match data from the database. {matchesError.message}
                    </AlertDescription>
                </Alert>
            </div>
          );
    }

    if (isLoadingMatches || isSyncing) {
        return (
            <div className="container py-6 sm:py-8">
                <div className="flex justify-center items-center py-24 text-muted-foreground bg-card rounded-lg border gap-4">
                    <LoaderCircle className="h-6 w-6 animate-spin" />
                    <h3 className="text-lg font-semibold text-foreground">
                        {isSyncing ? 'Syncing latest match data...' : 'Loading upcoming matches...'}
                    </h3>
                </div>
            </div>
        );
    }
    
    if (!matches || matches.length === 0) {
        return (
            <div className="container py-6 sm:py-8">
                <div className="text-center py-24 text-muted-foreground bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold text-foreground">No upcoming matches found for today.</h3>
                    <p className="mt-1 text-sm">The list is updated hourly. Please check back shortly for new matches.</p>
                </div>
            </div>
        );
    }

    const leagues = [...new Set(matches.map(match => match.league))].sort();

    return (
        <div className="container py-6 sm:py-8">
            <MatchList matches={matches} leagues={leagues} />
        </div>
    );
}
