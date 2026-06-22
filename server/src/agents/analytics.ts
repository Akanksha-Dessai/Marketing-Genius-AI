import { callAgent } from "../lib/openai.js";
import { ANALYTICS_JSON_SCHEMA } from "../lib/json-schemas.js";
import { ANALYTICS_SYSTEM, buildAnalyticsPrompt } from "../lib/prompts.js";
import {
  AnalyticsOutputSchema,
  type AnalyticsOutput,
  type CompanyInput,
  type ContentOutput,
  type ResearchOutput,
  type StrategyOutput,
} from "../types/campaign.js";

export async function runAnalyticsAgent(
  input: CompanyInput,
  research: ResearchOutput,
  strategy: StrategyOutput,
  content: ContentOutput
): Promise<AnalyticsOutput> {
  return callAgent(
    ANALYTICS_SYSTEM,
    buildAnalyticsPrompt(input, research, strategy, content),
    AnalyticsOutputSchema,
    ANALYTICS_JSON_SCHEMA as unknown as Record<string, unknown>,
    "analytics_output"
  );
}
