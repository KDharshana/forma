import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Badge,
  Button,
  Card,
  Divider,
  Icon,
  colors,
  mono,
} from "../components";

export type StopStatus = "pending" | "arrived" | "completed" | "failed";

export interface StopHeaderProps {
  stopNumber?: number;
  totalStops?: number;
  consigneeName?: string;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  timeWindow?: string;
  packagesCount?: number;
  specialInstructions?: string;
  requiresOtp?: boolean;
  status?: StopStatus;
  onNavigate?: () => void;
  onCall?: () => void;
  onComplete?: () => void;
  style?: ViewStyle;
}

export function StopHeader({
  stopNumber = 3,
  totalStops = 8,
  consigneeName = "Precision Hydraulics Manufacturing Ltd",
  address = "Plot 44/B, 2nd Cross, Peenya Industrial Area, Phase 2, Bangalore - 560058",
  contactName = "Mr. Raghu (Plant Receiving In-charge)",
  contactPhone = "+91 99000 54321",
  timeWindow = "11:30 AM – 12:15 PM",
  packagesCount = 4,
  specialInstructions = "Forklift unloading needed at Bay #3. Gate pass required at security entry.",
  requiresOtp = true,
  status = "arrived",
  onNavigate,
  onCall,
  onComplete,
  style,
}: StopHeaderProps) {
  const statusConfig = {
    pending: { label: "Pending", tone: "neutral" as const },
    arrived: { label: "Arrived at Stop", tone: "warning" as const },
    completed: { label: "Delivered", tone: "success" as const },
    failed: { label: "Delivery Failed", tone: "danger" as const },
  }[status];

  const badge = (
    <Badge tone={statusConfig.tone} dot={true}>
      {statusConfig.label}
    </Badge>
  );

  return (
    <Card
      title={`Stop ${stopNumber} of ${totalStops}`}
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* Consignee & Address */}
        <View style={s.consigneeSection}>
          <Text style={s.consigneeName}>{consigneeName}</Text>
          <View style={s.addressRow}>
            <Icon name="home" size={14} color={colors.muted} />
            <Text style={s.addressText}>{address}</Text>
          </View>
        </View>

        {/* Schedule & Contact Meta */}
        <View style={s.metaGrid}>
          <View style={s.metaCol}>
            <Text style={s.metaLabel}>Time Window</Text>
            <Text style={s.metaValue}>{timeWindow}</Text>
          </View>

          <View style={s.metaCol}>
            <Text style={s.metaLabel}>Consignment</Text>
            <Text style={s.metaValue}>{packagesCount} Crates / Packages</Text>
          </View>

          <View style={s.metaCol}>
            <Text style={s.metaLabel}>Contact In-Charge</Text>
            <Text style={s.metaValue}>{contactName}</Text>
            <Text style={[s.phoneText, s.monoText]}>{contactPhone}</Text>
          </View>
        </View>

        {/* Verification badges & Special instructions */}
        <View style={s.instructionsCard}>
          <View style={s.instHeadRow}>
            <View style={s.instBadgeRow}>
              {requiresOtp && (
                <Badge tone="lavender" dot={false}>
                  OTP Required
                </Badge>
              )}
              <Badge tone="neutral" dot={false}>
                Forklift Required
              </Badge>
            </View>
          </View>

          {specialInstructions && (
            <Text style={s.instructionsText}>{specialInstructions}</Text>
          )}
        </View>

        <Divider />

        {/* Actions Row */}
        <View style={s.actionsRow}>
          {onCall && (
            <Button variant="outline" size="sm" icon="phone" onPress={onCall}>
              Call Consignee
            </Button>
          )}

          {onNavigate && (
            <Button
              variant="secondary"
              size="sm"
              icon="external"
              onPress={onNavigate}
            >
              Navigate GPS
            </Button>
          )}

          {status !== "completed" && onComplete && (
            <Button
              variant="primary"
              size="sm"
              icon="check"
              onPress={onComplete}
            >
              Complete Stop
            </Button>
          )}
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
  consigneeSection: {
    gap: 6,
  },
  consigneeName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  addressText: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
    flex: 1,
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  metaCol: {
    flex: 1,
    minWidth: 150,
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  phoneText: {
    fontSize: 12,
    color: colors.muted,
  },
  monoText: {
    fontFamily: mono,
  },
  instructionsCard: {
    backgroundColor: colors.canvas,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 8,
  },
  instHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  instBadgeRow: {
    flexDirection: "row",
    gap: 6,
  },
  instructionsText: {
    fontSize: 12,
    color: colors.ink,
    lineHeight: 17,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
