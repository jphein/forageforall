/**
 * PrimaryButton / SecondaryButton
 */

import React from "react";
import { Pressable, StyleSheet, ActivityIndicator, View } from "react-native";
import { Text } from "./Text";
import { colors, palette, radius, spacing, shadow } from "../theme/tokens";

type Props = {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  tone?: "moss" | "terra" | "ink";
  icon?: React.ReactNode;
  full?: boolean;
};

export function PrimaryButton({ label, onPress, disabled, loading, tone = "moss", icon, full }: Props) {
  const bg = {
    moss: palette.moss,
    terra: palette.terra,
    ink: palette.soil,
  }[tone];

  return (
    <Pressable
      onPress={disabled || loading ? undefined : onPress}
      style={({ pressed }) => [
        styles.btn,
        shadow.card,
        {
          backgroundColor: bg,
          opacity: disabled ? 0.5 : pressed ? 0.92 : 1,
          alignSelf: full ? "stretch" : "flex-start",
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.cream} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {icon ? <View style={{ marginRight: 8 }}>{icon}</View> : null}
          <Text
            style={{
              color: palette.cream,
              fontWeight: "700",
              fontSize: 16,
              letterSpacing: 0.3,
            }}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export function SecondaryButton({ label, onPress, disabled, icon, full }: Omit<Props, "tone" | "loading">) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: colors.bgElevated,
          borderColor: colors.line,
          borderWidth: 1,
          opacity: disabled ? 0.5 : pressed ? 0.92 : 1,
          alignSelf: full ? "stretch" : "flex-start",
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon ? <View style={{ marginRight: 8 }}>{icon}</View> : null}
        <Text
          style={{
            color: colors.text,
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
});
