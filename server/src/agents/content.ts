import { callAgent } from "../lib/openai.js";
import { CONTENT_JSON_SCHEMA } from "../lib/json-schemas.js";
import { CONTENT_SYSTEM, buildContentPrompt } from "../lib/prompts.js";
import {
  ContentOutputSchema,
  type CompanyInput,
  type ContentOutput,
  type ResearchOutput,
  type StrategyOutput,
} from "../types/campaign.js";

export async function runContentAgent(
  input: CompanyInput,
  research: ResearchOutput,
  strategy: StrategyOutput
): Promise<ContentOutput> {
  return callAgent(
    CONTENT_SYSTEM,
    buildContentPrompt(input, research, strategy),
    ContentOutputSchema,
    CONTENT_JSON_SCHEMA as unknown as Record<string, unknown>,
    "content_output"
  );
}
