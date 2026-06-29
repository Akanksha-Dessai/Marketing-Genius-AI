import { History, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type MarketingGeniusView = "create" | "history";

interface MarketingGeniusSubNavProps {
  activeView: MarketingGeniusView;
  onViewChange: (view: MarketingGeniusView) => void;
}

export function MarketingGeniusSubNav({ activeView, onViewChange }: MarketingGeniusSubNavProps) {
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
