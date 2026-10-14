import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Badge, Button, Card, Icon, colors, mono } from "../components";

export type TripStatus = "dispatched" | "in_transit" | "delayed" | "completed";

export interface TripItem {
  id: string;
  tripNumber: string;
  vehicleNo: string;
  driverName: string;
  origin: string;
  destination: string;
  status: TripStatus;
  progressPercent: number;
  eta: string;
}

export interface TripBoardProps {
  trips?: TripItem[];
  onSelectTrip?: (trip: TripItem) => void;
  onCreateTrip?: () => void;
  style?: ViewStyle;
}

export function TripBoard({
  trips = [
    {
      id: "TRP-101",
      tripNumber: "TRP-101",
      vehicleNo: "KA-01-MJ-8819",
      driverName: "Sanjay Verma",
      origin: "Bangalore Hub",
      destination: "Chennai Central",
      status: "in_transit",
      progressPercent: 65,
      eta: "Today, 04:30 PM",
    },
    {
      id: "TRP-102",
      tripNumber: "TRP-102",
      vehicleNo: "MH-12-PQ-4412",
      driverName: "Anand Shinde",
      origin: "Pune Depot",
      destination: "Mumbai JNPT Port",
      status: "delayed",
      progressPercent: 30,
      eta: "Delayed +1.5h",
    },
    {
      id: "TRP-103",
      tripNumber: "TRP-103",
      vehicleNo: "DL-01-AX-9921",
      driverName: "Balwinder Singh",
      origin: "Delhi NCR",
      destination: "Jaipur Logistics Park",
      status: "dispatched",
      progressPercent: 10,
      eta: "Tomorrow, 08:00 AM",
    },
    {
      id: "TRP-104",
      tripNumber: "TRP-104",
      vehicleNo: "TN-07-ZZ-1209",
      driverName: "K. Murugan",
      origin: "Coimbatore Hub",
      destination: "Kochi Port",
      status: "completed",
      progressPercent: 100,
      eta: "Completed 11:20 AM",
    },
  ],
  onSelectTrip,
  onCreateTrip,
  style,
}: TripBoardProps) {
  const [filter, setFilter] = useState<"all" | TripStatus>("all");

  const statusTones: Record<
    TripStatus,
    { label: string; tone: "neutral" | "warning" | "success" | "danger" }
  > = {
    dispatched: { label: "Dispatched", tone: "neutral" },
    in_transit: { label: "In Transit", tone: "success" },
    delayed: { label: "Delayed", tone: "danger" },
    completed: { label: "Delivered", tone: "neutral" },
  };

  const filteredTrips =
    filter === "all" ? trips : trips.filter((t) => t.status === filter);

  const badge = (
    <Badge tone="neutral" dot={false}>
      {trips.length} Active Runs
    </Badge>
  );

  return (
    <Card
      title="Fleet Dispatch Board"
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* Filter Pills */}
        <View style={s.filterRow}>
          {(
            ["all", "in_transit", "delayed", "dispatched", "completed"] as const
          ).map((f) => {
            const isSelected = filter === f;
            const count =
              f === "all"
                ? trips.length
                : trips.filter((t) => t.status === f).length;
            const label =
              f === "all"
                ? "All Trips"
                : f === "in_transit"
                  ? "In Transit"
                  : f === "delayed"
                    ? "Delayed"
                    : f === "dispatched"
                      ? "Dispatched"
                      : "Completed";

            return (
              <Pressable
                key={f}
                accessibilityRole="button"
                onPress={() => setFilter(f)}
                style={[s.pill, isSelected && s.pillActive]}
              >
                <Text style={[s.pillText, isSelected && s.pillTextActive]}>
                  {label} ({count})
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Trips List */}
        <View style={s.tripsList}>
          {filteredTrips.map((trip) => {
            const tone = statusTones[trip.status].tone;
            const label = statusTones[trip.status].label;

            return (
              <Pressable
                key={trip.id}
                accessibilityRole="button"
                onPress={() => onSelectTrip?.(trip)}
                style={({ pressed }) => [
                  s.tripCard,
                  pressed && { backgroundColor: colors.canvas },
                ]}
              >
                <View style={s.tripHead}>
                  <View style={s.tripHeadLeft}>
                    <Text style={s.tripNo}>{trip.tripNumber}</Text>
                    <Text style={[s.vehicleNo, s.monoText]}>
                      {trip.vehicleNo}
                    </Text>
                  </View>
                  <Badge tone={tone} dot={true}>
                    {label}
                  </Badge>
                </View>

                {/* Route */}
                <View style={s.routeRow}>
                  <Text style={s.routeNode}>{trip.origin}</Text>
                  <View style={s.routeDivider}>
                    <Icon name="arrowRight" size={12} color={colors.muted} />
                  </View>
                  <Text style={s.routeNode}>{trip.destination}</Text>
                </View>

                {/* Footer driver & ETA */}
                <View style={s.tripFooter}>
                  <View style={s.driverCol}>
                    <Icon name="users" size={13} color={colors.muted} />
                    <Text style={s.driverText}>{trip.driverName}</Text>
                  </View>

                  <Text
                    style={[
                      s.etaText,
                      trip.status === "delayed" && s.etaDelayed,
                    ]}
                  >
                    ETA: {trip.eta}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {onCreateTrip && (
          <Button
            variant="outline"
            size="sm"
            icon="plus"
            onPress={onCreateTrip}
          >
            Schedule New Fleet Trip
          </Button>
        )}
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
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pillActive: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  pillText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.muted,
  },
  pillTextActive: {
    color: colors.paper,
    fontWeight: "600",
  },
  tripsList: {
    gap: 10,
  },
  tripCard: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  tripHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tripHeadLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tripNo: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
  vehicleNo: {
    fontSize: 12,
    color: colors.muted,
  },
  monoText: {
    fontFamily: mono,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  routeNode: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  routeDivider: {
    paddingHorizontal: 2,
  },
  tripFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  driverCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  driverText: {
    fontSize: 12,
    color: colors.muted,
  },
  etaText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
  },
  etaDelayed: {
    color: colors.danger,
  },
});
