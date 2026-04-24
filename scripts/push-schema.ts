import { init } from "@instantdb/admin";
import "dotenv/config";
import schema from "../src/db/schema";

const db = init({
  appId: process.env.INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_TOKEN!,
  schema,
});

// Admin SDK auto-pushes schema on first use. Trigger a no-op query.
async function main() {
  try {
    await db.query({ listings: { $: { limit: 1 } } });
    console.log("Schema valid — InstantDB accepted it.");
  } catch (e) {
    console.error("Schema push failed:", e);
    process.exit(1);
  }
  process.exit(0);
}
main();
