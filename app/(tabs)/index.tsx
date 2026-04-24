/**
 * Map screen — primary view. Clustered Google Map with custom-styled tiles,
 * filter chips, ripeness legend, bottom-sheet pin preview.
 */

import React, { useMemo, useRef, useState } from "react";
import { StyleSheet, View, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker, PROVIDER_GOOGLE, Region as RNRegion } from "react-native-maps";
import ClusteredMapView from "react-native-map-clustering";

import { Text } from "../../src/components/Text";
import { Chip } from "../../src/components/Chip";
import { MapPin } from "../../src/components/MapPin";
import { ListingCard } from "../../src/components/ListingCard";
import { LayerSheet } from "../../src/components/LayerSheet";
import { useListings, Region } from "../../src/hooks/useListings";
import { useCurrentLocation } from "../../src/hooks/useCurrentLocation";
import { useSourceLayers } from "../../src/hooks/useSourceLayers";
import { MAP_STYLES, MapStyleKey } from "../../src/config/mapStyles";
import { getSourceColor } from "../../src/config/sourceLayers";
import { colors, palette, radius, shadow, spacing } from "../../src/theme/tokens";
import { distanceMeters } from "../../src/lib/geo";

const DEFAULT_REGION: Region = {
  lat: 37.7749,
  lng: -122.4194,
  latDelta: 0.05,
  lngDelta: 0.05,
};

const KIND_FILTERS: { key: string; label: string }[] = [
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

export default function MapScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const { location } = useCurrentLocation();
  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [mapStyle, setMapStyle] = useState<MapStyleKey>("paper");
  const [ripeNow, setRipeNow] = useState(true);
  const [activeKinds, setActiveKinds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [layersOpen, setLayersOpen] = useState(false);
  const sourceLayers = useSourceLayers();

  // Center on user's location once we have it
  React.useEffect(() => {
    if (location && mapRef.current) {
      const r = { ...DEFAULT_REGION, lat: location.lat, lng: location.lng };
      setRegion(r);
      mapRef.current.animateToRegion({
        latitude: r.lat,
        longitude: r.lng,
        latitudeDelta: r.latDelta,
        longitudeDelta: r.lngDelta,
      });
    }
  }, [location?.lat, location?.lng]);

  const { listings } = useListings(region, {
    ripeNow,
    kinds: activeKinds.length ? activeKinds : undefined,
    sources: sourceLayers.hydrated ? sourceLayers.enabled : undefined,
  });

  const selected = useMemo(
    () => listings.find((l: any) => l.id === selectedId) ?? null,
    [listings, selectedId],
  );

  const onRegionChange = (r: RNRegion) =>
    setRegion({
      lat: r.latitude,
      lng: r.longitude,
      latDelta: r.latitudeDelta,
      lngDelta: r.longitudeDelta,
    });

  const toggleKind = (k: string) =>
    setActiveKinds((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ClusteredMapView
        ref={mapRef as any}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        mapType={mapStyle === "satellite" ? "hybrid" : "standard"}
        customMapStyle={MAP_STYLES[mapStyle] ?? []}
        initialRegion={{
          latitude: DEFAULT_REGION.lat,
          longitude: DEFAULT_REGION.lng,
          latitudeDelta: DEFAULT_REGION.latDelta,
          longitudeDelta: DEFAULT_REGION.lngDelta,
        }}
        onRegionChangeComplete={onRegionChange}
        showsUserLocation
        showsMyLocationButton={false}
        clusterColor={palette.moss}
        clusterTextColor={palette.cream}
        renderCluster={(cluster: any) => {
          // Cluster color = average ripeness of the pins *near* this cluster's
          // centroid (approximated from the current viewport's listings).
          // Gives zoomed-out views a useful "what's ripe around here" gradient.
          const { id, geometry, onPress, properties } = cluster;
          const points = properties?.point_count ?? 0;
          const [lng, lat] = geometry.coordinates;

          // Find the N closest listings to the cluster centroid and average.
          const ranked = listings
            .map((l: any) => {
              const dy = l.lat - lat;
              const dx = l.lng - lng;
              return { l, d2: dy * dy + dx * dx };
            })
            .sort((a, b) => a.d2 - b.d2)
            .slice(0, Math.max(1, points));

          const sum = ranked.reduce((s: number, x) => s + (x.l.currentRipeness ?? 0), 0);
          const avg = sum / ranked.length;
          const bucket = Math.max(0, Math.min(4, Math.round(avg))) as 0 | 1 | 2 | 3 | 4;
          const color = palette.ripeness[bucket];

          return (
            <Marker
              key={`cluster-${id}-${bucket}`}
              coordinate={{ latitude: lat, longitude: lng }}
              onPress={onPress}
              tracksViewChanges={false}
            >
              <View style={[styles.clusterBubble, { backgroundColor: color }]}>
                <Text style={styles.clusterLabel}>{points}</Text>
              </View>
            </Marker>
          );
        }}
      >
        {listings.map((l: any) => (
          <Marker
            // Key includes rounded ripeness so React remounts the marker when
            // ripeness changes (react-native-maps otherwise caches view).
            key={`${l.id}-${Math.round(l.currentRipeness ?? 0)}`}
            coordinate={{ latitude: l.lat, longitude: l.lng }}
            onPress={() => setSelectedId(l.id)}
            tracksViewChanges={false}
            anchor={{ x: 0.5, y: 1 }}
          >
            <MapPin
              kind={l.kind ?? l.species?.kind ?? "herb"}
              ripeness={l.currentRipeness ?? 0}
              selected={selectedId === l.id}
              sourceColor={getSourceColor(l.source)}
            />
          </Marker>
        ))}
      </ClusteredMapView>

      {/* Top filter bar */}
      <SafeAreaView edges={["top"]} style={styles.topWrap} pointerEvents="box-none">
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={palette.inkMuted} />
          <Text variant="body" muted style={{ marginLeft: 8, flex: 1 }}>
            Search species or places…
          </Text>
          <Pressable onPress={() => setLayersOpen(true)} hitSlop={10} style={{ marginRight: spacing.sm }}>
            <Ionicons name="layers-outline" size={20} color={palette.bark} />
          </Pressable>
          <MapStyleToggle value={mapStyle} onChange={setMapStyle} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
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

      {/* Floating add button */}
      <Pressable
        onPress={() => router.push("/add")}
        style={[styles.fab, shadow.floating]}
      >
        <Ionicons name="add" size={30} color={palette.cream} />
      </Pressable>

      {/* Bottom sheet preview */}
      {selected ? (
        <SafeAreaView edges={["bottom"]} style={styles.sheet} pointerEvents="box-none">
          <View style={styles.sheetInner}>
            <Pressable
              onPress={() => router.push(`/listing/${selected.id}`)}
              style={{ flex: 1 }}
            >
              <ListingCard
                listing={selected}
                distance={
                  location
                    ? distanceMeters(location, { lat: selected.lat, lng: selected.lng })
                    : undefined
                }
              />
            </Pressable>
            <Pressable
              onPress={() => setSelectedId(null)}
              hitSlop={12}
              style={styles.sheetClose}
              accessibilityLabel="Close pin preview"
            >
              <Ionicons name="close" size={18} color={palette.inkSoft} />
            </Pressable>
          </View>
        </SafeAreaView>
      ) : null}

      {/* Legend hides when a pin is selected so the detail card has room. */}
      {selected ? null : <LegendBar />}

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

function MapStyleToggle({ value, onChange }: { value: MapStyleKey; onChange: (v: MapStyleKey) => void }) {
  const next: Record<MapStyleKey, MapStyleKey> = { paper: "dark", dark: "satellite", satellite: "paper" };
  const icon = value === "paper" ? "map-outline" : value === "dark" ? "moon-outline" : "earth-outline";
  return (
    <Pressable onPress={() => onChange(next[value])} hitSlop={10}>
      <Ionicons name={icon as any} size={20} color={palette.bark} />
    </Pressable>
  );
}

function LegendBar() {
  const labels = ["Unripe", "Forming", "Soon", "Ripe", "Past"];
  return (
    <View style={[styles.legend, shadow.card]}>
      {palette.ripeness.map((c, i) => (
        <View key={i} style={{ alignItems: "center" }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: c, marginBottom: 2 }} />
          <Text variant="caption" muted>{labels[i]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  topWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgElevated,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    ...shadow.card,
  },
  chips: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingRight: spacing.md,
  },
  fab: {
    position: "absolute",
    right: spacing.lg,
    bottom: 110,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.terra,
    alignItems: "center",
    justifyContent: "center",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  legend: {
    position: "absolute",
    bottom: 24,
    left: spacing.md,
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.bgElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  sheetInner: {
    paddingHorizontal: spacing.md,
    position: "relative",
  },
  sheetClose: {
    position: "absolute",
    top: spacing.xs,
    right: spacing.md + 4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.cream,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
  clusterBubble: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: palette.cream,
    ...shadow.floating,
  },
  clusterLabel: {
    color: palette.cream,
    fontSize: 13,
    fontWeight: "700",
    fontFamily: undefined,
  },
});
