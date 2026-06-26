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

// Simple ZIP builder without external deps (store method)
export function createZipBuffer(files: Record<string, string>): Uint8Array {
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  const centralDir: Uint8Array[] = [];
  let offset = 0;

  for (const [name, content] of Object.entries(files)) {
    const nameBytes = encoder.encode(name);
    const contentBytes = encoder.encode(content);
    const crc = crc32(contentBytes);

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(localHeader.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint16(14, 0, true);
    view.setUint32(16, crc, true);
    view.setUint32(20, contentBytes.length, true);
    view.setUint32(24, contentBytes.length, true);
    view.setUint16(28, nameBytes.length, true);
    localHeader.set(nameBytes, 30);

    parts.push(localHeader, contentBytes);

    const cdEntry = new Uint8Array(46 + nameBytes.length);
    const cdView = new DataView(cdEntry.buffer);
    cdView.setUint32(0, 0x02014b50, true);
    cdView.setUint16(4, 20, true);
    cdView.setUint16(6, 20, true);
    cdView.setUint16(10, 0, true);
    cdView.setUint16(12, 0, true);
    cdView.setUint16(14, 0, true);
    cdView.setUint32(16, crc, true);
    cdView.setUint32(20, contentBytes.length, true);
    cdView.setUint32(24, contentBytes.length, true);
    cdView.setUint16(28, nameBytes.length, true);
    cdView.setUint32(42, offset, true);
    cdEntry.set(nameBytes, 46);
    centralDir.push(cdEntry);

    offset += localHeader.length + contentBytes.length;
  }

  const centralDirOffset = offset;
  let centralDirSize = 0;
  for (const entry of centralDir) {
    centralDirSize += entry.length;
  }

  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(4, 0, true);
  endView.setUint16(6, 0, true);
  endView.setUint16(8, Object.keys(files).length, true);
  endView.setUint16(10, Object.keys(files).length, true);
  endView.setUint32(12, centralDirSize, true);
  endView.setUint32(16, centralDirOffset, true);
  endView.setUint16(20, 0, true);

  const totalLength = offset + centralDirSize + endRecord.length;
  const result = new Uint8Array(totalLength);
  let pos = 0;
  for (const part of parts) {
    result.set(part, pos);
    pos += part.length;
  }
  for (const entry of centralDir) {
    result.set(entry, pos);
    pos += entry.length;
  }
  result.set(endRecord, pos);

  return result;
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
