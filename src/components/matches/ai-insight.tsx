'use client';

import { useState } from 'react';
import type { Match } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sparkles, LoaderCircle, Zap } from 'lucide-react';
import { getMatchPredictionSummary } from '@/ai/flows/get-match-prediction-summary';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useProPlan } from '@/hooks/use-pro-plan';
import { ProModal } from '@/components/pro-modal';

interface AIInsightProps {
  match: Match;
}

export function AIInsight({ match }: AIInsightProps) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [showProModal, setShowProModal] = useState(false);
  const { isPro } = useProPlan();
  const { toast } = useToast();

  const handleGenerateInsight = async () => {
    if (!isPro) {
        setShowProModal(true);
        return;
    }
    setLoading(true);
    setSummary('');

    try {
      const result = await getMatchPredictionSummary({
        homeTeamName: match.homeTeam.name,
        awayTeamName: match.awayTeam.name,
        league: match.league,
        kickOffTime: new Date(match.kickOff).toLocaleString(),
        predictedOutcome: match.prediction.outcome,
        predictedScore: match.prediction.score,
        predictionConfidence: match.prediction.confidence,
        analysisPoints: match.prediction.analysisPoints,
      });
      setSummary(result.summary);
    } catch (error) {
      console.error('AI Insight Error:', error);
      toast({
        variant: "destructive",
        title: "Error generating insight",
        description: "There was a problem getting the AI summary. Please try again later.",
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ProModal isOpen={showProModal} onClose={() => setShowProModal(false)} />
      <Button onClick={handleGenerateInsight} disabled={loading} className="w-full">
        {loading ? (
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          isPro ? <Sparkles className="mr-2 h-4 w-4" /> : <Zap className="mr-2 h-4 w-4" />
        )}
        {loading ? 'Generating...' : (isPro ? 'Generate AI Insight' : 'Generate AI Insight (Pro)')}
      </Button>

      {summary && (
        <Alert className="mt-4 border-accent">
          <Sparkles className="h-4 w-4 text-accent" />
          <AlertTitle>AI Summary</AlertTitle>
          <AlertDescription className="whitespace-pre-wrap leading-relaxed">
            {summary}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
