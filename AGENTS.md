# Repository Guide for AI Agents

> If you are an AI coding agent (Claude Code, Cursor, Aider, Copilot Workspace, etc.), **read this file first.** It tells you what this project is, how it's organized, what conventions to follow, and — critically — **what not to do**.

---

## Project in one paragraph

Forage for All is an open-source React Native (Expo) app that maps fruit trees and edible plants on public land. Backend is InstantDB (realtime sync, no custom server). Maps are Google Maps via `react-native-maps` with a custom paper-textured style. License is AGPLv3 — this is deliberate and non-negotiable.

## You are working in

- **Language:** TypeScript (strict mode on)
- **Framework:** Expo SDK 51, React Native 0.74, React 18, Expo Router v3
- **State:** Zustand for local UI state; InstantDB `useQuery` for server state
- **Styling:** StyleSheet + design tokens in `theme/`. No Tailwind, no styled-components.
- **Package manager:** npm (lockfile is `package-lock.json`)
- **Node version:** pinned in `.nvmrc` (20.x)

## Where things live

```
app/                        Expo Router file-based screens — creating a file here creates a route
src/
  components/               Shared UI — Pin, RipenessRing, SeasonStrip, Chip, LayerSheet
  config/
    mapStyles.ts            Google Maps customMapStyle variants (Paper, Dark, Satellite)
    sourceLayers.ts         Registry of open-data sources + attribution
  db/
    schema.ts               InstantDB schema (re-exported via instant.schema.ts)
    client.ts               InstantDB client + hooks
  hooks/
    useListings.ts          Viewport-aware geohash query with layer filtering
    useSourceLayers.ts      Persisted (AsyncStorage) layer toggle state
  lib/
    geo.ts                  Geohash + viewport queries — do NOT reinvent this
    ripeness.ts             Time-weighted ripeness math — read the comment before editing
  theme/
    tokens.ts               Colors, type scale, spacing — SINGLE SOURCE OF TRUTH
scripts/
  seed-species.ts           Seed ~60 edible species into the catalog
  seed-listings.ts          Aggregate open-data pins from iNat/GBIF/OSM/city datasets
  sync-listings.ts          Refresh stale open-data listings per-source
instant.schema.ts           ← the DB shape. If you change this, run `npm run schema:push`.
instant.perms.ts            InstantDB permission rules — push with `npm run perms:push`
docs/                       GitHub Pages marketing site. Static HTML. No build step.
```

## Commands you can run

```bash
npm install            # always run after pulling
npm run ios            # start iOS sim
npm run android        # start Android emulator
npm run typecheck      # tsc --noEmit — run before committing
npm run lint           # eslint — run before committing
npm run schema:push    # push instant.schema.ts to InstantDB
npm run seed:species   # one-time seed of ~60 species
```

If `npm run typecheck` or `npm run lint` fails, **do not commit**. Fix it or surface it.

## Conventions — match these, don't invent new ones

- **Colors, fonts, spacing:** import from `theme/`. Never hardcode `#D97706` or `16` as magic numbers.
- **Components:** one per file, PascalCase filename matches export name.
- **Hooks:** `useThing.ts`, return an object (not a tuple), destructurable.
- **Styles:** colocated `const styles = StyleSheet.create(...)` at the bottom of each component file. Name the object after the component (`pinStyles`, not `styles`) to avoid collisions in bundled contexts.
- **Strings:** use the i18n helper `t('key')` — do not inline user-facing copy.
- **Dates:** always `Date` objects in memory, ISO strings in the DB. Never Unix timestamps.
- **Coordinates:** store as `{lat, lng}`, never `[lng, lat]` arrays. Geohash is the index, not the storage format.

## Things that WILL break if you touch them carelessly

1. **`lib/geo.ts`** — geohash prefix queries depend on precision levels tuned to our zoom breakpoints. Read the doc comment at the top of the file.
2. **`instant.schema.ts`** — changing a field type requires a migration, not just a push. Ask a maintainer.
3. **`lib/ripeness.ts`** — the half-life constant (14 days) was calibrated against test data. Changing it shifts every pin's color.
4. **Fuzzy location logic** — coords are rounded to ~110m before write. Removing this breaks our privacy promise. See `lib/geo.ts :: fuzz()`.
5. **Google Maps API keys** — live in `.env` only. Never commit. Native config injects them at build via `app.config.ts`.

## What we will NOT merge (hard rules)

Reject your own PR before a human has to:

- ❌ Ads, analytics, tracking SDKs (Sentry is allowed, opt-in, self-hosted only)
- ❌ Firebase, Amplitude, Segment, PostHog, Mixpanel, or anything that phones home
- ❌ Hardcoded secrets, even in tests
- ❌ Features that degrade privacy defaults (exact locations by default, required accounts, etc.)
- ❌ AI plant-ID that auto-confirms species — humans must pick from the catalog
- ❌ MIT/Apache re-licensing. **AGPLv3 is load-bearing.**
- ❌ Changes to `FORAGING_ETHICS.md` without community discussion

## How to add a feature

1. Open or link a GitHub issue first. One-line PRs from nowhere get rejected.
2. Branch `feat/short-name` from `main`.
3. If it touches the DB → update `instant.schema.ts` + add a migration note.
4. If it adds user-facing copy → add to `i18n/en.json` with a semantic key.
5. If it adds a screen → add a route in `app/` and link it from the relevant tab.
6. Run `npm run typecheck && npm run lint` — both must pass.
7. Write a PR description: **what, why, screenshots** (if UI).

## How to add a species to the catalog

Edit `scripts/seed-species.ts`. Required fields:

```ts
{
  id: 'prunus-domestica',            // kebab-case latin
  common: 'European Plum',
  latin: 'Prunus domestica',
  category: 'fruit',                  // fruit | berry | nut | green | herb | mushroom | flower
  emoji: '🍑',                         // fallback icon — designer will replace with SVG
  season: { start: 7, end: 9 },       // months 1-12
  toxicity: 'pit-cyanogenic',         // null | short code (see lib/toxicity.ts)
  lookalikes: ['prunus-cerasifera'],  // ids of similar species
  sources: ['gbif:3022126'],          // authoritative references
}
```

**You must cite a source.** Uncited species get reverted.

## Testing approach

We don't have deep test coverage yet (help wanted). What exists:
- `lib/*.test.ts` — unit tests for pure logic (ripeness, geo, fuzz)
- No E2E yet. Manual QA via `docs/QA_CHECKLIST.md`.

When adding pure logic to `lib/`, **add a test.** When adding UI, a test is nice-to-have.

## Your first task, if you're a fresh agent

1. Read this file (done).
2. Read [`README.md`](./README.md) and [`FORAGING_ETHICS.md`](./FORAGING_ETHICS.md).
3. Skim `instant.schema.ts`, `theme/index.ts`, `lib/ripeness.ts`.
4. Run `npm install && npm run typecheck`. If it passes, you're set up.
5. Pick an issue tagged `good first issue` or `agent-friendly`.

## When you're unsure

- Unsure about a UX decision → defer to the human, don't guess
- Unsure about a privacy tradeoff → **always pick the more private option**
- Unsure about a species' toxicity → **don't ship it**
- Unsure about licensing → AGPLv3, always
- Unsure about anything else → open a draft PR and ask in the description

---

*This file is the contract. If you change it, you're changing how every future agent thinks about this codebase — do it carefully.*
