/**
 * Chip — pill-shaped filter / tag. Toggleable when onPress is provided.
 */

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "./Text";
import { colors, palette, radius, spacing } from "../theme/tokens";

export function Chip({
  label,
  active,
  onPress,
  icon,
  tone = "default",
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  tone?: "default" | "moss" | "terra" | "berry";
}) {
  const toneColor = {
    default: palette.bark,
    moss: palette.moss,
    terra: palette.terra,
    berry: palette.berry,
  }[tone];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: active ? toneColor : colors.bgElevated,
          borderColor: active ? toneColor : colors.line,
        },
      ]}
    >
      {icon ? <View style={{ marginRight: 6 }}>{icon}</View> : null}
      <Text
        variant="caption"
        style={{
          color: active ? palette.cream : colors.textSoft,
          fontWeight: "600",
          letterSpacing: 0.2,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
});
