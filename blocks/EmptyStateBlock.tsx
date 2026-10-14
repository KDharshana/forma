import React from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Badge, Button, Card, Icon, IconName, colors } from "../components";

export interface EmptyStateSuggestion {
  label: string;
  onPress: () => void;
}

export interface EmptyStateBlockProps {
  title?: string;
  description?: string;
  tag?: string;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
  suggestions?: EmptyStateSuggestion[];
  compact?: boolean;
  accent?: string;
  style?: ViewStyle;
}

export function EmptyStateBlock({
  title = "No records yet",
  description = "Create a record to get started.",
  tag,
  icon = "folder",
  actionLabel = "Create record",
  onAction,
  secondaryLabel = "Import records",
  onSecondaryAction,
  suggestions = [],
  compact = false,
  accent = colors.lime,
  style,
}: EmptyStateBlockProps) {
  return (
    <Card
      style={StyleSheet.flatten([
        s.card,
        compact ? s.compact : undefined,
        style,
      ])}
    >
      <View style={s.body}>
        <View style={[s.mark, { backgroundColor: accent }]}>
          <Icon name={icon} size={28} color={colors.ink} />
        </View>

        {!!tag && <Badge tone="neutral">{tag}</Badge>}

        <Text accessibilityRole="header" style={s.title}>
          {title}
        </Text>

        {!!description && <Text style={s.description}>{description}</Text>}

        {(onAction || onSecondaryAction) && (
          <View style={s.actions}>
            {onAction && !!actionLabel && (
              <Button onPress={onAction} icon="plus" accent={accent}>
                {actionLabel}
              </Button>
            )}
            {onSecondaryAction && !!secondaryLabel && (
              <Button
                onPress={onSecondaryAction}
                variant="outline"
                icon="upload"
              >
                {secondaryLabel}
              </Button>
            )}
          </View>
        )}

        {suggestions.length > 0 && (
          <View style={s.suggestions}>
            {suggestions.map((item) => (
              <Pressable
                key={item.label}
                accessibilityRole="button"
                onPress={item.onPress}
                style={s.suggestion}
              >
                <Text style={s.link}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
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
  suggestions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  suggestion: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  link: {
    fontSize: 14,
    color: colors.ink,
    textDecorationLine: "underline",
  },
});
