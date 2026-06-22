import { callAgent } from "../lib/openai.js";
import { RESEARCH_JSON_SCHEMA } from "../lib/json-schemas.js";
import { RESEARCH_SYSTEM, buildResearchPrompt } from "../lib/prompts.js";
import { ResearchOutputSchema, type CompanyInput, type ResearchOutput } from "../types/campaign.js";

export async function runResearchAgent(input: CompanyInput): Promise<ResearchOutput> {
  return callAgent(
    RESEARCH_SYSTEM,
    buildResearchPrompt(input),
    ResearchOutputSchema,
    RESEARCH_JSON_SCHEMA as unknown as Record<string, unknown>,
    "research_output"
  );
}
