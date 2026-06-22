# MarketingGenius AI — SJ Marketing Control Tower

Fork of [marketing-control-tower-demo](https://github.com/sjinnovation/marketing-control-tower-demo) with **MarketingGenius AI** — a 4-agent sequential campaign generator integrated via Supabase Edge Functions.

## Quick Start

```bash
npm install
cp .env.example .env   # add your Supabase keys
npm run dev            # http://localhost:8080
```

Login required. Navigate to **MarketingGenius AI** at `/marketing-genius` or via the Hackathon tab.

## MarketingGenius Module

| Agent | Role |
|-------|------|
| Research | Market trends, competitors, audience insights |
| Strategy | Channels, timeline, budget allocation |
| Content | Ads, social posts, emails |
| Analytics | KPIs, ROI forecast |

**Demo:** Click **Load Demo** (EcoBrew Coffee) → **Generate Campaign** → Download ZIP.

## Supabase Setup (gexlbguucuthlmchhyne)

```bash
npx supabase login
npx supabase link --project-ref gexlbguucuthlmchhyne
npx supabase db push
npx supabase functions deploy marketing-genius-campaign
npx supabase functions deploy marketing-genius-download
```

Set secrets in Supabase Dashboard → Edge Functions → Secrets:

- `OPENAI_KEY` — your OpenAI API key (required)
- `OPENAI_MODEL` — optional, defaults to `gpt-4o-mini`

## Branches

| Branch | Description |
|--------|-------------|
| `main` | Control tower + MarketingGenius integration |
| `feature/marketing-genius` | Active development branch |
| `standalone-demo` | Original standalone Express app (archived) |

## Environment Variables

```
VITE_SUPABASE_PROJECT_ID=gexlbguucuthlmchhyne
VITE_SUPABASE_URL=https://gexlbguucuthlmchhyne.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

## Architecture

```
React UI (/marketing-genius)
  → POST marketing-genius-campaign (SSE)
    → Research → Strategy → Content → Analytics (OpenAI)
    → Save to marketing_campaigns table
  → GET marketing-genius-download (ZIP)
```

## Standalone Demo (archived)

The original hackathon standalone app is preserved on branch `standalone-demo`.
