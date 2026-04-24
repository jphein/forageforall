# infra/

Optional self-hosted infrastructure for teams who want it.

**Nothing in this folder is required to run the app.** The default stack (InstantDB + Google Maps + Expo) is all hosted services with free tiers. This folder is for operators who want more control, more privacy, or to run the app fully under their own roof.

## What's here

### `sentry/` — self-hosted error monitoring

A `docker-compose.yml` for running [Sentry](https://sentry.io/welcome/) on your own server. Wire it into the app via an opt-in Settings toggle (off by default).

**Why self-host:** our privacy promise forbids sending error data to third parties. If you want crash visibility, you host it.

### `nominatim/` — optional self-hosted geocoding

For operators who want to avoid Google's Places API. Runs [Nominatim](https://nominatim.org) on OpenStreetMap data. Slower but fully private.

### `instant-selfhost/` — placeholder

InstantDB doesn't yet support self-hosting. When they do, setup notes go here.

---

## When to use this

- You're running a regional fork (e.g. `forage-for-all-berlin`) and want data sovereignty
- You're doing a privacy audit and need to remove all third-party dependencies
- Legal obligations (GDPR, etc.) require data to stay in-jurisdiction

## When not to

- You're just trying out the app
- You don't have ops experience — the hosted defaults work fine
- Your community is small enough that the free tiers cover it

---

*These configs are community-maintained. Tested against the versions in each subfolder's README.*
