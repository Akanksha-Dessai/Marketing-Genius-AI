import { useState } from "react";
import { Download, Copy, Check, TrendingUp, Users, MousePointer, DollarSign } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Tabs } from "./ui/Tabs";
import type { FullCampaign } from "../types/campaign";

interface CampaignResultsProps {
  campaign: FullCampaign;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h4 className="text-sm font-semibold text-violet-300 uppercase tracking-wider mb-3">
        {title}
      </h4>
      {children}
    </div>
  );
}

export function CampaignResults({ campaign }: CampaignResultsProps) {
  const { research, strategy, content, analytics, input } = campaign;

  const handleDownload = () => {
    window.open(`/api/campaign/${campaign.id}/download`, "_blank");
  };

  const tabs = [
    {
      id: "research",
      label: "Research",
      content: (
        <div className="space-y-4">
          <p className="text-slate-300 leading-relaxed">{research.summary}</p>
          <Section title="Market Trends">
            <ul className="space-y-2">
              {research.marketTrends.map((t, i) => (
                <li key={i} className="text-slate-300 flex gap-2">
                  <span className="text-violet-400">•</span> {t}
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Competitors">
            <div className="grid gap-3">
              {research.competitors.map((c, i) => (
                <div key={i} className="rounded-xl bg-white/5 p-4 border border-white/5">
                  <h5 className="font-medium text-white mb-2">{c.name}</h5>
                  <p className="text-sm text-slate-400">
                    <span className="text-emerald-400">Strength:</span> {c.strength}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">
                    <span className="text-amber-400">Weakness:</span> {c.weakness}
                  </p>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Audience Insights">
            <ul className="space-y-2">
              {research.audienceInsights.map((i, idx) => (
                <li key={idx} className="text-slate-300 flex gap-2">
                  <span className="text-cyan-400">•</span> {i}
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Opportunities">
            <ul className="space-y-2">
              {research.opportunities.map((o, i) => (
                <li key={i} className="text-slate-300 flex gap-2">
                  <span className="text-violet-400">•</span> {o}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      ),
    },
    {
      id: "strategy",
      label: "Strategy",
      content: (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white">{strategy.campaignName}</h3>
          <Section title="Objectives">
            <ul className="space-y-2">
              {strategy.objectives.map((o, i) => (
                <li key={i} className="text-slate-300 flex gap-2">
                  <span className="text-violet-400">•</span> {o}
                </li>
              ))}
            </ul>
          </Section>
          <Section title="Channels">
            <div className="grid gap-3">
              {strategy.channels.map((c, i) => (
                <div key={i} className="rounded-xl bg-white/5 p-4 border border-white/5">
                  <h5 className="font-medium text-white">{c.name}</h5>
                  <p className="text-sm text-slate-400 mt-1">{c.rationale}</p>
                  <ul className="mt-2 space-y-1">
                    {c.tactics.map((t, j) => (
                      <li key={j} className="text-sm text-slate-300">→ {t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Timeline">
            <div className="space-y-3">
              {strategy.timeline.map((t, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-sm font-mono text-violet-400 w-24 shrink-0">{t.duration}</div>
                  <div>
                    <h5 className="font-medium text-white">{t.phase}</h5>
                    <ul className="mt-1 space-y-1">
                      {t.activities.map((a, j) => (
                        <li key={j} className="text-sm text-slate-400">{a}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Budget Allocation">
            <div className="space-y-2">
              {strategy.budgetAllocation.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">{b.category}</span>
                      <span className="text-slate-400">{b.percentage}% · {b.amount}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-cyan-500"
                        style={{ width: `${b.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Key Messages">
            <div className="space-y-2">
              {strategy.keyMessages.map((m, i) => (
                <blockquote
                  key={i}
                  className="border-l-2 border-violet-500 pl-4 text-slate-300 italic"
                >
                  {m}
                </blockquote>
              ))}
            </div>
          </Section>
        </div>
      ),
    },
    {
      id: "content",
      label: "Content",
      content: (
        <div className="space-y-6">
          <Section title="Ad Variants">
            <div className="grid gap-4">
              {content.ads.map((ad, i) => (
                <div key={i} className="rounded-xl bg-white/5 p-5 border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="text-lg font-semibold text-white">{ad.headline}</h5>
                    <CopyButton text={`${ad.headline}\n\n${ad.body}\n\nCTA: ${ad.cta}`} />
                  </div>
                  <p className="text-slate-300">{ad.body}</p>
                  <span className="inline-block mt-3 rounded-lg bg-violet-600/30 px-3 py-1 text-sm text-violet-200">
                    {ad.cta}
                  </span>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Social Posts">
            <div className="grid gap-4">
              {content.socialPosts.map((post, i) => (
                <div key={i} className="rounded-xl bg-white/5 p-5 border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-medium text-cyan-400 uppercase">{post.platform}</span>
                    <CopyButton text={`${post.text}\n\n${post.hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ")}`} />
                  </div>
                  <p className="text-slate-300 whitespace-pre-wrap">{post.text}</p>
                  <p className="text-sm text-violet-400 mt-2">
                    {post.hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ")}
                  </p>
                </div>
              ))}
            </div>
          </Section>
          <Section title="Email Campaigns">
            <div className="grid gap-4">
              {content.emails.map((email, i) => (
                <div key={i} className="rounded-xl bg-white/5 p-5 border border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm text-slate-500">Subject</p>
                      <h5 className="font-medium text-white">{email.subject}</h5>
                      <p className="text-xs text-slate-500 mt-1">Preview: {email.preview}</p>
                    </div>
                    <CopyButton text={`Subject: ${email.subject}\n\n${email.body}`} />
                  </div>
                  <p className="text-slate-300 whitespace-pre-wrap mt-3">{email.body}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>
      ),
    },
    {
      id: "analytics",
      label: "Analytics",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, label: "Est. Reach", value: analytics.estimatedReach },
              { icon: MousePointer, label: "Est. CTR", value: analytics.estimatedCTR },
              { icon: TrendingUp, label: "Engagement", value: analytics.engagementForecast },
              { icon: DollarSign, label: "ROI Projection", value: analytics.roiProjection },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl bg-white/5 p-4 border border-white/5 text-center">
                <stat.icon className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                <p className="text-xs text-slate-500 uppercase">{stat.label}</p>
                <p className="text-lg font-semibold text-white mt-1">{stat.value}</p>
              </div>
            ))}
          </div>
          <Section title="KPIs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-white/10">
                    <th className="pb-2 pr-4">Metric</th>
                    <th className="pb-2 pr-4">Target</th>
                    <th className="pb-2">Benchmark</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.kpis.map((kpi, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-3 pr-4 text-white">{kpi.metric}</td>
                      <td className="py-3 pr-4 text-emerald-400">{kpi.target}</td>
                      <td className="py-3 text-slate-400">{kpi.benchmark}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
          <Section title="Recommendations">
            <ul className="space-y-2">
              {analytics.recommendations.map((r, i) => (
                <li key={i} className="text-slate-300 flex gap-2">
                  <span className="text-cyan-400">→</span> {r}
                </li>
              ))}
            </ul>
          </Section>
        </div>
      ),
    },
  ];

  return (
    <Card glow className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Campaign Package: {input.companyName}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Generated by 4 AI agents · {new Date(campaign.createdAt).toLocaleString()}
          </p>
        </div>
        <Button onClick={handleDownload} variant="secondary">
          <Download className="w-4 h-4" />
          Download ZIP
        </Button>
      </div>
      <Tabs tabs={tabs} />
    </Card>
  );
}
