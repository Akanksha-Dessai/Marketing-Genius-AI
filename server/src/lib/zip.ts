import archiver from "archiver";
import type { Response } from "express";
import type { FullCampaign } from "../types/campaign.js";

function researchToMarkdown(campaign: FullCampaign): string {
  const { research, input } = campaign;
  return `# Market Research: ${input.companyName}

## Summary
${research.summary}

## Market Trends
${research.marketTrends.map((t) => `- ${t}`).join("\n")}

## Competitors
${research.competitors.map((c) => `### ${c.name}\n- **Strength:** ${c.strength}\n- **Weakness:** ${c.weakness}`).join("\n\n")}

## Audience Insights
${research.audienceInsights.map((i) => `- ${i}`).join("\n")}

## Opportunities
${research.opportunities.map((o) => `- ${o}`).join("\n")}
`;
}

function strategyToMarkdown(campaign: FullCampaign): string {
  const { strategy } = campaign;
  return `# Campaign Strategy: ${strategy.campaignName}

## Objectives
${strategy.objectives.map((o) => `- ${o}`).join("\n")}

## Channels
${strategy.channels.map((c) => `### ${c.name}\n${c.rationale}\n\n**Tactics:**\n${c.tactics.map((t) => `- ${t}`).join("\n")}`).join("\n\n")}

## Timeline
${strategy.timeline.map((t) => `### ${t.phase} (${t.duration})\n${t.activities.map((a) => `- ${a}`).join("\n")}`).join("\n\n")}

## Budget Allocation
${strategy.budgetAllocation.map((b) => `- **${b.category}:** ${b.percentage}% (${b.amount})`).join("\n")}

## Key Messages
${strategy.keyMessages.map((m) => `- ${m}`).join("\n")}
`;
}

function contentToMarkdown(campaign: FullCampaign): string {
  const { content } = campaign;
  return `# Marketing Content

## Ad Variants
${content.ads.map((ad, i) => `### Ad ${i + 1}: ${ad.headline}\n${ad.body}\n\n**CTA:** ${ad.cta}`).join("\n\n")}

## Social Posts
${content.socialPosts.map((p) => `### ${p.platform}\n${p.text}\n\n**Hashtags:** ${p.hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ")}`).join("\n\n")}

## Email Campaigns
${content.emails.map((e, i) => `### Email ${i + 1}\n**Subject:** ${e.subject}\n**Preview:** ${e.preview}\n\n${e.body}`).join("\n\n")}
`;
}

function analyticsToMarkdown(campaign: FullCampaign): string {
  const { analytics } = campaign;
  return `# Analytics & ROI Forecast

## Key Performance Indicators
${analytics.kpis.map((k) => `- **${k.metric}:** Target ${k.target} (Benchmark: ${k.benchmark})`).join("\n")}

## Projections
- **Estimated Reach:** ${analytics.estimatedReach}
- **Estimated CTR:** ${analytics.estimatedCTR}
- **Engagement Forecast:** ${analytics.engagementForecast}
- **ROI Projection:** ${analytics.roiProjection}

## Recommendations
${analytics.recommendations.map((r) => `- ${r}`).join("\n")}
`;
}

export function streamCampaignZip(campaign: FullCampaign, res: Response): void {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const filename = `${campaign.input.companyName.replace(/\s+/g, "-").toLowerCase()}-campaign.zip`;

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  archive.pipe(res);
  archive.append(researchToMarkdown(campaign), { name: "research.md" });
  archive.append(strategyToMarkdown(campaign), { name: "strategy.md" });
  archive.append(contentToMarkdown(campaign), { name: "content.md" });
  archive.append(analyticsToMarkdown(campaign), { name: "analytics.md" });
  archive.append(JSON.stringify(campaign, null, 2), { name: "campaign.json" });
  archive.finalize();
}
