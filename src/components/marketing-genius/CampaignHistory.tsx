import { format } from "date-fns";
import { History, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMarketingCampaigns } from "@/hooks/useMarketingCampaigns";
import type { FullCampaign } from "@/types/marketing-genius";
import { cn } from "@/lib/utils";

interface CampaignHistoryProps {
  activeCampaignId?: string | null;
  onSelect: (campaign: FullCampaign) => void;
}

export function CampaignHistory({ activeCampaignId, onSelect }: CampaignHistoryProps) {
  const { data: campaigns, isLoading, isError } = useMarketingCampaigns();

  return (
    <Card className="shadow-sm border-border/80">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          My Campaigns
        </CardTitle>
        <CardDescription className="text-xs">Previously generated campaign packages</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 max-h-48 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading campaigns…
          </div>
        )}
        {isError && (
          <p className="text-xs text-muted-foreground text-center py-4">Unable to load campaign history.</p>
        )}
        {!isLoading && !isError && campaigns?.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No campaigns yet. Generate your first package above.
          </p>
        )}
        {campaigns?.map((campaign) => (
          <button
            key={campaign.id}
            type="button"
            onClick={() => onSelect(campaign)}
            className={cn(
              "w-full text-left rounded-lg border p-3 transition-all hover:border-primary/40 hover:bg-muted/30",
              activeCampaignId === campaign.id && "border-primary/50 bg-primary/5"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{campaign.input.companyName}</p>
                <p className="text-xs text-muted-foreground truncate">{campaign.strategy.campaignName}</p>
              </div>
              <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">
              {format(new Date(campaign.createdAt), "MMM d, yyyy · h:mm a")}
            </p>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
