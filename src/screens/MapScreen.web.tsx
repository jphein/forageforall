/**
 * Map screen — web version. Uses @react-google-maps/api in place of
 * react-native-maps (which has no web support).
 */

import React, { useMemo, useState, useCallback, useRef } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { GoogleMap, useJsApiLoader, Marker as GMarker, InfoWindow } from "@react-google-maps/api";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "../components/Text";
import { Chip } from "../components/Chip";
import { ListingCard } from "../components/ListingCard";
import { LayerSheet } from "../components/LayerSheet";
import { useListings, Region } from "../hooks/useListings";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import { useSourceLayers } from "../hooks/useSourceLayers";
import { MAP_STYLES, MapStyleKey } from "../config/mapStyles";
import { colors, palette, radius, shadow, spacing } from "../theme/tokens";
import { distanceMeters } from "../lib/geo";

const MAPS_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_WEB_KEY ?? "";

const DEFAULT_CENTER = { lat: 37.7749, lng: -122.4194 };

const KIND_FILTERS = [
  { key: "apple",    label: "Apples" },
  { key: "pear",     label: "Pears" },
  { key: "citrus",   label: "Citrus" },
  { key: "berry",    label: "Berries" },
  { key: "stone",    label: "Stone fruit" },
  { key: "grape",    label: "Grapes" },
  { key: "fig",      label: "Figs" },
  { key: "nut",      label: "Nuts" },
  { key: "herb",     label: "Herbs" },
  { key: "veg",      label: "Veg" },
  { key: "flower",   label: "Flowers" },
  { key: "mushroom", label: "Mushrooms" },
];

const KIND_GLYPH: Record<string, string> = {
  apple: "🍎", pear: "🍐", citrus: "🍊", berry: "🫐", stone: "🍑",
  nut: "🌰", fig: "🫒", grape: "🍇", herb: "🌿", veg: "🥬",
  flower: "🌼", mushroom: "🍄",
};

export default function MapScreen() {
  const router = useRouter();
  const { location } = useCurrentLocation();
  const [region, setRegion] = useState<Region>({
    lat: DEFAULT_CENTER.lat,
    lng: DEFAULT_CENTER.lng,
    latDelta: 0.05,
    lngDelta: 0.05,
  });
  const [ripeNow, setRipeNow] = useState(true);
  const [activeKinds, setActiveKinds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [layersOpen, setLayersOpen] = useState(false);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const [mapStyle, setMapStyle] = useState<MapStyleKey>("paper");
  const sourceLayers = useSourceLayers();

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: MAPS_KEY });

  // Stable initial camera target. @react-google-maps/api re-applies
  // `center`/`zoom` whenever those props change, so we must pass
  // references that never change — otherwise every viewport update
  // (via onIdle -> setRegion -> re-render) would snap the map back to
  // the previous center and the user couldn't pan or zoom.
  const initialCenter = useRef({
    lat: DEFAULT_CENTER.lat,
    lng: DEFAULT_CENTER.lng,
  });
  const hasCenteredOnUser = useRef(false);

  // Center on user location once it arrives — imperative so we don't
  // fight the user's gestures through controlled props.
  React.useEffect(() => {
    if (location && mapRef && !hasCenteredOnUser.current) {
      mapRef.panTo({ lat: location.lat, lng: location.lng });
      hasCenteredOnUser.current = true;
    }
  }, [location?.lat, location?.lng, mapRef]);

  const { listings } = useListings(region, {
    ripeNow,
    kinds: activeKinds.length ? activeKinds : undefined,
    sources: sourceLayers.hydrated ? sourceLayers.enabled : undefined,
  });

  const selected = useMemo(
    () => listings.find((l: any) => l.id === selectedId) ?? null,
    [listings, selectedId],
  );

  // onIdle fires once the map settles after a pan/zoom — mirrors
  // MapView's onRegionChangeComplete and avoids the per-frame churn of
  // onBoundsChanged.
  const onIdle = useCallback(() => {
    if (!mapRef) return;
    const c = mapRef.getCenter();
    const b = mapRef.getBounds();
    if (!c || !b) return;
    const ne = b.getNorthEast();
    const sw = b.getSouthWest();
    setRegion({
      lat: c.lat(),
      lng: c.lng(),
      latDelta: Math.abs(ne.lat() - sw.lat()),
      lngDelta: Math.abs(ne.lng() - sw.lng()),
    });
  }, [mapRef]);

  const toggleKind = (k: string) =>
    setActiveKinds((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  // Options: stable across renders unless mapStyle changes, so the
  // library doesn't re-apply settings on every listings update.
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      zoomControl: true,
      clickableIcons: false,
      gestureHandling: "greedy",
      styles: MAP_STYLES[mapStyle] ?? undefined,
      mapTypeId: mapStyle === "satellite" ? "hybrid" : "roadmap",
    }),
    [mapStyle],
  );

  const recenterOnUser = useCallback(() => {
    if (!mapRef || !location) return;
    mapRef.panTo({ lat: location.lat, lng: location.lng });
    if ((mapRef.getZoom() ?? 0) < 14) mapRef.setZoom(15);
  }, [mapRef, location?.lat, location?.lng]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <Text variant="body" muted>Loading map…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1 }}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={initialCenter.current}
          zoom={13}
          onLoad={setMapRef}
          onIdle={onIdle}
          options={mapOptions}
        >
          {listings.map((l: any) => {
            const glyph = KIND_GLYPH[l.kind ?? l.species?.kind ?? "herb"] ?? "🌱";
            return (
              <GMarker
                key={l.id}
                position={{ lat: l.lat, lng: l.lng }}
                onClick={() => setSelectedId(l.id === selectedId ? null : l.id)}
                label={{ text: glyph, fontSize: "18px", fontFamily: "serif" }}
              />
            );
          })}
          {selected ? (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => setSelectedId(null)}
            >
              <View style={{ maxWidth: 260 }}>
                <Text variant="title" style={{ fontSize: 15 }}>
                  {selected.title ?? selected.species?.commonName ?? "Find"}
                </Text>
                <Text variant="caption" muted style={{ marginTop: 2 }}>
                  {selected.species?.latinName}
                </Text>
                <Pressable
                  onPress={() => router.push(`/listing/${selected.id}`)}
                  style={{ marginTop: 8 }}
                >
                  <Text style={{ color: palette.moss, fontWeight: "600", fontSize: 13 }}>
                    View details →
                  </Text>
                </Pressable>
              </View>
            </InfoWindow>
          ) : null}
        </GoogleMap>
      </View>

      {/* Top filter bar */}
      <SafeAreaView edges={["top"]} style={styles.topWrap} pointerEvents="box-none">
        <View style={styles.searchBar}>
          <Pressable onPress={() => setLayersOpen(true)} hitSlop={10} style={{ marginRight: spacing.sm }}>
            <Ionicons name="layers-outline" size={20} color={palette.bark} />
          </Pressable>
          <Text variant="body" muted style={{ flex: 1 }}>
            {listings.length} finds in view
          </Text>
          <MapStyleToggle value={mapStyle} onChange={setMapStyle} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          style={styles.chipScroller}
        >
          <Chip label="Ripe now" active={ripeNow} onPress={() => setRipeNow((v) => !v)} tone="terra" />
          {KIND_FILTERS.map((k) => (
            <Chip
              key={k.key}
              label={k.label}
              active={activeKinds.includes(k.key)}
              onPress={() => toggleKind(k.key)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Locate-me button */}
      {location ? (
        <Pressable
          onPress={recenterOnUser}
          style={[styles.locate, shadow.floating]}
          accessibilityLabel="Center map on my location"
        >
          <Ionicons name="locate" size={20} color={palette.bark} />
        </Pressable>
      ) : null}

      {/* Add FAB — "Add a find" reads better than a bare plus on web
          where there's room for a label. */}
      <Pressable
        onPress={() => router.push("/add")}
        style={[styles.fab, shadow.floating]}
        accessibilityLabel="Add a find"
      >
        <Ionicons name="add" size={22} color={palette.cream} />
        <Text style={styles.fabLabel}>Add a find</Text>
      </Pressable>

      {/* Bottom preview card */}
      {selected ? (
        <SafeAreaView edges={["bottom"]} style={styles.sheet} pointerEvents="box-none">
          <View style={styles.sheetInner}>
            <ListingCard
              listing={selected}
              distance={
                location
                  ? distanceMeters(location, { lat: selected.lat, lng: selected.lng })
                  : undefined
              }
              onPress={() => router.push(`/listing/${selected.id}`)}
            />
            <Pressable
              onPress={() => setSelectedId(null)}
              hitSlop={12}
              style={styles.sheetClose}
            >
              <Ionicons name="close" size={18} color={palette.inkSoft} />
            </Pressable>
          </View>
        </SafeAreaView>
      ) : null}

      <LayerSheet
        visible={layersOpen}
        enabled={sourceLayers.enabled}
        onToggle={sourceLayers.toggle}
        onEnableAll={sourceLayers.enableAll}
        onResetDefaults={sourceLayers.resetDefaults}
        onClose={() => setLayersOpen(false)}
      />
    </View>
  );
}

function MapStyleToggle({
  value,
  onChange,
}: {
  value: MapStyleKey;
  onChange: (v: MapStyleKey) => void;
}) {
  const next: Record<MapStyleKey, MapStyleKey> = {
    paper: "dark",
    dark: "satellite",
    satellite: "paper",
  };
  const icon =
    value === "paper"
      ? "map-outline"
      : value === "dark"
      ? "moon-outline"
      : "earth-outline";
  return (
    <Pressable
      onPress={() => onChange(next[value])}
      hitSlop={10}
      accessibilityLabel={`Switch map style (currently ${value})`}
    >
      <Ionicons name={icon as any} size={20} color={palette.bark} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    pointerEvents: "box-none",
  } as any,
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgElevated,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderColor: colors.line,
    borderWidth: 1,
    ...shadow.card,
  },
  chipScroller: { flexGrow: 0, flexShrink: 0 },
  chips: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: spacing.lg,
    flexDirection: "row",
    height: 48,
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    backgroundColor: palette.moss,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  fabLabel: {
    color: palette.cream,
    fontWeight: "600",
    fontSize: 14,
  },
  locate: {
    position: "absolute",
    bottom: 168,
    right: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.bgElevated,
    borderColor: colors.line,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: "box-none",
  } as any,
  sheetInner: {
    margin: spacing.md,
    marginBottom: spacing.lg,
  },
  sheetClose: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.bgElevated,
    alignItems: "center",
    justifyContent: "center",
  },
});
