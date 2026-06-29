import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Archive, Loader2, Search, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useMarketingCampaigns } from "@/hooks/useMarketingCampaigns";
import type { FullCampaign } from "@/types/marketing-genius";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 8;

interface CampaignHistoryProps {
  activeCampaignId?: string | null;
  onSelect: (campaign: FullCampaign) => void;
  variant?: "compact" | "full";
}

function campaignLabel(campaign: FullCampaign): string {
  return campaign.input.companyName || campaign.strategy?.campaignName || "Untitled Campaign";
}

function matchesSearch(campaign: FullCampaign, query: string): boolean {
  const haystack = [
    campaignLabel(campaign),
    campaign.strategy?.campaignName,
    campaign.input.industry,
    campaign.input.campaignGoal,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

export function CampaignHistory({ activeCampaignId, onSelect, variant = "full" }: CampaignHistoryProps) {
  const { data: campaigns, isLoading, isError } = useMarketingCampaigns();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const isCompact = variant === "compact";

  const filtered = useMemo(() => {
    if (!campaigns) return [];
    const q = search.trim().toLowerCase();
    if (!q) return campaigns;
    return campaigns.filter((c) => matchesSearch(c, q));
  }, [campaigns, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, filtered.length);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  return (
    <Card className={cn("shadow-sm border-border/80", !isCompact && "h-full flex flex-col")}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <Archive className="h-4 w-4 text-primary" />
          Campaign Library
        </CardTitle>
        <CardDescription className="text-xs">
          {isCompact
            ? "Previously generated campaign packages"
            : "Browse saved packages — select one to view full details"}
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("flex flex-col gap-3", !isCompact && "flex-1 min-h-0")}>
        {!isCompact && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="search"
              placeholder="Search by company, campaign, or industry…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm"
              aria-label="Search campaigns"
            />
          </div>
        )}

        <div
          className={cn(
            "space-y-2",
            isCompact ? "max-h-48 overflow-y-auto" : "flex-1 min-h-0 overflow-y-auto pr-0.5"
          )}
        >
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading campaigns…
            </div>
          )}
          {isError && (
            <p className="text-xs text-muted-foreground text-center py-4">Unable to load campaign history.</p>
          )}
          {!isLoading && !isError && filtered.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">
              {search.trim()
                ? "No campaigns match your search."
                : "No campaigns yet. Use the Create Campaign tab to generate your first package."}
            </p>
          )}
          <div className="grid grid-cols-1 gap-2">
            {paginated.map((campaign) => (
              <button
                key={campaign.id}
                type="button"
                onClick={() => onSelect(campaign)}
                className={cn(
                  "w-full text-left rounded-lg border p-3 transition-all hover:border-primary/40 hover:bg-muted/30",
                  activeCampaignId === campaign.id && "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{campaignLabel(campaign)}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {campaign.strategy?.campaignName ?? "Campaign package"}
                    </p>
                  </div>
                  <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {format(new Date(campaign.createdAt), "MMM d, yyyy · h:mm a")}
                </p>
              </button>
            ))}
          </div>
        </div>

        {!isLoading && !isError && filtered.length > 0 && (
          <div className="pt-2 border-t border-border/60 space-y-2">
            <p className="text-[11px] text-center text-muted-foreground">
              Showing {rangeStart}–{rangeEnd} of {filtered.length}
              {search.trim() ? " matching" : ""} campaign{filtered.length !== 1 ? "s" : ""}
            </p>
            {totalPages > 1 && (
              <Pagination className="justify-center">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                      className={cn("cursor-pointer h-8 text-xs", page === 1 && "pointer-events-none opacity-50")}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-3 text-xs font-medium text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(totalPages, p + 1));
                      }}
                      className={cn(
                        "cursor-pointer h-8 text-xs",
                        page === totalPages && "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
