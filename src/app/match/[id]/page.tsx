import { matches } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Shield, Trophy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
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
  
  const getConfidenceVariant = (confidence: 'High' | 'Medium' | 'Low'): 'default' | 'secondary' | 'destructive' => {
      switch (confidence) {
          case 'High': return 'default';
          case 'Medium': return 'secondary';
          case 'Low': return 'destructive';
          default: return 'secondary';
      }
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
                            <span className="text-3xl md:text-4xl font-bold">{match.prediction.score}</span>
                            <span className="text-xs md:text-sm text-muted-foreground">Predicted Score</span>
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
                    <CardTitle>Prediction Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Predicted Outcome</span>
                        <span className="font-bold text-lg text-primary">{match.prediction.outcome}</span>
                    </div>
                    <Separator />
                     <div className="flex justify-between items-center">
                        <span className="font-semibold">Confidence</span>
                        <Badge variant={getConfidenceVariant(match.prediction.confidence)} className="text-sm">
                            {match.prediction.confidence}
                        </Badge>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-semibold mb-3">Key Analysis Points</h4>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            {match.prediction.analysisPoints.map((point, index) => (
                                <li key={index}>{point}</li>
                            ))}
                        </ul>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-accent" />
                        AI Prediction Insight
                    </CardTitle>
                    <CardDescription>
                        Get a summary of the prediction generated by AI for deeper insights.
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
