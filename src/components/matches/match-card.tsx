'use client';

import type { Match } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { format, addMinutes } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const [kickOffTime, setKickOffTime] = useState<string | null>(null);
  const [kickOffDay, setKickOffDay] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  
  useEffect(() => {
    const kickOffDate = new Date(match.kickOff);
    // This ensures the time is formatted on the client, avoiding hydration mismatches.
    setKickOffTime(format(kickOffDate, 'HH:mm'));
    setKickOffDay(format(kickOffDate, 'MMM d'));

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
  }, [match.kickOff, match.id]);

  return (
    <Link href={`/match/${match.id}`} className="group block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
      <Card className="hover:shadow-md transition-shadow duration-300 group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 relative">
        {isLive && (
          <Badge variant="destructive" className="absolute top-2 left-2 animate-pulse z-10">
            Live
          </Badge>
        )}
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{match.league}</span>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{kickOffDay ?? '...'}</span>
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
