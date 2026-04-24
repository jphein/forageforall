/**
 * LayerSheet — bottom sheet listing every data source as a toggleable layer.
 *
 * Triggered from the map screen via a stack-of-layers icon. Shows color swatch,
 * license, attribution link, and a simple on/off switch per source.
 */

import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "./Text";
import { SOURCE_LAYERS, SourceKey } from "../config/sourceLayers";
import { colors, palette, radius, spacing } from "../theme/tokens";

interface Props {
  visible: boolean;
  enabled: SourceKey[];
  onToggle: (key: SourceKey) => void;
  onEnableAll: () => void;
  onResetDefaults: () => void;
  onClose: () => void;
}

export function LayerSheet({
  visible,
  enabled,
  onToggle,
  onEnableAll,
  onResetDefaults,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <SafeAreaView style={styles.sheet} edges={["bottom"]}>
        <View style={styles.handle} />
        <View style={styles.header}>
          <Text variant="title" style={styles.title}>
            Map layers
          </Text>
          <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close">
            <Ionicons name="close" size={22} color={colors.textSoft} />
          </Pressable>
        </View>

        <Text variant="body" style={styles.intro}>
          Toggle data sources on and off. Community pins are always attributed;
          other layers come from open datasets with their own licenses.
        </Text>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollBody}>
          {SOURCE_LAYERS.map((layer) => {
            const isOn = enabled.includes(layer.key);
            return (
              <View key={layer.key} style={styles.row}>
                <View style={[styles.swatch, { backgroundColor: layer.color }]} />
                <View style={styles.rowBody}>
                  <Text variant="label" style={styles.rowLabel}>
                    {layer.label}
                  </Text>
                  <Text variant="caption" style={styles.rowDesc}>
                    {layer.description}
                  </Text>
                  <Pressable
                    onPress={() => Linking.openURL(layer.attributionUrl)}
                    hitSlop={6}
                  >
                    <Text variant="caption" style={styles.rowAttribution}>
                      {layer.attribution} · {layer.license}
                    </Text>
                  </Pressable>
                </View>
                <Switch
                  value={isOn}
                  onValueChange={() => onToggle(layer.key)}
                  trackColor={{ false: palette.line, true: palette.mossLight }}
                  thumbColor={isOn ? palette.moss : palette.sand}
                  accessibilityLabel={`${layer.label} ${isOn ? "on" : "off"}`}
                />
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.actions}>
          <Pressable style={styles.actionBtn} onPress={onResetDefaults}>
            <Text variant="label" style={styles.actionLabel}>
              Reset
            </Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.actionBtnPrimary]}
            onPress={onEnableAll}
          >
            <Text variant="label" style={[styles.actionLabel, styles.actionLabelPrimary]}>
              Show all
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(30,23,16,0.45)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: "85%",
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  handle: {
    alignSelf: "center",
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: palette.line,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: colors.text,
  },
  intro: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    color: colors.textSoft,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollBody: {
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lineSoft,
    gap: spacing.md,
  },
  swatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  rowBody: {
    flex: 1,
  },
  rowLabel: {
    color: colors.text,
    marginBottom: 2,
  },
  rowDesc: {
    color: colors.textSoft,
    marginBottom: 4,
  },
  rowAttribution: {
    color: palette.moss,
    textDecorationLine: "underline",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.line,
    alignItems: "center",
  },
  actionBtnPrimary: {
    backgroundColor: palette.moss,
    borderColor: palette.moss,
  },
  actionLabel: {
    color: colors.textSoft,
  },
  actionLabelPrimary: {
    color: colors.bg,
  },
});
