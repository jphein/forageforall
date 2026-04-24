# CLAUDE.md

This file is loaded automatically by Claude Code at the start of every session in this repo.

**Read [`AGENTS.md`](./AGENTS.md) first — it's the full guide.** This file is a short pointer with Claude-specific notes.

## TL;DR for Claude

- Stack: Expo + TypeScript + InstantDB + Google Maps. License: **AGPLv3 (non-negotiable)**.
- Design tokens live in `theme/`. Import them; don't hardcode colors or spacing.
- DB schema is `instant.schema.ts`. Run `npm run schema:push` after changing it.
- `npm run typecheck && npm run lint` must pass before any commit.
- Never commit secrets, add analytics, or weaken privacy defaults.

## Claude-specific tips

- **Use the Read tool on `AGENTS.md` before writing any code.** It lists the hard rules.
- When planning multi-file changes, draft the plan in a response before invoking edits — the user can course-correct cheaper that way.
- Prefer `str_replace` / edit tools over rewriting whole files. The diff is easier to review.
- Don't run `expo prebuild` unless the user asks — it regenerates `ios/` and `android/` and creates large diffs.
- For UI work, screenshot the sim before and after so the user can compare.

## Things that have bitten previous sessions

1. Hardcoding `#D97706` instead of `tokens.color.terra` — gets caught in review every time.
2. Adding `@react-native-firebase` for "just push notifications" — we don't use Firebase, use Expo Notifications.
3. Writing new geohash logic instead of reading `lib/geo.ts` — the existing code is tuned, don't duplicate.
4. Relaxing `tsconfig.json` strict flags to ship a PR — don't. Fix the types.

## When the user says "ship it"

1. Typecheck + lint must pass.
2. Commit message: conventional commits (`feat:`, `fix:`, `docs:`, `chore:`).
3. Don't force-push to `main` ever. Branches only.
4. Tag the maintainer in the PR description.

---

*Everything else is in [`AGENTS.md`](./AGENTS.md).*
