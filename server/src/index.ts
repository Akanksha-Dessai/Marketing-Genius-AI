import "./env.js";
import express from "express";
import cors from "cors";
import campaignRouter from "./routes/campaign.js";

const PORT = parseInt(process.env.PORT || "3001", 10);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    service: "MarketingGenius AI API",
    message: "Open the app at http://localhost:5173",
    endpoints: ["/api/health", "POST /api/campaign/generate", "GET /api/campaign/:id/download"],
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "MarketingGenius AI" });
});

app.use("/api/campaign", campaignRouter);

app.listen(PORT, () => {
  console.log(`MarketingGenius AI server running on http://localhost:${PORT}`);
});
