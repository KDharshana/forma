import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Button, Card, Icon, colors } from "../components";

export type ErrorStateCode = "404" | "403" | "500" | "offline";
export interface ErrorStateBlockProps {
  code?: ErrorStateCode | string;
  title?: string;
  description?: string;
  onHome?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
  accent?: string;
  compact?: boolean;
  style?: ViewStyle;
}

const messages: Record<ErrorStateCode, { title: string; description: string }> =
  {
    "404": {
      title: "Page not found",
      description: "This page may have moved or been removed.",
    },
    "403": {
      title: "You don’t have access",
      description: "Ask your workspace administrator for access.",
    },
    "500": {
      title: "Something went wrong",
      description: "Please try again in a moment.",
    },
    offline: {
      title: "You’re offline",
      description: "Check your connection and try again.",
    },
  };

export function ErrorStateBlock({
  code = "404",
  title,
  description,
  onHome,
  onRetry,
  onSupport,
  accent = colors.lime,
  compact = false,
  style,
}: ErrorStateBlockProps) {
  const message = messages[code as ErrorStateCode] || messages["500"];

  return (
    <Card
      style={StyleSheet.flatten([
        s.card,
        compact ? s.compact : undefined,
        style,
      ])}
    >
      <View style={s.body}>
        <View style={s.mark}>
          <Icon
            name={code === "403" ? "lock" : "alertCircle"}
            size={28}
            color={colors.danger}
          />
        </View>

        {code !== "offline" && <Text style={s.code}>{code}</Text>}

        <Text accessibilityRole="header" style={s.title}>
          {title || message.title}
        </Text>

        <Text style={s.description}>{description || message.description}</Text>

        {(onRetry || onHome) && (
          <View style={s.actions}>
            {onRetry && (
              <Button onPress={onRetry} accent={accent} icon="refresh">
                Try again
              </Button>
            )}
            {onHome && (
              <Button
                onPress={onHome}
                variant={onRetry ? "outline" : "primary"}
                icon="home"
              >
                Go to dashboard
              </Button>
            )}
          </View>
        )}

        {onSupport && (
          <Button variant="ghost" onPress={onSupport}>
            Contact support
          </Button>
        )}
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 620,
    padding: 28,
    paddingVertical: 36,
    alignItems: "center",
  },
  compact: {
    padding: 20,
    paddingVertical: 20,
  },
  body: {
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  mark: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.dangerBg,
    alignItems: "center",
    justifyContent: "center",
  },
  code: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.ink,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    textAlign: "center",
    maxWidth: 400,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 8,
    maxWidth: "100%",
  },
});
