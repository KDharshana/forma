import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Avatar, Badge, Card, TagChip, colors } from "../components";

export interface TimelineEvent {
  id: string;
  actor: string;
  action: string;
  target: string;
  category: "team" | "security" | "billing";
  time: string;
  badge?: string;
}

export interface ActivityTimelineBlockProps {
  events?: TimelineEvent[];
  accent?: string;
  style?: ViewStyle;
}

const sampleEvents: TimelineEvent[] = [
  {
    id: "1",
    actor: "Alex Chen",
    action: "deployed release version",
    target: "v1.4.2 to Production",
    category: "security",
    time: "12m ago",
    badge: "Success",
  },
  {
    id: "2",
    actor: "Sam Lee",
    action: "invited 2 new collaborators",
    target: "to Design Systems team",
    category: "team",
    time: "1h ago",
  },
  {
    id: "3",
    actor: "Billing System",
    action: "processed monthly subscription",
    target: "Invoice #INV-2026-089",
    category: "billing",
    time: "4h ago",
    badge: "$240.00",
  },
  {
    id: "4",
    actor: "Jordan Park",
    action: "rotated API secret keys",
    target: "for Webhook Production Gateway",
    category: "security",
    time: "Yesterday",
  },
];

export function ActivityTimelineBlock({
  events = sampleEvents,
  accent = colors.lime,
  style,
}: ActivityTimelineBlockProps) {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all" ? events : events.filter((e) => e.category === filter);

  return (
    <Card title="Activity" style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        {/* Filter Chips */}
        <View style={s.filterRow}>
          {[
            { id: "all", label: "All Activity" },
            { id: "team", label: "Team" },
            { id: "security", label: "Security" },
            { id: "billing", label: "Billing" },
          ].map((item) => (
            <TagChip
              key={item.id}
              label={item.label}
              selected={filter === item.id}
              accent={accent}
              onPress={() => setFilter(item.id)}
            />
          ))}
        </View>

        {/* Timeline List */}
        <View style={s.timeline}>
          {!filtered.length ? (
            <Text style={s.emptyText}>No activity in this category.</Text>
          ) : (
            filtered.map((item, idx) => {
              const isLast = idx === filtered.length - 1;
              return (
                <View key={item.id} style={s.eventRow}>
                  {/* Timeline indicator column */}
                  <View style={s.indicatorCol}>
                    <Avatar name={item.actor} size="sm" />
                    {!isLast && <View style={s.verticalLine} />}
                  </View>

                  {/* Event content */}
                  <View style={s.contentCol}>
                    <View style={s.eventTop}>
                      <Text style={s.eventDesc}>
                        <Text style={s.actorName}>{item.actor}</Text>{" "}
                        {item.action}{" "}
                        <Text style={s.targetName}>{item.target}</Text>
                      </Text>
                      <Text style={s.timeText}>{item.time}</Text>
                    </View>

                    {item.badge && (
                      <View style={s.badgeRow}>
                        <Badge tone="success">{item.badge}</Badge>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
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
    width: "100%",
    gap: 14,
  },
  filterRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 8,
  },
  timeline: {
    gap: 16,
    paddingTop: 4,
  },
  eventRow: {
    flexDirection: "row",
    gap: 14,
  },
  indicatorCol: {
    alignItems: "center",
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.line,
    marginTop: 6,
  },
  contentCol: {
    flex: 1,
    paddingTop: 4,
    gap: 6,
    minWidth: 0,
  },
  eventTop: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  eventDesc: {
    minWidth: 120,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
    flex: 1,
  },
  actorName: {
    fontWeight: "600",
    color: colors.ink,
  },
  targetName: {
    fontWeight: "600",
    color: colors.ink,
  },
  timeText: {
    fontSize: 11,
    color: colors.muted,
  },
  badgeRow: {
    flexDirection: "row",
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    paddingVertical: 8,
  },
});
