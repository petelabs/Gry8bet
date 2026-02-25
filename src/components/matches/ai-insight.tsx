'use client';

import { useState } from 'react';
import type { Match } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sparkles, LoaderCircle, ArrowUpRight, Users, TrendingUp, BarChart as BarChartIcon } from 'lucide-react';
import { getMatchPredictionSummary } from '@/ai/flows/get-match-prediction-summary';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useProPlan } from '@/hooks/use-pro-plan';
import { cn } from '@/lib/utils';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AIInsightProps {
  match: Match;
}

type AIResult = {
    summary: string;
    mostConfidentPick: string;
    confidenceScore: number;
    bothTeamsToScore: string;
    overUnder2_5: string;
    headToHead: {
        homeWins: number;
        awayWins: number;
        draws: number;
    };
}

const AFFILIATE_URL = 'https://moy.auraodin.com/redirect.aspx?pid=166680&bid=1733';

function H2HChart({ data, homeTeamName, awayTeamName }: { data: AIResult['headToHead'], homeTeamName: string, awayTeamName: string }) {
    const chartData = [
        { name: homeTeamName, wins: data.homeWins, fill: "hsl(var(--chart-1))" },
        { name: 'Draws', wins: data.draws, fill: "hsl(var(--chart-3))" },
        { name: awayTeamName, wins: data.awayWins, fill: "hsl(var(--chart-2))" },
    ].filter(item => item.wins > 0 || item.name === 'Draws'); // Always show draws if it's 0, but hide teams with 0 wins
    
    if (chartData.every(d => d.wins === 0)) return null;

    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} interval={0} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} width={10} />
                    <Tooltip
                        cursor={{fill: 'hsl(var(--muted))'}}
                        contentStyle={{
                            background: "hsl(var(--background))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)"
                        }}
                    />
                    <Bar dataKey="wins" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export function AIInsight({ match }: AIInsightProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const { toast } = useToast();
  const { isPro } = useProPlan();
  const firestore = useFirestore();

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

        // Cache the result in Firestore (fire and forget)
        if (apiResult) {
            try {
                const predictionRef = doc(firestore, "predictions", match.id);
                await setDoc(predictionRef, {
                    ...apiResult,
                    predictionTimestamp: new Date(),
                });
            } catch (firestoreError) {
                console.error("Firestore Caching Error:", firestoreError);
                // Don't show a toast for caching errors, it's a background task.
            }
        }
        
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
        <div className={cn("grid grid-cols-1 gap-4", !isPro && "sm:grid-cols-2")}>
            <Button onClick={handleGenerateInsight} disabled={loading} variant="outline">
                {loading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                <Sparkles className="mr-2 h-4 w-4" />
                )}
                {loading ? 'Analyzing...' : 'View AI Prediction'}
            </Button>
            {!isPro && (
              <Button asChild>
                  <Link href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer">
                      Bet Now
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
              </Button>
            )}
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
            
            {result.headToHead && (result.headToHead.homeWins > 0 || result.headToHead.awayWins > 0 || result.headToHead.draws > 0) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <BarChartIcon className="h-5 w-5 text-accent" />
                           Head-to-Head (Last 5)
                        </CardTitle>
                        <CardDescription>
                            Recent results between {match.homeTeam.name} and {match.awayTeam.name}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-0">
                        <H2HChart data={result.headToHead} homeTeamName={match.homeTeam.name} awayTeamName={match.awayTeam.name} />
                    </CardContent>
                </Card>
            )}

            <Alert className="border-accent">
              <Sparkles className="h-4 w-4 text-accent" />
              <AlertTitle>Expert Summary</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap leading-relaxed">
                {result.summary}
              </AlertDescription>
            </Alert>
            
            {!isPro && (
              <Button asChild size="lg" className="w-full">
                <Link href={AFFILIATE_URL} target="_blank" rel="noopener noreferrer">
                  Place Your Bet Now on 22Bet
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
        </div>
      )}
    </div>
  );
}
