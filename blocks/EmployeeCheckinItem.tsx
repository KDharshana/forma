import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Badge, Card, Icon, colors, mono } from "../components";

export type CheckinStatus =
  "on_time" | "late" | "early_departure" | "geofence_violation";

export interface EmployeeCheckinItemProps {
  staffName?: string;
  staffId?: string;
  role?: string;
  date?: string;
  checkInTime?: string;
  checkOutTime?: string;
  duration?: string;
  locationName?: string;
  coordinates?: string;
  status?: CheckinStatus;
  hasPhotoProof?: boolean;
  style?: ViewStyle;
}

export function EmployeeCheckinItem({
  staffName = "Ramesh Kumar",
  staffId = "DRV-102",
  role = "Fleet Route Driver",
  date = "Today, 14 Oct 2026",
  checkInTime = "08:24 AM",
  checkOutTime = "05:48 PM",
  duration = "9h 24m",
  locationName = "Peenya Industrial Area Depot, Bangalore",
  coordinates = "13.0285° N, 77.5197° E",
  status = "on_time",
  hasPhotoProof = true,
  style,
}: EmployeeCheckinItemProps) {
  const statusConfig: Record<
    CheckinStatus,
    { label: string; tone: "success" | "warning" | "danger" | "neutral" }
  > = {
    on_time: { label: "On Time (Verified)", tone: "success" },
    late: { label: "Late Check-in", tone: "warning" },
    early_departure: { label: "Early Departure", tone: "warning" },
    geofence_violation: { label: "Geofence Mismatch", tone: "danger" },
  };

  const badge = (
    <Badge tone={statusConfig[status].tone} dot={true}>
      {statusConfig[status].label}
    </Badge>
  );

  return (
    <Card
      title={`${staffName} (${staffId})`}
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* Role & Date Subhead */}
        <View style={s.subheadRow}>
          <Text style={s.roleText}>{role}</Text>
          <Text style={s.dateText}>{date}</Text>
        </View>

        {/* Timestamps & Duration Bar */}
        <View style={s.timeRow}>
          <View style={s.timeCol}>
            <Text style={s.timeLabel}>In</Text>
            <Text style={s.timeValue}>{checkInTime}</Text>
          </View>

          <View style={s.arrowCol}>
            <Icon name="arrowRight" size={14} color={colors.muted} />
          </View>

          <View style={s.timeCol}>
            <Text style={s.timeLabel}>Out</Text>
            <Text style={s.timeValue}>{checkOutTime || "—"}</Text>
          </View>

          <View style={s.durationBadge}>
            <Text style={s.durationLabel}>Shift</Text>
            <Text style={s.durationValue}>{duration}</Text>
          </View>
        </View>

        {/* GPS Geostamp Tag */}
        <View style={s.geoStampBox}>
          <View style={s.geoIcon}>
            <Icon name="home" size={14} color={colors.ink} />
          </View>
          <View style={s.geoCol}>
            <Text style={s.locationNameText}>{locationName}</Text>
            <Text style={s.coordinatesText}>{coordinates}</Text>
          </View>

          {hasPhotoProof && (
            <View style={s.photoProofTag}>
              <Icon name="checkCircle" size={12} color={colors.success} />
              <Text style={s.photoProofText}>Photo OK</Text>
            </View>
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
    gap: 12,
  },
  subheadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roleText: {
    fontSize: 13,
    color: colors.muted,
  },
  dateText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.muted,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.canvas,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 12,
  },
  timeCol: {
    gap: 2,
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
  },
  timeValue: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: mono,
    color: colors.ink,
  },
  arrowCol: {
    paddingHorizontal: 4,
  },
  durationBadge: {
    marginLeft: "auto",
    alignItems: "flex-end",
    gap: 2,
  },
  durationLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
  },
  durationValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
  geoStampBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    padding: 10,
    gap: 10,
  },
  geoIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
  },
  geoCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  locationNameText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
  },
  coordinatesText: {
    fontSize: 11,
    fontFamily: mono,
    color: colors.muted,
  },
  photoProofTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.successBg,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  photoProofText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.success,
  },
});
