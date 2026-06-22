import { Router, type Request, type Response } from "express";
import { orchestrateCampaign, campaignStore } from "../agents/orchestrator.js";
import { streamCampaignZip } from "../lib/zip.js";
import type { SSEEvent } from "../types/campaign.js";

const router = Router();

function sendSSE(res: Response, event: SSEEvent): void {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

router.post("/generate", async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  try {
    await orchestrateCampaign(req.body, (event) => sendSSE(res, event));
    res.end();
  } catch (err) {
    let message = "Campaign generation failed";
    if (err instanceof Error) {
      message = err.message.includes("validation failed")
        ? "AI agent returned invalid data. Please try again."
        : err.message;
    }
    sendSSE(res, { type: "error", message });
    res.end();
  }
});

router.get("/:id/download", (req: Request, res: Response) => {
  const id = req.params.id as string;
  const campaign = campaignStore.get(id);
  if (!campaign) {
    res.status(404).json({ error: "Campaign not found" });
    return;
  }
  streamCampaignZip(campaign, res);
});

export default router;
