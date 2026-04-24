/**
 * Auth — magic-code email flow via InstantDB.
 */

import React, { useState } from "react";
import { View, TextInput, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { Text } from "../src/components/Text";
import { PrimaryButton, SecondaryButton } from "../src/components/Button";
import { ScreenHeader } from "../src/components/ScreenHeader";
import { db } from "../src/db/client";
import { colors, palette, radius, spacing } from "../src/theme/tokens";

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await db.auth.sendMagicCode({ email: email.trim() });
      setSent(true);
    } catch (e: any) {
      Alert.alert("Couldn't send code", e?.message ?? "Try again");
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    setLoading(true);
    try {
      await db.auth.signInWithMagicCode({ email: email.trim(), code: code.trim() });
      router.back();
    } catch (e: any) {
      Alert.alert("Wrong code", e?.message ?? "Check your email & try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={["top"]}>
        <ScreenHeader title="Sign in" showBack />
      </SafeAreaView>
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        <Text variant="display" style={{ fontSize: 28 }}>
          {sent ? "Check your email." : "Magic code sign-in."}
        </Text>
        <Text variant="body" soft>
          {sent
            ? `We sent a 6-digit code to ${email}. Enter it below.`
            : "No passwords. We'll email you a one-time code."}
        </Text>

        {!sent ? (
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor={palette.inkMuted}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.input}
          />
        ) : (
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="123456"
            placeholderTextColor={palette.inkMuted}
            keyboardType="number-pad"
            style={[styles.input, { fontSize: 22, letterSpacing: 8, textAlign: "center" }]}
            maxLength={6}
            autoFocus
          />
        )}

        <PrimaryButton
          full
          label={sent ? "Verify" : "Send code"}
          loading={loading}
          onPress={sent ? verify : sendCode}
        />
        {sent ? (
          <SecondaryButton full label="Use a different email" onPress={() => setSent(false)} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.bgElevated,
    borderRadius: radius.md,
    borderColor: colors.line,
    borderWidth: 1,
    padding: spacing.md,
    fontSize: 17,
    color: colors.text,
  },
});
