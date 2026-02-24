import { matches } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { AIInsight } from '@/components/matches/ai-insight';
import { MatchDetails } from '@/components/matches/match-details';

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
        </div>
    </div>
  );
}
