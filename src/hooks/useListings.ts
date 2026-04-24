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

  const { data, isLoading, error } = db.useQuery(
    boundedCells.length
      ? {
          listings: {
            $: {
              where,
              order: { lastConfirmedAt: "desc" },
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
      out = out.filter((l) => l.species && filter.kinds!.includes(l.species.kind));
    }
    if (filter.inSeason) {
      out = out.filter((l) =>
        Array.isArray(l.species?.seasonMonths)
          ? l.species.seasonMonths.includes(filter.inSeason)
          : false,
      );
    }
    return out;
  }, [listings, filter.kinds, filter.inSeason]);

  return { listings: filtered, isLoading, error };
}
