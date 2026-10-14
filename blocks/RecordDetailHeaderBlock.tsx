import React, { useState } from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import { AlertDialog, Badge, Button, Card, colors } from "../components";

export interface RecordDetailHeaderBlockProps {
  title?: string;
  recordId?: string;
  modifiedLabel?: string;
  breadcrumb?: string;
  status?: "Completed" | "In progress" | "In review" | "Draft";
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  accent?: string;
  style?: ViewStyle;
}

export function RecordDetailHeaderBlock({
  title = "Mobile Design System Exploration",
  recordId = "REC-4820",
  modifiedLabel,
  breadcrumb = "Projects",
  status = "In progress",
  onEdit,
  onShare,
  onDelete,
  accent = colors.lime,
  style,
}: RecordDetailHeaderBlockProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <Card style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        {/* Top breadcrumb & metadata row */}
        <View style={s.topRow}>
          <View style={s.breadcrumbGroup}>
            <Text style={s.breadRoot}>{breadcrumb}</Text>
            <Text style={s.breadSlash}>/</Text>
            <Text style={s.breadCode}>{recordId}</Text>
          </View>

          <Badge
            tone={
              status === "Completed"
                ? "success"
                : status === "In progress"
                  ? "lavender"
                  : status === "In review"
                    ? "warning"
                    : "neutral"
            }
          >
            {status}
          </Badge>
        </View>

        {/* Main Title and Actions */}
        <View style={s.mainRow}>
          <View style={s.titleGroup}>
            <Text accessibilityRole="header" style={s.title}>
              {title}
            </Text>
            {!!modifiedLabel && (
              <Text style={s.timestamp}>{modifiedLabel}</Text>
            )}
          </View>

          {(onShare || onEdit || onDelete) && (
            <View style={s.actionsGroup}>
              {onShare && (
                <Button variant="outline" icon="share" onPress={onShare}>
                  Share
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="secondary"
                  icon="edit"
                  accent={accent}
                  onPress={onEdit}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  icon="trash"
                  onPress={() => setConfirmDelete(true)}
                >
                  Delete
                </Button>
              )}
            </View>
          )}
        </View>
      </View>

      <AlertDialog
        visible={confirmDelete}
        title="Delete record?"
        description={`Delete “${title}”? This action cannot be undone.`}
        confirmText="Delete record"
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => onDelete?.()}
      />
    </Card>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
  },
  body: {
    width: "100%",
    gap: 12,
  },
  topRow: {
    flexWrap: "wrap",
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  breadcrumbGroup: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  breadRoot: {
    fontSize: 12,
    color: colors.muted,
  },
  breadSlash: {
    fontSize: 12,
    color: colors.line,
  },
  breadCode: {
    fontSize: 12,
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    color: colors.muted,
  },
  mainRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: 16,
  },
  titleGroup: {
    flex: 1,
    minWidth: 0,
    flexBasis: 240,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
    letterSpacing: -0.4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
  actionsGroup: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
