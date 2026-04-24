/**
 * Browse — list view of nearby listings with species search & filters.
 */

import React, { useMemo, useState } from "react";
import { FlatList, View, StyleSheet, TextInput, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "../../src/components/Text";
import { Chip } from "../../src/components/Chip";
import { ListingCard } from "../../src/components/ListingCard";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { useListings } from "../../src/hooks/useListings";
import { useCurrentLocation } from "../../src/hooks/useCurrentLocation";
import { distanceMeters } from "../../src/lib/geo";
import { colors, palette, radius, spacing } from "../../src/theme/tokens";
import { currentMonth } from "../../src/lib/season";

const KINDS = [
  "apple", "pear", "citrus", "berry", "stone", "grape",
  "fig", "nut", "herb", "veg", "flower", "mushroom",
];

export default function BrowseScreen() {
  const router = useRouter();
  const { location } = useCurrentLocation();
  const [search, setSearch] = useState("");
  const [inSeasonOnly, setInSeasonOnly] = useState(true);
  const [activeKinds, setActiveKinds] = useState<string[]>([]);

  // Wide search radius — 0.5° ≈ 55km
  const region = location
    ? { lat: location.lat, lng: location.lng, latDelta: 0.5, lngDelta: 0.5 }
    : { lat: 37.7749, lng: -122.4194, latDelta: 0.5, lngDelta: 0.5 };

  const { listings } = useListings(region, {
    kinds: activeKinds.length ? activeKinds : undefined,
    inSeason: inSeasonOnly ? currentMonth() : undefined,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter((l: any) => {
      const hay = [l.title, l.species?.commonName, l.species?.latinName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [listings, search]);

  const sorted = useMemo(() => {
    if (!location) return filtered;
    return [...filtered]
      .map((l: any) => ({
        ...l,
        _dist: distanceMeters(location, { lat: l.lat, lng: l.lng }),
      }))
      .sort((a, b) => a._dist - b._dist);
  }, [filtered, location?.lat, location?.lng]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={["top"]}>
        <ScreenHeader title="Browse" subtitle={`${sorted.length} finds nearby`} />
      </SafeAreaView>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={palette.inkMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Species or notes…"
            placeholderTextColor={palette.inkMuted}
            style={styles.input}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipScroller}
      >
        <Chip label="In season" active={inSeasonOnly} onPress={() => setInSeasonOnly((v) => !v)} tone="moss" />
        {KINDS.map((k) => (
          <Chip
            key={k}
            label={k[0].toUpperCase() + k.slice(1)}
            active={activeKinds.includes(k)}
            onPress={() =>
              setActiveKinds((prev) =>
                prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k],
              )
            }
          />
        ))}
      </ScrollView>

      <FlatList
        data={sorted}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: 120 }}
        renderItem={({ item }: any) => (
          <ListingCard
            listing={item}
            distance={item._dist}
            onPress={() => router.push(`/listing/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={{ padding: spacing.xl, alignItems: "center" }}>
            <Text variant="title" muted>Nothing here yet.</Text>
            <Text variant="body" muted style={{ marginTop: 8, textAlign: "center" }}>
              Be the first to pin a find — tap the + on the map.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bgElevated,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderColor: colors.line,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: colors.text,
    fontSize: 15,
  },
  // `flexGrow: 0` stops the horizontal ScrollView from stretching vertically
  // to fill the gap between the search row and the FlatList.
  chipScroller: { flexGrow: 0, flexShrink: 0 },
  chips: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    alignItems: "center",
  },
});
