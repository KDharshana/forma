import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Button, Card, Icon, Input, colors } from "../components";

export interface TwoFactorAuthBlockProps {
  onVerify?: (code: string) => void | Promise<void>;
  onResend?: () => void | Promise<void>;
  onUseBackup?: () => void;
  accent?: string;
  style?: ViewStyle;
}

export function TwoFactorAuthBlock({
  onVerify,
  onResend,
  onUseBackup,
  accent = colors.lime,
  style,
}: TwoFactorAuthBlockProps) {
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [pending, setPending] = useState<"verify" | "resend" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(
      () => setCountdown((value) => Math.max(0, value - 1)),
      1000,
    );
    return () => clearTimeout(timer);
  }, [countdown]);

  const verify = async () => {
    if (pending || !onVerify) return;
    if (code.length !== 6) {
      setError("Enter the complete six-digit code.");
      return;
    }
    setPending("verify");
    setError("");
    try {
      await onVerify(code);
    } catch {
      setError("We couldn’t verify that code. Please try again.");
    } finally {
      setPending(null);
    }
  };

  const resend = async () => {
    if (pending || countdown > 0 || !onResend) return;
    setPending("resend");
    setError("");
    try {
      await onResend();
      setCountdown(60);
    } catch {
      setError("Couldn’t send a new code. Please try again.");
    } finally {
      setPending(null);
    }
  };

  return (
    <Card style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        <View style={[s.mark, { backgroundColor: accent }]}>
          <Icon name="shield" size={22} color={colors.ink} />
        </View>
        <Text accessibilityRole="header" style={s.title}>
          Verify your account
        </Text>
        <Text style={s.description}>
          Enter your six-digit verification code.
        </Text>
        <Input
          label="Verification code"
          placeholder="000000"
          value={code}
          onChangeText={(value) => {
            setCode(value.replace(/\D/g, "").slice(0, 6));
            setError("");
          }}
          keyboardType="number-pad"
          autoComplete="one-time-code"
          textContentType="oneTimeCode"
          returnKeyType="done"
          onSubmitEditing={verify}
          editable={!pending}
          error={error}
          accent={accent}
          style={s.code}
        />
        <Button
          onPress={verify}
          loading={pending === "verify"}
          disabled={!onVerify || pending === "resend"}
          accent={accent}
          style={s.verifyBtn}
        >
          Verify
        </Button>
        {onResend && (
          <Button
            variant="ghost"
            onPress={resend}
            loading={pending === "resend"}
            disabled={countdown > 0 || pending === "verify"}
          >
            {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
          </Button>
        )}
        {onUseBackup && (
          <Pressable
            accessibilityRole="button"
            onPress={onUseBackup}
            style={s.link}
          >
            <Text style={s.linkText}>Use a recovery code</Text>
          </Pressable>
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
    gap: 14,
  },
  mark: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.ink,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: "center",
  },
  code: {
    fontSize: 24,
    letterSpacing: 8,
    textAlign: "center",
  },
  verifyBtn: {
    width: "100%",
  },
  link: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  linkText: {
    color: colors.ink,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
