# CLAUDE.md — GMO em Prática

## Project Overview

**GMO em Prática** is a Next.js 14 (App Router) interactive internal learning tool for commercial teams to understand Organizational Change Management (Gestão de Mudança Organizacional — GMO) in a practical and engaging way.

All UI text and content is in **Brazilian Portuguese (PT-BR)**. Code remains in English.

The app contains two interactive modules:
1. **Jornada da Mudança** — A visual 5-phase change timeline with expandable detail cards
2. **Biblioteca de Sinais** — A library of real client phrases with GMO interpretation and commercial guidance

The app also retains an existing **AI Process Rule Validator** API route (`/api/analyze`) powered by Google Gemini.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| AI SDK | `@google/genai` (Gemini 1.5 Flash) |
| Deployment | Vercel (serverless) |

---

## Project Structure

```
/
├── app/
│   ├── globals.css                   # Tailwind base + custom fadeIn animation
│   ├── layout.tsx                    # Root layout (pt-BR lang, GMO metadata)
│   ├── page.tsx                      # Main shell — tab navigation between GMO modules
│   ├── components/
│   │   ├── TimelineJourney.tsx       # Feature 1: interactive 5-phase change timeline
│   │   └── SignalLibrary.tsx         # Feature 2: client signal cards with detail panel
│   └── api/
│       └── analyze/
│           └── route.ts              # POST /api/analyze — Gemini rule validator
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

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `ANTHROPIC_API_KEY` | No | Reserved; not currently used in runtime |

**Never commit `.env.local` or any file containing API keys.**

---

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

---

## Feature 1: Jornada da Mudança (`app/components/TimelineJourney.tsx`)

Interactive timeline of the 5 GMO phases. Clicking a phase reveals a rich inline detail panel.

### Phases

| # | Name | Emoji | Accent Color |
|---|---|---|---|
| 1 | Diagnóstico | 🔍 | Violet |
| 2 | Comunicação | 📣 | Blue |
| 3 | Capacitação | 🎓 | Teal |
| 4 | Adoção | 🚀 | Orange |
| 5 | Sustentação | 🏛️ | Emerald |

### Phase detail sections (5 content cards per phase)

| Section key | Icon | Description | Style |
|---|---|---|---|
| `what` | ⚙️ | O que acontece | Default |
| `risk` | ⚠️ | Risco de não atuar | Red-tinted |
| `example` | 💼 | Exemplo real no cliente | Italic |
| `manifestation` | 👁️ | Como se manifesta na prática | Default |
| `insight` | 💡 | Insight de GMO | Accent-tinted, full-width |

### Interaction pattern
- Grid of 5 phase buttons; clicking toggles the detail panel below
- Clicking the active phase closes the panel
- Dot progress indicator at bottom reflects the active phase
- `animate-fade-in` class applied to the detail panel on mount

---

## Feature 2: Biblioteca de Sinais (`app/components/SignalLibrary.tsx`)

A library of real client phrases that signal a GMO need. Users can filter by phase and click a card to see an inline detail panel.

### Signal cards

| Phrase | Phase # | Phase name |
|---|---|---|
| "O time não está usando" | 4 | Adoção |
| "As pessoas resistem" | 2 | Comunicação |
| "O sistema é bom, mas..." | 3 | Capacitação |
| "A liderança não comprou" | 1 | Diagnóstico |
| "Estamos com retrabalho" | 3 | Capacitação |
| "O projeto foi entregue, mas não mudou nada" | 5 | Sustentação |

### Card detail sections (4 per signal)

| Section | Icon | Style |
|---|---|---|
| O que isso significa | 🔎 | Default |
| Risco oculto | ⚠️ | Red-tinted |
| Insight de GMO | 💡 | Accent-tinted |
| Pergunta que o comercial pode fazer | 💬 | Amber-tinted |

### Interaction pattern
- Phase filter chips at top narrow the visible cards; selecting same filter deactivates it
- Clicking a card selects it and opens the detail panel below the grid
- Filter reset clears the selected card
- `animate-fade-in` on detail panel mount

---

## API Route: `POST /api/analyze`

**File:** `app/api/analyze/route.ts`

Validates business process rules. Powered by Google Gemini 1.5 Flash. Responds in PT-BR.

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
  "rule_clarity": { "score": "string", "analysis": "string" },
  "operational_risks": { "summary": "string", "items": ["string"] },
  "automation_opportunities": { "summary": "string", "items": ["string"] },
  "recommended_technology": { "technologies": ["string"], "rationale": "string" },
  "complexity_level": { "level": "Low | Medium | High", "explanation": "string" }
}
```

### How it works

1. Validates required fields; returns 400 if missing.
2. Calls `gemini-1.5-flash` via `@google/genai` with `responseMimeType: "application/json"`.
3. Strips any accidental markdown fences, then `JSON.parse`s the result.
4. Returns the structured JSON to the client.

### Error responses

```json
{ "error": "Mensagem em PT-BR" }
```

HTTP 400 — missing required fields
HTTP 500 — model error or JSON parse failure

---

## UI & Design Conventions

- **Dark theme** — `bg-gray-950` base, `bg-gray-900` surfaces, `border-gray-800` borders
- **Color system** — each GMO phase has a dedicated Tailwind accent (violet → blue → teal → orange → emerald); the same phase number must use the same accent color in both modules
- **Language rule** — all user-facing strings must be in PT-BR; variable names, comments, and type definitions remain in English
- **No modals** — detail panels expand inline below the grid for an exploratory, non-disruptive feel
- **Tailwind only** — no CSS modules, no styled-components; all styles are utility classes
- **Client Components** — `page.tsx` and all files under `app/components/` are Client Components (`"use client"`)
- **App Router only** — no `pages/` directory; all routes live under `app/`
- **TypeScript strict** — `strict: true`; all data shapes are typed with interfaces local to each file
- **Animation** — the `animate-fade-in` utility is defined in `globals.css`; apply it to panels that mount on user interaction

---

## Adding New Signal Cards

Add a new entry to the `SIGNALS` array in `app/components/SignalLibrary.tsx`:

```ts
{
  id: "unique-kebab-id",
  phrase: "Frase do cliente em PT-BR",
  phaseName: "Adoção",
  phaseNumber: 4,            // 1–5, controls color and phase filter
  color: COLORS[4],          // reference the pre-defined COLORS map
  interpretation: "...",
  hiddenRisk: "...",
  insight: "...",
  question: "...",
}
```

## Adding New Timeline Phases

1. Add a new entry to the `PHASES` array in `app/components/TimelineJourney.tsx`.
2. Define a new `PhaseColor` object (bg, border, text, badge, dot, sectionBg, glow).
3. Add the phase number to `PHASE_NAMES` and `PHASE_EMOJIS` in `SignalLibrary.tsx` so signal cards can reference it.

---

## Deployment to Vercel

1. Push to GitHub and connect repo in Vercel.
2. In Vercel project settings → **Environment Variables**, add `GEMINI_API_KEY`.
3. Deploy — Vercel auto-detects Next.js.

> **Timeout note:** The API route sets `export const maxDuration = 60`. On Vercel's **Hobby** plan the limit is 10s; upgrade to **Pro** for the full budget.
