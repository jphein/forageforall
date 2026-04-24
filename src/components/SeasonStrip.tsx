/**
 * SeasonStrip — 12-month ribbon, highlighting the species' season
 * and the current month.
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "./Text";
import { colors, palette, radius } from "../theme/tokens";
import { MONTH_NAMES, currentMonth } from "../lib/season";

export function SeasonStrip({
  months,
  current = currentMonth(),
}: {
  months: number[];
  current?: number;
}) {
  return (
    <View style={styles.row}>
      {MONTH_NAMES.map((name, i) => {
        const m = i + 1;
        const inSeason = months.includes(m);
        const isCurrent = m === current;
        return (
          <View
            key={name}
            style={[
              styles.cell,
              {
                backgroundColor: inSeason
                  ? isCurrent
                    ? palette.ember
                    : palette.mossLight
                  : colors.bgInset,
                borderColor: isCurrent ? palette.soil : "transparent",
                borderWidth: isCurrent ? 1.5 : 0,
              },
            ]}
          >
            <Text
              variant="caption"
              style={{
                color: inSeason ? palette.soil : colors.textMuted,
                fontWeight: isCurrent ? "800" : "600",
              }}
            >
              {name[0]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 3 },
  cell: {
    flex: 1,
    height: 28,
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});
