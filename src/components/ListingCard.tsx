/**
 * ListingCard — used in the browse list and bottom-sheet preview.
 */

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Text } from "./Text";
import { RipenessRing } from "./RipenessRing";
import { colors, palette, radius, spacing, shadow } from "../theme/tokens";
import { describeSeason, isInSeason } from "../lib/season";
import { RIPENESS_SHORT } from "../lib/ripeness";
import { formatDistance } from "../lib/geo";

export function ListingCard({
  listing,
  distance,
  onPress,
}: {
  listing: any;
  distance?: number;
  onPress?: () => void;
}) {
  const species = listing.species ?? {};
  const months: number[] = Array.isArray(species.seasonMonths) ? species.seasonMonths : [];
  const ripe = listing.currentRipeness ?? 0;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [
      styles.card,
      shadow.card,
      pressed && { transform: [{ scale: 0.99 }] },
    ]}>
      <View style={styles.photoWrap}>
        {species.photoUrl ? (
          <Image source={{ uri: species.photoUrl }} style={styles.photo} contentFit="cover" />
        ) : (
          <View style={[styles.photo, { backgroundColor: palette.sage, alignItems: "center", justifyContent: "center" }]}>
            <Text style={{ fontSize: 32 }}>🌿</Text>
          </View>
        )}
        <View style={styles.ringBadge}>
          <RipenessRing size={32} ripeness={ripe} />
        </View>
      </View>

      <View style={styles.body}>
        <Text variant="title" numberOfLines={1}>{listing.title || species.commonName || "Find"}</Text>
        <Text variant="caption" muted style={{ fontStyle: "italic" }} numberOfLines={1}>
          {species.latinName ?? ""}
        </Text>

        <View style={styles.metaRow}>
          <Text variant="caption" soft>
            {RIPENESS_SHORT[ripe as 0] ?? "—"}
          </Text>
          <Dot />
          <Text variant="caption" soft numberOfLines={1}>
            {describeSeason(months)}
            {isInSeason(months) ? " · in season" : ""}
          </Text>
          {typeof distance === "number" ? (
            <>
              <Dot />
              <Text variant="caption" soft>{formatDistance(distance)}</Text>
            </>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

function Dot() {
  return <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: palette.inkMuted, marginHorizontal: 6 }} />;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.bgElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  photoWrap: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    overflow: "hidden",
    position: "relative",
  },
  photo: { width: "100%", height: "100%" },
  ringBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: colors.bg,
    borderRadius: 999,
    padding: 2,
  },
  body: { flex: 1, justifyContent: "center" },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4, flexWrap: "wrap" },
});
