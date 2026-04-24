/**
 * MapPin — what we render inside a <Marker>. Ring + fruit glyph emoji.
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { RipenessRing } from "./RipenessRing";
import { palette, shadow } from "../theme/tokens";
import { Ripeness } from "../lib/ripeness";

const KIND_GLYPH: Record<string, string> = {
  apple: "🍎",
  pear: "🍐",
  citrus: "🍊",
  berry: "🫐",
  stone: "🍑",
  nut: "🌰",
  fig: "🫒",
  grape: "🍇",
  herb: "🌿",
  veg: "🥬",
  flower: "🌼",
  mushroom: "🍄",
};

export function MapPin({
  kind,
  ripeness,
  size = 40,
  selected,
  sourceColor,
}: {
  kind: string;
  ripeness: Ripeness | number;
  size?: number;
  selected?: boolean;
  sourceColor?: string;
}) {
  const glyph = KIND_GLYPH[kind] ?? "🌱";
  const s = selected ? size + 8 : size;
  const stemColor = sourceColor ?? palette.bark;
  return (
    <View style={[styles.wrap, shadow.floating]}>
      <View style={{ width: s, height: s, alignItems: "center", justifyContent: "center" }}>
        <View style={StyleSheet.absoluteFill}>
          <RipenessRing size={s} ripeness={ripeness} />
        </View>
        <Text style={{ fontSize: s * 0.45 }}>{glyph}</Text>
      </View>
      <View
        style={[
          styles.stem,
          { borderTopColor: stemColor, borderTopWidth: selected ? 10 : 8 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
  },
  stem: {
    marginTop: -2,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});
