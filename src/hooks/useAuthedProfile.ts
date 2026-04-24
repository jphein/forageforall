/**
 * useAuthedProfile — the signed-in user's Instant profile, auto-created on first use.
 * Uses InstantDB's magic-code auth under the hood (see screens/auth.tsx).
 */

import { useEffect } from "react";
import { db } from "../db/client";
import { id as newId } from "@instantdb/react-native";

export function useAuthedProfile() {
  const { user } = db.useAuth();
  const { data } = db.useQuery(
    user ? { profiles: { $: { where: { id: user.id } } } } : null,
  );
  const profile = (data?.profiles?.[0] ?? null) as any | null;

  // Auto-create a profile on first sign-in.
  useEffect(() => {
    if (user && !profile) {
      db.transact(
        db.tx.profiles[user.id].update({
          handle: user.email?.split("@")[0] ?? `forager-${user.id.slice(0, 6)}`,
          displayName: user.email?.split("@")[0] ?? "New forager",
          joinedAt: Date.now(),
          pinsCount: 0,
          confirmsCount: 0,
          badges: [],
          fuzzyLocation: true,
          anonymizeReports: false,
        }),
      );
    }
  }, [user?.id, profile?.id]);

  return { user, profile };
}

export { newId };
