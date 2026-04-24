/**
 * useListings — viewport-aware query with geohash prefix filtering.
 *
 * Usage:
 *   const { listings, isLoading } = useListings(region, { ripeNow: true });
 */

import { useMemo } from "react";
import { db } from "../db/client";
import { geohash5CellsForRegion } from "../lib/geo";

export type Region = {
  lat: number;
  lng: number;
  latDelta: number;
  lngDelta: number;
};

export type ListingFilter = {
  ripeNow?: boolean;
  kinds?: string[];
  inSeason?: number; // month 1..12
  sources?: string[]; // e.g. ["community", "inat", "osm"] — empty = show all
};

export function useListings(region: Region | null, filter: ListingFilter = {}) {
  const cells = useMemo(
    () => (region ? geohash5CellsForRegion(region) : []),
    [region?.lat, region?.lng, region?.latDelta, region?.lngDelta],
  );

  // Cap the query — huge zoom-outs should hit the cluster layer,
  // not pull 10k listings.
  const boundedCells = cells.slice(0, 64);

  const where: any = {
    status: "active",
  };
  if (boundedCells.length) where.geohash5 = { $in: boundedCells };
  if (filter.ripeNow) where.currentRipeness = { $gte: 3 };

  // We don't order server-side: lastConfirmedAt is sparsely populated on
  // open-data imports and InstantDB requires the field to be both indexed
  // and typed for server-side ordering. The map clusters pins visually,
  // so order has minimal visible impact; we sort client-side where it matters.
  const { data, isLoading, error } = db.useQuery(
    boundedCells.length
      ? {
          listings: {
            $: {
              where,
              limit: 500,
            },
            species: {},
            createdBy: {},
          },
        }
      : null,
  );

  const listings = (data?.listings ?? []) as any[];

  const filtered = useMemo(() => {
    let out = listings;
    if (filter.kinds?.length) {
      // Prefer the denormalized `kind` field on the listing; fall back to
      // the linked species' kind for community pins that predate the field.
      out = out.filter((l) => {
        const k = l.kind ?? l.species?.kind;
        return k && filter.kinds!.includes(k);
      });
    }
    if (filter.inSeason) {
      out = out.filter((l) =>
        Array.isArray(l.species?.seasonMonths)
          ? l.species.seasonMonths.includes(filter.inSeason)
          : false,
      );
    }
    if (filter.sources?.length) {
      out = out.filter((l) => {
        const src = l.source ?? "community";
        return filter.sources!.includes(src);
      });
    }
    return out;
  }, [listings, filter.kinds, filter.inSeason, filter.sources]);

  return { listings: filtered, isLoading, error };
}
