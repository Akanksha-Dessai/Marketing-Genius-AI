import { useRef, useState } from "react";
import {
  Sparkles,
  Search,
  Target,
  PenTool,
  BarChart3,
  CheckCircle2,
  Loader2,
  Download,
  Copy,
  Check,
  AlertCircle,
  Users,
  MousePointerClick,
  Heart,
  TrendingUp,
  Bot,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMarketingGeniusStream } from "@/hooks/useMarketingGeniusStream";
import { CampaignPdfTemplate } from "@/components/marketing-genius/CampaignPdfTemplate";
import { campaignPdfFilename, generateCampaignPdf } from "@/lib/marketing-genius/generateCampaignPdf";
import {
  CHANNEL_OPTIONS,
  EMPTY_COMPANY_FORM,
  INITIAL_AGENTS,
  type CompanyInput,
  type FullCampaign,
  type AgentState,
} from "@/types/marketing-genius";
import { cn } from "@/lib/utils";

const ICONS = { research: Search, strategy: Target, content: PenTool, analytics: BarChart3 };

function RequiredMark() {
  return (
    <span className="text-destructive ml-0.5" aria-hidden="true">
      *
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</p>
  );
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
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function ChannelChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm font-medium transition-all",
        selected
          ? "border-primary bg-primary/10 text-primary shadow-sm"
          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function AgentPipeline({ agents, isGenerating }: { agents: AgentState[]; isGenerating: boolean }) {
  const show = isGenerating || agents.some((a) => a.status !== "pending");
  if (!show) return null;

  return (
    <div className="space-y-3 w-full">
      <h2 className="text-lg font-semibold">AI Agent Pipeline</h2>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 w-full">
        {agents.map((agent, index) => {
          const Icon = ICONS[agent.name];
          const isRunning = agent.status === "running";
          const isComplete = agent.status === "complete";
          const isError = agent.status === "error";

          return (
            <Card
              key={agent.name}
              className={cn(
                "transition-all",
                isRunning && "border-primary/50 ring-2 ring-primary/20 shadow-md",
                isComplete && "border-green-500/20 bg-green-500/[0.02]"
              )}
            >
              <CardHeader className="pb-3 pt-4 px-4">
                <div className="flex items-start justify-between gap-2">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
                      isComplete && "bg-green-500/10 text-green-600",
                      isRunning && "bg-primary/10 text-primary",
                      !isComplete && !isRunning && "bg-muted text-muted-foreground"
                    )}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isRunning ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <Badge
                    variant={isComplete ? "default" : isRunning ? "secondary" : isError ? "destructive" : "outline"}
                    className={cn("text-xs shrink-0", isComplete && "bg-primary")}
                  >
                    {isComplete ? "Complete" : isRunning ? "Running" : isError ? "Error" : "Waiting"}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-semibold leading-tight">
                  {index + 1}. {agent.label}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">{agent.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function OutputPlaceholder() {
  return (
    <Card className="border-dashed border-border/80 bg-muted/20 shadow-none w-full">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <Bot className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Your campaign workspace</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          Complete the form on the left and click Generate Campaign. Four AI agents will run here in
          sequence — research, strategy, content, and analytics.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
          {INITIAL_AGENTS.map((agent, index) => {
            const Icon = ICONS[agent.name];
            return (
              <div
                key={agent.name}
                className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/80 p-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground text-xs font-semibold">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                    {agent.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{agent.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function CampaignResults({ campaign }: { campaign: FullCampaign }) {
  const { research, strategy, content, analytics, input } = campaign;
  const pdfRef = useRef<HTMLDivElement>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (!pdfRef.current) return;
    setDownloadingPdf(true);
    try {
      await generateCampaignPdf(pdfRef.current, campaignPdfFilename(input.companyName));
    } catch {
      alert("PDF generation failed. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  const metrics = [
    { label: "Est. Reach", value: analytics.estimatedReach, icon: Users },
    { label: "Est. CTR", value: analytics.estimatedCTR, icon: MousePointerClick },
    { label: "Engagement", value: analytics.engagementForecast, icon: Heart },
    { label: "ROI", value: analytics.roiProjection, icon: TrendingUp },
  ];

  return (
    <>
      <div className="fixed top-0 -left-[10000px] pointer-events-none" aria-hidden="true">
        <CampaignPdfTemplate ref={pdfRef} campaign={campaign} />
      </div>
      <Card className="shadow-md border-border/80 w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">Campaign Package: {input.companyName}</CardTitle>
            <CardDescription>
              Generated by 4 AI agents · {input.country} · {new Date(campaign.createdAt).toLocaleString()}
            </CardDescription>
          </div>
          <Button
            onClick={handleDownloadPdf}
            variant="outline"
            size="sm"
            className="shrink-0"
            disabled={downloadingPdf}
          >
            {downloadingPdf ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="research">
          <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/60 p-1">
            <TabsTrigger value="research" className="flex-1 sm:flex-none">
              Research
            </TabsTrigger>
            <TabsTrigger value="strategy" className="flex-1 sm:flex-none">
              Strategy
            </TabsTrigger>
            <TabsTrigger value="content" className="flex-1 sm:flex-none">
              Content
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 sm:flex-none">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="research" className="mt-6 space-y-6">
            <p className="text-muted-foreground leading-relaxed">{research.summary}</p>
            <div>
              <h4 className="font-semibold mb-3">Market Trends</h4>
              <ul className="space-y-2">
                {research.marketTrends.map((t, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Competitors</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {research.competitors.map((c, i) => (
                  <div key={i} className="rounded-lg border border-border/80 bg-muted/30 p-4 space-y-2">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Strength:</span> {c.strength}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Weakness:</span> {c.weakness}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="strategy" className="mt-6 space-y-6">
            <h3 className="text-xl font-bold">{strategy.campaignName}</h3>
            <div>
              <h4 className="font-semibold mb-3">Objectives</h4>
              <ul className="space-y-2">
                {strategy.objectives.map((o, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-primary">•</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Budget Allocation</h4>
              <div className="space-y-3">
                {strategy.budgetAllocation.map((b, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium">{b.category}</span>
                      <span className="text-muted-foreground">
                        {b.percentage}% · {b.amount}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-primary transition-all"
                        style={{ width: `${b.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="mt-6 space-y-4">
            {content.ads.map((ad, i) => (
              <div key={i} className="rounded-lg border border-border/80 bg-card p-4 space-y-2">
                <div className="flex justify-between items-start gap-3">
                  <h5 className="font-semibold">{ad.headline}</h5>
                  <CopyButton text={`${ad.headline}\n\n${ad.body}\n\nCTA: ${ad.cta}`} />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{ad.body}</p>
                <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">{ad.cta}</Badge>
              </div>
            ))}
            {content.socialPosts.map((post, i) => (
              <div key={i} className="rounded-lg border border-border/80 bg-muted/20 p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="font-medium">
                    {post.platform}
                  </Badge>
                  <CopyButton text={post.text} />
                </div>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{post.text}</p>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {metrics.map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-border/80 bg-muted/30 p-4 text-center space-y-2"
                >
                  <div className="flex justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <s.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="font-semibold text-sm">{s.value}</p>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-semibold mb-3">Recommendations</h4>
              <ul className="space-y-2">
                {analytics.recommendations.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-primary">→</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    </>
  );
}

function CompanyForm({
  form,
  setForm,
  isGenerating,
  onSubmit,
}: {
  form: CompanyInput;
  setForm: React.Dispatch<React.SetStateAction<CompanyInput>>;
  isGenerating: boolean;
  onSubmit: () => void;
}) {
  const toggleChannel = (channel: string) => {
    setForm((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const canSubmit =
    form.companyName.trim() &&
    form.industry.trim() &&
    form.country.trim() &&
    form.productService.trim() &&
    form.targetAudience.trim() &&
    form.campaignGoal.trim() &&
    form.budgetRange.trim() &&
    form.channels.length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
      className="space-y-5"
    >
      <div className="space-y-4">
        <SectionLabel>Business Profile</SectionLabel>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">
              Company Name
              <RequiredMark />
            </Label>
            <Input
              id="companyName"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="e.g. DataNimbus"
              required
              disabled={isGenerating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="industry">
              Industry
              <RequiredMark />
            </Label>
            <Input
              id="industry"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              placeholder="e.g. B2B SaaS / Data Analytics"
              required
              disabled={isGenerating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">
              Primary Market / Country
              <RequiredMark />
            </Label>
            <Input
              id="country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="e.g. United States, India"
              required
              disabled={isGenerating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="productService">
              Product / Service
              <RequiredMark />
            </Label>
            <Textarea
              id="productService"
              value={form.productService}
              onChange={(e) => setForm({ ...form, productService: e.target.value })}
              placeholder="Describe what you sell or offer"
              rows={3}
              required
              disabled={isGenerating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAudience">
              Target Audience
              <RequiredMark />
            </Label>
            <Textarea
              id="targetAudience"
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              placeholder="Who are you trying to reach?"
              rows={2}
              required
              disabled={isGenerating}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <SectionLabel>Campaign Brief</SectionLabel>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="campaignGoal">
              Campaign Goal
              <RequiredMark />
            </Label>
            <Input
              id="campaignGoal"
              value={form.campaignGoal}
              onChange={(e) => setForm({ ...form, campaignGoal: e.target.value })}
              placeholder="e.g. Generate 300 qualified leads in Q3"
              required
              disabled={isGenerating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budgetRange">
              Budget Range
              <RequiredMark />
            </Label>
            <Input
              id="budgetRange"
              value={form.budgetRange}
              onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
              placeholder="e.g. $50,000 - $100,000"
              required
              disabled={isGenerating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="knownCompetitors">
              Known Competitors <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="knownCompetitors"
              value={form.knownCompetitors}
              onChange={(e) => setForm({ ...form, knownCompetitors: e.target.value })}
              placeholder="e.g. Zoho Analytics, Tableau — helps AI focus research"
              rows={2}
              disabled={isGenerating}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <SectionLabel>
          Preferred Channels
          <RequiredMark />
        </SectionLabel>
        <div className="flex flex-wrap gap-2">
          {CHANNEL_OPTIONS.map((ch) => (
            <ChannelChip
              key={ch}
              label={ch}
              selected={form.channels.includes(ch)}
              onClick={() => !isGenerating && toggleChannel(ch)}
            />
          ))}
        </div>
        {form.channels.length === 0 && (
          <p className="text-xs text-muted-foreground">Select at least one channel to continue.</p>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        <span className="text-destructive">*</span> Required fields
      </p>

      <Button
        type="submit"
        size="lg"
        className="w-full bg-gradient-primary hover:opacity-90 text-white shadow-md border-0"
        disabled={isGenerating || !canSubmit}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating Campaign...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Campaign
          </>
        )}
      </Button>
    </form>
  );
}

export default function MarketingGeniusPage() {
  const { agents, campaign, isGenerating, error, generate, reset } = useMarketingGeniusStream();
  const [form, setForm] = useState<CompanyInput>(EMPTY_COMPANY_FORM);

  const showPipeline = isGenerating || agents.some((a) => a.status !== "pending");
  const showPlaceholder = !showPipeline && !campaign;

  return (
    <div className="w-full space-y-5 py-1">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-primary" />
          Marketing Genius Campaign AI
        </h1>
        <p className="text-sm text-muted-foreground">
          Four specialized AI agents research your market, craft strategy, generate content, and forecast ROI.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
          <div>
            <p className="font-medium text-destructive">Generation failed</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
            <button type="button" onClick={reset} className="text-sm underline mt-2 hover:text-foreground">
              Try again
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start w-full">
        {/* Left: form */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <Card className="shadow-sm border-border/80 w-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Company Details</CardTitle>
              <CardDescription>Tell our AI agents about your business and campaign goals</CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyForm
                form={form}
                setForm={setForm}
                isGenerating={isGenerating}
                onSubmit={() => generate(form)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right: pipeline + results */}
        <div className="lg:col-span-7 space-y-5 min-w-0 w-full">
          {showPlaceholder && <OutputPlaceholder />}
          {showPipeline && <AgentPipeline agents={agents} isGenerating={isGenerating} />}
          {campaign && <CampaignResults campaign={campaign} />}
        </div>
      </div>
    </div>
  );
}
