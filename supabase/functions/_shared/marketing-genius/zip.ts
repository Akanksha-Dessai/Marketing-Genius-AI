import { strToU8, zipSync } from "npm:fflate@0.8.2";
import type { FullCampaign } from "./orchestrator.ts";

function researchToMarkdown(campaign: FullCampaign): string {
  const { research, input } = campaign;
  const r = research as {
    summary: string;
    marketTrends: string[];
    competitors: { name: string; strength: string; weakness: string }[];
    audienceInsights: string[];
    opportunities: string[];
  };
  return `# Market Research: ${input.companyName}\n**Market:** ${input.country}\n\n## Summary\n${r.summary}\n\n## Market Trends\n${r.marketTrends.map((t) => `- ${t}`).join("\n")}\n\n## Competitors\n${r.competitors.map((c) => `### ${c.name}\n- **Strength:** ${c.strength}\n- **Weakness:** ${c.weakness}`).join("\n\n")}\n\n## Audience Insights\n${r.audienceInsights.map((i) => `- ${i}`).join("\n")}\n\n## Opportunities\n${r.opportunities.map((o) => `- ${o}`).join("\n")}`;
}

function strategyToMarkdown(campaign: FullCampaign): string {
  const s = campaign.strategy as {
    campaignName: string;
    objectives: string[];
    channels: { name: string; rationale: string; tactics: string[] }[];
    timeline: { phase: string; duration: string; activities: string[] }[];
    budgetAllocation: { category: string; percentage: number; amount: string }[];
    keyMessages: string[];
  };
  return `# Campaign Strategy: ${s.campaignName}\n\n## Objectives\n${s.objectives.map((o) => `- ${o}`).join("\n")}\n\n## Channels\n${s.channels.map((c) => `### ${c.name}\n${c.rationale}\n\n**Tactics:**\n${c.tactics.map((t) => `- ${t}`).join("\n")}`).join("\n\n")}\n\n## Timeline\n${s.timeline.map((t) => `### ${t.phase} (${t.duration})\n${t.activities.map((a) => `- ${a}`).join("\n")}`).join("\n\n")}\n\n## Budget Allocation\n${s.budgetAllocation.map((b) => `- **${b.category}:** ${b.percentage}% (${b.amount})`).join("\n")}\n\n## Key Messages\n${s.keyMessages.map((m) => `- ${m}`).join("\n")}`;
}

function contentToMarkdown(campaign: FullCampaign): string {
  const c = campaign.content as {
    ads: { headline: string; body: string; cta: string }[];
    socialPosts: { platform: string; text: string; hashtags: string[] }[];
    emails: { subject: string; preview: string; body: string }[];
  };
  return `# Marketing Content\n\n## Ad Variants\n${c.ads.map((ad, i) => `### Ad ${i + 1}: ${ad.headline}\n${ad.body}\n\n**CTA:** ${ad.cta}`).join("\n\n")}\n\n## Social Posts\n${c.socialPosts.map((p) => `### ${p.platform}\n${p.text}\n\n**Hashtags:** ${p.hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ")}`).join("\n\n")}\n\n## Email Campaigns\n${c.emails.map((e, i) => `### Email ${i + 1}\n**Subject:** ${e.subject}\n**Preview:** ${e.preview}\n\n${e.body}`).join("\n\n")}`;
}

function analyticsToMarkdown(campaign: FullCampaign): string {
  const a = campaign.analytics as {
    kpis: { metric: string; target: string; benchmark: string }[];
    estimatedReach: string;
    estimatedCTR: string;
    engagementForecast: string;
    roiProjection: string;
    recommendations: string[];
  };
  return `# Analytics & ROI Forecast\n\n## Key Performance Indicators\n${a.kpis.map((k) => `- **${k.metric}:** Target ${k.target} (Benchmark: ${k.benchmark})`).join("\n")}\n\n## Projections\n- **Estimated Reach:** ${a.estimatedReach}\n- **Estimated CTR:** ${a.estimatedCTR}\n- **Engagement Forecast:** ${a.engagementForecast}\n- **ROI Projection:** ${a.roiProjection}\n\n## Recommendations\n${a.recommendations.map((r) => `- ${r}`).join("\n")}`;
}

export function buildCampaignZipFiles(campaign: FullCampaign): Record<string, string> {
  return {
    "research.md": researchToMarkdown(campaign),
    "strategy.md": strategyToMarkdown(campaign),
    "content.md": contentToMarkdown(campaign),
    "analytics.md": analyticsToMarkdown(campaign),
    "campaign.json": JSON.stringify(campaign, null, 2),
  };
}

export function createZipBuffer(files: Record<string, string>): Uint8Array {
  const entries: Record<string, Uint8Array> = {};
  for (const [name, content] of Object.entries(files)) {
    entries[name] = strToU8(content);
  }
  return zipSync(entries);
}
