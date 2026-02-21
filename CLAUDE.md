# CLAUDE.md — AI Process Rule Validator

## Project Overview

**AI Process Rule Validator** is a Next.js 14 (App Router) web application that uses Claude to analyze business process rules. Users can run analyses in a standalone mode or organise them inside **Projects** with a persistent history timeline backed by Neon Postgres.

UI text is in **Brazilian Portuguese (PT-BR)**. Code, file names, and variables stay in English. Code comments are in PT-BR.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| AI SDK | `@anthropic-ai/sdk` |
| Model | `claude-opus-4-6` with adaptive thinking |
| Database | Neon Postgres (`@neondatabase/serverless`) |
| Deployment | Vercel (serverless) |

---

## Project Structure

```
/
├── app/
│   ├── globals.css                          # Tailwind base
│   ├── layout.tsx                           # Root layout — PT-BR nav, lang="pt-BR"
│   ├── page.tsx                             # Standalone analysis page (no persistence)
│   ├── projects/
│   │   ├── page.tsx                         # Server Component — list projects
│   │   ├── _components/
│   │   │   └── CreateProjectForm.tsx        # Client Component — create project
│   │   └── [id]/
│   │       ├── page.tsx                     # Server Component — project + timeline
│   │       ├── _components/
│   │       │   └── AnalyzeForm.tsx          # Client Component — new analysis form
│   │       └── analyses/
│   │           └── [analysisId]/
│   │               └── page.tsx             # Server Component — analysis result
│   └── api/
│       ├── analyze/
│       │   └── route.ts                     # POST — Claude + optional persistence
│       └── projects/
│           ├── route.ts                     # GET list / POST create
│           └── [id]/
│               ├── route.ts                 # GET single project
│               └── analyses/
│                   └── route.ts             # GET analyses by project
├── lib/
│   ├── db.ts                                # Neon client (lazy init)
│   └── schema.sql                           # DDL — run once in Neon SQL console
├── .env.example
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Environment Variables

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key — console.anthropic.com |
| `DATABASE_URL` | Yes (for projects) | Neon connection string — console.neon.tech |

**Never commit `.env.local`.**

---

## Database Setup

Run `lib/schema.sql` once in the Neon SQL Console:

```sql
-- Creates tables: projects, analyses
-- Run via: Neon Console → SQL Editor → paste schema.sql
```

Tables:
- **projects** — `id (uuid PK)`, `name`, `description`, `created_at`, `updated_at`
- **analyses** — `id (uuid PK)`, `project_id (FK → projects)`, `process_description`, `business_rule`, `volume_sla`, `result (jsonb)`, `created_at`

---

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

---

## API Routes

### `POST /api/analyze`
**File:** `app/api/analyze/route.ts`

**Request body:**
```json
{
  "processDescription": "string (required)",
  "businessRule": "string (required)",
  "volumeSla": "string (optional)",
  "project_id": "uuid (optional — enables persistence)"
}
```

**Response:**
```json
{
  "rule_clarity":             { "score": "...", "analysis": "..." },
  "operational_risks":        { "summary": "...", "items": ["..."] },
  "automation_opportunities": { "summary": "...", "items": ["..."] },
  "recommended_technology":   { "technologies": ["RPA","AI","Workflow","OCR"], "rationale": "..." },
  "complexity_level":         { "level": "Low|Medium|High", "explanation": "..." },
  "analysis_id":              "uuid (only present when project_id was provided and saved)"
}
```

How it works:
1. Validates required fields (400 if missing).
2. Calls `claude-opus-4-6` via `stream.finalMessage()`.
3. Finds `text` block (skips `thinking` blocks).
4. Strips markdown fences and `JSON.parse`s.
5. If `project_id` provided → inserts row in `analyses` table, adds `analysis_id` to response.
6. DB failure is silent — analysis still returns even if persistence fails.

### `GET /api/projects` — lista projetos com contagem de análises
### `POST /api/projects` — cria projeto (`{ name, description? }`)
### `GET /api/projects/[id]` — retorna projeto pelo ID
### `GET /api/projects/[id]/analyses` — lista análises do projeto

---

## Frontend Pages

| Route | Type | Description |
|---|---|---|
| `/` | Client Component | Standalone analysis (no project, no persistence) |
| `/projects` | Server Component | List + create projects |
| `/projects/[id]` | Server Component | Project detail + analysis timeline |
| `/projects/[id]/analyses/[analysisId]` | Server Component | Full analysis result |

---

## Deployment to Vercel

1. Push to GitHub.
2. In Vercel → Settings → Environment Variables add `ANTHROPIC_API_KEY` and `DATABASE_URL`.
3. Deploy — Vercel auto-detects Next.js.
4. Run `lib/schema.sql` in Neon SQL Console before first use.

> **Timeout note:** `maxDuration = 60`. Vercel Hobby plan caps at 10 s; Pro gives 60 s. Claude with adaptive thinking can take 15–30 s.

---

## Key Conventions

- **App Router only** — no `pages/` directory.
- **Server Components by default** — Client Components only for interactivity (`"use client"`).
- **Streaming** — `client.messages.stream(…).finalMessage()` to avoid timeouts.
- **Adaptive thinking** — `thinking: { type: "adaptive" }` on `claude-opus-4-6`. No `budget_tokens`.
- **Text block extraction** — `response.content.find((b) => b.type === "text")`.
- **JSON robustness** — strip markdown fences before `JSON.parse`.
- **Neon lazy init** — `getDb()` in `lib/db.ts` defers `neon(url)` to runtime, avoiding build errors when `DATABASE_URL` is absent.
- **Graceful DB degradation** — persistence errors are caught and logged; analysis response is never blocked by DB failures.
- **No auth** — no authentication layer by design.
- **Tailwind only** — no CSS modules or styled-components.
- **TypeScript strict** — `strict: true` in `tsconfig.json`.

---

## Product Evolution Roadmap

After persistence is stable, suggested next features (priority order):

| # | Feature | Value |
|---|---|---|
| 1 | **Tags por análise** | Categorize análises (ex: Financeiro, RH, Logística) |
| 2 | **Marcar como validada** | Destaca análises aprovadas pelo time |
| 3 | **Comentários** | Discussão assíncrona por análise |
| 4 | **Export to PPT** | Geração de apresentação via python-pptx ou similar |
| 5 | **Geração de backlog** | Transforma análise em user stories exportáveis |
| 6 | **Dashboard de analytics** | Mix de tecnologias, distribuição de complexidade, ROI estimado |
| 7 | **Motor de priorização** | Score automático baseado em risco × oportunidade × complexidade |

---

## Model Configuration Reference

| Parameter | Value | Notes |
|---|---|---|
| `model` | `claude-opus-4-6` | Não adicionar sufixo de data |
| `max_tokens` | `4096` | Suficiente para JSON estruturado |
| `thinking` | `{ type: "adaptive" }` | Claude decide quando pensar |
| `system` | `SYSTEM_PROMPT` constant | Instrui saída JSON pura |
