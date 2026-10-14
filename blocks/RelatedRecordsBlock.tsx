import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Badge,
  Button,
  Card,
  Icon,
  List,
  ListItem,
  colors,
} from "../components";

export interface RelatedItem {
  id: string;
  name: string;
  type: string;
  status: "Completed" | "In review" | "Pending";
  meta: string;
}

export interface RelatedRecordsBlockProps {
  items?: RelatedItem[];
  onOpenRecord?: (record: RelatedItem) => void;
  onLinkRecord?: () => void;
  accent?: string;
  style?: ViewStyle;
}

const sampleRelated: RelatedItem[] = [
  {
    id: "INV-802",
    name: "Design Sprint Retainer Invoice",
    type: "Invoice",
    status: "Completed",
    meta: "$4,200.00 · Paid",
  },
  {
    id: "TSK-319",
    name: "Color Contrast Accessibility Audit",
    type: "Task",
    status: "In review",
    meta: "Assigned to Sam Lee",
  },
  {
    id: "DOC-104",
    name: "Service Level Agreement (SLA)",
    type: "Contract",
    status: "Completed",
    meta: "Signed by Acme CEO",
  },
];

export function RelatedRecordsBlock({
  items = sampleRelated,
  onOpenRecord,
  onLinkRecord,
  accent = colors.lime,
  style,
}: RelatedRecordsBlockProps) {
  const action = onLinkRecord ? (
    <Button variant="outline" icon="plus" onPress={onLinkRecord}>
      Link record
    </Button>
  ) : undefined;

  return (
    <Card
      title="Related records"
      action={action}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {items.length === 0 ? (
          <Text style={s.emptyText}>No related records.</Text>
        ) : (
          <List divided style={s.list}>
            {items.map((item) => (
              <ListItem
                key={item.id}
                leading={
                  <View style={s.iconWrap}>
                    <Icon
                      name={
                        item.type === "Invoice"
                          ? "wallet"
                          : item.type === "Task"
                            ? "layers"
                            : "file"
                      }
                      size={16}
                      color={colors.ink}
                    />
                  </View>
                }
                title={item.name}
                subtitle={item.meta}
                trailing={
                  <Badge
                    tone={
                      item.status === "Completed"
                        ? "success"
                        : item.status === "In review"
                          ? "warning"
                          : "neutral"
                    }
                  >
                    {item.status}
                  </Badge>
                }
                showChevron={!!onOpenRecord}
                onPress={onOpenRecord ? () => onOpenRecord(item) : undefined}
              />
            ))}
          </List>
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
  },
  list: {
    width: "100%",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    paddingVertical: 8,
  },
});
