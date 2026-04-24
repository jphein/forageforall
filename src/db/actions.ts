/**
 * Actions — thin wrappers around db.transact that keep denormalized fields
 * on listings consistent with the latest reports.
 */

import { id as newId } from "@instantdb/react-native";
import { db } from "../db/client";
import { toGeohash5, toGeohash7, fuzzCoord } from "../lib/geo";
import { Ripeness } from "../lib/ripeness";

export type NewListingInput = {
  lat: number;
  lng: number;
  speciesId: string;
  title: string;
  notes?: string;
  accessFlags: {
    public: boolean;
    permission: boolean;
    pesticide: boolean;
    gloves: boolean;
  };
  initialRipeness: Ripeness;
  fuzzy?: boolean;
  userId: string;
};

export async function createListing(input: NewListingInput) {
  const listingId = newId();
  const reportId = newId();
  const now = Date.now();

  const lat = input.fuzzy ? fuzzCoord(input.lat) : input.lat;
  const lng = input.fuzzy ? fuzzCoord(input.lng) : input.lng;

  await db.transact([
    db.tx.listings[listingId]
      .update({
        lat,
        lng,
        geohash5: toGeohash5(lat, lng),
        geohash7: toGeohash7(lat, lng),
        title: input.title,
        notes: input.notes,
        accessFlags: input.accessFlags,
        currentRipeness: input.initialRipeness,
        lastConfirmedAt: now,
        reportCount: 1,
        stillThereScore: 1,
        status: "active",
        createdAt: now,
      })
      .link({ species: input.speciesId, createdBy: input.userId }),

    db.tx.reports[reportId]
      .update({
        ripeness: input.initialRipeness,
        stillThere: true,
        createdAt: now,
      })
      .link({ listing: listingId, author: input.userId }),
  ]);

  return { listingId };
}

export async function submitReport(opts: {
  listingId: string;
  userId: string;
  ripeness: Ripeness;
  stillThere: boolean;
  note?: string;
  photoUrl?: string;
  // New computed values from the client (keeps write paths simple)
  nextCurrentRipeness: Ripeness;
  nextReportCount: number;
  nextStillThereScore: number;
}) {
  const reportId = newId();
  const now = Date.now();
  await db.transact([
    db.tx.reports[reportId]
      .update({
        ripeness: opts.ripeness,
        stillThere: opts.stillThere,
        note: opts.note,
        photoUrl: opts.photoUrl,
        createdAt: now,
      })
      .link({ listing: opts.listingId, author: opts.userId }),

    db.tx.listings[opts.listingId].update({
      currentRipeness: opts.nextCurrentRipeness,
      reportCount: opts.nextReportCount,
      stillThereScore: opts.nextStillThereScore,
      lastConfirmedAt: now,
    }),
  ]);
}

export async function addComment(opts: {
  listingId: string;
  userId: string;
  text: string;
  isConfirm?: boolean;
}) {
  await db.transact(
    db.tx.comments[newId()]
      .update({
        text: opts.text,
        createdAt: Date.now(),
        isConfirm: !!opts.isConfirm,
      })
      .link({ listing: opts.listingId, author: opts.userId }),
  );
}

export async function toggleSave(opts: {
  listingId: string;
  userId: string;
  existingSaveId: string | null;
}) {
  if (opts.existingSaveId) {
    await db.transact(db.tx.saves[opts.existingSaveId].delete());
  } else {
    await db.transact(
      db.tx.saves[newId()]
        .update({ savedAt: Date.now() })
        .link({ user: opts.userId, listing: opts.listingId }),
    );
  }
}

export async function flagListing(opts: {
  listingId: string;
  userId: string;
  reason: string;
  note?: string;
}) {
  await db.transact(
    db.tx.flags[newId()]
      .update({
        reason: opts.reason,
        note: opts.note,
        createdAt: Date.now(),
        resolved: false,
      })
      .link({ listing: opts.listingId, author: opts.userId }),
  );
}
