import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import {
  Button,
  Card,
  Checkbox,
  Icon,
  Input,
  ProgressBar,
  colors,
} from "../components";

export interface SignUpBlockProps {
  onSignUp?: (data: {
    name: string;
    email: string;
    pass: string;
  }) => void | Promise<void>;
  onLogin?: () => void;
  accent?: string;
  style?: ViewStyle;
}

export function SignUpBlock({
  onSignUp,
  onLogin,
  accent = colors.lime,
  style,
}: SignUpBlockProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 30;
    if (/[A-Z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass)) score += 25;
    if (/[^A-Za-z0-9]/.test(pass)) score += 20;
    return Math.min(100, score);
  };

  const strength = calculateStrength(password);
  const strengthLabel =
    strength < 40 ? "Weak" : strength < 75 ? "Medium" : "Strong";
  const strengthTone =
    strength < 40 ? "danger" : strength < 75 ? "warning" : "success";

  const handleSubmit = async () => {
    if (pending || !onSignUp) return;
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill out all required fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Use at least eight characters for your password.");
      return;
    }
    if (!agreeTerms) {
      setError("Please accept the terms to create your account.");
      return;
    }
    setError("");
    setPending(true);
    try {
      await onSignUp({
        name: name.trim(),
        email: email.trim(),
        pass: password,
      });
    } catch {
      setError("Couldn’t create your account. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        <View style={s.header}>
          <View style={[s.brandMark, { backgroundColor: accent }]}>
            <Icon name="users" size={18} color={colors.ink} />
          </View>
          <Text style={s.title}>Create an account</Text>
          <Text style={s.subtitle}>
            Join the workspace to start collaborating.
          </Text>
        </View>

        {error ? (
          <View accessibilityLiveRegion="polite" style={s.errorBanner}>
            <Icon name="alertCircle" size={14} color={colors.danger} />
            <Text style={s.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={s.form}>
          <Input
            label="Full name"
            icon="users"
            placeholder="Alex Chen"
            value={name}
            onChangeText={(v) => {
              setName(v);
              setError("");
            }}
            editable={!pending}
            accent={accent}
          />

          <Input
            label="Email address"
            icon="mail"
            placeholder="alex@studio.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setError("");
            }}
            editable={!pending}
            accent={accent}
          />

          <View>
            <Input
              label="Choose password"
              icon="lock"
              placeholder="Min 8 characters"
              autoComplete="new-password"
              autoCapitalize="none"
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
              editable={!pending}
              secureTextEntry
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                setError("");
              }}
              accent={accent}
            />
            {password.length > 0 && (
              <View style={s.strengthRow}>
                <View style={{ flex: 1 }}>
                  <ProgressBar
                    value={strength}
                    tone={strengthTone}
                    size="sm"
                    accent={accent}
                  />
                </View>
                <Text style={s.strengthLabel}>{strengthLabel} password</Text>
              </View>
            )}
          </View>

          <Checkbox
            checked={agreeTerms}
            onChange={setAgreeTerms}
            label="I agree to the Terms of Service & Privacy Policy"
            accent={accent}
          />

          <Button
            variant="primary"
            onPress={handleSubmit}
            loading={pending}
            disabled={!onSignUp}
            icon="arrow"
            accent={accent}
            style={s.submitBtn}
          >
            Create account
          </Button>
        </View>

        {onLogin && (
          <View style={s.footer}>
            <Text style={s.footerText}>Already have an account?</Text>
            <Pressable
              accessibilityRole="button"
              onPress={onLogin}
              style={{ minHeight: 44, justifyContent: "center" }}
            >
              <Text style={s.loginLink}>Sign in</Text>
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
    marginBottom: 12,
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
    gap: 14,
  },
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  strengthLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
  },
  submitBtn: {
    marginTop: 8,
    width: "100%",
  },
  footer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 22,
  },
  footerText: {
    fontSize: 13,
    color: colors.muted,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    ...(Platform.OS === "web" ? { cursor: "pointer" as any } : {}),
  },
});
