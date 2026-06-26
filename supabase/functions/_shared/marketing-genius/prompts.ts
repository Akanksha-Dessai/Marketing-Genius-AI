export const RESEARCH_SYSTEM = `You are a Research Agent for MarketingGenius AI. Analyze the business and market context provided. Produce thorough, realistic market research with specific competitor names and actionable audience insights. Be concrete and data-informed in tone.

Prioritize competitors and market dynamics relevant to the specified country/primary market. If known competitors are provided, include and analyze them alongside additional relevant competitors in that market. Tailor audience insights to regional preferences, regulations, and cultural context.`;

export const STRATEGY_SYSTEM = `You are a Strategy Agent for MarketingGenius AI. Using the company details and research provided, create a comprehensive marketing campaign strategy. Include realistic budget allocation percentages that sum to 100. Align channels with the company's goals, audience, and target country/market.`;

export const CONTENT_SYSTEM = `You are a Content Agent for MarketingGenius AI. Generate compelling marketing copy based on the strategy and research. Create exactly 3 ad variants, 5 social posts across different platforms, and 2 email drafts. Make copy punchy, on-brand, and ready to publish.`;

export const ANALYTICS_SYSTEM = `You are an Analytics Agent for MarketingGenius AI. Estimate realistic marketing performance metrics and ROI based on the campaign strategy, content plan, and budget. Provide specific KPI targets and actionable optimization recommendations.`;

export function buildResearchPrompt(input: Record<string, unknown>): string {
  return `Analyze this company and produce market research:\n\n${JSON.stringify(input, null, 2)}`;
}

export function buildStrategyPrompt(input: Record<string, unknown>, research: Record<string, unknown>): string {
  return `Create a marketing campaign strategy for this company.\n\nCompany:\n${JSON.stringify(input, null, 2)}\n\nResearch:\n${JSON.stringify(research, null, 2)}`;
}

export function buildContentPrompt(
  input: Record<string, unknown>,
  research: Record<string, unknown>,
  strategy: Record<string, unknown>
): string {
  return `Generate marketing content for this campaign.\n\nCompany:\n${JSON.stringify(input, null, 2)}\n\nResearch:\n${JSON.stringify(research, null, 2)}\n\nStrategy:\n${JSON.stringify(strategy, null, 2)}`;
}

export function buildAnalyticsPrompt(
  input: Record<string, unknown>,
  research: Record<string, unknown>,
  strategy: Record<string, unknown>,
  content: Record<string, unknown>
): string {
  return `Estimate campaign performance and ROI.\n\nCompany:\n${JSON.stringify(input, null, 2)}\n\nResearch:\n${JSON.stringify(research, null, 2)}\n\nStrategy:\n${JSON.stringify(strategy, null, 2)}\n\nContent:\n${JSON.stringify(content, null, 2)}`;
}
