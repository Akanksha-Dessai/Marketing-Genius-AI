import { useState } from "react";
import {
  Bot,
  ChevronDown,
  ChevronUp,
  History,
  Home,
  Lightbulb,
  Megaphone,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type MarketingGeniusView = "home" | "create" | "history";

interface MarketingGeniusNavProps {
  activeView: MarketingGeniusView;
  onViewChange: (view: MarketingGeniusView) => void;
}

export function MarketingGeniusSidebar({ activeView, onViewChange }: MarketingGeniusNavProps) {
  const [campaignsOpen, setCampaignsOpen] = useState(true);
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);

  const isCampaignView = activeView === "create" || activeView === "history";

  return (
    <aside className="w-full lg:w-56 shrink-0">
      <nav className="rounded-xl bg-muted/40 border border-border/60 p-2 space-y-0.5">
        <button
          type="button"
          onClick={() => onViewChange("home")}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            activeView === "home" || activeView === "create"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <Home className="h-4 w-4 shrink-0" />
          Home
        </button>

        <div className="pt-0.5">
          <button
            type="button"
            onClick={() => setCampaignsOpen((o) => !o)}
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isCampaignView
                ? "text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <span className="flex items-center gap-2.5">
              <Megaphone className="h-4 w-4 shrink-0" />
              Campaigns
            </span>
            {campaignsOpen ? (
              <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
          </button>

          {campaignsOpen && (
            <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border/80 pl-3">
              <button
                type="button"
                onClick={() => onViewChange("create")}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  activeView === "create"
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-current" />
                Create Campaign
              </button>
              <button
                type="button"
                onClick={() => onViewChange("history")}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                  activeView === "history"
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-current" />
                Campaign Library
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setAgentsOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <Bot className="h-4 w-4 shrink-0" />
            AI Agents
          </span>
          {agentsOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>

        {agentsOpen && (
          <div className="ml-3 space-y-0.5 border-l border-border/80 pl-3 pb-1">
            {["Research Agent", "Strategy Agent", "Content Agent", "Analytics Agent"].map((label) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground"
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                {label}
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setInsightsOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <Lightbulb className="h-4 w-4 shrink-0" />
            Insights
          </span>
          {insightsOpen ? (
            <ChevronUp className="h-4 w-4 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 shrink-0" />
          )}
        </button>

        {insightsOpen && (
          <div className="ml-3 space-y-0.5 border-l border-border/80 pl-3 pb-1">
            {["Market Trends", "ROI Forecasts", "Audience Data"].map((label) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground"
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                {label}
              </div>
            ))}
          </div>
        )}
      </nav>
    </aside>
  );
}

interface MarketingGeniusSubNavProps {
  activeView: MarketingGeniusView;
  onViewChange: (view: MarketingGeniusView) => void;
}

export function MarketingGeniusSubNav({ activeView, onViewChange }: MarketingGeniusSubNavProps) {
  if (activeView === "home") return null;

  return (
    <div className="inline-flex items-center gap-1 rounded-xl bg-muted/50 border border-border/60 p-1.5">
      <button
        type="button"
        onClick={() => onViewChange("create")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-all",
          activeView === "create"
            ? "bg-primary text-primary-foreground shadow-sm font-semibold"
            : "font-medium text-muted-foreground hover:text-foreground"
        )}
      >
        {activeView === "create" && <Plus className="h-4 w-4" />}
        Create Campaign
      </button>
      <button
        type="button"
        onClick={() => onViewChange("history")}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-all",
          activeView === "history"
            ? "bg-primary text-primary-foreground shadow-sm font-semibold"
            : "font-medium text-muted-foreground hover:text-foreground"
        )}
      >
        <History className="h-4 w-4" />
        Campaign Library
      </button>
    </div>
  );
}
