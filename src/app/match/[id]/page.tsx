import { getFixtureById } from '@/lib/api-sports';
import { mapApiFixtureToMatch } from '@/lib/api-sports-mappers';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { AIInsight } from '@/components/matches/ai-insight';
import { MatchDetails } from '@/components/matches/match-details';
import type { Metadata } from 'next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { BetNowCard } from '@/components/betting/bet-now-card';

type MatchPageProps = {
  params: {
    id: string;
  };
};

async function getMatch(id: string) {
    const fixtureData = await getFixtureById(id);

    if (!fixtureData || (!fixtureData.response && !fixtureData.errors)) {
      return { match: null, error: 'Could not fetch match data. The API may be unavailable or the match ID is invalid.' };
    }

    const hasErrors = Array.isArray(fixtureData.errors) ? fixtureData.errors.length > 0 : Object.keys(fixtureData.errors).length > 0;
    if (hasErrors) {
        const errorKey = Object.keys(fixtureData.errors)[0];
        const errorMessage = fixtureData.errors[errorKey as any];
        const errorString = typeof errorMessage === 'string' ? errorMessage : 'An unexpected error occurred while fetching match details.';
        return { match: null, error: errorString };
    }

    if (fixtureData.results === 0) {
        return { match: null, error: 'Match not found.' };
    }

    const match = mapApiFixtureToMatch(fixtureData.response[0]);
    return { match, error: null };
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { match } = await getMatch(params.id);

  if (!match) {
    return {
      title: 'Match Not Found'
    }
  }

  return {
    title: `${match.homeTeam.name} vs ${match.awayTeam.name} | Expert Prediction & Betting Tips`
  }
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { match, error } = await getMatch(params.id);

  if (error) {
      return (
         <div className="container py-6 sm:py-8 max-w-2xl mx-auto">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {error}
                </AlertDescription>
            </Alert>
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
