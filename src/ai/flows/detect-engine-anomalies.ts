// src/ai/flows/detect-engine-anomalies.ts
'use server';
/**
 * @fileOverview An engine anomaly detection AI agent.
 *
 * - detectEngineAnomalies - A function that handles the engine anomaly detection process.
 * - DetectEngineAnomaliesInput - The input type for the detectEngineAnomalies function.
 * - DetectEngineAnomaliesOutput - The return type for the detectEngineAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EngineLogSectionSchema = z.object({
  timestamp: z.string().describe('The timestamp of the log entry.'),
  parameters: z.record(z.string(), z.number()).describe('A record of engine parameters, where the key is the parameter name and the value is the parameter value.'),
});

const DetectEngineAnomaliesInputSchema = z.object({
  logData: z.array(EngineLogSectionSchema).describe('An array of engine log data sections.'),
});
export type DetectEngineAnomaliesInput = z.infer<typeof DetectEngineAnomaliesInputSchema>;

const AnomalySchema = z.object({
  timestamp: z.string().describe('The timestamp of the anomalous log entry.'),
  parameter: z.string().describe('The name of the parameter that is anomalous.'),
  expectedValue: z.number().describe('The expected value of the parameter.'),
  actualValue: z.number().describe('The actual value of the parameter.'),
  possibleCauses: z.string().describe('Possible causes of the anomaly.'),
  recommendedActions: z.string().describe('Recommended actions to address the anomaly.'),
});

const DetectEngineAnomaliesOutputSchema = z.object({
  anomalies: z.array(AnomalySchema).describe('An array of detected anomalies in the engine log data.'),
});
export type DetectEngineAnomaliesOutput = z.infer<typeof DetectEngineAnomaliesOutputSchema>;

export async function detectEngineAnomalies(input: DetectEngineAnomaliesInput): Promise<DetectEngineAnomaliesOutput> {
  return detectEngineAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectEngineAnomaliesPrompt',
  input: {schema: DetectEngineAnomaliesInputSchema},
  output: {schema: DetectEngineAnomaliesOutputSchema},
  prompt: `You are an expert marine engineer specializing in identifying anomalies in engine log data.

You will be provided with an array of engine log data sections, each containing a timestamp and a record of engine parameters.

Your task is to analyze the log data and identify any potential anomalies or deviations from normal operating parameters.
Anomalies can include drops in pressure, spikes in temperature or pressure, changes in fuel usage, etc.

For each detected anomaly, you should provide the following information:
- timestamp: The timestamp of the anomalous log entry.
- parameter: The name of the parameter that is anomalous.
- expectedValue: The expected value of the parameter.
- actualValue: The actual value of the parameter.
- possibleCauses: Possible causes of the anomaly.
- recommendedActions: Recommended actions to address the anomaly.

Return the anomalies in the format of DetectEngineAnomaliesOutputSchema.

Here is the engine log data:
{{{logData}}}
`,
});

const detectEngineAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectEngineAnomaliesFlow',
    inputSchema: DetectEngineAnomaliesInputSchema,
    outputSchema: DetectEngineAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
