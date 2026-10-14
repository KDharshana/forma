import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Badge,
  Button,
  Card,
  Divider,
  Icon,
  ProgressBar,
  colors,
  mono,
} from "../components";

export type TripLiveState = "dispatched" | "in_transit" | "delayed" | "arrived";

export interface TripHeaderProps {
  tripNumber?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  driverName?: string;
  driverPhone?: string;
  origin?: string;
  destination?: string;
  eta?: string;
  distanceKm?: number;
  completedKm?: number;
  status?: TripLiveState;
  onCallDriver?: () => void;
  onViewGPS?: () => void;
  onViewManifest?: () => void;
  style?: ViewStyle;
}

export function TripHeader({
  tripNumber = "TRP-2026-0914",
  vehicleNumber = "KA-01-MJ-8819",
  vehicleType = "32ft Multi-Axle Container (14 Ton)",
  driverName = "Sanjay Verma",
  driverPhone = "+91 98450 12345",
  origin = "BLR Central Logistics Hub",
  destination = "Chennai Port CFS Terminal #2",
  eta = "Today, 04:30 PM (On Schedule)",
  distanceKm = 348,
  completedKm = 226,
  status = "in_transit",
  onCallDriver,
  onViewGPS,
  onViewManifest,
  style,
}: TripHeaderProps) {
  const percent = Math.min(
    100,
    Math.round((completedKm / (distanceKm || 1)) * 100),
  );

  const statusConfig = {
    dispatched: { label: "Dispatched", tone: "neutral" as const },
    in_transit: { label: "In Transit", tone: "success" as const },
    delayed: { label: "Delayed (+45m)", tone: "danger" as const },
    arrived: { label: "Arrived at Gate", tone: "success" as const },
  }[status];

  const badge = (
    <Badge tone={statusConfig.tone} dot={true}>
      {statusConfig.label}
    </Badge>
  );

  return (
    <Card
      title={`Trip ${tripNumber}`}
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* Route Direction */}
        <View style={s.routeContainer}>
          <View style={s.routePoint}>
            <Text style={s.pointType}>Origin</Text>
            <Text style={s.pointName}>{origin}</Text>
          </View>

          <View style={s.routeArrowWrap}>
            <Icon name="arrowRight" size={16} color={colors.ink} />
          </View>

          <View style={s.routePoint}>
            <Text style={s.pointType}>Destination</Text>
            <Text style={s.pointName}>{destination}</Text>
          </View>
        </View>

        {/* Progress Timeline */}
        <View style={s.progressSection}>
          <View style={s.progressLabels}>
            <Text style={s.progressText}>
              Covered {completedKm} km of {distanceKm} km ({percent}%)
            </Text>
            <Text style={s.etaText}>ETA: {eta}</Text>
          </View>
          <ProgressBar value={percent} tone="accent" size="md" />
        </View>

        <Divider />

        {/* Vehicle & Driver Details */}
        <View style={s.detailsGrid}>
          <View style={s.detailCol}>
            <Text style={s.detailLabel}>Assigned Vehicle</Text>
            <Text style={[s.vehicleNoText, s.monoText]}>{vehicleNumber}</Text>
            <Text style={s.detailSub}>{vehicleType}</Text>
          </View>

          <View style={s.detailCol}>
            <Text style={s.detailLabel}>Primary Driver</Text>
            <Text style={s.driverNameText}>{driverName}</Text>
            <Text style={[s.detailSub, s.monoText]}>{driverPhone}</Text>
          </View>
        </View>

        {/* Actions Row */}
        <View style={s.actionsRow}>
          {onCallDriver && (
            <Button
              variant="outline"
              size="sm"
              icon="phone"
              onPress={onCallDriver}
            >
              Call Driver
            </Button>
          )}

          {onViewGPS && (
            <Button variant="outline" size="sm" icon="home" onPress={onViewGPS}>
              Live Telematics
            </Button>
          )}

          {onViewManifest && (
            <Button
              variant="secondary"
              size="sm"
              icon="file"
              onPress={onViewManifest}
            >
              Trip Manifest
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
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.canvas,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 12,
  },
  routePoint: {
    flex: 1,
    gap: 3,
  },
  pointType: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
  },
  pointName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.ink,
  },
  routeArrowWrap: {
    paddingHorizontal: 8,
  },
  progressSection: {
    gap: 8,
  },
  progressLabels: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  progressText: {
    fontSize: 12,
    color: colors.muted,
  },
  etaText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  detailCol: {
    flex: 1,
    minWidth: 160,
    gap: 2,
  },
  detailLabel: {
    fontSize: 11,
    color: colors.muted,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  vehicleNoText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
  driverNameText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
  detailSub: {
    fontSize: 12,
    color: colors.muted,
  },
  monoText: {
    fontFamily: mono,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingTop: 4,
  },
});
