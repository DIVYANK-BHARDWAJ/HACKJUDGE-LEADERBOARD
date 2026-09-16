# ⌬ HackJudge Live Leaderboard

<div align="center">

**The public standings surface for the HackJudge hackathon judging ecosystem.**

[![HackJudge Ecosystem](https://img.shields.io/badge/HackJudge-Ecosystem-ff6b2b?style=for-the-badge)](https://github.com/DIVYANK-BHARDWAJ)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-Apache--2.0-blue?style=for-the-badge)](./LICENSE)

</div>

---

## What is this?

**HackJudge Live Leaderboard** is the standings and visualization layer of the **HackJudge ecosystem**. It turns evaluated hackathon submissions into a live, public-facing scoreboard with podium rankings, score comparisons, project metadata, submission freshness, and a shared event countdown.

This repository is **not an isolated leaderboard experiment**. It is designed to sit downstream of the other HackJudge components:

```text
┌──────────────────────────────────────────────────────────────────────┐
│                         HACKJUDGE ECOSYSTEM                           │
└──────────────────────────────────────────────────────────────────────┘

 Participant / Organizer
          │
          ▼
┌──────────────────────────────┐
│ HACKJUDGE-PARTICIPANT-PORTAL │
│                              │
│ • submission intake          │
│ • participant experience     │
│ • result/status surface      │
│ • organizer controls         │
└──────────────┬───────────────┘
               │
               │ submissions / evaluation state
               ▼
┌──────────────────────────────┐
│           HACKJUDGE          │
│                              │
│ • repository analysis        │
│ • scoring engine             │
│ • evaluation reasoning       │
│ • integrity-aware judging    │
└──────────────┬───────────────┘
               │
               │ evaluated submission records
               ▼
┌──────────────────────────────┐
│      SHARED SUPABASE DATA    │
│                              │
│ • submissions                │
│ • config / end time          │
│ • realtime change stream     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      LIVE LEADERBOARD        │
│          (THIS REPO)         │
│                              │
│ • live standings             │
│ • top-three podium           │
│ • score visualization        │
│ • auto-refresh               │
│ • event countdown            │
└──────────────────────────────┘
```

The result is a complete judging experience: **submit → evaluate → persist → rank → publish standings**.

---

## Core capabilities

### 🏆 Live standings
Submissions are loaded from the shared `submissions` table and sorted by score in descending order, producing the current ranking order.

### ⚡ Realtime + polling resilience
The client listens for Supabase Postgres changes and also polls every 10 seconds. This gives the board both low-latency updates and a fallback synchronization mechanism.

### 🥇 Podium presentation
The highest three submissions receive dedicated champion, runner-up, and third-place cards, while every remaining project appears in the full ranking table.

### 📊 Relative score visualization
Ranks below the podium receive score bars and a percentage comparison against the current highest score, making the spread of the field easy to scan.

### ⏱️ Shared hackathon countdown
The event end time is read from the shared `config` table, allowing organizer-side schedule changes to propagate to the public leaderboard. A build-time environment fallback is retained for resilience.

### 👤 Participant-aware highlighting
An optional `VITE_CURRENT_USER_REPO` value can highlight the current participant's repository in the standings.

### 🏷️ Lightweight project categorization
Repository names are heuristically tagged as `AI`, `WEB`, `API`, or `DEV` for fast visual classification.

### 🛰️ Freshness telemetry
The UI tracks how long it has been since the latest successful synchronization, giving viewers immediate visibility into data freshness.

---

## Data flow

```text
                  ┌───────────────────────┐
                  │ Participant Portal    │
                  │ submits repository    │
                  └───────────┬───────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │ HackJudge Evaluation  │
                  │ and scoring pipeline  │
                  └───────────┬───────────┘
                              │
                              ▼
                  ┌───────────────────────┐
                  │ Supabase              │
                  │ submissions + config  │
                  └───────┬───────┬───────┘
                          │       │
              realtime ───┘       └─── polling
                          │       │
                          ▼       ▼
                  ┌───────────────────────┐
                  │ Live Leaderboard      │
                  │ rank → visualize → UI │
                  └───────────────────────┘
```

---

## Repository structure

```text
leaderboard-/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   └── supabase.ts
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
└── SECURITY.md
```

The current implementation is a compact React/Vite application with Supabase as its data source. fileciteturn38file0L2-L2

---

## Technology stack

| Layer | Technology |
|---|---|
| UI | React 19 |
| Language | TypeScript 6 |
| Build tool | Vite 8 |
| Data | Supabase JS client |
| Realtime | Supabase Postgres Changes |
| Icons | Lucide React |
| Styling | CSS / inline React styles |
| Tooling | ESLint, TypeScript |

The declared dependencies and scripts are visible in `package.json`, including Vite, React, TypeScript, Supabase JS, Lucide React, linting, and production build commands. fileciteturn39file0L2-L2

---

## Getting started

### 1. Clone

```bash
git clone https://github.com/DIVYANK-BHARDWAJ/leaderboard-.git
cd leaderboard-
```

### 2. Install

```bash
npm install
```

### 3. Configure environment

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_CURRENT_USER_REPO=https://github.com/your-user/your-repo
VITE_HACKATHON_END_TIME=2026-12-01T18:00:00Z
```

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are read by the application before creating the Supabase client. fileciteturn42file0L2-L2

### 4. Run locally

```bash
npm run dev
```

### 5. Validate a production build

```bash
npm run lint
npm run build
npm run preview
```

The project exposes `dev`, `build`, `lint`, and `preview` scripts. fileciteturn39file0L2-L2

---

## Shared data contract

The leaderboard currently expects a `submissions` dataset with fields equivalent to:

```ts
interface Submission {
  id: string;
  github_url: string;
  repo_name: string;
  owner: string;
  score: string | number;
  submitted_at: string;
}
```

The client orders records by `score` descending and derives the podium from the resulting ordered collection. fileciteturn41file0L2-L2

For the event countdown, the client reads `config.value` where `config.key = 'end_time'`. fileciteturn41file0L2-L2

---

## Refresh model

The leaderboard intentionally uses two synchronization paths:

```text
Initial load
    │
    ├── Fetch current submissions
    │
    ├── Subscribe to Supabase Postgres changes
    │
    └── Start 10-second polling loop
            │
            ├── update standings
            ├── reset freshness timer
            └── re-render podium + board
```

The application removes the polling interval and Supabase channel when the component unmounts. fileciteturn41file0L2-L2

---

## Design philosophy

The interface intentionally treats a hackathon scoreboard like a live operations surface rather than a generic CRUD table:

- high-contrast ranking hierarchy
- explicit podium semantics
- dense score visualization
- live status indicators
- visible synchronization freshness
- event countdown
- compact project metadata
- responsive single-page presentation

The document title and application chrome identify the experience as a live hackathon standings surface, while the UI labels emphasize rankings and automatic updates. fileciteturn46file0L2-L2

---

## Security model

This frontend uses a Supabase URL and **anon/public client key**. These values must never be treated as server-side secrets. Database access must therefore be protected by appropriate Supabase Row Level Security policies and least-privilege exposure.

Security expectations are documented in [`SECURITY.md`](./SECURITY.md).

### Never commit

```text
.env
.env.local
.env.*.local
service-role keys
server-side database credentials
admin passwords
API provider secrets
```

The repository's `.gitignore` already excludes local environment files and common build artifacts. fileciteturn45file0L2-L2

---

## Relationship to the other HackJudge repositories

| Component | Responsibility |
|---|---|
| **HACKJUDGE** | Core repository analysis, scoring, evaluation logic, and judging engine |
| **HACKJUDGE-PARTICIPANT-PORTAL** | Submission intake, participant experience, evaluation status/results, and organizer controls |
| **leaderboard-** | Public standings, ranking visualization, podium, freshness, and event countdown |

Together they form a single product architecture:

> **HackJudge evaluates. Participant Portal orchestrates. Leaderboard publishes the standings.**

That separation keeps judging logic, submission workflow, and public presentation independently maintainable while sharing a common data plane.

---

## Roadmap

Potential future evolution includes:

- server-authoritative rank snapshots
- signed/verified result feeds
- category-specific leaderboards
- score-history charts
- tie-break metadata
- search and filtering
- judge/audit views
- animated rank-change events
- accessibility hardening
- automated end-to-end tests
- observability for synchronization failures

---

## Contributing

Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before opening a pull request.

Respect the project's [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) and security process in [`SECURITY.md`](./SECURITY.md).

---

## License

Copyright © 2026 Divyank Bhardwaj.

Licensed under the **Apache License 2.0**. See [`LICENSE`](./LICENSE).

---

<div align="center">

**HACKJUDGE ECOSYSTEM**  
`evaluate → persist → rank → publish`

</div>
