/**
 * Themed <Text> — applies default color + font from tokens.
 */

import React from "react";
import { Text as RNText, TextProps, StyleSheet } from "react-native";
import { colors, type } from "../theme/tokens";

type Variant = "display" | "title" | "body" | "label" | "caption";

export function Text({
  variant = "body",
  muted,
  soft,
  style,
  ...rest
}: TextProps & { variant?: Variant; muted?: boolean; soft?: boolean }) {
  const base = variantStyles[variant];
  const color = muted
    ? colors.textMuted
    : soft
      ? colors.textSoft
      : colors.text;
  return <RNText {...rest} style={[base, { color }, style]} />;
}

const variantStyles = StyleSheet.create({
  display: {
    fontFamily: type.display.fontFamily,
    fontWeight: "700",
    fontSize: type.sizes.display,
    letterSpacing: -0.5,
  },
  title: {
    fontFamily: type.display.fontFamily,
    fontWeight: "600",
    fontSize: type.sizes.xl,
    letterSpacing: -0.2,
  },
  body: {
    fontFamily: type.body.fontFamily,
    fontWeight: "400",
    fontSize: type.sizes.md,
    lineHeight: 22,
  },
  label: {
    fontFamily: type.body.fontFamily,
    fontWeight: "600",
    fontSize: type.sizes.sm,
    letterSpacing: 0.2,
    textTransform: "uppercase",
  },
  caption: {
    fontFamily: type.body.fontFamily,
    fontWeight: "400",
    fontSize: type.sizes.xs,
  },
});
