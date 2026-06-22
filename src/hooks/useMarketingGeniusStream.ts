import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  INITIAL_AGENTS,
  type AgentState,
  type CompanyInput,
  type FullCampaign,
  type SSEEvent,
} from "@/types/marketing-genius";

interface UseMarketingGeniusStreamResult {
  agents: AgentState[];
  campaign: FullCampaign | null;
  isGenerating: boolean;
  error: string | null;
  generate: (input: CompanyInput) => Promise<void>;
  reset: () => void;
}

function updateAgent(agents: AgentState[], agentName: string, update: Partial<AgentState>): AgentState[] {
  return agents.map((a) => (a.name === agentName ? { ...a, ...update } : a));
}

function parseSSEChunk(buffer: string): { events: SSEEvent[]; remainder: string } {
  const events: SSEEvent[] = [];
  const lines = buffer.split("\n");
  let remainder = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i === lines.length - 1 && !buffer.endsWith("\n")) {
      remainder = line;
      break;
    }
    if (line.startsWith("data: ")) {
      try {
        events.push(JSON.parse(line.slice(6)) as SSEEvent);
      } catch {
        // skip malformed
      }
    }
  }

  return { events, remainder };
}

export function useMarketingGeniusStream(): UseMarketingGeniusStreamResult {
  const [agents, setAgents] = useState<AgentState[]>(INITIAL_AGENTS);
  const [campaign, setCampaign] = useState<FullCampaign | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setAgents(INITIAL_AGENTS);
    setCampaign(null);
    setError(null);
    setIsGenerating(false);
  }, []);

  const generate = useCallback(async (input: CompanyInput) => {
    setIsGenerating(true);
    setError(null);
    setCampaign(null);
    setAgents(INITIAL_AGENTS.map((a) => ({ ...a, status: "pending" as const })));

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("You must be logged in to generate campaigns");

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/marketing-genius-campaign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          apikey: anonKey,
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Server error: ${response.status} - ${errBody}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const { events, remainder } = parseSSEChunk(buffer);
        buffer = remainder;

        for (const event of events) {
          if (event.type === "agent_start") {
            setAgents((prev) => updateAgent(prev, event.agent, { status: "running" }));
          } else if (event.type === "agent_complete") {
            setAgents((prev) => updateAgent(prev, event.agent, { status: "complete", data: event.data }));
          } else if (event.type === "complete") {
            setCampaign(event.campaign);
          } else if (event.type === "error") {
            setError(event.message);
            setAgents((prev) => prev.map((a) => (a.status === "running" ? { ...a, status: "error" } : a)));
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return { agents, campaign, isGenerating, error, generate, reset };
}

export async function downloadCampaignZip(campaignId: string): Promise<void> {
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;
  if (!token) throw new Error("You must be logged in to download");

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const response = await fetch(
    `${supabaseUrl}/functions/v1/marketing-genius-download?id=${encodeURIComponent(campaignId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: anonKey,
      },
    }
  );

  if (!response.ok) throw new Error("Download failed");

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "campaign.zip";
  a.click();
  URL.revokeObjectURL(url);
}
