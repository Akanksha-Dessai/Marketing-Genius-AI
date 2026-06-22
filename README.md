# MarketingGenius AI

Multi-Agent Marketing Campaign Generator — built for hackathon demos.

Four AI agents work in sequence to research your market, build strategy, generate content, and forecast ROI. Download the full campaign package as a ZIP.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **AI:** OpenAI API (gpt-4o-mini)

## Quick Start

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure OpenAI API key

```bash
cp .env.example server/.env
```

Edit `server/.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
PORT=3001
```

### 3. Run the app

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 3-Minute Demo Script (for Judges)

1. **Intro (30s):** "MarketingGenius AI uses four specialized agents — Research, Strategy, Content, and Analytics — that pass context to each other like a real marketing team."

2. **Input (30s):** Click **Load Demo** to pre-fill EcoBrew Coffee (sustainable coffee subscription). Hit **Generate Campaign**.

3. **Pipeline (60s):** Watch agents light up one by one. Explain each role as it runs:
   - Research → market & competitors
   - Strategy → channels & budget
   - Content → ads, posts, emails
   - Analytics → ROI forecast

4. **Results (45s):** Walk through the tabbed output. Show copy-to-clipboard on an ad. Highlight budget allocation chart and ROI numbers.

5. **Download (15s):** Click **Download ZIP** — show the markdown files and `campaign.json` inside.

## Agent Architecture

```
User Input → Research Agent → Strategy Agent → Content Agent → Analytics Agent → Campaign Package
```

Each agent receives all prior agent outputs as context, ensuring coherent end-to-end campaigns.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/campaign/generate` | Generate campaign (SSE stream) |
| GET | `/api/campaign/:id/download` | Download campaign ZIP |
| GET | `/api/health` | Health check |

## Project Structure

```
├── client/          # React frontend
├── server/          # Express API + AI agents
├── package.json     # Root dev scripts
└── .env.example     # Environment template
```

## Hackathon Tips

- Pre-load the EcoBrew demo before going on stage
- Generation takes 30–90 seconds — narrate what each agent is doing
- If Wi-Fi is unreliable, generate once beforehand and re-walk through cached results
- Switch to `gpt-4o` in `.env` for higher quality output (slower, more expensive)
