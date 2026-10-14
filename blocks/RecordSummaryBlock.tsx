import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Avatar, Card, Divider, Icon, TagChip, colors } from "../components";

export interface RecordSummaryBlockProps {
  ownerName?: string;
  clientName?: string;
  clientEmail?: string;
  dueDate?: string;
  contractValue?: string;
  tags?: string[];
  accent?: string;
  style?: ViewStyle;
}

export function RecordSummaryBlock({
  ownerName = "Alex Chen",
  clientName = "Acme Studios Inc.",
  clientEmail = "billing@acmestudios.com",
  dueDate = "Nov 15, 2026",
  contractValue = "$28,500.00",
  tags = ["Design System", "Mobile", "Q4 Milestone"],
  accent = colors.lime,
  style,
}: RecordSummaryBlockProps) {
  return (
    <Card title="Record Overview" style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        <View style={s.grid}>
          {/* Item 1: Owner */}
          <Card variant="outlined" style={s.item}>
            <Text style={s.label}>Owner</Text>
            <View style={s.ownerRow}>
              <Avatar name={ownerName} size="sm" />
              <Text style={s.ownerText}>{ownerName}</Text>
            </View>
          </Card>

          {/* Item 2: Client */}
          <Card variant="outlined" style={s.item}>
            <Text style={s.label}>Client</Text>
            <Text style={s.valueBold}>{clientName}</Text>
            <Text style={s.valueSub}>{clientEmail}</Text>
          </Card>

          {/* Item 3: Due Date */}
          <Card variant="outlined" style={s.item}>
            <Text style={s.label}>Due date</Text>
            <View style={s.dateRow}>
              <Icon name="calendar" size={14} color={colors.muted} />
              <Text style={s.valueBold}>{dueDate}</Text>
            </View>
          </Card>

          {/* Item 4: Budget */}
          <Card variant="outlined" style={s.item}>
            <Text style={s.label}>Contract value</Text>
            <Text style={[s.valueBold, s.valueAmount]}>{contractValue}</Text>
          </Card>
        </View>

        {/* Tags Section */}
        {!!tags.length && (
          <>
            <Divider spacing={12} />
            <View style={s.tagsSection}>
              <Text style={s.label}>Tags</Text>
              <View style={s.chipsRow}>
                {tags.map((t) => (
                  <TagChip key={t} label={t} accent={accent} />
                ))}
              </View>
            </View>
          </>
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
    width: "100%",
    gap: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  item: {
    flex: 1,
    flexBasis: 180,
    minWidth: 0,
    backgroundColor: colors.canvas,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
    minWidth: 0,
  },
  ownerText: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  valueBold: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  valueAmount: {
    fontSize: 18,
    letterSpacing: -0.5,
  },
  valueSub: {
    fontSize: 11,
    color: colors.muted,
    flexShrink: 1,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  tagsSection: {
    gap: 8,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});
