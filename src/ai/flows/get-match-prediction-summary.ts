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

// Tool to simulate fetching expert analysis
const getExpertMatchAnalysis = ai.defineTool(
  {
    name: 'getExpertMatchAnalysis',
    description: 'Gets detailed expert analysis and real-time data for a given football match.',
    inputSchema: z.object({
      homeTeamName: z.string(),
      awayTeamName: z.string(),
    }),
    outputSchema: z.object({
      headToHeadStats: z.string().describe('Summary of the last 5 head-to-head results.'),
      keyPlayerStatus: z.string().describe('Information on injuries, suspensions, or key player form.'),
      bettingOddsInsight: z.string().describe('Insights from current betting market odds.'),
      teamForm: z.string().describe('Analysis of both teams\' recent performance and form (last 5 games).'),
    }),
  },
  async ({ homeTeamName, awayTeamName }) => {
    // In a real application, this would be a call to a third-party sports data API.
    // We are mocking the response here for demonstration purposes.
    console.log(`Fetching expert analysis for ${homeTeamName} vs ${awayTeamName}...`);
    return {
      headToHeadStats: `${homeTeamName} has won 3 of the last 5 meetings, with 2 draws.`,
      keyPlayerStatus: `${awayTeamName}'s top scorer is returning from a minor injury but may not be at 100%. ${homeTeamName} has a key defender suspended.`,
      bettingOddsInsight: 'Major betting markets have seen a slight shift towards a draw in the last 24 hours, suggesting uncertainty.',
      teamForm: `${homeTeamName} is unbeaten in their last 8 home games. ${awayTeamName} has struggled to score on the road, with only 2 goals in their last 4 away matches.`,
    };
  }
);


const GetMatchPredictionSummaryInputSchema = z.object({
  homeTeamName: z.string().describe('The name of the home team.'),
  awayTeamName: z.string().describe('The name of the away team.'),
  league: z.string().describe('The league the match is being played in.'),
}).describe('Input data for generating a football match prediction summary.');

export type GetMatchPredictionSummaryInput = z.infer<typeof GetMatchPredictionSummaryInputSchema>;

const GetMatchPredictionSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, expert-level summary of the match prediction insights, incorporating all available data and analysis.'),
  mostConfidentPick: z.string().describe('The single most confident prediction based on the analysis (e.g., "Home Win", "Both Teams to Score").'),
  confidenceScore: z.number().int().min(1).max(100).describe('A confidence score for the pick, from 1 (very low) to 100 (very high).'),
}).describe('Output containing the generated prediction summary and confident pick.');

export type GetMatchPredictionSummaryOutput = z.infer<typeof GetMatchPredictionSummaryOutputSchema>;

const prompt = ai.definePrompt({
  name: 'getMatchPredictionSummaryPrompt',
  input: { schema: GetMatchPredictionSummaryInputSchema },
  output: { schema: GetMatchPredictionSummaryOutputSchema },
  tools: [getExpertMatchAnalysis],
  prompt: `You are a world-class football prediction analyst. Your task is to provide a reliable, expert-level prediction summary for an upcoming football match.

First, you MUST use the getExpertMatchAnalysis tool to fetch detailed, real-time data for the match between {{{homeTeamName}}} and {{{awayTeamName}}}.

Then, synthesize the information from the tool with the basic match details below. Your analysis should be sharp, insightful, and avoid generic statements.

Base your final summary, your most confident pick, and your confidence score *primarily* on the expert data returned by the tool.

Match Details:
- League: {{{league}}}

Generate a concise summary (2-3 paragraphs) that explains the reasoning behind your prediction. Conclude with the single most confident pick and a numerical confidence score.`,
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
