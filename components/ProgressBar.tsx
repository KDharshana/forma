import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";

export interface ProgressBarProps {
  /** Progress percentage (0 to 100) */
  value?: number;
  /** Label describing the progress */
  label?: string;
  /** Whether to show the percentage text */
  showPercent?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Custom accent color for progress bar */
  accent?: string;
  /** Semantic color tone */
  tone?: "accent" | "success" | "warning" | "danger";
  /** Indeterminate loading state */
  indeterminate?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Track background style */
  trackStyle?: StyleProp<ViewStyle>;
  /** Filled bar style */
  fillStyle?: StyleProp<ViewStyle>;
  /** Label text style */
  labelStyle?: StyleProp<TextStyle>;
}

export function ProgressBar({
  value = 0,
  label,
  showPercent = false,
  size = "md",
  accent = colors.lime,
  tone,
  indeterminate = false,
  style,
  trackStyle,
  fillStyle,
  labelStyle,
}: ProgressBarProps) {
  const clamped = Math.min(
    100,
    Math.max(0, Number.isFinite(value) ? value : 0),
  );

  const barHeight = size === "sm" ? 4 : size === "lg" ? 10 : 7;

  const barColor =
    tone === "success"
      ? colors.success
      : tone === "warning"
        ? colors.warning
        : tone === "danger"
          ? colors.danger
          : accent;

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label || "Progress"}
      accessibilityValue={
        indeterminate
          ? undefined
          : { min: 0, max: 100, now: Math.round(clamped) }
      }
      style={[s.container, style]}
    >
      {(label || showPercent) && (
        <View style={s.labelRow}>
          {label && (
            <Text style={[s.label, labelStyle]} numberOfLines={1}>
              {label}
            </Text>
          )}
          {showPercent && !indeterminate && (
            <Text style={[s.percent, labelStyle]}>{Math.round(clamped)}%</Text>
          )}
        </View>
      )}

      <View style={[s.track, { height: barHeight }, trackStyle]}>
        <View
          style={[
            s.fill,
            indeterminate
              ? s.indeterminateFill
              : { width: `${clamped}%` },
            { backgroundColor: barColor },
            fillStyle,
          ]}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
  },
  labelRow: {
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: 12,
    fontWeight: "500",
    color: colors.ink,
  },
  percent: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
    flexShrink: 0,
  },
  track: {
    width: "100%",
    backgroundColor: colors.line,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  indeterminateFill: {
    width: "40%",
  },
});
