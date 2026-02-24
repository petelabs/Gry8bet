'use client';

import { doc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, LoaderCircle } from 'lucide-react';
import { AIInsight } from '@/components/matches/ai-insight';
import { MatchDetails } from '@/components/matches/match-details';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { BetNowCard } from '@/components/betting/bet-now-card';
import type { Match } from '@/lib/types';
import { useMemo } from 'react';

// Note: generateMetadata is a server-only function. In a client component,
// you can set the document title using useEffect, but it's less ideal for SEO.
// For this iteration, we'll rely on the default title from layout.tsx.

export default function MatchPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const firestore = useFirestore();

  const matchRef = useMemoFirebase(() => {
    if (!firestore || !id) return null;
    return doc(firestore, 'matches', id);
  }, [firestore, id]);

  const { data: match, isLoading, error } = useDoc<Match>(matchRef);

  if (error) {
    return (
      <div className="container py-6 sm:py-8 max-w-2xl mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not load match data: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container flex justify-center items-center py-24">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!match) {
    notFound();
  }

  return (
    <div className="container py-6 sm:py-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-around items-center">
              <div className="flex flex-col items-center gap-2 w-1/3">
                <Image
                  src={match.homeTeam.logoUrl}
                  alt={`${match.homeTeam.name} logo`}
                  width={64}
                  height={64}
                  data-ai-hint={match.homeTeam.logoImageHint}
                  className="rounded-full aspect-square object-contain"
                />
                <h2 className="text-lg md:text-xl font-bold text-center">{match.homeTeam.name}</h2>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-bold">vs</span>
              </div>
              <div className="flex flex-col items-center gap-2 w-1/3">
                <Image
                  src={match.awayTeam.logoUrl}
                  alt={`${match.awayTeam.name} logo`}
                  width={64}
                  height={64}
                  data-ai-hint={match.awayTeam.logoImageHint}
                  className="rounded-full aspect-square object-contain"
                />
                <h2 className="text-lg md:text-xl font-bold text-center">{match.awayTeam.name}</h2>
              </div>
            </div>
          </CardHeader>
          <MatchDetails match={match} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              Expert AI Analysis
            </CardTitle>
            <CardDescription>
              Use our powerful AI to get expert analysis and the most confident prediction for this match.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIInsight match={match} />
          </CardContent>
        </Card>

        <BetNowCard />
      </div>
    </div>
  );
}
