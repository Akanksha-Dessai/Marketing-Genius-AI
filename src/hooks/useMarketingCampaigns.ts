import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { rowToFullCampaign, type FullCampaign, type MarketingCampaignRow } from "@/types/marketing-genius";

export function useMarketingCampaigns() {
  return useQuery({
    queryKey: ["marketing-campaigns"],
    queryFn: async (): Promise<FullCampaign[]> => {
      const { data, error } = await (supabase as { from: (t: string) => typeof supabase.from })
        .from("marketing_campaigns")
        .select("id, user_id, input, research, strategy, content, analytics, created_at")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return ((data ?? []) as MarketingCampaignRow[]).map(rowToFullCampaign);
    },
  });
}
