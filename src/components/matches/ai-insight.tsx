'use client';

import { useState } from 'react';
import type { Match } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sparkles, LoaderCircle, Zap, ShieldCheck } from 'lucide-react';
import { getMatchPredictionSummary } from '@/ai/flows/get-match-prediction-summary';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useProPlan } from '@/hooks/use-pro-plan';
import { ProModal } from '@/components/pro-modal';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface AIInsightProps {
  match: Match;
}

type AIResult = {
    summary: string;
    mostConfidentPick: string;
    confidenceScore: number;
}

export function AIInsight({ match }: AIInsightProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult | null>(null);
  const [showProModal, setShowProModal] = useState(false);
  const { isPro } = useProPlan();
  const { toast } = useToast();

  const handleGenerateInsight = async () => {
    if (!isPro) {
        setShowProModal(true);
        return;
    }
    setLoading(true);
    setResult(null);

    try {
        const apiResult = await getMatchPredictionSummary({
            matchId: match.id,
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

  return (
    <div className="space-y-4">
      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
      
      {!result && (
          <Button onClick={handleGenerateInsight} disabled={loading} className="w-full">
            {loading ? (
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              isPro ? <Sparkles className="mr-2 h-4 w-4" /> : <Zap className="mr-2 h-4 w-4" />
            )}
            {loading ? 'Analyzing...' : (isPro ? 'Get Expert AI Analysis' : 'Get Expert AI Analysis (Pro)')}
          </Button>
      )}

      {result && (
        <div className="space-y-4 mt-4">
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

            <Alert className="border-accent">
              <Sparkles className="h-4 w-4 text-accent" />
              <AlertTitle>Expert Summary</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap leading-relaxed">
                {result.summary}
              </AlertDescription>
            </Alert>
        </div>
      )}
    </div>
  );
}
