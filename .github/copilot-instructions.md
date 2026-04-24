# .github/copilot-instructions.md — GitHub Copilot / Copilot Workspace

Read `AGENTS.md` at the repo root for the full agent guide. This file is a condensed pointer.

This is **Forage for All**, an open-source Expo + TypeScript + InstantDB app that maps edible plants on public land.

## Non-negotiable rules

- **License:** AGPLv3. Don't change it. Don't merge code incompatible with it.
- **No trackers, ads, analytics, or SDKs that phone home.**
- **Privacy defaults:** locations fuzzed to ~110m before write. Don't remove this.
- **Design tokens** live in `theme/`. Import them. Don't hardcode `#D97706`.
- **TypeScript strict mode.** Don't weaken `tsconfig.json`.
- **`npm run typecheck && npm run lint` must pass.**

## Stack

Expo SDK 51 · React Native 0.74 · Expo Router · TypeScript · InstantDB · Google Maps · Zustand.

## Key files

- `AGENTS.md` — full guide, read first
- `instant.schema.ts` — DB shape
- `theme/` — design tokens
- `lib/geo.ts` — geohash viewport queries (don't rewrite)
- `lib/ripeness.ts` — ripeness math (don't tune constants)
- `docs/ARCHITECTURE.md` — 5-min mental model

## Conventions

- PascalCase filenames for components
- One component per file
- `useThing.ts` hooks return objects, not tuples
- Coords as `{lat, lng}`, dates as `Date` in memory / ISO in DB
- User copy via `t('key')`, never inline
