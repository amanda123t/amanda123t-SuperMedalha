# CLAUDE.md — AI Process Rule Validator

## Project Overview

**AI Process Rule Validator** is a Next.js 14 (App Router) web application that uses Claude to analyze business process rules. Users provide a process description and a business rule (with an optional Volume/SLA field), click **Analyze**, and receive a structured AI-generated assessment across five dimensions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI SDK | `@anthropic-ai/sdk` |
| Model | `claude-opus-4-6` with adaptive thinking |
| Deployment | Vercel (serverless) |

---

## Project Structure

```
/
├── app/
│   ├── globals.css          # Tailwind base styles
│   ├── layout.tsx           # Root layout (metadata, font)
│   ├── page.tsx             # Main UI — form + result cards
│   └── api/
│       └── analyze/
│           └── route.ts     # POST /api/analyze — calls Claude
├── .env.example             # Environment variable template
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your key:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key from console.anthropic.com |

**Never commit `.env.local` or any file containing your API key.**

---

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

---

## API Route: `POST /api/analyze`

**File:** `app/api/analyze/route.ts`

### Request body

```json
{
  "processDescription": "string (required)",
  "businessRule": "string (required)",
  "volumeSla": "string (optional)"
}
```

### Response shape

```json
{
  "rule_clarity": {
    "score": "Clear | Partially Clear | Unclear",
    "analysis": "string"
  },
  "operational_risks": {
    "summary": "string",
    "items": ["string"]
  },
  "automation_opportunities": {
    "summary": "string",
    "items": ["string"]
  },
  "recommended_technology": {
    "technologies": ["RPA", "AI", "Workflow", "OCR"],
    "rationale": "string"
  },
  "complexity_level": {
    "level": "Low | Medium | High",
    "explanation": "string"
  }
}
```

### How it works

1. Validates required fields; returns 400 if missing.
2. Calls `claude-opus-4-6` with `thinking: { type: "adaptive" }` via streaming (`stream.finalMessage()`).
3. Locates the `text` block in `response.content` (separate from any `thinking` blocks).
4. Strips any accidental markdown code fences, then `JSON.parse`s the result.
5. Returns the structured JSON to the client.

### Error responses

```json
{ "error": "Human-readable message" }
```

HTTP 400 — missing required fields
HTTP 500 — model error or JSON parse failure

---

## UI: `app/page.tsx`

Client component (`"use client"`). State:

- `processDescription`, `businessRule`, `volumeSla` — controlled textarea/input values
- `loading` — shows skeleton cards while the API call is in flight
- `result` — typed `AnalysisResult | null`; renders five result cards when set
- `error` — shows a red banner on failure

The **Analyze** button is disabled until both required fields have content and the request is not in flight.

---

## Deployment to Vercel

1. Push to GitHub (or connect the repo directly in Vercel).
2. In the Vercel project settings → **Environment Variables**, add `ANTHROPIC_API_KEY`.
3. Deploy — Vercel auto-detects Next.js and applies the correct build settings.

> **Timeout note:** The API route sets `export const maxDuration = 60`. On Vercel's **Hobby** plan the limit is 10 s; upgrade to **Pro** to use the full 60 s budget. Claude responses with adaptive thinking can occasionally take 15–30 s.

---

## Key Conventions

- **App Router only** — no `pages/` directory. All routes live under `app/`.
- **Server Components by default** — only `app/page.tsx` is a Client Component (`"use client"`).
- **Streaming over plain `create()`** — use `client.messages.stream(…).finalMessage()` in API routes to avoid HTTP timeouts on large or thinking-heavy responses.
- **Adaptive thinking** — pass `thinking: { type: "adaptive" }` to `claude-opus-4-6`. Do not set `budget_tokens` (deprecated on this model).
- **Text block extraction** — when thinking is enabled, `response.content` is an array that may start with a `thinking` block. Always find the `text` block explicitly with `.find((b) => b.type === "text")`.
- **JSON robustness** — strip markdown code fences before `JSON.parse` in case the model wraps output in ` ```json ` blocks.
- **No authentication** — this app has no auth layer by design.
- **Tailwind only** — no CSS modules, no styled-components. All styles are Tailwind utility classes.
- **TypeScript strict mode** — `strict: true` in `tsconfig.json`. All interfaces for API response shapes are defined in `app/page.tsx`.

---

## Model Configuration Reference

| Parameter | Value | Notes |
|---|---|---|
| `model` | `claude-opus-4-6` | Current recommended default |
| `max_tokens` | `4096` | Sufficient for structured JSON output |
| `thinking` | `{ type: "adaptive" }` | Claude decides when/how much to think |
| `system` | See `SYSTEM_PROMPT` constant | Instructs JSON-only output |

Do not add date suffixes to model IDs (e.g., never `claude-opus-4-6-20250514`).
