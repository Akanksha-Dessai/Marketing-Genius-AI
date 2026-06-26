import {
  ANALYTICS_JSON_SCHEMA,
  CONTENT_JSON_SCHEMA,
  RESEARCH_JSON_SCHEMA,
  STRATEGY_JSON_SCHEMA,
} from "./json-schemas.ts";
import {
  ANALYTICS_SYSTEM,
  CONTENT_SYSTEM,
  RESEARCH_SYSTEM,
  STRATEGY_SYSTEM,
  buildAnalyticsPrompt,
  buildContentPrompt,
  buildResearchPrompt,
  buildStrategyPrompt,
} from "./prompts.ts";

export type AgentName = "research" | "strategy" | "content" | "analytics";

export interface CompanyInput {
  companyName: string;
  industry: string;
  country: string;
  productService: string;
  targetAudience: string;
  knownCompetitors?: string;
  campaignGoal: string;
  budgetRange: string;
  channels: string[];
}

export interface FullCampaign {
  id: string;
  input: CompanyInput;
  research: Record<string, unknown>;
  strategy: Record<string, unknown>;
  content: Record<string, unknown>;
  analytics: Record<string, unknown>;
  createdAt: string;
}

export type SSEEvent =
  | { type: "agent_start"; agent: AgentName }
  | { type: "agent_complete"; agent: AgentName; data: unknown }
  | { type: "complete"; campaignId: string; campaign: FullCampaign }
  | { type: "error"; message: string };

function validateCompanyInput(raw: unknown): CompanyInput {
  const input = raw as CompanyInput;
  if (!input?.companyName || !input?.industry || !input?.country || !input?.productService) {
    throw new Error("Invalid campaign input: missing required fields");
  }
  if (!Array.isArray(input.channels) || input.channels.length === 0) {
    throw new Error("Invalid campaign input: at least one channel required");
  }
  return input;
}

async function callAgent(
  systemPrompt: string,
  userPrompt: string,
  jsonSchema: Record<string, unknown>,
  schemaName: string,
  retries = 2
): Promise<Record<string, unknown>> {
  const openaiKey = Deno.env.get("OPENAI_KEY");
  if (!openaiKey) throw new Error("OPENAI_KEY not configured in Supabase secrets");

  const model = Deno.env.get("OPENAI_MODEL") || "gpt-4o-mini";
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: `${systemPrompt}\n\nRespond with JSON matching the provided schema exactly. Use the exact field names specified.`,
            },
            { role: "user", content: userPrompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: { name: schemaName, strict: true, schema: jsonSchema },
          },
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Empty response from OpenAI");
      return JSON.parse(content);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(`[${schemaName}] attempt ${attempt + 1} failed:`, lastError.message);
      if (attempt < retries) continue;
    }
  }

  throw lastError ?? new Error("Agent call failed");
}

type EventEmitter = (event: SSEEvent) => void;

export async function orchestrateCampaign(
  rawInput: unknown,
  userId: string,
  // deno-lint-ignore no-explicit-any
  supabase: any,
  emit: EventEmitter
): Promise<FullCampaign> {
  const input = validateCompanyInput(rawInput);

  emit({ type: "agent_start", agent: "research" });
  const research = await callAgent(
    RESEARCH_SYSTEM,
    buildResearchPrompt(input),
    RESEARCH_JSON_SCHEMA,
    "research_output"
  );
  emit({ type: "agent_complete", agent: "research", data: research });

  emit({ type: "agent_start", agent: "strategy" });
  const strategy = await callAgent(
    STRATEGY_SYSTEM,
    buildStrategyPrompt(input, research),
    STRATEGY_JSON_SCHEMA,
    "strategy_output"
  );
  emit({ type: "agent_complete", agent: "strategy", data: strategy });

  emit({ type: "agent_start", agent: "content" });
  const content = await callAgent(
    CONTENT_SYSTEM,
    buildContentPrompt(input, research, strategy),
    CONTENT_JSON_SCHEMA,
    "content_output"
  );
  emit({ type: "agent_complete", agent: "content", data: content });

  emit({ type: "agent_start", agent: "analytics" });
  const analytics = await callAgent(
    ANALYTICS_SYSTEM,
    buildAnalyticsPrompt(input, research, strategy, content),
    ANALYTICS_JSON_SCHEMA,
    "analytics_output"
  );
  emit({ type: "agent_complete", agent: "analytics", data: analytics });

  const createdAt = new Date().toISOString();

  const { data: saved, error } = await supabase
    .from("marketing_campaigns")
    .insert({
      user_id: userId,
      input,
      research,
      strategy,
      content,
      analytics,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to save campaign:", error);
    throw new Error("Failed to save campaign to database");
  }

  const campaign: FullCampaign = {
    id: saved.id,
    input,
    research,
    strategy,
    content,
    analytics,
    createdAt,
  };

  emit({ type: "complete", campaignId: campaign.id, campaign });
  return campaign;
}
