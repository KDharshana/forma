import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Avatar, Badge, Card, Dropdown, Icon, colors } from "../components";

export interface KanbanCard {
  id: string;
  title: string;
  tag: string;
  assignee: string;
  priority: "high" | "medium" | "low";
}

export interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanPipelineBlockProps {
  initialColumns?: KanbanColumn[];
  onColumnsChange?: (columns: KanbanColumn[]) => void;
  onAddCard?: (columnId: string) => void;
  accent?: string;
  style?: ViewStyle;
}

const defaultColumns: KanbanColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      {
        id: "c1",
        title: "Refactor icon color props",
        tag: "Design",
        assignee: "Sam Lee",
        priority: "low",
      },
      {
        id: "c2",
        title: "Add haptic feedback to switches",
        tag: "Native",
        assignee: "Alex Chen",
        priority: "medium",
      },
    ],
  },
  {
    id: "progress",
    title: "In Progress",
    cards: [
      {
        id: "c3",
        title: "Carousel keyboard accessibility",
        tag: "A11y",
        assignee: "Jordan Park",
        priority: "high",
      },
    ],
  },
  {
    id: "done",
    title: "Shipped",
    cards: [
      {
        id: "c4",
        title: "Theme token palette specification",
        tag: "Tokens",
        assignee: "Alex Chen",
        priority: "high",
      },
      {
        id: "c5",
        title: "Combobox keyboard navigation",
        tag: "Component",
        assignee: "Sam Lee",
        priority: "medium",
      },
    ],
  },
];

export function KanbanPipelineBlock({
  initialColumns = defaultColumns,
  onColumnsChange,
  onAddCard,
  accent = colors.lime,
  style,
}: KanbanPipelineBlockProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);

  const move = (card: KanbanCard, target: string) => {
    const next = columns.map((col) => ({
      ...col,
      cards:
        col.id === target
          ? [...col.cards.filter((c) => c.id !== card.id), card]
          : col.cards.filter((c) => c.id !== card.id),
    }));
    setColumns(next);
    onColumnsChange?.(next);
  };

  return (
    <Card title="Workflow" style={StyleSheet.flatten([s.card, style])}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        contentContainerStyle={s.columnsRow}
      >
        {columns.map((col) => (
          <View key={col.id} style={s.column}>
            {/* Column Header */}
            <View style={s.columnHeader}>
              <View style={s.colTitleRow}>
                <Text style={s.colTitle}>{col.title}</Text>
                <Badge tone="neutral">{col.cards.length}</Badge>
              </View>
              {onAddCard && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Add card to ${col.title}`}
                  onPress={() => onAddCard(col.id)}
                  style={s.addBtn}
                >
                  <Icon name="plus" size={13} color={colors.muted} />
                </Pressable>
              )}
            </View>

            {/* Cards List */}
            <View style={s.cardStack}>
              {col.cards.map((card) => (
                <Card key={card.id} variant="surface" style={s.taskCard}>
                  <View style={s.cardTop}>
                    <Badge tone="neutral">{card.tag}</Badge>
                    <View
                      style={[
                        s.priorityDot,
                        card.priority === "high"
                          ? { backgroundColor: colors.danger }
                          : card.priority === "medium"
                            ? { backgroundColor: "#d48818" }
                            : { backgroundColor: colors.success },
                      ]}
                    />
                  </View>

                  <Text style={s.taskTitle}>{card.title}</Text>
                  <Text style={s.priorityText}>
                    {card.priority.charAt(0).toUpperCase() +
                      card.priority.slice(1)}{" "}
                    priority
                  </Text>

                  <View style={s.cardBottom}>
                    <Avatar name={card.assignee} size="sm" />
                    <Text style={s.assigneeName}>{card.assignee}</Text>
                  </View>

                  {columns.length > 1 && (
                    <Dropdown
                      placeholder="Move to"
                      items={columns
                        .filter((c) => c.id !== col.id)
                        .map((c) => ({ id: c.id, label: c.title }))}
                      onSelect={(item) => move(card, item.id)}
                    />
                  )}
                </Card>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </Card>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
  },
  columnsRow: {
    flexDirection: "row",
    gap: 14,
    paddingBottom: 6,
  },
  column: {
    width: 250,
    backgroundColor: colors.canvas,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 10,
  },
  columnHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  colTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  colTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  addBtn: {
    minHeight: 44,
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  cardStack: {
    gap: 10,
  },
  taskCard: {
    padding: 12,
    gap: 8,
    borderRadius: 12,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    lineHeight: 18,
  },
  priorityText: {
    fontSize: 11,
    color: colors.muted,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 8,
  },
  assigneeName: {
    fontSize: 11,
    color: colors.muted,
    flexShrink: 1,
  },
});
