/**
 * useListing — single listing + live reports + comments.
 */

import { db } from "../db/client";

export function useListing(listingId: string | null) {
  const { data, isLoading, error } = db.useQuery(
    listingId
      ? {
          listings: {
            $: { where: { id: listingId } },
            species: {},
            createdBy: {},
            reports: {
              $: { order: { createdAt: "desc" }, limit: 20 },
              author: {},
            },
            comments: {
              $: { order: { createdAt: "desc" }, limit: 50 },
              author: {},
            },
          },
        }
      : null,
  );
  const listing = (data?.listings?.[0] ?? null) as any | null;
  return { listing, isLoading, error };
}
