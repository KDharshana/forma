import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Badge, Card, Icon, colors, mono } from "../components";

export type CheckpointStatus = "completed" | "current" | "upcoming";

export interface TrackingCheckpoint {
  id: string;
  title: string;
  location?: string;
  timestamp?: string;
  status: CheckpointStatus;
  description?: string;
}

export interface TrackingStatusBarProps {
  awbNumber?: string;
  carrier?: string;
  checkpoints?: TrackingCheckpoint[];
  estimatedDelivery?: string;
  style?: ViewStyle;
}

export function TrackingStatusBar({
  awbNumber = "AWB-894102914",
  carrier = "Apex Freight Logistics",
  estimatedDelivery = "Tomorrow by 06:00 PM",
  checkpoints = [
    {
      id: "1",
      title: "Consignment Booked & Manifested",
      location: "Bangalore Depot",
      timestamp: "13 Oct, 09:15 AM",
      status: "completed",
    },
    {
      id: "2",
      title: "Departed Origin Logistics Hub",
      location: "BLR Central Terminal",
      timestamp: "13 Oct, 07:45 PM",
      status: "completed",
    },
    {
      id: "3",
      title: "In Transit via Toll Expressway",
      location: "NH-48 Checkpoint #3",
      timestamp: "14 Oct, 06:20 AM",
      status: "current",
      description: "Vehicle moving at 64 km/h towards destination hub.",
    },
    {
      id: "4",
      title: "Arrived at Destination Distribution Hub",
      location: "Chennai Hub",
      status: "upcoming",
    },
    {
      id: "5",
      title: "Out for Final Mile Delivery",
      location: "Customer Facility",
      status: "upcoming",
    },
  ],
  style,
}: TrackingStatusBarProps) {
  const currentCheckpoint = checkpoints.find((c) => c.status === "current");

  const badge = (
    <Badge tone="success" dot={true}>
      In Transit
    </Badge>
  );

  return (
    <Card
      title={`Shipment ${awbNumber}`}
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* Carrier & ETA row */}
        <View style={s.summaryRow}>
          <View style={s.summaryCol}>
            <Text style={s.carrierText}>{carrier}</Text>
            <Text style={[s.awbText, s.monoText]}>{awbNumber}</Text>
          </View>

          <View style={s.etaCol}>
            <Text style={s.etaLabel}>Expected Delivery</Text>
            <Text style={s.etaVal}>{estimatedDelivery}</Text>
          </View>
        </View>

        {/* Checkpoint Milestone Sequence */}
        <View style={s.timeline}>
          {checkpoints.map((cp, idx) => {
            const isLast = idx === checkpoints.length - 1;
            const isDone = cp.status === "completed";
            const isCurrent = cp.status === "current";

            return (
              <View key={cp.id} style={s.timelineItem}>
                {/* Node & Line */}
                <View style={s.nodeCol}>
                  <View
                    style={[
                      s.nodeCircle,
                      isDone && s.nodeCircleDone,
                      isCurrent && s.nodeCircleCurrent,
                    ]}
                  >
                    {isDone ? (
                      <Icon name="check" size={11} color={colors.paper} />
                    ) : isCurrent ? (
                      <View style={s.innerDot} />
                    ) : null}
                  </View>

                  {!isLast && (
                    <View
                      style={[s.connectingLine, isDone && s.connectingLineDone]}
                    />
                  )}
                </View>

                {/* Content */}
                <View style={[s.contentCol, !isLast && s.contentSpacing]}>
                  <View style={s.titleRow}>
                    <Text
                      style={[
                        s.cpTitle,
                        isCurrent && s.cpTitleCurrent,
                        !isDone && !isCurrent && s.cpTitleUpcoming,
                      ]}
                    >
                      {cp.title}
                    </Text>
                    {cp.timestamp && (
                      <Text style={s.timestampText}>{cp.timestamp}</Text>
                    )}
                  </View>

                  {cp.location && (
                    <Text style={s.locationText}>{cp.location}</Text>
                  )}

                  {cp.description && (
                    <View style={s.descBox}>
                      <Text style={s.descText}>{cp.description}</Text>
                    </View>
                  )}
                </View>
              </View>
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
    gap: 16,
  },
  summaryRow: {
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
  summaryCol: {
    gap: 2,
  },
  carrierText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.ink,
  },
  awbText: {
    fontSize: 12,
    color: colors.muted,
  },
  monoText: {
    fontFamily: mono,
  },
  etaCol: {
    alignItems: "flex-end",
    gap: 2,
  },
  etaLabel: {
    fontSize: 11,
    color: colors.muted,
  },
  etaVal: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.ink,
  },
  timeline: {
    paddingVertical: 4,
  },
  timelineItem: {
    flexDirection: "row",
  },
  nodeCol: {
    alignItems: "center",
    width: 24,
    marginRight: 12,
  },
  nodeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.canvas,
    borderWidth: 2,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  nodeCircleDone: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  nodeCircleCurrent: {
    backgroundColor: colors.lime,
    borderColor: colors.ink,
  },
  innerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.ink,
  },
  connectingLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
    backgroundColor: colors.line,
    marginVertical: 2,
  },
  connectingLineDone: {
    backgroundColor: colors.ink,
  },
  contentCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  contentSpacing: {
    paddingBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cpTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    flex: 1,
  },
  cpTitleCurrent: {
    fontWeight: "700",
    color: colors.ink,
  },
  cpTitleUpcoming: {
    color: colors.muted,
    fontWeight: "400",
  },
  timestampText: {
    fontSize: 11,
    color: colors.muted,
    flexShrink: 0,
  },
  locationText: {
    fontSize: 12,
    color: colors.muted,
  },
  descBox: {
    marginTop: 4,
    backgroundColor: colors.canvas,
    borderRadius: 6,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  descText: {
    fontSize: 11,
    color: colors.ink,
    lineHeight: 16,
  },
});
