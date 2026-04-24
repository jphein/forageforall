/**
 * Ripeness — model + helpers
 *
 * 0 unripe → 4 past. Current ripeness is denormalized onto the listing
 * from recent reports (see hooks/useUpdateRipeness).
 */

import { palette } from "../theme/tokens";

export type Ripeness = 0 | 1 | 2 | 3 | 4;

export const RIPENESS_LABELS: Record<Ripeness, string> = {
  0: "Unripe",
  1: "Forming",
  2: "Approaching",
  3: "Ripe now",
  4: "Past",
};

export const RIPENESS_SHORT: Record<Ripeness, string> = {
  0: "Unripe",
  1: "Forming",
  2: "Soon",
  3: "Ripe",
  4: "Past",
};

export function ripenessColor(r: Ripeness | number): string {
  const i = Math.max(0, Math.min(4, Math.round(r))) as Ripeness;
  return palette.ripeness[i];
}

/**
 * Combine recent reports into a single "current" ripeness.
 * Time-weighted: a fresh report counts much more than an old one.
 */
export function computeCurrentRipeness(
  reports: { ripeness: number; createdAt: number }[],
  now = Date.now(),
): Ripeness {
  if (!reports.length) return 0;
  const WEEK = 7 * 24 * 60 * 60 * 1000;
  let num = 0;
  let den = 0;
  for (const r of reports) {
    const ageWeeks = Math.max(0, (now - r.createdAt) / WEEK);
    const w = Math.exp(-ageWeeks / 2); // half-life ~1.4 weeks
    num += r.ripeness * w;
    den += w;
  }
  return Math.round(num / (den || 1)) as Ripeness;
}

/**
 * "Still there?" score — 1 = recently confirmed, 0 = stale or gone.
 */
export function stillThereScore(
  reports: { stillThere: boolean; createdAt: number }[],
  now = Date.now(),
): number {
  if (!reports.length) return 0;
  const WEEK = 7 * 24 * 60 * 60 * 1000;
  let num = 0;
  let den = 0;
  for (const r of reports) {
    const ageWeeks = Math.max(0, (now - r.createdAt) / WEEK);
    const w = Math.exp(-ageWeeks / 4);
    num += (r.stillThere ? 1 : 0) * w;
    den += w;
  }
  return num / (den || 1);
}
