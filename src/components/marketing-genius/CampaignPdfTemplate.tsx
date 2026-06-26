import { forwardRef } from "react";
import type { FullCampaign } from "@/types/marketing-genius";

const styles = {
  page: {
    width: 794,
    fontFamily: "Inter, system-ui, sans-serif",
    color: "#1a1a2e",
    backgroundColor: "#ffffff",
    padding: 40,
    boxSizing: "border-box" as const,
  },
  cover: {
    background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
    color: "#ffffff",
    borderRadius: 12,
    padding: "48px 40px",
    marginBottom: 32,
  },
  coverTitle: { fontSize: 28, fontWeight: 700, margin: "0 0 8px 0" },
  coverSub: { fontSize: 14, opacity: 0.9, margin: 0 },
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#6366f1",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: 8,
    marginBottom: 16,
  },
  h4: { fontSize: 14, fontWeight: 600, margin: "16px 0 8px 0" },
  p: { fontSize: 12, lineHeight: 1.6, margin: "0 0 10px 0", color: "#374151" },
  li: { fontSize: 12, lineHeight: 1.5, marginBottom: 6, color: "#374151" },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#f9fafb",
  },
  metricGrid: { display: "flex", flexWrap: "wrap" as const, gap: 10 },
  metric: {
    flex: "1 1 45%",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 12,
    textAlign: "center" as const,
    backgroundColor: "#f9fafb",
  },
  metricLabel: { fontSize: 10, color: "#6b7280", marginBottom: 4 },
  metricValue: { fontSize: 14, fontWeight: 700, color: "#1a1a2e" },
  bar: { height: 8, backgroundColor: "#e5e7eb", borderRadius: 4, marginTop: 4, overflow: "hidden" },
  barFill: { height: "100%", background: "linear-gradient(90deg, #6366f1, #3b82f6)", borderRadius: 4 },
  meta: { fontSize: 11, color: "#6b7280", marginTop: 8 },
};

interface CampaignPdfTemplateProps {
  campaign: FullCampaign;
}

export const CampaignPdfTemplate = forwardRef<HTMLDivElement, CampaignPdfTemplateProps>(
  function CampaignPdfTemplate({ campaign }, ref) {
    const { input, research, strategy, content, analytics, createdAt } = campaign;

    return (
      <div ref={ref} style={styles.page}>
        <div style={styles.cover}>
          <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 12px 0", opacity: 0.85 }}>
            Marketing Genius Campaign Package
          </p>
          <h1 style={styles.coverTitle}>{input.companyName}</h1>
          <p style={styles.coverSub}>
            {input.industry} · {input.country} · {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Company Overview</h2>
          <p style={styles.p}><strong>Product / Service:</strong> {input.productService}</p>
          <p style={styles.p}><strong>Target Audience:</strong> {input.targetAudience}</p>
          <p style={styles.p}><strong>Campaign Goal:</strong> {input.campaignGoal}</p>
          <p style={styles.p}><strong>Budget:</strong> {input.budgetRange}</p>
          <p style={styles.p}><strong>Channels:</strong> {input.channels.join(", ")}</p>
          {input.knownCompetitors?.trim() && (
            <p style={styles.p}><strong>Known Competitors:</strong> {input.knownCompetitors}</p>
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Research</h2>
          <p style={styles.p}>{research.summary}</p>
          <h3 style={styles.h4}>Market Trends</h3>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {research.marketTrends.map((t, i) => (
              <li key={i} style={styles.li}>{t}</li>
            ))}
          </ul>
          <h3 style={styles.h4}>Competitors</h3>
          {research.competitors.map((c, i) => (
            <div key={i} style={styles.card}>
              <p style={{ ...styles.p, fontWeight: 600, marginBottom: 4 }}>{c.name}</p>
              <p style={{ ...styles.p, margin: 0 }}><strong>Strength:</strong> {c.strength}</p>
              <p style={{ ...styles.p, margin: 0 }}><strong>Weakness:</strong> {c.weakness}</p>
            </div>
          ))}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Strategy — {strategy.campaignName}</h2>
          <h3 style={styles.h4}>Objectives</h3>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {strategy.objectives.map((o, i) => (
              <li key={i} style={styles.li}>{o}</li>
            ))}
          </ul>
          <h3 style={styles.h4}>Budget Allocation</h3>
          {strategy.budgetAllocation.map((b, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ fontWeight: 600 }}>{b.category}</span>
                <span style={{ color: "#6b7280" }}>{b.percentage}% · {b.amount}</span>
              </div>
              <div style={styles.bar}>
                <div style={{ ...styles.barFill, width: `${b.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Content</h2>
          <h3 style={styles.h4}>Ad Variants</h3>
          {content.ads.map((ad, i) => (
            <div key={i} style={styles.card}>
              <p style={{ ...styles.p, fontWeight: 600 }}>{ad.headline}</p>
              <p style={styles.p}>{ad.body}</p>
              <p style={{ ...styles.p, margin: 0, color: "#6366f1", fontWeight: 600 }}>CTA: {ad.cta}</p>
            </div>
          ))}
          <h3 style={styles.h4}>Social Posts</h3>
          {content.socialPosts.map((post, i) => (
            <div key={i} style={styles.card}>
              <p style={{ ...styles.p, fontWeight: 600, marginBottom: 4 }}>{post.platform}</p>
              <p style={{ ...styles.p, margin: 0, whiteSpace: "pre-wrap" }}>{post.text}</p>
            </div>
          ))}
          {content.emails?.length > 0 && (
            <>
              <h3 style={styles.h4}>Email Drafts</h3>
              {content.emails.map((email, i) => (
                <div key={i} style={styles.card}>
                  <p style={{ ...styles.p, fontWeight: 600 }}>Subject: {email.subject}</p>
                  <p style={{ ...styles.p, fontStyle: "italic" }}>{email.preview}</p>
                  <p style={{ ...styles.p, margin: 0 }}>{email.body}</p>
                </div>
              ))}
            </>
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Analytics & ROI</h2>
          <div style={styles.metricGrid}>
            {[
              { label: "Est. Reach", value: analytics.estimatedReach },
              { label: "Est. CTR", value: analytics.estimatedCTR },
              { label: "Engagement", value: analytics.engagementForecast },
              { label: "ROI", value: analytics.roiProjection },
            ].map((m) => (
              <div key={m.label} style={styles.metric}>
                <div style={styles.metricLabel}>{m.label}</div>
                <div style={styles.metricValue}>{m.value}</div>
              </div>
            ))}
          </div>
          <h3 style={styles.h4}>Recommendations</h3>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {analytics.recommendations.map((r, i) => (
              <li key={i} style={styles.li}>{r}</li>
            ))}
          </ul>
        </div>

        <p style={styles.meta}>Generated by Marketing Genius AI · SJ Innovation Marketing Hub</p>
      </div>
    );
  }
);
