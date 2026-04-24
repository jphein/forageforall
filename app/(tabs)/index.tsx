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
import { useListings, Region } from "../../src/hooks/useListings";
import { useCurrentLocation } from "../../src/hooks/useCurrentLocation";
import { MAP_STYLES, MapStyleKey } from "../../src/config/mapStyles";
import { colors, palette, radius, shadow, spacing } from "../../src/theme/tokens";
import { distanceMeters } from "../../src/lib/geo";

const DEFAULT_REGION: Region = {
  lat: 37.7749,
  lng: -122.4194,
  latDelta: 0.05,
  lngDelta: 0.05,
};

const KIND_FILTERS: { key: string; label: string }[] = [
  { key: "apple", label: "Apples" },
  { key: "citrus", label: "Citrus" },
  { key: "berry", label: "Berries" },
  { key: "stone", label: "Stone fruit" },
  { key: "nut", label: "Nuts" },
  { key: "herb", label: "Herbs" },
  { key: "veg", label: "Veg" },
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
      >
        {listings.map((l: any) => (
          <Marker
            key={l.id}
            coordinate={{ latitude: l.lat, longitude: l.lng }}
            onPress={() => setSelectedId(l.id)}
            tracksViewChanges={false}
            anchor={{ x: 0.5, y: 1 }}
          >
            <MapPin
              kind={l.species?.kind ?? "herb"}
              ripeness={l.currentRipeness ?? 0}
              selected={selectedId === l.id}
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
          <View style={{ paddingHorizontal: spacing.md }}>
            <Pressable
              onPress={() => router.push(`/listing/${selected.id}`)}
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
          </View>
        </SafeAreaView>
      ) : null}

      <LegendBar />
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
});
