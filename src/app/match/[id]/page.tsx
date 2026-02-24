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
import { useMemo, useState, useEffect } from 'react';
import { addMinutes } from 'date-fns';
import { Badge } from '@/components/ui/badge';

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
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!match) return;

    const kickOffDate = new Date(match.kickOff);
    
    // Generate a consistent, pseudo-random duration for each match based on its ID.
    // This avoids using Math.random() directly, which can cause issues between server and client rendering.
    const matchIdNum1 = parseInt(match.id.slice(-1), 10) || 0;
    const matchIdNum2 = parseInt(match.id.slice(-2, -1), 10) || 3;
    
    const firstHalfAdded = 4 + (matchIdNum1 % 3); // Consistent 4-6 mins
    const secondHalfAdded = 5 + (matchIdNum2 % 6); // Consistent 5-10 mins
    const totalDuration = 90 + 15 + firstHalfAdded + secondHalfAdded; // Includes 15 min half-time
    const matchEndTime = addMinutes(kickOffDate, totalDuration);

    const checkLiveStatus = () => {
      const now = new Date();
      if (now >= kickOffDate && now <= matchEndTime) {
        setIsLive(true);
      } else {
        setIsLive(false);
      }
    };

    checkLiveStatus(); // Initial check
    const interval = setInterval(checkLiveStatus, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, [match]);

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
        <Card className="relative">
           {isLive && (
            <Badge variant="destructive" className="absolute top-4 right-4 animate-pulse z-10">
              Live
            </Badge>
          )}
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
