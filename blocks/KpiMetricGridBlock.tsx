import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Badge, Card, Icon, colors } from "../components";
import Svg, { Path } from "react-native-svg";

export interface KpiItem {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  description: string;
  points: number[];
}

export interface KpiMetricGridBlockProps {
  items?: KpiItem[];
  accent?: string;
  style?: ViewStyle;
}

const defaultKpis: KpiItem[] = [
  {
    id: "mrr",
    title: "Monthly Recurring Revenue",
    value: "$48,920",
    change: "+18.4%",
    trend: "up",
    description: "vs. previous month",
    points: [24, 30, 28, 42, 38, 55, 62],
  },
  {
    id: "active_users",
    title: "Active Organizations",
    value: "1,420",
    change: "+12.1%",
    trend: "up",
    description: "vs. previous month",
    points: [15, 22, 28, 35, 34, 48, 58],
  },
  {
    id: "conversion",
    title: "Trial-to-Paid Conversion",
    value: "8.6%",
    change: "+1.8%",
    trend: "up",
    description: "cohort 30-day window",
    points: [5.2, 5.8, 6.4, 7.1, 7.8, 8.2, 8.6],
  },
  {
    id: "churn",
    title: "Net Revenue Churn",
    value: "0.8%",
    change: "-0.4%",
    trend: "down",
    description: "vs. previous month",
    points: [1.8, 1.6, 1.4, 1.2, 1.1, 0.9, 0.8],
  },
];

function MiniSparkline({ points, color }: { points: number[]; color: string }) {
  points = points.filter(Number.isFinite);
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const w = 70;
  const h = 26;

  const pathD = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / range) * (h - 6) - 3;
      return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <Path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function KpiMetricGridBlock({
  items = defaultKpis,
  accent = colors.lime,
  style,
}: KpiMetricGridBlockProps) {
  return (
    <View style={[s.grid, style]}>
      {items.map((kpi) => {
        const isPositive = kpi.trend === "up";
        return (
          <Card key={kpi.id} variant="elevated" style={s.card}>
            <View style={s.topRow}>
              <Text style={s.title}>{kpi.title}</Text>
              <Badge tone={isPositive ? "success" : "neutral"}>
                {kpi.change}
              </Badge>
            </View>

            <View style={s.middleRow}>
              <Text style={s.value}>{kpi.value}</Text>
              <MiniSparkline
                points={kpi.points}
                color={isPositive ? "#4f7a28" : "#72796b"}
              />
            </View>

            <View style={s.bottomRow}>
              <Icon
                name={isPositive ? "arrowUp" : "arrowDown"}
                size={12}
                color={isPositive ? colors.success : colors.muted}
              />
              <Text style={s.description}>{kpi.description}</Text>
            </View>
          </Card>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    flex: 1,
    flexBasis: 220,
    minWidth: 0,
    padding: 18,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.muted,
    flex: 1,
    minWidth: 0,
  },
  middleRow: {
    flexWrap: "wrap",
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 10,
  },
  value: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.ink,
    letterSpacing: -0.8,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  description: {
    flexShrink: 1,
    fontSize: 11,
    color: colors.muted,
  },
});
