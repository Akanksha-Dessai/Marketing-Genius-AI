export interface CompanyInput {
  companyName: string;
  industry: string;
  country: string;
  productService: string;
  targetAudience: string;
  knownCompetitors: string;
  campaignGoal: string;
  budgetRange: string;
  channels: string[];
}

export interface ResearchOutput {
  summary: string;
  marketTrends: string[];
  competitors: { name: string; strength: string; weakness: string }[];
  audienceInsights: string[];
  opportunities: string[];
}

export interface StrategyOutput {
  campaignName: string;
  objectives: string[];
  channels: { name: string; rationale: string; tactics: string[] }[];
  timeline: { phase: string; duration: string; activities: string[] }[];
  budgetAllocation: { category: string; percentage: number; amount: string }[];
  keyMessages: string[];
}

export interface ContentOutput {
  ads: { headline: string; body: string; cta: string }[];
  socialPosts: { platform: string; text: string; hashtags: string[] }[];
  emails: { subject: string; preview: string; body: string }[];
}

export interface AnalyticsOutput {
  kpis: { metric: string; target: string; benchmark: string }[];
  estimatedReach: string;
  estimatedCTR: string;
  engagementForecast: string;
  roiProjection: string;
  recommendations: string[];
}

export type AgentName = "research" | "strategy" | "content" | "analytics";
export type AgentStatus = "pending" | "running" | "complete" | "error";

export interface AgentState {
  name: AgentName;
  label: string;
  description: string;
  status: AgentStatus;
  data?: unknown;
}

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

export const CHANNEL_OPTIONS = [
  "Social Media",
  "Email",
  "Google Ads",
  "Content Marketing",
  "Influencer",
  "SEO",
] as const;

export const EMPTY_COMPANY_FORM: CompanyInput = {
  companyName: "",
  industry: "",
  country: "",
  productService: "",
  targetAudience: "",
  knownCompetitors: "",
  campaignGoal: "",
  budgetRange: "",
  channels: [],
};

export const DEMO_COMPANY: CompanyInput = {
  companyName: "EcoBrew Coffee",
  industry: "Food & Beverage / DTC Subscription",
  country: "United States",
  productService: "Sustainable coffee subscription boxes sourced from fair-trade farms",
  targetAudience: "Eco-conscious millennials and Gen Z urban professionals aged 25-40",
  knownCompetitors: "Trade Coffee, Atlas Coffee Club, Blue Bottle",
  campaignGoal: "Acquire 5,000 new subscribers in Q3 with 20% month-over-month growth",
  budgetRange: "$25,000 - $50,000",
  channels: ["Social Media", "Email", "Influencer", "Content Marketing"],
};

export const INITIAL_AGENTS: AgentState[] = [
  { name: "research", label: "Research Agent", description: "Analyzing market, competitors & audience", status: "pending" },
  { name: "strategy", label: "Strategy Agent", description: "Building campaign plan & channel mix", status: "pending" },
  { name: "content", label: "Content Agent", description: "Generating ads, posts & emails", status: "pending" },
  { name: "analytics", label: "Analytics Agent", description: "Forecasting engagement & ROI", status: "pending" },
];

export const AGENT_STATUS_MESSAGES: Record<AgentName, string[]> = {
  research: [
    "Scanning market trends and industry reports…",
    "Mapping competitor positioning and gaps…",
    "Profiling target audience segments…",
  ],
  strategy: [
    "Defining campaign objectives and KPIs…",
    "Allocating budget across channels…",
    "Building phased launch timeline…",
  ],
  content: [
    "Drafting ad variants and headlines…",
    "Writing social posts for each platform…",
    "Composing email nurture sequences…",
  ],
  analytics: [
    "Forecasting reach and engagement…",
    "Calculating ROI projections…",
    "Generating optimization recommendations…",
  ],
};

export interface MarketingCampaignRow {
  id: string;
  user_id: string;
  input: CompanyInput;
  research: ResearchOutput;
  strategy: StrategyOutput;
  content: ContentOutput;
  analytics: AnalyticsOutput;
  created_at: string;
}

/** Ensures legacy/partial Supabase rows never leave required string fields undefined. */
export function normalizeCompanyInput(input: Partial<CompanyInput> | null | undefined): CompanyInput {
  return {
    companyName: input?.companyName ?? "",
    industry: input?.industry ?? "",
    country: input?.country ?? "",
    productService: input?.productService ?? "",
    targetAudience: input?.targetAudience ?? "",
    knownCompetitors: input?.knownCompetitors ?? "",
    campaignGoal: input?.campaignGoal ?? "",
    budgetRange: input?.budgetRange ?? "",
    channels: Array.isArray(input?.channels) ? input.channels : [],
  };
}

export function rowToFullCampaign(row: MarketingCampaignRow): FullCampaign {
  return {
    id: row.id,
    input: normalizeCompanyInput(row.input),
    research: row.research,
    strategy: row.strategy,
    content: row.content,
    analytics: row.analytics,
    createdAt: row.created_at,
  };
}

export const HACKATHON_SUBMISSION_DEFAULTS = {
  projectTitle: "Marketing Genius AI — Multi-Agent Campaign Generator",
  description: `Problem: Marketing teams spend 2–3 days per campaign on research, strategy, copy, and forecasts.

Solution: Marketing Genius AI orchestrates four specialized agents (Research, Strategy, Content, Analytics) in sequence via Supabase Edge Functions with live SSE streaming. Each agent's output feeds the next.

Tech: React, TypeScript, Supabase Edge Functions, OpenAI, pgvector, TanStack Query.

Live demo: /marketing-genius`,
};
