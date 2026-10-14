import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Button, Card, Checkbox, Icon, Input, colors } from "../components";

export interface AuthLoginBlockProps {
  onLogin?: (
    email: string,
    pass: string,
    remember?: boolean,
  ) => void | Promise<void>;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  accent?: string;
  style?: ViewStyle;
}

export function AuthLoginBlock({
  onLogin,
  onForgotPassword,
  onSignUp,
  accent = colors.lime,
  style,
}: AuthLoginBlockProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async () => {
    if (pending || !onLogin) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || !password) {
      setError("Enter a valid email address and your password.");
      return;
    }
    setError("");
    setPending(true);
    try {
      await onLogin(email.trim(), password, rememberMe);
    } catch {
      setError("Unable to sign in. Check your details and try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        <View style={s.header}>
          <View style={[s.brandMark, { backgroundColor: accent }]}>
            <Icon name="spark" size={18} color={colors.ink} />
          </View>
          <Text style={s.title}>Welcome back</Text>
          <Text style={s.subtitle}>
            Enter your details to access your workspace.
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
            label="Email address"
            icon="mail"
            placeholder="you@studio.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            editable={!pending}
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setError("");
            }}
            accent={accent}
          />

          <View style={s.passwordWrapper}>
            <Input
              label="Password"
              icon="lock"
              placeholder="Enter password"
              secureTextEntry={!showPassword}
              autoComplete="current-password"
              autoCapitalize="none"
              editable={!pending}
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
              trailingAccessory={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                  }
                  onPress={() => setShowPassword(!showPassword)}
                  style={s.eyeToggle}
                >
                  <Icon
                    name={showPassword ? "eyeOff" : "eye"}
                    size={18}
                    color={colors.muted}
                  />
                </Pressable>
              }
              value={password}
              onChangeText={(v) => {
                setPassword(v);
                setError("");
              }}
              accent={accent}
            />
          </View>

          <View style={s.optionsRow}>
            <Checkbox
              checked={rememberMe}
              onChange={setRememberMe}
              label="Remember me"
              accent={accent}
            />

            {onForgotPassword && (
              <Pressable
                accessibilityRole="button"
                onPress={onForgotPassword}
                style={s.linkTarget}
              >
                <Text style={s.forgotText}>Forgot password?</Text>
              </Pressable>
            )}
          </View>

          <Button
            variant="primary"
            onPress={handleSubmit}
            loading={pending}
            disabled={!onLogin}
            icon="arrow"
            accent={accent}
            style={s.submitBtn}
          >
            Sign in
          </Button>
        </View>

        {onSignUp && (
          <View style={s.footer}>
            <Text style={s.footerText}>Don’t have an account?</Text>
            <Pressable
              accessibilityRole="button"
              onPress={onSignUp}
              style={s.linkTarget}
            >
              <Text style={s.signUpLink}>Sign up</Text>
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
  passwordWrapper: {
    position: "relative",
  },
  eyeToggle: {
    width: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  linkTarget: {
    minHeight: 44,
    justifyContent: "center",
  },
  optionsRow: {
    flexWrap: "wrap",
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  forgotText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "500",
    ...(Platform.OS === "web" ? { cursor: "pointer" as any } : {}),
  },
  submitBtn: {
    marginTop: 4,
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
  signUpLink: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    ...(Platform.OS === "web" ? { cursor: "pointer" as any } : {}),
  },
});
