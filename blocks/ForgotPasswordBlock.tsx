import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Button, Card, Icon, Input, colors } from "../components";

export interface ForgotPasswordBlockProps {
  onSubmit?: (email: string) => void | Promise<void>;
  onBackToLogin?: () => void;
  accent?: string;
  style?: ViewStyle;
}

export function ForgotPasswordBlock({
  onSubmit,
  onBackToLogin,
  accent = colors.lime,
  style,
}: ForgotPasswordBlockProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async () => {
    if (pending || !onSubmit) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setPending(true);
    try {
      await onSubmit(email.trim());
      setSubmitted(true);
    } catch {
      setError("Couldn’t request a reset link. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        <View style={s.header}>
          <View style={[s.brandMark, { backgroundColor: accent }]}>
            <Icon
              name={submitted ? "check" : "key"}
              size={18}
              color={colors.ink}
            />
          </View>
          <Text style={s.title}>
            {submitted ? "Check your email" : "Reset your password"}
          </Text>
          <Text style={s.subtitle}>
            {submitted
              ? `If an account exists for ${email.trim()}, you’ll receive reset instructions.`
              : "Enter your account email and we'll send you a link to reset your password."}
          </Text>
        </View>

        {error ? (
          <View accessibilityLiveRegion="polite" style={s.errorBanner}>
            <Icon name="alertCircle" size={14} color={colors.danger} />
            <Text style={s.errorText}>{error}</Text>
          </View>
        ) : null}

        {!submitted ? (
          <View style={s.form}>
            <Input
              label="Email address"
              icon="mail"
              placeholder="you@studio.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect={false}
              editable={!pending}
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
              value={email}
              onChangeText={(v) => {
                setEmail(v);
                setError("");
              }}
              accent={accent}
            />

            <Button
              variant="primary"
              onPress={handleSubmit}
              loading={pending}
              disabled={!onSubmit}
              icon="arrow"
              accent={accent}
              style={s.submitBtn}
            >
              Send reset instructions
            </Button>
          </View>
        ) : (
          <View style={s.successBox}>
            <Text style={s.resendHint}>
              Didn’t receive the email? Check your spam folder or
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setSubmitted(false)}
              style={{ minHeight: 44, justifyContent: "center" }}
            >
              <Text style={s.resendLink}>try another email address</Text>
            </Pressable>
          </View>
        )}

        {onBackToLogin && (
          <View style={s.footer}>
            <Pressable
              accessibilityRole="button"
              onPress={onBackToLogin}
              style={s.backRow}
            >
              <Icon name="arrowLeft" size={13} color={colors.ink} />
              <Text style={s.backText}>Return to sign in</Text>
            </Pressable>
          </View>
        )}
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 420,
    padding: 24,
  },
  body: {
    width: "100%",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  brandMark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.ink,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
    textAlign: "center",
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.dangerBg,
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: colors.danger,
    fontWeight: "500",
  },
  form: {
    gap: 16,
  },
  submitBtn: {
    width: "100%",
  },
  successBox: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
  },
  resendHint: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
  },
  resendLink: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
    textDecorationLine: "underline",
    ...(Platform.OS === "web" ? { cursor: "pointer" as any } : {}),
  },
  footer: {
    alignItems: "center",
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  backRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    ...(Platform.OS === "web" ? { cursor: "pointer" as any } : {}),
  },
  backText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.ink,
  },
});
