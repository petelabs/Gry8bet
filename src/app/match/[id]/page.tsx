import { matches } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar, Clock, MapPin, Trophy, Shield } from 'lucide-react';
import { AIInsight } from '@/components/matches/ai-insight';

type MatchPageProps = {
  params: {
    id: string;
  };
};

export function generateMetadata({ params }: MatchPageProps) {
  const match = matches.find(m => m.id === params.id);

  if (!match) {
    return {
      title: 'Match Not Found'
    }
  }

  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name} | FootyForecast`
  }
}

export default function MatchPage({ params }: MatchPageProps) {
  const match = matches.find(m => m.id === params.id);

  if (!match) {
    notFound();
  }

  const kickOffDate = new Date(match.kickOff);

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
                            <span>{format(kickOffDate, 'EEEE, MMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{format(kickOffDate, 'p')}</span>
                        </div>
                    </div>
                </CardContent>
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
        </div>
    </div>
  );
}
