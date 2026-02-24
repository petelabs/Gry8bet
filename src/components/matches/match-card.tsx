'use client';

import type { Match } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const [kickOffTime, setKickOffTime] = useState<string | null>(null);
  const kickOffDate = new Date(match.kickOff);

  useEffect(() => {
    // This ensures the time is formatted on the client, avoiding hydration mismatches.
    setKickOffTime(format(kickOffDate, 'HH:mm'));
  }, [kickOffDate]);

  return (
    <Link href={`/match/${match.id}`} className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
      <Card className="hover:shadow-md transition-shadow duration-300 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2">
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{match.league}</span>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(kickOffDate, 'MMM d')}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{kickOffTime ?? '--:--'}</span>
                </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between gap-2 text-center">
            <div className="flex-1 flex flex-col items-center gap-2">
              <Image
                src={match.homeTeam.logoUrl}
                alt={`${match.homeTeam.name} logo`}
                width={40}
                height={40}
                data-ai-hint={match.homeTeam.logoImageHint}
                className="rounded-full aspect-square object-contain"
              />
              <span className="font-semibold text-sm sm:text-base leading-tight">{match.homeTeam.name}</span>
            </div>
            <div className="font-bold text-xl sm:text-2xl text-muted-foreground">vs</div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <Image
                src={match.awayTeam.logoUrl}
                alt={`${match.awayTeam.name} logo`}
                width={40}
                height={40}
                data-ai-hint={match.awayTeam.logoImageHint}
                className="rounded-full aspect-square object-contain"
              />
              <span className="font-semibold text-sm sm:text-base leading-tight">{match.awayTeam.name}</span>
            </div>
          </div>

          <div className="bg-muted/50 rounded-md p-3 flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold text-primary">View Match & AI Analysis</p>
            </div>
            <div className="flex items-center gap-2 text-right">
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
