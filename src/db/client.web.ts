/**
 * Web-specific InstantDB client — uses @instantdb/react instead of
 * @instantdb/react-native. Metro resolves .web.ts before .ts on web.
 */

import { init } from "@instantdb/react";
import schema from "./schema";

const appId =
  (typeof process !== "undefined" && process.env.INSTANT_APP_ID) ??
  "32870e24-647d-452a-ab13-fdaa0a8d8564";

export const db = init({ appId, schema } as any);
export { schema };
