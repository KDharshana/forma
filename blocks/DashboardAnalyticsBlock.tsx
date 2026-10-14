import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Card, Divider, SegmentedControl, colors } from "../components";

export interface AnalyticsBar {
  label: string;
  value: number;
  secondaryValue: number;
}

export interface DashboardAnalyticsBlockProps {
  data?: Record<"7D" | "30D" | "90D", AnalyticsBar[]>;
  accent?: string;
  style?: ViewStyle;
}

const chartData: Record<string, AnalyticsBar[]> = {
  "7D": [
    { label: "Mon", value: 45, secondaryValue: 30 },
    { label: "Tue", value: 68, secondaryValue: 42 },
    { label: "Wed", value: 52, secondaryValue: 38 },
    { label: "Thu", value: 89, secondaryValue: 55 },
    { label: "Fri", value: 74, secondaryValue: 60 },
    { label: "Sat", value: 95, secondaryValue: 70 },
    { label: "Sun", value: 110, secondaryValue: 82 },
  ],
  "30D": [
    { label: "W1", value: 240, secondaryValue: 180 },
    { label: "W2", value: 310, secondaryValue: 220 },
    { label: "W3", value: 290, secondaryValue: 240 },
    { label: "W4", value: 420, secondaryValue: 310 },
  ],
  "90D": [
    { label: "Month 1", value: 820, secondaryValue: 640 },
    { label: "Month 2", value: 980, secondaryValue: 760 },
    { label: "Month 3", value: 1240, secondaryValue: 920 },
  ],
};

export function DashboardAnalyticsBlock({
  data = chartData,
  accent = colors.lime,
  style,
}: DashboardAnalyticsBlockProps) {
  const [period, setPeriod] = useState<"7D" | "30D" | "90D">("7D");
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const bars = data[period].map((b) => ({
    ...b,
    value: Math.max(0, Number.isFinite(b.value) ? b.value : 0),
    secondaryValue: Math.max(
      0,
      Number.isFinite(b.secondaryValue) ? b.secondaryValue : 0,
    ),
  }));
  const selected = selectedIdx === null ? undefined : bars[selectedIdx];
  const maxVal =
    Math.max(...bars.map((b) => Math.max(b.value, b.secondaryValue))) || 1;

  const action = (
    <SegmentedControl
      options={["7D", "30D", "90D"]}
      value={period}
      onChange={(v) => {
        if (v === "7D" || v === "30D" || v === "90D") setPeriod(v);
        setSelectedIdx(null);
      }}
      accent={accent}
    />
  );

  return (
    <Card
      title="Sessions"
      action={action}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* Readout Row */}
        <View style={s.readoutRow}>
          <View style={s.metricsRow}>
            <View>
              <Text style={s.metricLabel}>Current period</Text>
              <Text style={s.metricVal}>
                {(selected
                  ? selected.value
                  : bars.reduce((sum, b) => sum + b.value, 0)
                ).toLocaleString()}
              </Text>
            </View>

            <Divider orientation="vertical" spacing={14} />

            <View>
              <Text style={s.metricLabel}>Previous period</Text>
              <Text style={s.metricVal}>
                {(selected
                  ? selected.secondaryValue
                  : bars.reduce((sum, b) => sum + b.secondaryValue, 0)
                ).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={s.legend}>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: colors.ink }]} />
              <Text style={s.legendText}>Current period</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: accent }]} />
              <Text style={s.legendText}>Previous period</Text>
            </View>
          </View>
        </View>

        <Text accessibilityLiveRegion="polite" style={s.subtitle}>
          {selected ? selected.label : "Period totals"}
        </Text>

        {/* Bar Chart Visualization */}
        <View style={s.chartContainer}>
          {bars.map((item, idx) => {
            const isSelected = selectedIdx === idx;
            const primaryHeight = (item.value / maxVal) * 120;
            const secondaryHeight = (item.secondaryValue / maxVal) * 120;

            return (
              <Pressable
                key={item.label}
                accessibilityRole="button"
                accessibilityLabel={`${item.label}: current ${item.value}, previous ${item.secondaryValue}`}
                accessibilityState={{ selected: isSelected }}
                onPress={() => setSelectedIdx(isSelected ? null : idx)}
                style={s.barCol}
              >
                <View style={s.barsWrapper}>
                  <View
                    style={[
                      s.bar,
                      { height: secondaryHeight, backgroundColor: accent },
                    ]}
                  />
                  <View
                    style={[
                      s.bar,
                      {
                        height: primaryHeight,
                        backgroundColor: isSelected ? colors.ink : "#72796b",
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    s.barLabel,
                    isSelected && { fontWeight: "700", color: colors.ink },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
  },
  body: {
    width: "100%",
    gap: 16,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
  },
  readoutRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    flexWrap: "wrap",
    gap: 12,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 11,
    color: colors.muted,
  },
  metricVal: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.ink,
    marginTop: 2,
  },
  legend: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: colors.muted,
  },
  chartContainer: {
    height: 160,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 10,
    gap: 4,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    ...(Platform.OS === "web" ? { cursor: "pointer" as any } : {}),
  },
  barsWrapper: {
    width: "100%",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
    marginBottom: 8,
  },
  bar: {
    width: "40%",
    maxWidth: 16,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 11,
    color: colors.muted,
  },
});
