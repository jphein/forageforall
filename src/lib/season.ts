/**
 * Season helpers — months as 1..12.
 */

export const MONTH_NAMES = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

export const MONTH_NAMES_LONG = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export function currentMonth(): number {
  return new Date().getMonth() + 1;
}

export function isInSeason(seasonMonths: number[] | undefined, month = currentMonth()): boolean {
  if (!seasonMonths?.length) return false;
  return seasonMonths.includes(month);
}

/** Human description of a species' season. */
export function describeSeason(months: number[] | undefined): string {
  if (!months?.length) return "Season unknown";
  const sorted = [...months].sort((a, b) => a - b);
  // detect contiguous run (incl. wraparound)
  const start = sorted[0];
  const end = sorted[sorted.length - 1];
  if (end - start + 1 === sorted.length) {
    return `${MONTH_NAMES[start - 1]}–${MONTH_NAMES[end - 1]}`;
  }
  return sorted.map((m) => MONTH_NAMES[m - 1]).join(", ");
}
