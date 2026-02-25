'use client';

import { useState } from 'react';
import type { Match } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sparkles, LoaderCircle, ArrowUpRight, Users, TrendingUp } from 'lucide-react';
import { getMatchPredictionSummary } from '@/ai/flows/get-match-prediction-summary';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface AIInsightProps {
  match: Match;
}

type AIResult = {
    summary: string;
    mostConfidentPick: string;
    confidenceScore: number;
    bothTeamsToScore: string;
    overUnder2_5: string;
}

const AFFILIATE_URL = 'https://moy.auraodin.com/redirect.aspx?pid=166680&bid=1733';

export function AIInsight({ match }: AIInsightProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const { toast } = useToast();

  const handleGenerateInsight = async () => {
    setLoading(true);
    setResult(null);

    try {
        const apiResult = await getMatchPredictionSummary({
            matchId: match.id,
            homeTeamId: match.homeTeam.id,
            awayTeamId: match.awayTeam.id,
            homeTeamName: match.homeTeam.name,
            awayTeamName: match.awayTeam.name,
            league: match.league,
        });
        
        setResult(apiResult);
        
    } catch (error) {
      console.error('AI Insight Error:', error);
      const errorMessage = error instanceof Error ? error.message : "There was a problem getting the AI summary. Please try again later.";
      toast({
        variant: "destructive",
        title: "Error generating insight",
        description: errorMessage,
      })
    } finally {
      setLoading(false);
    }
  };

  const bttsParts = result?.bothTeamsToScore?.split(' - ') ?? [];
  const bttsPick = bttsParts[0] ?? '';
  const bttsReason = bttsParts.length > 1 ? bttsParts.slice(1).join(' - ') : '';

  const ouParts = result?.overUnder2_5?.split(' - ') ?? [];
  const ouPick = ouParts[0] ?? '';
  const ouReason = ouParts.length > 1 ? ouParts.slice(1).join(' - ') : '';


  return (
    <div className="space-y-4">
      {!result && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={handleGenerateInsight} disabled={loading} variant="outline">
                {loading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                <Sparkles className="mr-2 h-4 w-4" />
                )}
                {loading ? 'Analyzing...' : 'View AI Prediction'}
            </Button>
            <Button asChild>
                <Link href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer">
                    Bet Now
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
      )}

      {result && (
        <div className="space-y-4">
            <Card>
                <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                         <h4 className="font-semibold flex items-center gap-2">
                           <ShieldCheck className="h-5 w-5 text-primary" />
                           Most Confident Pick
                        </h4>
                        <span className="font-bold text-lg text-primary">{result.mostConfidentPick}</span>
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-muted-foreground">Confidence Score</span>
                            <span className="text-sm font-bold">{result.confidenceScore}%</span>
                        </div>
                        <Progress value={result.confidenceScore} className="h-2" />
                    </div>
                </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Card>
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Both Teams to Score?</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bttsPick}</div>
                        <p className="text-xs text-muted-foreground">{bttsReason}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Over/Under 2.5 Goals</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{ouPick}</div>
                         <p className="text-xs text-muted-foreground">{ouReason}</p>
                    </CardContent>
                </Card>
            </div>

            <Alert className="border-accent">
              <Sparkles className="h-4 w-4 text-accent" />
              <AlertTitle>Expert Summary</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap leading-relaxed">
                {result.summary}
              </AlertDescription>
            </Alert>
            
            <Button asChild size="lg" className="w-full">
              <Link href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer">
                Place Your Bet Now on 22Bet
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
        </div>
      )}
    </div>
  );
}
