import { v4 as uuidv4 } from "uuid";
import { runResearchAgent } from "./research.js";
import { runStrategyAgent } from "./strategy.js";
import { runContentAgent } from "./content.js";
import { runAnalyticsAgent } from "./analytics.js";
import {
  CompanyInputSchema,
  type CompanyInput,
  type FullCampaign,
  type SSEEvent,
} from "../types/campaign.js";

export const campaignStore = new Map<string, FullCampaign>();

type EventEmitter = (event: SSEEvent) => void;

export async function orchestrateCampaign(
  rawInput: unknown,
  emit: EventEmitter
): Promise<FullCampaign> {
  const input: CompanyInput = CompanyInputSchema.parse(rawInput);
  const id = uuidv4();

  // Run agents sequentially, emitting start/complete per agent
  emit({ type: "agent_start", agent: "research" });
  const research = await runResearchAgent(input);
  emit({ type: "agent_complete", agent: "research", data: research });

  emit({ type: "agent_start", agent: "strategy" });
  const strategy = await runStrategyAgent(input, research);
  emit({ type: "agent_complete", agent: "strategy", data: strategy });

  emit({ type: "agent_start", agent: "content" });
  const content = await runContentAgent(input, research, strategy);
  emit({ type: "agent_complete", agent: "content", data: content });

  emit({ type: "agent_start", agent: "analytics" });
  const analytics = await runAnalyticsAgent(input, research, strategy, content);
  emit({ type: "agent_complete", agent: "analytics", data: analytics });

  const campaign: FullCampaign = {
    id,
    input,
    research,
    strategy,
    content,
    analytics,
    createdAt: new Date().toISOString(),
  };

  campaignStore.set(id, campaign);
  emit({ type: "complete", campaignId: id, campaign });

  return campaign;
}
