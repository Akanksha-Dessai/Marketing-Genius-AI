import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { buildCampaignZipFiles, createZipBuffer } from "../_shared/marketing-genius/zip.ts";
import type { FullCampaign } from "../_shared/marketing-genius/orchestrator.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const campaignId = url.searchParams.get("id");
    if (!campaignId) {
      return new Response(JSON.stringify({ error: "Missing campaign id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: userData, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !userData?.user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: row, error } = await supabase
      .from("marketing_campaigns")
      .select("*")
      .eq("id", campaignId)
      .eq("user_id", userData.user.id)
      .single();

    if (error || !row) {
      return new Response(JSON.stringify({ error: "Campaign not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const campaign: FullCampaign = {
      id: row.id,
      input: row.input,
      research: row.research,
      strategy: row.strategy,
      content: row.content,
      analytics: row.analytics,
      createdAt: row.created_at,
    };

    const files = buildCampaignZipFiles(campaign);
    const zipBuffer = createZipBuffer(files);
    const companyName = (campaign.input.companyName || "campaign")
      .replace(/\s+/g, "-")
      .toLowerCase();

    return new Response(zipBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${companyName}-campaign.zip"`,
      },
    });
  } catch (err) {
    console.error("[marketing-genius-download]", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
