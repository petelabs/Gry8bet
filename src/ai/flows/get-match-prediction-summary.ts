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
import { getPrediction } from '@/lib/api-sports';
import type { ApiSportsResponseData } from '@/lib/types';

// Helper function to format H2H stats
function formatHeadToHead(h2h: ApiSportsResponseData['h2h'], homeTeamName: string, awayTeamName: string): string {
    if (!h2h || h2h.length === 0) return 'No recent head-to-head data available.';
    
    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;

    h2h.forEach(match => {
        if (match.teams.home.name === homeTeamName && match.teams.home.winner) {
            homeWins++;
        } else if (match.teams.away.name === homeTeamName && match.teams.away.winner) {
            homeWins++;
        } else if (match.teams.home.name === awayTeamName && match.teams.home.winner) {
            awayWins++;
        } else if (match.teams.away.name === awayTeamName && match.teams.away.winner) {
            awayWins++;
        } else if (match.teams.home.winner === null) {
            draws++;
        }
    });

    return `In the last ${h2h.length} meetings, ${homeTeamName} won ${homeWins}, ${awayTeamName} won ${awayWins}, with ${draws} draws.`;
}

// Tool to get real expert analysis from API-Sports
const getExpertMatchAnalysis = ai.defineTool(
  {
    name: 'getExpertMatchAnalysis',
    description: 'Gets detailed expert analysis and real-time data for a given football match using its fixture ID.',
    inputSchema: z.object({
      matchId: z.string().describe('The fixture ID of the match.'),
    }),
    outputSchema: z.object({
      headToHeadStats: z.string().describe('Summary of the head-to-head results.'),
      keyPlayerStatus: z.string().describe('Information on injuries, suspensions, or key player form. If not available, state that.'),
      bettingOddsInsight: z.string().describe('Insights from current betting market odds or expert advice.'),
      teamForm: z.string().describe('Analysis of both teams\' recent performance and form.'),
    }),
  },
  async ({ matchId }) => {
    console.log(`Fetching expert analysis for match ID ${matchId} from API-Sports...`);
    const predictionData = await getPrediction(matchId);

    if (!predictionData || predictionData.results === 0) {
      throw new Error(`Could not retrieve analysis for match ID ${matchId}. The match may be too far in the future or data is not available.`);
    }

    const data = predictionData.response[0];

    const homeTeamName = data.teams.home.name;
    const awayTeamName = data.teams.away.name;

    const teamForm = `${homeTeamName}'s form in their last 5 games is ${data.teams.home.last_5.form}. ${awayTeamName}'s form is ${data.teams.away.last_5.form}.`;
    
    // The free API-Sports plan does not include detailed player status (injuries/suspensions).
    const keyPlayerStatus = "Detailed key player status (injuries, suspensions) is not available on the current plan.";

    const headToHeadStats = formatHeadToHead(data.h2h, homeTeamName, awayTeamName);
    
    const bettingOddsInsight = `The API's primary advice is: "${data.predictions.advice}". The predicted chances are - ${homeTeamName} win: ${data.predictions.percent.home}, Draw: ${data.predictions.percent.draw}, ${awayTeamName} win: ${data.predictions.percent.away}.`;

    return {
      headToHeadStats,
      keyPlayerStatus,
      bettingOddsInsight,
      teamForm,
    };
  }
);


const GetMatchPredictionSummaryInputSchema = z.object({
  matchId: z.string().describe("The unique fixture ID for the match."),
  homeTeamName: z.string().describe('The name of the home team.'),
  awayTeamName: z.string().describe('The name of the away team.'),
  league: z.string().describe('The league the match is being played in.'),
}).describe('Input data for generating a football match prediction summary.');

export type GetMatchPredictionSummaryInput = z.infer<typeof GetMatchPredictionSummaryInputSchema>;

const GetMatchPredictionSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, expert-level summary of the match prediction insights, incorporating all available data and analysis.'),
  mostConfidentPick: z.string().describe('The single most confident prediction based on the analysis (e.g., "Home Win", "Both Teams to Score", "Chelsea or draw").'),
  confidenceScore: z.number().int().min(0).max(100).describe('A confidence score for the pick, from 0 (very low) to 100 (very high).'),
}).describe('Output containing the generated prediction summary and confident pick.');

export type GetMatchPredictionSummaryOutput = z.infer<typeof GetMatchPredictionSummaryOutputSchema>;

const prompt = ai.definePrompt({
  name: 'getMatchPredictionSummaryPrompt',
  input: { schema: GetMatchPredictionSummaryInputSchema },
  output: { schema: GetMatchPredictionSummaryOutputSchema },
  tools: [getExpertMatchAnalysis],
  prompt: `You are a world-class football prediction analyst. Your task is to provide a reliable, expert-level prediction summary for an upcoming football match.

First, you MUST use the getExpertMatchAnalysis tool with the provided match ID ({{{matchId}}}) to fetch detailed, real-time data for the match.

Then, synthesize the information from the tool. Your analysis should be sharp, insightful, and avoid generic statements.

Base your final summary, your most confident pick, and your confidence score *primarily* on the expert data returned by the tool.

Match Details for context:
- Home Team: {{{homeTeamName}}}
- Away Team: {{{awayTeamName}}}
- League: {{{league}}}

Generate a concise summary (2-3 paragraphs) that explains the reasoning behind your prediction. For the 'mostConfidentPick', use the primary advice from the analysis (e.g., the 'advice' field). For the 'confidenceScore', determine the highest percentage chance from the analysis (e.g., if home is '60%', draw is '20%', away is '20%', the confidence score is 60).`,
});

const getMatchPredictionSummaryFlow = ai.defineFlow(
  {
    name: 'getMatchPredictionSummaryFlow',
    inputSchema: GetMatchPredictionSummaryInputSchema,
    outputSchema: GetMatchPredictionSummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    if (output) {
      // Ensure confidence score is an integer between 0 and 100
      output.confidenceScore = Math.round(Math.max(0, Math.min(100, output.confidenceScore)));
    }
    
    return output!;
  }
);

export async function getMatchPredictionSummary(input: GetMatchPredictionSummaryInput): Promise<GetMatchPredictionSummaryOutput> {
  return getMatchPredictionSummaryFlow(input);
}
