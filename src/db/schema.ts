/**
 * InstantDB schema — see handoff/instant.schema.ts in the design repo for docs.
 * Push to your Instant app with:  npm run schema:push
 */

import { i } from "@instantdb/react-native";

const _schema = i.schema({
  entities: {
    species: i.entity({
      commonName: i.string().indexed(),
      latinName: i.string().indexed(),
      kind: i.string(),
      seasonMonths: i.json(),
      description: i.string().optional(),
      photoUrl: i.string().optional(),
      gbifKey: i.number().optional(),
      isToxic: i.boolean().optional(),
      lookAlikes: i.json().optional(),
    }),

    listings: i.entity({
      lat: i.number().indexed(),
      lng: i.number().indexed(),
      geohash5: i.string().indexed(),
      geohash7: i.string().indexed(),

      title: i.string(),
      notes: i.string().optional(),
      accessFlags: i.json(),

      currentRipeness: i.number().indexed(),
      lastConfirmedAt: i.date().optional().indexed(),
      reportCount: i.number(),
      stillThereScore: i.number().optional(),

      // Data provenance — tracks which open data source contributed this pin.
      // "community" = user-submitted. All others are open dataset imports.
      // Values: "community" | "inat" | "osm" | "gbif" | "fallingfruit"
      //         | "sf_trees" | "nyc_trees" | "portland_trees"
      source: i.string().indexed().optional(),
      // Original ID from the upstream dataset (for dedup on re-sync)
      sourceId: i.string().indexed().optional(),
      // ISO timestamp of last upstream sync (null = never re-synced)
      sourceSyncedAt: i.date().optional(),

      status: i.string().indexed(),
      createdAt: i.date().indexed(),
    }),

    reports: i.entity({
      ripeness: i.number(),
      stillThere: i.boolean(),
      photoUrl: i.string().optional(),
      note: i.string().optional(),
      createdAt: i.date().indexed(),
    }),

    comments: i.entity({
      text: i.string(),
      createdAt: i.date().indexed(),
      isConfirm: i.boolean(),
    }),

    profiles: i.entity({
      handle: i.string().unique().indexed(),
      displayName: i.string(),
      avatarUrl: i.string().optional(),
      joinedAt: i.date(),
      pinsCount: i.number(),
      confirmsCount: i.number(),
      badges: i.json(),
      fuzzyLocation: i.boolean(),
      anonymizeReports: i.boolean(),
    }),

    saves: i.entity({
      savedAt: i.date(),
    }),

    flags: i.entity({
      reason: i.string(),
      note: i.string().optional(),
      createdAt: i.date(),
      resolved: i.boolean(),
    }),
  },

  links: {
    listingSpecies: {
      forward: { on: "listings", has: "one", label: "species" },
      reverse: { on: "species", has: "many", label: "listings" },
    },
    listingCreator: {
      forward: { on: "listings", has: "one", label: "createdBy" },
      reverse: { on: "profiles", has: "many", label: "createdListings" },
    },
    reportListing: {
      forward: { on: "reports", has: "one", label: "listing" },
      reverse: { on: "listings", has: "many", label: "reports" },
    },
    reportAuthor: {
      forward: { on: "reports", has: "one", label: "author" },
      reverse: { on: "profiles", has: "many", label: "reports" },
    },
    commentListing: {
      forward: { on: "comments", has: "one", label: "listing" },
      reverse: { on: "listings", has: "many", label: "comments" },
    },
    commentAuthor: {
      forward: { on: "comments", has: "one", label: "author" },
      reverse: { on: "profiles", has: "many", label: "comments" },
    },
    userSaves: {
      forward: { on: "saves", has: "one", label: "user" },
      reverse: { on: "profiles", has: "many", label: "saves" },
    },
    saveListing: {
      forward: { on: "saves", has: "one", label: "listing" },
      reverse: { on: "listings", has: "many", label: "saves" },
    },
    flagListing: {
      forward: { on: "flags", has: "one", label: "listing" },
      reverse: { on: "listings", has: "many", label: "flags" },
    },
    flagAuthor: {
      forward: { on: "flags", has: "one", label: "author" },
      reverse: { on: "profiles", has: "many", label: "flags" },
    },
  },

  rooms: {
    mapTile: {
      presence: i.entity({
        handle: i.string(),
        lat: i.number(),
        lng: i.number(),
      }),
    },
  },
});

type _AppSchema = typeof _schema;
export interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;
export default schema;
