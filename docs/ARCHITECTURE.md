# Architecture

A 5-minute mental model of the codebase.

## System shape

```
┌──────────────┐     realtime WS      ┌──────────────┐
│  Expo app    │ ◄──────────────────► │  InstantDB   │
│ (iOS/Android)│                      │  (hosted)    │
└──────┬───────┘                      └──────────────┘
       │
       │ tiles + geocoding
       ▼
┌──────────────┐
│ Google Maps  │
│  Platform    │
└──────────────┘
```

**No custom backend.** InstantDB handles auth, realtime sync, and permissions. This is deliberate — one fewer moving part, one fewer thing to run, one fewer person needed on-call.

## Data flow: dropping a pin

1. User taps **+** → `app/add/index.tsx`
2. Camera captures photo → uploaded to Instant's file storage
3. Species picked from catalog → local validation
4. Coords **fuzzed** (`lib/geo.ts::fuzz`) to ~110m grid
5. `db.transact([db.tx.listings[id].update({...})])` — single write
6. InstantDB pushes the new listing to every connected client with a matching viewport query
7. Map pin appears live on other users' devices within ~200ms

## Data flow: viewing the map

1. `app/(tabs)/index.tsx` mounts → tracks region in state, feeds it to `useListings(region, filter)`
2. Hook computes the geohash-5 cells covering the visible rect (`geohash5CellsForRegion` in `src/lib/geo.ts`)
3. `db.useQuery({ listings: { $: { where: { geohash5: { $in: [...] }, status: "active" } }, species: {}, createdBy: {} } })`
4. Results stream in realtime. Tap a pin → bottom preview card → tap card → `app/listing/[id].tsx`
5. Layers are client-side filters over the streamed results, keyed off `listing.source`

## Why geohash, not real geo

InstantDB has no native geospatial index (yet). We fake one by:
- Storing **two** geohash strings on each listing at write time — `geohash5` (~4.9 km cell) for coarse viewport queries, `geohash7` (~150 m cell) reserved for precise nearby searches
- Computing the covering set of geohash-5 cells for the viewport at query time (via `ngeohash.bboxes`)
- Querying `where geohash5 in [...]` — indexed, fast

Precision levels are tuned to zoom breakpoints in `src/lib/geo.ts`. Don't rewrite this; it's not trivial.

## Ripeness math

Two phases:

1. **At seed time** (`scripts/seed-listings.ts :: computeRipeness`): imports get an initial 0–4 ripeness based on circular distance between the current month and the species' `seasonMonths` window. `in season → 3`, `1 month before → 2`, `2 months before → 1`, `1 month after → 4`, else 0.
2. **At report time** (`src/lib/ripeness.ts :: computeCurrentRipeness`): once real user reports exist, a time-weighted average kicks in — half-life ~1.4 weeks — so a fresh "still ripe" report quickly dominates stale imports.

Output: 0 (unripe) → 4 (past), mapped to the 5-stage color ring in `palette.ripeness`.

## Privacy model

- **Default:** coords fuzzed to ~110m before write. Timestamps rounded to the day.
- **Opt-in:** precise coords (for your own pins only, visible only to you).
- **Opt-out:** mark a pin private → visible only to creator.
- **Moderator blocklist:** sensitive species (rare mushrooms, protected plants) hidden globally.

No analytics. No crash reporter that phones home. Sentry is allowed only self-hosted, and is off by default.

## Auth

Instant's email-magic-link auth. No passwords, no OAuth (yet — can add later if community wants it).

## Offline

Instant caches queries locally. Writes queue when offline and flush on reconnect. Map tiles cache via `react-native-maps` default behavior.

## Where to extend

| Want to add... | Touch... |
|---|---|
| A new screen | `app/` (Expo Router) |
| A new DB entity | `instant.schema.ts` + migration plan |
| A new species | `scripts/species-data.ts` (auto-imported by both seeds) |
| A new open-data source | `scripts/seed-listings.ts` (add fetcher) + `src/config/sourceLayers.ts` (add layer) |
| A new map style | `src/config/mapStyles.ts` |
| A new UI primitive | `src/components/` + `src/theme/` tokens |
| A new language | `i18n/<locale>.json` |
