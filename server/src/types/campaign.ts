import { z } from "zod";

export const CompanyInputSchema = z.object({
  companyName: z.string().min(1),
  industry: z.string().min(1),
  productService: z.string().min(1),
  targetAudience: z.string().min(1),
  campaignGoal: z.string().min(1),
  budgetRange: z.string().min(1),
  channels: z.array(z.string()).min(1),
});

export type CompanyInput = z.infer<typeof CompanyInputSchema>;

export const ResearchOutputSchema = z.object({
  summary: z.string(),
  marketTrends: z.array(z.string()),
  competitors: z.array(
    z.object({
      name: z.string(),
      strength: z.string(),
      weakness: z.string(),
    })
  ),
  audienceInsights: z.array(z.string()),
  opportunities: z.array(z.string()),
});

export const StrategyOutputSchema = z.object({
  campaignName: z.string(),
  objectives: z.array(z.string()),
  channels: z.array(
    z.object({
      name: z.string(),
      rationale: z.string(),
      tactics: z.array(z.string()),
    })
  ),
  timeline: z.array(
    z.object({
      phase: z.string(),
      duration: z.string(),
      activities: z.array(z.string()),
    })
  ),
  budgetAllocation: z.array(
    z.object({
      category: z.string(),
      percentage: z.number(),
      amount: z.string(),
    })
  ),
  keyMessages: z.array(z.string()),
});

export const ContentOutputSchema = z.object({
  ads: z.array(
    z.object({
      headline: z.string(),
      body: z.string(),
      cta: z.string(),
    })
  ),
  socialPosts: z.array(
    z.object({
      platform: z.string(),
      text: z.string(),
      hashtags: z.array(z.string()),
    })
  ),
  emails: z.array(
    z.object({
      subject: z.string(),
      preview: z.string(),
      body: z.string(),
    })
  ),
});

export const AnalyticsOutputSchema = z.object({
  kpis: z.array(
    z.object({
      metric: z.string(),
      target: z.string(),
      benchmark: z.string(),
    })
  ),
  estimatedReach: z.string(),
  estimatedCTR: z.string(),
  engagementForecast: z.string(),
  roiProjection: z.string(),
  recommendations: z.array(z.string()),
});

export type ResearchOutput = z.infer<typeof ResearchOutputSchema>;
export type StrategyOutput = z.infer<typeof StrategyOutputSchema>;
export type ContentOutput = z.infer<typeof ContentOutputSchema>;
export type AnalyticsOutput = z.infer<typeof AnalyticsOutputSchema>;

export type AgentName = "research" | "strategy" | "content" | "analytics";

export interface FullCampaign {
  id: string;
  input: CompanyInput;
  research: ResearchOutput;
  strategy: StrategyOutput;
  content: ContentOutput;
  analytics: AnalyticsOutput;
  createdAt: string;
}

export type SSEEvent =
  | { type: "agent_start"; agent: AgentName }
  | { type: "agent_complete"; agent: AgentName; data: unknown }
  | { type: "complete"; campaignId: string; campaign: FullCampaign }
  | { type: "error"; message: string };
