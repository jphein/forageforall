/**
 * Listing detail — hero, season strip, access checklist, reports, comments,
 * "still there?" action, report submission.
 */

import React, { useMemo, useState } from "react";
import { ScrollView, View, StyleSheet, Pressable, TextInput, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

import { Text } from "../../src/components/Text";
import { RipenessRing } from "../../src/components/RipenessRing";
import { SeasonStrip } from "../../src/components/SeasonStrip";
import { PrimaryButton, SecondaryButton } from "../../src/components/Button";
import { Chip } from "../../src/components/Chip";
import { ScreenHeader } from "../../src/components/ScreenHeader";
import { useListing } from "../../src/hooks/useListing";
import { useAuthedProfile } from "../../src/hooks/useAuthedProfile";
import { submitReport, addComment, flagListing } from "../../src/db/actions";
import { colors, palette, radius, spacing, shadow } from "../../src/theme/tokens";
import { RIPENESS_LABELS, Ripeness, computeCurrentRipeness, stillThereScore } from "../../src/lib/ripeness";

export default function ListingDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthedProfile();
  const { listing, isLoading } = useListing(id ?? null);
  const [myRipeness, setMyRipeness] = useState<Ripeness>(3);
  const [commentText, setCommentText] = useState("");

  const species = listing?.species ?? {};
  const months: number[] = Array.isArray(species.seasonMonths) ? species.seasonMonths : [];
  const reports = (listing?.reports ?? []) as any[];
  const comments = (listing?.comments ?? []) as any[];

  const confirmedText = useMemo(() => {
    const last = listing?.lastConfirmedAt;
    if (!last) return "Not yet confirmed";
    const days = Math.floor((Date.now() - last) / 86_400_000);
    if (days === 0) return "Confirmed today";
    if (days === 1) return "Confirmed yesterday";
    return `Confirmed ${days}d ago`;
  }, [listing?.lastConfirmedAt]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <SafeAreaView edges={["top"]}>
          <ScreenHeader title="…" showBack />
        </SafeAreaView>
      </View>
    );
  }
  if (!listing) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <SafeAreaView edges={["top"]}>
          <ScreenHeader title="Not found" showBack />
        </SafeAreaView>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: spacing.lg,
            gap: spacing.md,
          }}
        >
          <Text variant="title" style={{ fontSize: 20 }}>
            This find is gone.
          </Text>
          <Text variant="body" muted style={{ textAlign: "center", maxWidth: 320 }}>
            The pin you&apos;re looking for doesn&apos;t exist — it may have
            been removed, or the link is wrong.
          </Text>
          <PrimaryButton label="Back to the map" onPress={() => router.replace("/")} />
        </View>
      </View>
    );
  }

  const submit = async (stillThere: boolean) => {
    if (!user) {
      router.push("/auth");
      return;
    }
    const withMine = [
      ...reports.map((r) => ({ ripeness: r.ripeness, createdAt: r.createdAt, stillThere: r.stillThere })),
      { ripeness: myRipeness, createdAt: Date.now(), stillThere },
    ];
    const nextRipe = computeCurrentRipeness(withMine);
    const nextStill = stillThereScore(withMine);
    await submitReport({
      listingId: listing.id,
      userId: user.id,
      ripeness: myRipeness,
      stillThere,
      nextCurrentRipeness: nextRipe,
      nextReportCount: (listing.reportCount ?? 0) + 1,
      nextStillThereScore: nextStill,
    });
  };

  const sendComment = async () => {
    if (!user) return router.push("/auth");
    const txt = commentText.trim();
    if (!txt) return;
    await addComment({ listingId: listing.id, userId: user.id, text: txt });
    setCommentText("");
  };

  const flag = () => {
    if (!user) return router.push("/auth");
    const file = (reason: string) =>
      flagListing({ listingId: listing.id, userId: user.id, reason });
    if (Platform.OS === "web" && typeof window !== "undefined") {
      // Alert.alert's multi-button prompt isn't implemented on RNW.
      // Use window.prompt with a keyed list — clunky but works.
      const choice = window.prompt(
        "Flag this listing? Type one of:\n  1 — Private property\n  2 — Wrong species\n  3 — Dangerous",
      );
      const reasonByChoice: Record<string, string> = {
        "1": "private_property",
        "2": "wrong_species",
        "3": "dangerous",
      };
      if (choice && reasonByChoice[choice.trim()]) {
        file(reasonByChoice[choice.trim()]);
      }
      return;
    }
    Alert.alert("Flag this listing?", "Choose a reason", [
      { text: "Cancel", style: "cancel" },
      { text: "Private property", onPress: () => file("private_property") },
      { text: "Wrong species", onPress: () => file("wrong_species") },
      { text: "Dangerous", onPress: () => file("dangerous") },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={["top"]}>
        <ScreenHeader
          title={species.commonName ?? "Find"}
          showBack
          trailing={
            <Pressable onPress={flag} hitSlop={10}>
              <Ionicons name="flag-outline" size={20} color={palette.bark} />
            </Pressable>
          }
        />
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ paddingBottom: 200 }}>
        {/* Hero */}
        <View style={{ padding: spacing.md }}>
          <View style={[styles.hero, shadow.card]}>
            {species.photoUrl ? (
              <Image source={{ uri: species.photoUrl }} style={styles.heroImg} contentFit="cover" />
            ) : (
              <View style={[styles.heroImg, { backgroundColor: palette.sage, alignItems: "center", justifyContent: "center" }]}>
                <Text style={{ fontSize: 64 }}>🌿</Text>
              </View>
            )}
            <View style={styles.heroRing}>
              <RipenessRing size={56} ripeness={listing.currentRipeness ?? 0} />
            </View>
          </View>

          <View style={{ marginTop: spacing.md }}>
            <Text variant="display" style={{ fontSize: 28 }}>
              {listing.title || species.commonName}
            </Text>
            <Text variant="body" muted style={{ fontStyle: "italic" }}>
              {species.latinName}
            </Text>
            <View style={styles.statusRow}>
              <Chip label={RIPENESS_LABELS[(listing.currentRipeness ?? 0) as Ripeness]} tone="terra" active />
              <Chip label={confirmedText} />
            </View>
          </View>
        </View>

        {/* Season */}
        <Section title="Season">
          <SeasonStrip months={months} />
        </Section>

        {/* Access */}
        <Section title="Access">
          <View style={{ gap: 6 }}>
            <AccessRow flag label="Public land" ok={!!listing.accessFlags?.public} />
            <AccessRow flag label="Permission needed" warn={!!listing.accessFlags?.permission} />
            <AccessRow flag label="Possible pesticide / spray" danger={!!listing.accessFlags?.pesticide} />
            <AccessRow flag label="Bring gloves" neutral={!!listing.accessFlags?.gloves} />
          </View>
          {listing.notes ? (
            <Text variant="body" soft style={{ marginTop: spacing.md }}>{listing.notes}</Text>
          ) : null}
        </Section>

        {/* Report */}
        <Section title="Report ripeness">
          <View style={styles.ripeRow}>
            {([0, 1, 2, 3, 4] as Ripeness[]).map((r) => (
              <Pressable
                key={r}
                onPress={() => setMyRipeness(r)}
                style={[
                  styles.ripeCell,
                  { borderColor: myRipeness === r ? palette.soil : "transparent" },
                ]}
              >
                <RipenessRing size={36} ripeness={r} />
                <Text variant="caption" muted>{RIPENESS_LABELS[r]}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.md }}>
            <PrimaryButton tone="moss" label="Still there ✓" onPress={() => submit(true)} full />
            <SecondaryButton label="Gone" onPress={() => submit(false)} full />
          </View>
        </Section>

        {/* Community */}
        <Section title={`Community (${comments.length})`}>
          <View style={styles.commentBox}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Add a note for other foragers…"
              placeholderTextColor={palette.inkMuted}
              style={styles.commentInput}
              multiline
            />
            <Pressable onPress={sendComment} disabled={!commentText.trim()}>
              <Ionicons name="send" size={20} color={commentText.trim() ? palette.moss : palette.inkMuted} />
            </Pressable>
          </View>
          {comments.map((c) => (
            <View key={c.id} style={styles.comment}>
              <Text variant="caption" soft style={{ fontWeight: "700" }}>
                {c.author?.displayName ?? "forager"}
              </Text>
              <Text variant="body">{c.text}</Text>
            </View>
          ))}
        </Section>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
      <Text variant="label" soft style={{ marginBottom: spacing.sm }}>{title}</Text>
      {children}
    </View>
  );
}

function AccessRow({ label, ok, warn, danger }: any) {
  const color = ok ? palette.moss : warn ? palette.sun : danger ? palette.terra : palette.bark;
  const icon = ok ? "checkmark-circle" : warn ? "alert-circle" : danger ? "warning" : "information-circle-outline";
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6 }}>
      <Ionicons name={icon as any} size={18} color={color} />
      <Text variant="body" style={{ marginLeft: 8 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.lg, overflow: "hidden", height: 220, position: "relative" },
  heroImg: { width: "100%", height: "100%" },
  heroRing: { position: "absolute", right: spacing.md, bottom: spacing.md, backgroundColor: colors.bg, borderRadius: 999, padding: 4 },
  statusRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md, flexWrap: "wrap" },
  ripeRow: { flexDirection: "row", justifyContent: "space-between" },
  ripeCell: { alignItems: "center", padding: 6, borderRadius: radius.md, borderWidth: 2, gap: 4, minWidth: 56 },
  commentBox: { flexDirection: "row", backgroundColor: colors.bgElevated, borderRadius: radius.md, padding: spacing.md, alignItems: "flex-end", gap: spacing.sm },
  commentInput: { flex: 1, color: colors.text, fontSize: 15, minHeight: 40, maxHeight: 120 },
  comment: { marginTop: spacing.md, backgroundColor: colors.bgElevated, padding: spacing.md, borderRadius: radius.md },
});
