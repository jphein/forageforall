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

1. `app/(tabs)/index.tsx` mounts → `useMapViewport()` hook
2. Hook computes the geohash prefixes covering the visible rect
3. `db.useQuery({ listings: { $: { where: { geohashPrefix: { in: [...] } } } } })`
4. Results stream in realtime — tap a pin → `app/listing/[id].tsx`

## Why geohash, not real geo

InstantDB has no native geospatial index (yet). We fake one by:
- Storing a geohash string on each listing at write time
- Computing prefixes for the viewport at query time
- Querying `where geohashPrefix in [...]`

Precision levels are tuned to zoom breakpoints in `lib/geo.ts`. Don't rewrite this; it's not trivial.

## Ripeness math

`lib/ripeness.ts` combines:
- Species' seasonal window (from catalog)
- Recent user reports (weighted by recency — half-life 14 days)
- Geographic similarity (same city = higher weight)

Output: a 0–1 score → mapped to the 5-stage color ring.

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
| A new species | `scripts/seed-species.ts` |
| A new map style | `lib/maps.ts` |
| A new UI primitive | `components/` + `theme/` tokens |
| A new language | `i18n/<locale>.json` |
