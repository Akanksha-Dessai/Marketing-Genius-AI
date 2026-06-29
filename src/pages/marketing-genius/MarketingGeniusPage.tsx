import { useState } from "react";
import {
  Sparkles,
  Search,
  Target,
  PenTool,
  BarChart3,
  Loader2,
  AlertCircle,
  Bot,
  Wand2,
  History,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMarketingGeniusStream } from "@/hooks/useMarketingGeniusStream";
import { CampaignHistory } from "@/components/marketing-genius/CampaignHistory";
import { CampaignResults, AgentPipeline } from "@/components/marketing-genius/CampaignResults";
import {
  MarketingGeniusSubNav,
  type MarketingGeniusView,
} from "@/components/marketing-genius/MarketingGeniusNav";
import { useQueryClient } from "@tanstack/react-query";
import {
  CHANNEL_OPTIONS,
  DEMO_COMPANY,
  EMPTY_COMPANY_FORM,
  INITIAL_AGENTS,
  type CompanyInput,
  type FullCampaign,
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

function OutputPlaceholder() {
  return (
    <Card className="border-dashed border-border/80 bg-muted/20 shadow-none w-full">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <Bot className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Your campaign workspace</h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          Click <strong>Load Demo</strong> for a quick start, or fill in the form and click{" "}
          <strong>Generate Campaign</strong>. Four AI agents run in sequence.
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

function CompanyForm({
  form,
  setForm,
  isGenerating,
  onSubmit,
  onLoadDemo,
}: {
  form: CompanyInput;
  setForm: React.Dispatch<React.SetStateAction<CompanyInput>>;
  isGenerating: boolean;
  onSubmit: () => void;
  onLoadDemo: () => void;
}) {
  const toggleChannel = (channel: string) => {
    setForm((prev) => {
      const channels = prev.channels ?? [];
      return {
        ...prev,
        channels: channels.includes(channel)
          ? channels.filter((c) => c !== channel)
          : [...channels, channel],
      };
    });
  };

  const canSubmit =
    (form.companyName?.trim() ?? "") &&
    (form.industry?.trim() ?? "") &&
    (form.country?.trim() ?? "") &&
    (form.productService?.trim() ?? "") &&
    (form.targetAudience?.trim() ?? "") &&
    (form.campaignGoal?.trim() ?? "") &&
    (form.budgetRange?.trim() ?? "") &&
    (form.channels?.length ?? 0) > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
      className="space-y-5"
    >
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed border-primary/40 hover:bg-primary/5"
        onClick={onLoadDemo}
        disabled={isGenerating}
      >
        <Wand2 className="w-4 h-4 mr-2 text-primary" />
        Load Demo — EcoBrew Coffee
      </Button>

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
              value={form.companyName ?? ""}
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
              value={form.industry ?? ""}
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
              value={form.country ?? ""}
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
              value={form.productService ?? ""}
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
              value={form.targetAudience ?? ""}
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
              value={form.campaignGoal ?? ""}
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
              value={form.budgetRange ?? ""}
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
              value={form.knownCompetitors ?? ""}
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
              selected={form.channels?.includes(ch) ?? false}
              onClick={() => !isGenerating && toggleChannel(ch)}
            />
          ))}
        </div>
        {(form.channels?.length ?? 0) === 0 && (
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

function HistoryPlaceholder() {
  return (
    <Card className="border-dashed border-border/80 bg-muted/20 shadow-none w-full">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
          <History className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Campaign Library</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Select a saved campaign from the library to view its research, strategy, content, and analytics.
        </p>
      </CardContent>
    </Card>
  );
}

export default function MarketingGeniusPage() {
  const queryClient = useQueryClient();
  const { agents, campaign, isGenerating, error, generate, reset } = useMarketingGeniusStream();
  const [form, setForm] = useState<CompanyInput>(EMPTY_COMPANY_FORM);
  const [historyCampaign, setHistoryCampaign] = useState<FullCampaign | null>(null);
  const [activeView, setActiveView] = useState<MarketingGeniusView>("create");

  const showPipeline = isGenerating || agents.some((a) => a.status !== "pending");
  const showCreatePlaceholder = !showPipeline && !campaign;

  const handleGenerate = async () => {
    await generate(form);
    queryClient.invalidateQueries({ queryKey: ["marketing-campaigns"] });
  };

  const handleLoadDemo = () => {
    setForm(DEMO_COMPANY);
  };

  const handleSelectHistory = (selected: FullCampaign) => {
    setHistoryCampaign(selected);
  };

  return (
    <div className="w-full space-y-5 py-1">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-primary" />
          Marketing Genius AI
        </h1>
        <p className="text-sm text-muted-foreground">
          Four specialized AI agents research your market, craft strategy, generate content, and
          forecast ROI.
        </p>
      </div>

      <MarketingGeniusSubNav activeView={activeView} onViewChange={setActiveView} />

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

      {activeView === "create" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start w-full">
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
                  onSubmit={handleGenerate}
                  onLoadDemo={handleLoadDemo}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7 space-y-5 min-w-0 w-full">
            {showCreatePlaceholder && <OutputPlaceholder />}
            {showPipeline && <AgentPipeline agents={agents} isGenerating={isGenerating} />}
            {campaign && <CampaignResults campaign={campaign} />}
          </div>
        </div>
      )}

      {activeView === "history" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-start w-full">
          <div className="lg:col-span-4 lg:sticky lg:top-20">
            <CampaignHistory
              variant="full"
              activeCampaignId={historyCampaign?.id}
              onSelect={handleSelectHistory}
            />
          </div>
          <div className="lg:col-span-8 space-y-5 min-w-0 w-full">
            {!historyCampaign && <HistoryPlaceholder />}
            {historyCampaign && <CampaignResults campaign={historyCampaign} />}
          </div>
        </div>
      )}
    </div>
  );
}
