import { strToU8, zipSync } from "fflate";
import type { FullCampaign } from "@/types/marketing-genius";

function researchToMarkdown(campaign: FullCampaign): string {
  const { research, input } = campaign;
  return `# Market Research: ${input.companyName}
**Market:** ${input.country}

## Summary
${research.summary}

## Market Trends
${research.marketTrends.map((t) => `- ${t}`).join("\n")}

## Competitors
${research.competitors.map((c) => `### ${c.name}\n- **Strength:** ${c.strength}\n- **Weakness:** ${c.weakness}`).join("\n\n")}

## Audience Insights
${research.audienceInsights.map((i) => `- ${i}`).join("\n")}

## Opportunities
${research.opportunities.map((o) => `- ${o}`).join("\n")}`;
}

function strategyToMarkdown(campaign: FullCampaign): string {
  const s = campaign.strategy;
  return `# Campaign Strategy: ${s.campaignName}

## Objectives
${s.objectives.map((o) => `- ${o}`).join("\n")}

## Channels
${s.channels.map((c) => `### ${c.name}\n${c.rationale}\n\n**Tactics:**\n${c.tactics.map((t) => `- ${t}`).join("\n")}`).join("\n\n")}

## Timeline
${s.timeline.map((t) => `### ${t.phase} (${t.duration})\n${t.activities.map((a) => `- ${a}`).join("\n")}`).join("\n\n")}

## Budget Allocation
${s.budgetAllocation.map((b) => `- **${b.category}:** ${b.percentage}% (${b.amount})`).join("\n")}

## Key Messages
${s.keyMessages.map((m) => `- ${m}`).join("\n")}`;
}

function contentToMarkdown(campaign: FullCampaign): string {
  const c = campaign.content;
  return `# Marketing Content

## Ad Variants
${c.ads.map((ad, i) => `### Ad ${i + 1}: ${ad.headline}\n${ad.body}\n\n**CTA:** ${ad.cta}`).join("\n\n")}

## Social Posts
${c.socialPosts.map((p) => `### ${p.platform}\n${p.text}\n\n**Hashtags:** ${p.hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ")}`).join("\n\n")}

## Email Campaigns
${c.emails.map((e, i) => `### Email ${i + 1}\n**Subject:** ${e.subject}\n**Preview:** ${e.preview}\n\n${e.body}`).join("\n\n")}`;
}

function analyticsToMarkdown(campaign: FullCampaign): string {
  const a = campaign.analytics;
  return `# Analytics & ROI Forecast

## Key Performance Indicators
${a.kpis.map((k) => `- **${k.metric}:** Target ${k.target} (Benchmark: ${k.benchmark})`).join("\n")}

## Projections
- **Estimated Reach:** ${a.estimatedReach}
- **Estimated CTR:** ${a.estimatedCTR}
- **Engagement Forecast:** ${a.engagementForecast}
- **ROI Projection:** ${a.roiProjection}

## Recommendations
${a.recommendations.map((r) => `- ${r}`).join("\n")}`;
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

export function createCampaignZipBlob(campaign: FullCampaign): Blob {
  const files = buildCampaignZipFiles(campaign);
  const entries: Record<string, Uint8Array> = {};
  for (const [name, content] of Object.entries(files)) {
    entries[name] = strToU8(content);
  }
  const zipped = zipSync(entries);
  return new Blob([zipped], { type: "application/zip" });
}

export function campaignZipFilename(companyName: string): string {
  const slug = (companyName || "campaign")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();
  return `${slug || "campaign"}-campaign-package.zip`;
}

export function downloadCampaignZipLocal(campaign: FullCampaign): void {
  const blob = createCampaignZipBlob(campaign);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = campaignZipFilename(campaign.input.companyName);
  a.click();
  URL.revokeObjectURL(url);
}
