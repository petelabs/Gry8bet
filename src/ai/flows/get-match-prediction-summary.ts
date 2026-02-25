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
import { getH2HEvents, getLast5EventsForTeam } from '@/lib/the-sports-db';
import type { TheSportsDBEvent } from '@/lib/types';

// Helper function to format team form
function formatTeamForm(events: TheSportsDBEvent[], teamName: string): string {
    if (!events || events.length === 0) return `${teamName} has no recent match data.`;
    const form = events.map(match => {
        const isHome = match.strHomeTeam === teamName;
        const score = `${match.intHomeScore}-${match.intAwayScore}`;
        if (isHome) {
            if (match.intHomeScore > match.intAwayScore) return 'W';
            if (match.intHomeScore < match.intAwayScore) return 'L';
            return 'D';
        } else {
            if (match.intAwayScore > match.intHomeScore) return 'W';
            if (match.intAwayScore < match.intHomeScore) return 'L';
            return 'D';
        }
    }).join('');
    return `${teamName}'s form in their last ${events.length} games is: ${form}.`;
}


// Helper function to format H2H stats
function formatHeadToHead(h2h: TheSportsDBEvent[], homeTeamName: string, awayTeamName: string): string {
    if (!h2h || h2h.length === 0) return 'No recent head-to-head data available.';
    
    let homeWins = 0;
    let awayWins = 0;
    let draws = 0;

    h2h.slice(0, 5).forEach(match => { // Limit to last 5 for summary
        if (match.intHomeScore === match.intAwayScore) {
            draws++;
        } else if (match.strHomeTeam === homeTeamName && match.intHomeScore > match.intAwayScore) {
            homeWins++;
        } else if (match.strAwayTeam === homeTeamName && match.intAwayScore > match.intHomeScore) {
            homeWins++;
        } else {
            awayWins++;
        }
    });

    return `In the last ${Math.min(5, h2h.length)} meetings, ${homeTeamName} won ${homeWins}, ${awayTeamName} won ${awayWins}, with ${draws} draws.`;
}

// Tool to get historical match data from TheSportsDB
const getExpertMatchAnalysis = ai.defineTool(
  {
    name: 'getExpertMatchAnalysis',
    description: 'Gets historical match data for a given football match, including team form and head-to-head history.',
    inputSchema: z.object({
      homeTeamId: z.string().describe('The ID of the home team.'),
      awayTeamId: z.string().describe('The ID of the away team.'),
      homeTeamName: z.string().describe('The name of the home team.'),
      awayTeamName: z.string().describe('The name of the away team.'),
    }),
    outputSchema: z.object({
      teamForm: z.string().describe("Analysis of both teams' recent performance and form."),
      headToHeadStats: z.string().describe('Summary of the head-to-head results.'),
    }),
  },
  async ({ homeTeamId, awayTeamId, homeTeamName, awayTeamName }) => {
    console.log(`Fetching historical analysis for teams ${homeTeamId} and ${awayTeamId}...`);

    const [homeFormEvents, awayFormEvents, h2hEvents] = await Promise.all([
        getLast5EventsForTeam(homeTeamId),
        getLast5EventsForTeam(awayTeamId),
        getH2HEvents(homeTeamName, awayTeamName)
    ]);
    
    const homeForm = formatTeamForm(homeFormEvents, homeTeamName);
    const awayForm = formatTeamForm(awayFormEvents, awayTeamName);
    
    const teamForm = `${homeForm} ${awayForm}`;
    const headToHeadStats = formatHeadToHead(h2hEvents, homeTeamName, awayTeamName);

    return {
      teamForm,
      headToHeadStats,
    };
  }
);


const GetMatchPredictionSummaryInputSchema = z.object({
  matchId: z.string().describe("The unique event ID for the match."),
  homeTeamId: z.string().describe('The ID of the home team.'),
  awayTeamId: z.string().describe('The ID of the away team.'),
  homeTeamName: z.string().describe('The name of the home team.'),
  awayTeamName: z.string().describe('The name of the away team.'),
  league: z.string().describe('The league the match is being played in.'),
}).describe('Input data for generating a football match prediction summary.');

export type GetMatchPredictionSummaryInput = z.infer<typeof GetMatchPredictionSummaryInputSchema>;

const GetMatchPredictionSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise, expert-level summary of the match prediction insights, incorporating all available data and analysis.'),
  mostConfidentPick: z.string().describe('The single most confident prediction based on the analysis (e.g., "Home Win", "Both Teams to Score", "Draw").'),
  confidenceScore: z.number().int().min(0).max(100).describe('A confidence score for the pick, from 0 (very low) to 100 (very high), based on your analysis of the form and H2H data.'),
}).describe('Output containing the generated prediction summary and confident pick.');

export type GetMatchPredictionSummaryOutput = z.infer<typeof GetMatchPredictionSummaryOutputSchema>;

const prompt = ai.definePrompt({
  name: 'getMatchPredictionSummaryPrompt',
  input: { schema: GetMatchPredictionSummaryInputSchema },
  output: { schema: GetMatchPredictionSummaryOutputSchema },
  tools: [getExpertMatchAnalysis],
  prompt: `You are a world-class football prediction analyst. Your task is to provide a reliable, expert-level prediction summary for an upcoming football match.

First, you MUST use the getExpertMatchAnalysis tool with the provided team IDs to fetch detailed historical data for the match.

Then, synthesize the information from the tool. Your analysis should be sharp, insightful, and avoid generic statements. There are no betting odds available, so you must base your prediction entirely on the historical data (team form and head-to-head results).

Match Details for context:
- Home Team: {{{homeTeamName}}}
- Away Team: {{{awayTeamName}}}
- League: {{{league}}}

Generate a concise summary (2-3 paragraphs) that explains the reasoning behind your prediction. For the 'mostConfidentPick', determine the most likely outcome (e.g., "Home Win", "Draw", "Away Win", "Both Teams to Score"). For the 'confidenceScore', generate a score from 0 to 100 based on how confident you are in your pick given the available data.`,
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
