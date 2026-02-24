'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CardContent } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import type { Match } from '@/lib/types';

interface MatchDetailsProps {
  match: Match;
}

export function MatchDetails({ match }: MatchDetailsProps) {
  const [kickOffTime, setKickOffTime] = useState<string | null>(null);
  const [kickOffDay, setKickOffDay] = useState<string | null>(null);

  useEffect(() => {
    const kickOffDate = new Date(match.kickOff);
    // This ensures the time is formatted on the client, avoiding hydration mismatches.
    setKickOffTime(format(kickOffDate, 'p'));
    setKickOffDay(format(kickOffDate, 'EEEE, MMM d, yyyy'));
  }, [match.kickOff]);

  return (
    <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                <span>{match.league}</span>
            </div>
            <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{match.stadium}</span>
            </div>
             <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{kickOffDay ?? '...'}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>{kickOffTime ?? '--:--'}</span>
            </div>
        </div>
    </CardContent>
  );
}
