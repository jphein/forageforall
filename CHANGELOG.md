# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] — 2026-04-24

First public preview. Everything you need to try the app and start dropping pins.

### App
- React Native + Expo SDK 51 scaffold with file-based routing (Expo Router v3)
- Core screens: Map (clustered), Listing detail, Add flow, Browse, Calendar, Profile, About, Onboarding
- Google Maps integration with a custom paper-textured style (and a dark variant)
- Privacy-first: coordinates fuzzed to ~110m on community pins
- Ripeness ring math (14-day half-life) blends species seasonality with community confirmations

### Data
- InstantDB realtime backend, no custom server
- `source`-tagged listings render as toggleable map layers with per-source pin colors
- Open-data aggregator `npm run seed:listings` pulls from iNaturalist, GBIF, OpenStreetMap, Falling Fruit, and SF/NYC/Portland street-tree inventories
- Weekly GitHub Action re-syncs stale open-data pins
- Seed catalog of ~85 edibles — worldwide staples plus Sierra Nevada + California natives (manzanita, toyon, oaks, elderberry, bay laurel, pine nuts)
- Nevada County, CA seeded with 3,198 iNaturalist + GBIF pins on first run

### Builds
- EAS preview profile producing installable Android APK + iOS simulator bundle
- Release pipeline (GitHub Actions) attaches APK + iOS bundle to every tag
- Weekly `sync-data.yml` refresh workflow

### Meta
- AGPLv3 — non-negotiable, protects the community data from closed forks
- Agent-friendly docs (AGENTS.md, CLAUDE.md, `.cursorrules`, `copilot-instructions.md`)
- GitHub Pages marketing site with generated OG image
- Foraging ethics, privacy policy, security policy, code of conduct, governance
- Issue + PR templates, `llms.txt`
