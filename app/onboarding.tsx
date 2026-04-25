/**
 * Onboarding — 4-slide intro: map, add, ripeness, values. Sets flag in AsyncStorage.
 */

import React, { useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Dimensions, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Text } from "../src/components/Text";
import { PrimaryButton } from "../src/components/Button";
import { colors, palette, spacing } from "../src/theme/tokens";
import { markOnboarded } from "./_layout";

const { width } = Dimensions.get("window");

const SLIDES = [
  { glyph: "🗺️", title: "Find what's free to pick.", body: "A living map of fruit trees, berries, and edibles on public land — maintained by your community." },
  { glyph: "📍", title: "Pin what you spot.", body: "Drop a pin, snap a photo, tag the species. Everyone benefits when good finds are shared." },
  { glyph: "🍎", title: "Know what's ripe.", body: "Others confirm ripeness throughout the season. The ring on each pin shows you at a glance." },
  { glyph: "🌱", title: "Free, forever.", body: "Open source. No ads. No tracking. Your location is never sold. AGPLv3 — fork us if we ever stray." },
];

export default function Onboarding() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [i, setI] = useState(0);

  const next = async () => {
    if (i < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (i + 1) * width, animated: true });
      setI(i + 1);
    } else {
      await markOnboarded();
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setI(Math.round(e.nativeEvent.contentOffset.x / width))}
        >
          {SLIDES.map((s) => (
            <View key={s.title} style={[styles.slide, { width }]}>
              <View style={styles.glyphWrap}>
                <Text style={{ fontSize: 96 }}>{s.glyph}</Text>
              </View>
              <Text variant="display" style={styles.title}>{s.title}</Text>
              <Text variant="body" soft style={styles.body}>{s.body}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.dots}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                { backgroundColor: idx === i ? palette.moss : palette.sand, width: idx === i ? 22 : 8 },
              ]}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Pressable onPress={async () => { await markOnboarded(); router.replace("/(tabs)"); }}>
            <Text variant="body" muted>Skip</Text>
          </Pressable>
          <PrimaryButton label={i === SLIDES.length - 1 ? "Start foraging" : "Next"} onPress={next} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { flex: 1, paddingHorizontal: spacing.xxl, justifyContent: "center", alignItems: "center" },
  glyphWrap: { width: 180, height: 180, borderRadius: 90, backgroundColor: palette.sage, alignItems: "center", justifyContent: "center", marginBottom: spacing.xxl },
  title: { textAlign: "center", fontSize: 32, lineHeight: 38, marginBottom: spacing.md },
  body: { textAlign: "center", fontSize: 17, lineHeight: 24 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, paddingVertical: spacing.lg },
  dot: { height: 8, borderRadius: 4 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
});
