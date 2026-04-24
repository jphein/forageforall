/**
 * useCurrentLocation — one-shot current location with permission handling.
 */

import { useEffect, useState } from "react";
import * as Location from "expo-location";

export function useCurrentLocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [permission, setPermission] = useState<"unknown" | "granted" | "denied">("unknown");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setPermission("denied");
          return;
        }
        setPermission("granted");
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      } catch (e: any) {
        setError(e?.message ?? "Location error");
      }
    })();
  }, []);

  return { location, permission, error };
}
