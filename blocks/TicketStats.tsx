import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Badge, Card, Divider, Icon, colors, mono } from "../components";

export interface TicketStatsProps {
  totalOpen?: number;
  slaResolutionRate?: number; // e.g. 96.4%
  avgFirstResponse?: string; // e.g. "18 mins"
  breachedCount?: number;
  priorityCounts?: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  style?: ViewStyle;
}

export function TicketStats({
  totalOpen = 42,
  slaResolutionRate = 96.8,
  avgFirstResponse = "14 mins",
  breachedCount = 2,
  priorityCounts = {
    critical: 1,
    high: 6,
    medium: 21,
    low: 14,
  },
  style,
}: TicketStatsProps) {
  const isHealthy = breachedCount === 0;

  const badge = (
    <Badge tone={isHealthy ? "success" : "warning"} dot={true}>
      {isHealthy ? "SLA Target Met" : `${breachedCount} Breaches`}
    </Badge>
  );

  return (
    <Card
      title="Service Level Agreement & Ticket Pulse"
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* 4 Metric Cards Grid */}
        <View style={s.metricGrid}>
          <View style={s.metricCard}>
            <Text style={s.metricLabel}>Open Queue</Text>
            <Text style={[s.metricVal, s.monoText]}>{totalOpen}</Text>
            <Text style={s.metricSub}>Active tickets</Text>
          </View>

          <View style={s.metricCard}>
            <Text style={s.metricLabel}>SLA Compliance</Text>
            <Text style={[s.metricValSuccess, s.monoText]}>
              {slaResolutionRate}%
            </Text>
            <Text style={s.metricSub}>Target: &gt;95%</Text>
          </View>

          <View style={s.metricCard}>
            <Text style={s.metricLabel}>Avg First Response</Text>
            <Text style={[s.metricVal, s.monoText]}>{avgFirstResponse}</Text>
            <Text style={s.metricSub}>Median response</Text>
          </View>

          <View
            style={[s.metricCard, breachedCount > 0 && s.metricCardWarning]}
          >
            <Text style={s.metricLabel}>SLA Breaches</Text>
            <Text
              style={[
                breachedCount > 0 ? s.metricValDanger : s.metricVal,
                s.monoText,
              ]}
            >
              {breachedCount}
            </Text>
            <Text style={s.metricSub}>Requires escalation</Text>
          </View>
        </View>

        <Divider />

        {/* Priority Tiers Breakdown */}
        <View style={s.prioritySection}>
          <Text style={s.priorityTitle}>Active Queue by Priority</Text>
          <View style={s.priorityRow}>
            <View style={s.pCard}>
              <View style={[s.pDot, { backgroundColor: colors.danger }]} />
              <Text style={s.pLabel}>P1 Critical</Text>
              <Text style={[s.pVal, s.monoText]}>
                {priorityCounts.critical}
              </Text>
            </View>

            <View style={s.pCard}>
              <View style={[s.pDot, { backgroundColor: colors.warning }]} />
              <Text style={s.pLabel}>P2 High</Text>
              <Text style={[s.pVal, s.monoText]}>{priorityCounts.high}</Text>
            </View>

            <View style={s.pCard}>
              <View style={[s.pDot, { backgroundColor: colors.ink }]} />
              <Text style={s.pLabel}>P3 Medium</Text>
              <Text style={[s.pVal, s.monoText]}>{priorityCounts.medium}</Text>
            </View>

            <View style={s.pCard}>
              <View style={[s.pDot, { backgroundColor: colors.muted }]} />
              <Text style={s.pLabel}>P4 Low</Text>
              <Text style={[s.pVal, s.monoText]}>{priorityCounts.low}</Text>
            </View>
          </View>
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
    gap: 16,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: 130,
    backgroundColor: colors.canvas,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 4,
  },
  metricCardWarning: {
    borderColor: "#f5c6c2",
    backgroundColor: colors.dangerBg,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
  },
  metricVal: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.ink,
  },
  metricValSuccess: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.success,
  },
  metricValDanger: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.danger,
  },
  metricSub: {
    fontSize: 11,
    color: colors.muted,
  },
  monoText: {
    fontFamily: mono,
  },
  prioritySection: {
    gap: 8,
  },
  priorityTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  priorityRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pCard: {
    flex: 1,
    minWidth: 90,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 6,
  },
  pDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pLabel: {
    fontSize: 12,
    color: colors.ink,
    flex: 1,
  },
  pVal: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.ink,
  },
});
