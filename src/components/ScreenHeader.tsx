/**
 * ScreenHeader — page title + optional back + trailing actions.
 */

import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "./Text";
import { colors, spacing } from "../theme/tokens";

export function ScreenHeader({
  title,
  subtitle,
  showBack,
  trailing,
}: {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  trailing?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <View style={styles.row}>
      {showBack ? (
        <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={10}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
      ) : (
        <View style={{ width: 32 }} />
      )}
      <View style={{ flex: 1, alignItems: "center" }}>
        <Text variant="title">{title}</Text>
        {subtitle ? <Text variant="caption" muted>{subtitle}</Text> : null}
      </View>
      <View style={{ minWidth: 32, alignItems: "flex-end" }}>{trailing}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.bg,
    borderBottomColor: colors.lineSoft,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
});
