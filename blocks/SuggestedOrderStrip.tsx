import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Badge, Button, Icon, colors, mono } from "../components";

export interface SuggestedOrderStripProps {
  sku?: string;
  productName?: string;
  runoutDays?: number;
  dailyVelocity?: number;
  suggestedQuantity?: number;
  estimatedCost?: string;
  onAccept?: () => void;
  onDismiss?: () => void;
  style?: ViewStyle;
}

export function SuggestedOrderStrip({
  sku = "HYD-HSE-050",
  productName = "Heavy Duty Hydraulic Hose 1/2 inch",
  runoutDays = 4,
  dailyVelocity = 38,
  suggestedQuantity = 400,
  estimatedCost = "₹48,000.00",
  onAccept,
  onDismiss,
  style,
}: SuggestedOrderStripProps) {
  const isUrgent = runoutDays <= 3;

  return (
    <View style={[s.strip, isUrgent && s.stripUrgent, style]}>
      {/* Icon & Predictive Lead */}
      <View style={s.leadRow}>
        <View style={[s.iconBox, isUrgent ? s.iconBoxUrgent : s.iconBoxNormal]}>
          <Icon
            name={isUrgent ? "alertTriangle" : "spark"}
            size={16}
            color={isUrgent ? colors.danger : colors.ink}
          />
        </View>

        <View style={s.contentCol}>
          <View style={s.titleRow}>
            <Text style={s.productTitle} numberOfLines={1}>
              {productName}
            </Text>
            <Badge tone={isUrgent ? "danger" : "warning"} dot={true}>
              Stockout in {runoutDays} days
            </Badge>
          </View>

          <Text style={s.metricSummary}>
            Velocity:{" "}
            <Text style={s.strongText}>{dailyVelocity} units/day</Text> •
            Suggested PO:{" "}
            <Text style={[s.strongText, s.monoText]}>
              {suggestedQuantity} units
            </Text>{" "}
            ({estimatedCost})
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={s.actionsRow}>
        {onDismiss && (
          <Button variant="ghost" size="sm" onPress={onDismiss}>
            Dismiss
          </Button>
        )}
        {onAccept && (
          <Button variant="primary" size="sm" icon="plus" onPress={onAccept}>
            Add to PO
          </Button>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  strip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.paper,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 16,
    flexWrap: "wrap",
  },
  stripUrgent: {
    borderColor: "#f5c6c2",
    backgroundColor: "#fffdfd",
  },
  leadRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 260,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconBoxNormal: {
    backgroundColor: colors.lime,
  },
  iconBoxUrgent: {
    backgroundColor: colors.dangerBg,
  },
  contentCol: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
  metricSummary: {
    fontSize: 12,
    color: colors.muted,
  },
  strongText: {
    fontWeight: "600",
    color: colors.ink,
  },
  monoText: {
    fontFamily: mono,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
});
