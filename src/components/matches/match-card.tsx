import type { Match } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Clock } from 'lucide-react';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const kickOffDate = new Date(match.kickOff);
  
  const getConfidenceVariant = (confidence: 'High' | 'Medium' | 'Low'): 'default' | 'secondary' | 'destructive' => {
      switch (confidence) {
          case 'High': return 'default';
          case 'Medium': return 'secondary';
          case 'Low': return 'destructive';
          default: return 'secondary';
      }
  }

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
                    <span>{format(kickOffDate, 'HH:mm')}</span>
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
              <p className="text-xs text-muted-foreground">Prediction</p>
              <p className="font-bold text-primary">{match.prediction.outcome} ({match.prediction.score})</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getConfidenceVariant(match.prediction.confidence)}>
                {match.prediction.confidence}
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
