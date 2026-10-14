import React from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";

export interface MetricPoint {
  label: string;
  value: number;
}

export interface MetricCardProps {
  /** Metric title */
  title?: string;
  /** Formatted metric value */
  value?: string;
  /** Percentage or value change string */
  change?: string;
  /** Subtitle or comparison label */
  comparisonLabel?: string;
  /** Data points for mini bar chart */
  points: MetricPoint[];
  /** Accent highlight color for latest bar and change label */
  accent?: string;
  /** Optional click handler making card interactive */
  onPress?: () => void;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Title text style */
  titleStyle?: StyleProp<TextStyle>;
  /** Value text style */
  valueStyle?: StyleProp<TextStyle>;
}

export function MetricCard({
  title = "Total revenue",
  value = "$24,680",
  change,
  comparisonLabel,
  points,
  accent = colors.lime,
  onPress,
  style,
  titleStyle,
  valueStyle,
}: MetricCardProps) {
  const max = Math.max(
    ...points.map((p) => Math.max(0, Number.isFinite(p.value) ? p.value : 0)),
    1,
  );

  const content = (
    <>
      <View style={s.row}>
        <Text style={[s.label, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={[s.row, s.valueRow]}>
        <Text style={[s.value, valueStyle]} numberOfLines={1}>
          {value}
        </Text>
        {change && (
          <Text style={[s.change, { color: accent }]} numberOfLines={1}>
            {change}
          </Text>
        )}
      </View>
      {comparisonLabel && (
        <Text style={s.caption} numberOfLines={2}>
          {comparisonLabel}
        </Text>
      )}
      <View
        accessible
        style={s.chart}
        accessibilityRole="image"
        accessibilityLabel={points
          .map((p) => `${p.label}: ${p.value}`)
          .join(", ")}
      >
        {points.map((point, i) => (
          <View style={s.column} key={`${point.label}-${i}`}>
            <View
              style={[
                s.bar,
                {
                  height: Math.max(
                    4,
                    (Math.max(
                      0,
                      Number.isFinite(point.value) ? point.value : 0,
                    ) /
                      max) *
                      66,
                  ),
                  backgroundColor: i === points.length - 1 ? accent : "#454c3d",
                },
              ]}
            />
            <Text style={s.axis} numberOfLines={1}>
              {point.label}
            </Text>
          </View>
        ))}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed, hovered }: any) => [
          s.card,
          (pressed || hovered) && s.cardActive,
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[s.card, style]}>{content}</View>;
}

const s = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#262d23",
    borderRadius: 22,
    padding: 22,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none" } as any)
      : {}),
  },
  cardActive: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  row: {
    flexWrap: "wrap",
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  valueRow: {
    marginTop: 14,
    alignItems: "baseline",
  },
  label: {
    color: "#c5c9bf",
    fontSize: 12,
    flexShrink: 1,
  },
  value: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "500",
    letterSpacing: -1.2,
    flexShrink: 1,
    minWidth: 0,
  },
  change: {
    fontSize: 11,
    fontWeight: "600",
    flexShrink: 0,
  },
  caption: {
    color: "#8f9887",
    fontSize: 12,
    marginTop: 5,
    flexShrink: 1,
  },
  chart: {
    height: 96,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginTop: 14,
  },
  column: {
    flex: 1,
    alignItems: "center",
    gap: 9,
  },
  bar: {
    width: "100%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  axis: {
    fontSize: 11,
    color: "#9ba392",
  },
});
