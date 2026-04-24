/**
 * InstantDB client singleton.
 * Set INSTANT_APP_ID in your .env — see https://instantdb.com/dash
 */

import { init } from "@instantdb/react-native";
import Constants from "expo-constants";
import schema from "./schema";

const appId =
  (Constants.expoConfig?.extra?.instantAppId as string | undefined) ??
  process.env.INSTANT_APP_ID;

if (!appId) {
  // Fatal but developer-friendly — the app will render a fallback screen.
  console.warn(
    "[forage] INSTANT_APP_ID is not set. Copy .env.example to .env and fill it in.",
  );
}

export const db = init({
  appId: appId ?? "MISSING_INSTANT_APP_ID",
  schema,
});

export { schema };
