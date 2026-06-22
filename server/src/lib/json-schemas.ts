/** OpenAI strict JSON schemas for structured agent outputs */

export const RESEARCH_JSON_SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string", description: "2-3 paragraph market research summary" },
    marketTrends: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      description: "Current market trends",
    },
    competitors: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          strength: { type: "string" },
          weakness: { type: "string" },
        },
        required: ["name", "strength", "weakness"],
        additionalProperties: false,
      },
      minItems: 2,
    },
    audienceInsights: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
    },
    opportunities: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
    },
  },
  required: ["summary", "marketTrends", "competitors", "audienceInsights", "opportunities"],
  additionalProperties: false,
} as const;

export const STRATEGY_JSON_SCHEMA = {
  type: "object",
  properties: {
    campaignName: { type: "string" },
    objectives: { type: "array", items: { type: "string" }, minItems: 3 },
    channels: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          rationale: { type: "string" },
          tactics: { type: "array", items: { type: "string" }, minItems: 2 },
        },
        required: ["name", "rationale", "tactics"],
        additionalProperties: false,
      },
      minItems: 2,
    },
    timeline: {
      type: "array",
      items: {
        type: "object",
        properties: {
          phase: { type: "string" },
          duration: { type: "string" },
          activities: { type: "array", items: { type: "string" }, minItems: 2 },
        },
        required: ["phase", "duration", "activities"],
        additionalProperties: false,
      },
      minItems: 3,
    },
    budgetAllocation: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          percentage: { type: "number" },
          amount: { type: "string" },
        },
        required: ["category", "percentage", "amount"],
        additionalProperties: false,
      },
      minItems: 3,
    },
    keyMessages: { type: "array", items: { type: "string" }, minItems: 3 },
  },
  required: [
    "campaignName",
    "objectives",
    "channels",
    "timeline",
    "budgetAllocation",
    "keyMessages",
  ],
  additionalProperties: false,
} as const;

export const CONTENT_JSON_SCHEMA = {
  type: "object",
  properties: {
    ads: {
      type: "array",
      items: {
        type: "object",
        properties: {
          headline: { type: "string" },
          body: { type: "string" },
          cta: { type: "string" },
        },
        required: ["headline", "body", "cta"],
        additionalProperties: false,
      },
      minItems: 3,
      maxItems: 3,
    },
    socialPosts: {
      type: "array",
      items: {
        type: "object",
        properties: {
          platform: { type: "string" },
          text: { type: "string" },
          hashtags: { type: "array", items: { type: "string" }, minItems: 2 },
        },
        required: ["platform", "text", "hashtags"],
        additionalProperties: false,
      },
      minItems: 5,
      maxItems: 5,
    },
    emails: {
      type: "array",
      items: {
        type: "object",
        properties: {
          subject: { type: "string" },
          preview: { type: "string" },
          body: { type: "string" },
        },
        required: ["subject", "preview", "body"],
        additionalProperties: false,
      },
      minItems: 2,
      maxItems: 2,
    },
  },
  required: ["ads", "socialPosts", "emails"],
  additionalProperties: false,
} as const;

export const ANALYTICS_JSON_SCHEMA = {
  type: "object",
  properties: {
    kpis: {
      type: "array",
      items: {
        type: "object",
        properties: {
          metric: { type: "string" },
          target: { type: "string" },
          benchmark: { type: "string" },
        },
        required: ["metric", "target", "benchmark"],
        additionalProperties: false,
      },
      minItems: 4,
    },
    estimatedReach: { type: "string" },
    estimatedCTR: { type: "string" },
    engagementForecast: { type: "string" },
    roiProjection: { type: "string" },
    recommendations: { type: "array", items: { type: "string" }, minItems: 3 },
  },
  required: [
    "kpis",
    "estimatedReach",
    "estimatedCTR",
    "engagementForecast",
    "roiProjection",
    "recommendations",
  ],
  additionalProperties: false,
} as const;
