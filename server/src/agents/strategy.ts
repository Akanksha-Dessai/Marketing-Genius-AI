import { callAgent } from "../lib/openai.js";
import { STRATEGY_JSON_SCHEMA } from "../lib/json-schemas.js";
import { STRATEGY_SYSTEM, buildStrategyPrompt } from "../lib/prompts.js";
import {
  StrategyOutputSchema,
  type CompanyInput,
  type ResearchOutput,
  type StrategyOutput,
} from "../types/campaign.js";

export async function runStrategyAgent(
  input: CompanyInput,
  research: ResearchOutput
): Promise<StrategyOutput> {
  return callAgent(
    STRATEGY_SYSTEM,
    buildStrategyPrompt(input, research),
    StrategyOutputSchema,
    STRATEGY_JSON_SCHEMA as unknown as Record<string, unknown>,
    "strategy_output"
  );
}
