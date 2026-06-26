import { jsPDF } from "jspdf";
import type { FullCampaign } from "@/types/marketing-genius";

const MARGIN = 18;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;
const FOOTER_Y = PAGE_H - 10;

const PRIMARY: [number, number, number] = [79, 70, 229];
const TEXT: [number, number, number] = [17, 24, 39];
const MUTED: [number, number, number] = [107, 114, 128];
const BORDER: [number, number, number] = [229, 231, 235];

const UNICODE_REPLACEMENTS: Record<string, string> = {
  "\u2019": "'",
  "\u2018": "'",
  "\u201C": '"',
  "\u201D": '"',
  "\u2013": "-",
  "\u2014": "-",
  "\u2022": "-",
  "\u00B7": "|",
  "\u2026": "...",
  "\u00A0": " ",
};

/** jsPDF Helvetica only supports WinAnsi — strip emojis and unsupported Unicode. */
export function sanitizePdfText(text: string): string {
  return text
    .normalize("NFKD")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{E000}-\u{F8FF}]/gu, "")
    .replace(/[^\t\n\r\x20-\x7E\xA0-\xFF]/g, (ch) => UNICODE_REPLACEMENTS[ch] ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

class PdfBuilder {
  private pdf: jsPDF;
  private y = MARGIN;
  private companyName: string;

  constructor(companyName: string) {
    this.companyName = companyName;
    this.pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  }

  private safe(text: string): string {
    return sanitizePdfText(text);
  }

  private wrap(text: string, maxWidth: number): string[] {
    const safe = this.safe(text);
    const lines: string[] = [];
    for (const paragraph of safe.split("\n")) {
      const trimmed = paragraph.trim();
      if (!trimmed) {
        if (lines.length > 0) lines.push("");
        continue;
      }
      lines.push(...(this.pdf.splitTextToSize(trimmed, maxWidth) as string[]));
    }
    return lines;
  }

  private drawPageHeader() {
    this.pdf.setDrawColor(...PRIMARY);
    this.pdf.setFillColor(...PRIMARY);
    this.pdf.rect(0, 0, PAGE_W, 3, "F");
    this.y = MARGIN + 2;
  }

  private applyFooters() {
    const total = this.pdf.getNumberOfPages();
    const footerLeft = `${this.safe(this.companyName)} | Marketing Genius AI`;
    for (let i = 1; i <= total; i++) {
      this.pdf.setPage(i);
      this.pdf.setDrawColor(...BORDER);
      this.pdf.line(MARGIN, FOOTER_Y - 4, PAGE_W - MARGIN, FOOTER_Y - 4);
      this.pdf.setFont("helvetica", "normal");
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(...MUTED);
      this.pdf.text(footerLeft, MARGIN, FOOTER_Y);
      this.pdf.text(`Page ${i} of ${total}`, PAGE_W - MARGIN, FOOTER_Y, { align: "right" });
    }
  }

  private newPage() {
    this.pdf.addPage();
    this.drawPageHeader();
  }

  private ensureSpace(needed: number) {
    if (this.y + needed > FOOTER_Y - 8) this.newPage();
  }

  private drawLines(lines: string[], x: number, startY: number, lineHeight: number): number {
    let cy = startY;
    for (const line of lines) {
      this.ensureSpace(lineHeight);
      this.pdf.text(line, x, cy);
      cy += lineHeight;
      this.y = Math.max(this.y, cy);
    }
    return cy;
  }

  private sectionTitle(title: string) {
    this.ensureSpace(14);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFontSize(14);
    this.pdf.setTextColor(...PRIMARY);
    this.pdf.text(this.safe(title), MARGIN, this.y);
    this.y += 6;
    this.pdf.setDrawColor(...BORDER);
    this.pdf.line(MARGIN, this.y, PAGE_W - MARGIN, this.y);
    this.y += 8;
  }

  private subTitle(title: string) {
    this.ensureSpace(10);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFontSize(11);
    this.pdf.setTextColor(...TEXT);
    this.pdf.text(this.safe(title), MARGIN, this.y);
    this.y += 6;
  }

  private paragraph(text: string, fontSize = 10) {
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setFontSize(fontSize);
    this.pdf.setTextColor(...TEXT);
    const lineHeight = fontSize * 0.45;
    const lines = this.wrap(text, CONTENT_W);
    for (const line of lines) {
      this.ensureSpace(lineHeight + 1);
      this.pdf.text(line, MARGIN, this.y);
      this.y += lineHeight;
    }
    this.y += 3;
  }

  private bullets(items: string[]) {
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(...TEXT);
    const lineHeight = 4.5;
    for (const item of items) {
      const lines = this.wrap(`- ${item}`, CONTENT_W - 4);
      for (const line of lines) {
        this.ensureSpace(lineHeight);
        this.pdf.text(line, MARGIN + 2, this.y);
        this.y += lineHeight;
      }
    }
    this.y += 3;
  }

  private infoGrid(items: { label: string; value: string }[]) {
    const colW = CONTENT_W / 2 - 3;
    let col = 0;
    let rowY = this.y;
    for (const item of items) {
      this.ensureSpace(24);
      const x = col === 0 ? MARGIN : MARGIN + colW + 6;
      if (col === 0) rowY = this.y;
      const valLines = this.wrap(item.value, colW - 8);
      const boxH = Math.max(20, 12 + valLines.length * 4);
      this.pdf.setDrawColor(...BORDER);
      this.pdf.setFillColor(249, 250, 251);
      this.pdf.roundedRect(x, rowY, colW, boxH, 2, 2, "FD");
      this.pdf.setFont("helvetica", "bold");
      this.pdf.setFontSize(7);
      this.pdf.setTextColor(...MUTED);
      this.pdf.text(this.safe(item.label).toUpperCase(), x + 4, rowY + 6);
      this.pdf.setFont("helvetica", "normal");
      this.pdf.setFontSize(9);
      this.pdf.setTextColor(...TEXT);
      this.drawLines(valLines.slice(0, 3), x + 4, rowY + 11, 4);
      col++;
      if (col > 1) {
        col = 0;
        this.y = rowY + boxH + 4;
      }
    }
    if (col === 1) this.y = rowY + 24;
    this.y += 2;
  }

  private metricGrid(metrics: { label: string; value: string }[]) {
    const boxW = CONTENT_W / 2 - 3;
    let col = 0;
    let rowY = this.y;
    for (const m of metrics) {
      this.ensureSpace(22);
      const x = col === 0 ? MARGIN : MARGIN + boxW + 6;
      if (col === 0) rowY = this.y;
      this.pdf.setDrawColor(...BORDER);
      this.pdf.setFillColor(249, 250, 251);
      this.pdf.roundedRect(x, rowY, boxW, 18, 2, 2, "FD");
      this.pdf.setFont("helvetica", "normal");
      this.pdf.setFontSize(8);
      this.pdf.setTextColor(...MUTED);
      this.pdf.text(this.safe(m.label), x + boxW / 2, rowY + 7, { align: "center" });
      this.pdf.setFont("helvetica", "bold");
      this.pdf.setFontSize(10);
      this.pdf.setTextColor(...TEXT);
      const valLines = this.wrap(m.value, boxW - 8);
      this.pdf.text(valLines[0], x + boxW / 2, rowY + 14, { align: "center" });
      col++;
      if (col > 1) {
        col = 0;
        this.y = rowY + 22;
      }
    }
    if (col === 1) this.y = rowY + 22;
    this.y += 4;
  }

  private budgetBar(category: string, percentage: number, amount: string) {
    this.ensureSpace(12);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(...TEXT);
    this.pdf.text(this.safe(category), MARGIN, this.y);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setTextColor(...MUTED);
    this.pdf.text(`${percentage}% | ${this.safe(amount)}`, PAGE_W - MARGIN, this.y, { align: "right" });
    this.y += 4;
    this.pdf.setFillColor(...BORDER);
    this.pdf.roundedRect(MARGIN, this.y, CONTENT_W, 3, 1, 1, "F");
    this.pdf.setFillColor(...PRIMARY);
    this.pdf.roundedRect(MARGIN, this.y, (CONTENT_W * percentage) / 100, 3, 1, 1, "F");
    this.y += 8;
  }

  private card(title: string, body: string, extra?: string) {
    const innerW = CONTENT_W - 10;
    const padX = MARGIN + 5;
    const lineHeight = 4.2;
    const titleLines = this.wrap(title, innerW);
    const bodyLines = this.wrap(body, innerW);
    const extraLines = extra ? this.wrap(extra, innerW) : [];
    const h =
      6 +
      titleLines.length * 5 +
      bodyLines.length * lineHeight +
      (extraLines.length > 0 ? extraLines.length * lineHeight + 4 : 0) +
      6;

    this.ensureSpace(h);
    const cardTop = this.y;
    this.pdf.setDrawColor(...BORDER);
    this.pdf.setFillColor(249, 250, 251);
    this.pdf.roundedRect(MARGIN, cardTop, CONTENT_W, h, 2, 2, "FD");

    let cy = cardTop + 7;
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(...TEXT);
    for (const line of titleLines) {
      this.pdf.text(line, padX, cy);
      cy += 5;
    }

    cy += 2;
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(...TEXT);
    for (const line of bodyLines) {
      this.pdf.text(line, padX, cy);
      cy += lineHeight;
    }

    if (extraLines.length > 0) {
      cy += 2;
      this.pdf.setTextColor(...PRIMARY);
      this.pdf.setFont("helvetica", "bold");
      for (const line of extraLines) {
        this.pdf.text(line, padX, cy);
        cy += lineHeight;
      }
    }

    this.y = cardTop + h + 4;
  }

  private kpiTable(kpis: { metric: string; target: string; benchmark: string }[]) {
    this.ensureSpace(10 + kpis.length * 8);
    const colW = [CONTENT_W * 0.4, CONTENT_W * 0.3, CONTENT_W * 0.3];
    const headers = ["Metric", "Target", "Benchmark"];
    let x = MARGIN;
    this.pdf.setFillColor(249, 250, 251);
    this.pdf.rect(MARGIN, this.y, CONTENT_W, 8, "F");
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(...TEXT);
    for (let i = 0; i < headers.length; i++) {
      this.pdf.text(headers[i], x + 3, this.y + 5.5);
      x += colW[i];
    }
    this.y += 8;
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setFontSize(9);
    for (const k of kpis) {
      this.ensureSpace(8);
      x = MARGIN;
      this.pdf.setDrawColor(...BORDER);
      this.pdf.line(MARGIN, this.y, PAGE_W - MARGIN, this.y);
      const vals = [k.metric, k.target, k.benchmark];
      for (let i = 0; i < vals.length; i++) {
        const lines = this.wrap(vals[i], colW[i] - 6);
        this.pdf.text(lines[0], x + 3, this.y + 5);
        x += colW[i];
      }
      this.y += 8;
    }
    this.y += 4;
  }

  build(campaign: FullCampaign): jsPDF {
    const { input, research, strategy, content, analytics, createdAt } = campaign;
    const dateStr = new Date(createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    this.drawPageHeader();

    this.pdf.setFillColor(...PRIMARY);
    this.pdf.roundedRect(MARGIN, this.y, CONTENT_W, 48, 3, 3, "F");
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setFontSize(8);
    this.pdf.text("MARKETING GENIUS CAMPAIGN PACKAGE", MARGIN + 8, this.y + 12);
    this.pdf.setFont("helvetica", "bold");
    this.pdf.setFontSize(22);
    const titleLines = this.wrap(input.companyName, CONTENT_W - 16).slice(0, 2);
    let coverY = this.y + 22;
    for (const line of titleLines) {
      this.pdf.text(line, MARGIN + 8, coverY);
      coverY += 8;
    }
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setFontSize(11);
    this.pdf.text(this.safe(strategy.campaignName), MARGIN + 8, this.y + 34);
    this.pdf.setFontSize(9);
    this.pdf.text(
      `${this.safe(input.industry)} | ${this.safe(input.country)} | ${dateStr}`,
      MARGIN + 8,
      this.y + 42
    );
    this.y += 56;

    this.sectionTitle("Executive Summary");
    this.paragraph(research.summary);
    this.infoGrid([
      { label: "Campaign Goal", value: input.campaignGoal },
      { label: "Budget Range", value: input.budgetRange },
      { label: "Target Audience", value: input.targetAudience },
      { label: "Channels", value: input.channels.join(", ") },
    ]);
    if (input.knownCompetitors?.trim()) {
      this.subTitle("Known Competitors");
      this.paragraph(input.knownCompetitors);
    }
    this.subTitle("Product / Service");
    this.paragraph(input.productService);

    this.newPage();
    this.sectionTitle("Market Research");
    this.subTitle("Market Trends");
    this.bullets(research.marketTrends);
    this.subTitle("Competitive Landscape");
    for (const c of research.competitors) {
      this.card(c.name, `Strength: ${c.strength}\nWeakness: ${c.weakness}`);
    }
    this.subTitle("Audience Insights");
    this.bullets(research.audienceInsights);
    this.subTitle("Growth Opportunities");
    this.bullets(research.opportunities);

    this.newPage();
    this.sectionTitle(`Campaign Strategy - ${strategy.campaignName}`);
    this.subTitle("Objectives");
    this.bullets(strategy.objectives);
    this.subTitle("Channel Plan");
    for (const ch of strategy.channels) {
      this.card(ch.name, ch.rationale);
    }
    this.subTitle("Timeline");
    for (const phase of strategy.timeline) {
      this.card(`${phase.phase} (${phase.duration})`, phase.activities.join("\n"));
    }

    this.newPage();
    this.subTitle("Budget Allocation");
    for (const b of strategy.budgetAllocation) {
      this.budgetBar(b.category, b.percentage, b.amount);
    }
    this.subTitle("Key Messages");
    this.bullets(strategy.keyMessages);

    this.newPage();
    this.sectionTitle("Marketing Content");
    this.subTitle("Ad Variants");
    for (const ad of content.ads) {
      this.card(ad.headline, ad.body, `CTA: ${ad.cta}`);
    }
    this.subTitle("Social Posts");
    for (const post of content.socialPosts) {
      const hashtags = post.hashtags?.length
        ? `\n\nHashtags: ${post.hashtags.map((h) => (h.startsWith("#") ? h : `#${h}`)).join(" ")}`
        : "";
      this.card(post.platform, `${post.text}${hashtags}`);
    }
    if (content.emails?.length > 0) {
      this.subTitle("Email Drafts");
      for (const email of content.emails) {
        this.card(`Subject: ${email.subject}`, `${email.preview}\n\n${email.body}`);
      }
    }

    this.newPage();
    this.sectionTitle("Analytics & ROI Forecast");
    this.metricGrid([
      { label: "Est. Reach", value: analytics.estimatedReach },
      { label: "Est. CTR", value: analytics.estimatedCTR },
      { label: "Engagement", value: analytics.engagementForecast },
      { label: "ROI Projection", value: analytics.roiProjection },
    ]);
    if (analytics.kpis?.length > 0) {
      this.subTitle("Key Performance Indicators");
      this.kpiTable(analytics.kpis);
    }
    this.subTitle("Recommendations");
    this.bullets(analytics.recommendations);
    this.pdf.setFont("helvetica", "normal");
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(...MUTED);
    this.ensureSpace(8);
    this.pdf.text(
      `Generated by Marketing Genius AI | SJ Innovation Marketing Hub | ID: ${campaign.id.slice(0, 8)}`,
      PAGE_W / 2,
      this.y,
      { align: "center" }
    );

    this.applyFooters();
    return this.pdf;
  }
}

export function generateCampaignPdf(campaign: FullCampaign, filename: string): void {
  const pdf = new PdfBuilder(campaign.input.companyName).build(campaign);
  pdf.save(filename);
}

export function campaignPdfFilename(companyName: string): string {
  const slug = (companyName || "campaign")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();
  return `${slug || "campaign"}-marketing-package.pdf`;
}
