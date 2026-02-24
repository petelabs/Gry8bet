'use server';
/**
 * @fileOverview A Genkit flow that generates a summary of key prediction insights for a football match.
 *
 * - getMatchPredictionSummary - A function that handles the generation of the prediction summary.
 * - GetMatchPredictionSummaryInput - The input type for the getMatchPredictionSummary function.
 * - GetMatchPredictionSummaryOutput - The return type for the getMatchPredictionSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetMatchPredictionSummaryInputSchema = z.object({
  homeTeamName: z.string().describe('The name of the home team.'),
  awayTeamName: z.string().describe('The name of the away team.'),
  league: z.string().describe('The league the match is being played in.'),
  kickOffTime: z.string().describe('The kick-off time of the match.'),
  predictedOutcome: z.string().describe('The predicted outcome of the match (e.g., Home Win, Draw, Away Win).'),
  predictedScore: z.string().describe('The predicted score of the match (e.g., 2-1).'),
  predictionConfidence: z.string().describe('The confidence level of the prediction (e.g., High, Medium, Low, or a percentage).'),
  analysisPoints: z.array(z.string()).describe('An array of key analysis points supporting the prediction.'),
}).describe('Input data for generating a football match prediction summary.');

export type GetMatchPredictionSummaryInput = z.infer<typeof GetMatchPredictionSummaryInputSchema>;

const GetMatchPredictionSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the match prediction insights and the most confident pick.'),
}).describe('Output containing the generated prediction summary.');

export type GetMatchPredictionSummaryOutput = z.infer<typeof GetMatchPredictionSummaryOutputSchema>;

const prompt = ai.definePrompt({
  name: 'getMatchPredictionSummaryPrompt',
  input: { schema: GetMatchPredictionSummaryInputSchema },
  output: { schema: GetMatchPredictionSummaryOutputSchema },
  prompt: `You are an expert football prediction analyst. Your task is to provide a concise summary of the key prediction insights for an upcoming football match, highlighting the most confident pick and relevant factors.

Match Details:
Home Team: {{{homeTeamName}}}
Away Team: {{{awayTeamName}}}
League: {{{league}}}
Kick-off Time: {{{kickOffTime}}}

Prediction:
Outcome: {{{predictedOutcome}}}
Score: {{{predictedScore}}}
Confidence: {{{predictionConfidence}}}

Analysis Points:
{{#each analysisPoints}}- {{{this}}}
{{/each}}

Based on the above information, provide a brief summary (2-3 paragraphs) of the key insights, explaining why the predicted outcome is the most confident pick. Focus on the most important factors.

Summary:`,
});

const getMatchPredictionSummaryFlow = ai.defineFlow(
  {
    name: 'getMatchPredictionSummaryFlow',
    inputSchema: GetMatchPredictionSummaryInputSchema,
    outputSchema: GetMatchPredictionSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function getMatchPredictionSummary(input: GetMatchPredictionSummaryInput): Promise<GetMatchPredictionSummaryOutput> {
  return getMatchPredictionSummaryFlow(input);
}
