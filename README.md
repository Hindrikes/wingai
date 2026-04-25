# 🦋 WingAI

**AI-drivet dejtingoperativsystem för den svenska marknaden.**

HubSpot × Hinge × personlig AI-strateg — ett SaaS som lär sig vem du är, analyserar dina matcher och hjälper dig boka fler dates. På svenska.

---

## Vad är WingAI?

WingAI löser ett specifikt problem: svenska dejtingappen-användare matchar frekvent men konverserar sällan. 71% av Hinge-matcher i Sverige leder aldrig till ett meddelande.

**Tre kärnfunktioner:**

- **ProfileX-Ray** — Analyserar matcher på under 3s. Kemikemi, långsiktighet, risk och insats-ROI i ett matchkort.
- **ConvoOS** — Tre rankade meddelandeförslag i *din* röst. Säker, Lekfull, Djärv. Med förklaring varför.
- **DateFlow** — Pipeline-vy över alla matcher. Veckovis analys. Automation-regler.

---

## Tech Stack

| Lager | Teknologi |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Next.js API Routes, Supabase |
| Databas | PostgreSQL + pgvector (Supabase) |
| AI | Anthropic Claude (Sonnet, Haiku, Opus) |
| Monorepo | Turborepo + pnpm |
| Hosting | Vercel (planerat) |

## AI-agenter

```
Orkestrator (claude-sonnet-4-6)
├── UserDNA-agent    — Bygger och uppdaterar användarprofilen
├── ProfileX-Ray     — Analyserar inkommande profiler (< 3s)
├── ConvoOS          — Realtidsförslag (Haiku fast, Sonnet komplex)
├── Strategiagent    — Veckovis djupanalys (Opus + extended thinking)
└── Säkerhetsagent   — Alltid-på filter (manipulering, trakasserier)
```

---

## Kom igång

### Förutsättningar
- Node.js 22+
- pnpm 10+
- Supabase-konto (gratis)
- Anthropic API-nyckel

### Installation

```bash
git clone https://github.com/Hindrikes/wingai.git
cd wingai
pnpm install
```

### Miljövariabler

```bash
cp apps/web/.env.example apps/web/.env.local
# Fyll i dina nycklar i .env.local
```

### Databas

```bash
# Kör migrationen mot din Supabase-instans
# Kopiera innehållet i supabase/migrations/001_initial_schema.sql
# och kör det i Supabase SQL Editor
```

### Starta utvecklingsservern

```bash
pnpm dev
# Öppna http://localhost:3000
```

---

## Projektstruktur

```
wingai/
├── apps/
│   └── web/                    # Next.js 15 app
│       └── src/
│           ├── app/            # App Router sidor & API-routes
│           ├── components/     # UI-komponenter
│           │   ├── match-card/ # MatchCard-komponent
│           │   ├── pipeline/   # DateFlow pipeline
│           │   └── convoos/    # ConvoOS panel
│           ├── lib/
│           │   ├── agents/     # AI-agenter
│           │   ├── anthropic/  # Anthropic SDK-klient
│           │   └── supabase/   # Supabase-klient
│           └── types/          # TypeScript-typer
├── packages/
│   └── shared/                 # Delade typer och utilities
└── supabase/
    └── migrations/             # SQL-migrationer
```

---

## Etik & Säkerhet

WingAI följer **Autenticitetspakten**: AI:n assisterar användarens genuina jag — skapar aldrig en falsk persona. Alla outputs granskas av Säkerhetsagenten innan leverans.

- GDPR-kompatibelt (IMY-registrerat)
- Inga råprofildata från tredje part lagras server-sidan
- "Pausa Allt"-knapp stoppar all automation omedelbart
- EU AI Act Begränsad Risk-klassificering

---

## Licens

Proprietär — © 2025 WingAI / Hindrikes
