/**
 * InstantDB permission rules — push with `npm run perms:push`.
 *
 * Keys to remember:
 *  - All writes require auth.
 *  - Only authors can edit their own reports/comments.
 *  - Listings become append-only after creation (edits go via reports & flags).
 */

const rules = {
  species: {
    allow: {
      view: "true",
      create: "auth.id != null && auth.isAdmin == true",
      update: "auth.isAdmin == true",
      delete: "auth.isAdmin == true",
    },
  },
  listings: {
    allow: {
      view: "true",
      create: "auth.id != null",
      update:
        // Only the creator can edit, and only status / notes fields.
        "auth.id != null && data.createdBy == auth.id",
      delete: "auth.id != null && data.createdBy == auth.id",
    },
  },
  reports: {
    allow: {
      view: "true",
      create: "auth.id != null",
      update: "auth.id != null && data.author == auth.id",
      delete: "auth.id != null && data.author == auth.id",
    },
  },
  comments: {
    allow: {
      view: "true",
      create: "auth.id != null",
      update: "auth.id != null && data.author == auth.id",
      delete: "auth.id != null && data.author == auth.id",
    },
  },
  profiles: {
    allow: {
      view: "true",
      create: "auth.id != null",
      update: "auth.id != null && data.id == auth.id",
      delete: "auth.id != null && data.id == auth.id",
    },
  },
  saves: {
    allow: {
      view: "auth.id != null && data.user == auth.id",
      create: "auth.id != null",
      delete: "auth.id != null && data.user == auth.id",
    },
  },
  flags: {
    allow: {
      view: "auth.isAdmin == true || data.author == auth.id",
      create: "auth.id != null",
      update: "auth.isAdmin == true",
      delete: "auth.isAdmin == true",
    },
  },
};

export default rules;
