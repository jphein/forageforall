/**
 * useSourceLayers — persisted toggle state for which data layers to show.
 *
 * Stored in AsyncStorage so toggles survive app restarts.
 * Defaults come from sourceLayers.ts (defaultOff flag).
 */

import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SOURCE_LAYERS, SourceKey, getDefaultEnabledSources } from "../config/sourceLayers";

const STORAGE_KEY = "forage.sourceLayers.v1";

export function useSourceLayers() {
  const [enabled, setEnabled] = useState<SourceKey[]>(getDefaultEnabledSources());
  const [hydrated, setHydrated] = useState(false);

  // Load persisted toggles on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as SourceKey[];
            const validKeys = new Set(SOURCE_LAYERS.map((l) => l.key));
            setEnabled(parsed.filter((k) => validKeys.has(k)));
          } catch {
            // invalid JSON — fall back to defaults
          }
        }
      })
      .finally(() => setHydrated(true));
  }, []);

  const persist = useCallback((next: SourceKey[]) => {
    setEnabled(next);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const toggle = useCallback(
    (key: SourceKey) => {
      persist(enabled.includes(key) ? enabled.filter((k) => k !== key) : [...enabled, key]);
    },
    [enabled, persist],
  );

  const setOnly = useCallback((key: SourceKey) => persist([key]), [persist]);
  const enableAll = useCallback(
    () => persist(SOURCE_LAYERS.map((l) => l.key)),
    [persist],
  );
  const resetDefaults = useCallback(
    () => persist(getDefaultEnabledSources()),
    [persist],
  );

  return { enabled, hydrated, toggle, setOnly, enableAll, resetDefaults };
}
