import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { AlertDialog, Button, Card, colors } from "../components";

export interface BatchBulkActionsBlockProps {
  selectedCount?: number;
  onClearSelection?: () => void;
  onChangeStatus?: () => void | Promise<void>;
  onExport?: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  accent?: string;
  style?: ViewStyle;
}

export function BatchBulkActionsBlock({
  selectedCount = 0,
  onClearSelection,
  onChangeStatus,
  onExport,
  onDelete,
  accent = colors.lime,
  style,
}: BatchBulkActionsBlockProps) {
  const [confirm, setConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const count = Math.max(0, Math.floor(selectedCount));

  const run = async (action: () => void | Promise<void>) => {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not complete the action.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <Card style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        <Text accessibilityLiveRegion="polite" style={s.title}>
          {count} {count === 1 ? "record" : "records"} selected
        </Text>

        <View style={s.actions}>
          {onChangeStatus && (
            <Button
              variant="outline"
              size="sm"
              disabled={!count || pending}
              onPress={() => run(onChangeStatus)}
            >
              Update status
            </Button>
          )}
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              disabled={!count || pending}
              onPress={() => run(onExport)}
            >
              Export
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              disabled={!count || pending}
              onPress={() => setConfirm(true)}
            >
              Delete
            </Button>
          )}
          {onClearSelection && (
            <Button
              variant="ghost"
              size="sm"
              disabled={!count || pending}
              onPress={onClearSelection}
            >
              Deselect
            </Button>
          )}
        </View>
      </View>

      {!!error && (
        <Text accessibilityRole="alert" style={s.errorText}>
          {error}
        </Text>
      )}

      <AlertDialog
        visible={confirm}
        onClose={() => setConfirm(false)}
        title={`Delete ${count} ${count === 1 ? "record" : "records"}?`}
        description="This action cannot be undone."
        confirmText="Delete"
        onConfirm={async () => {
          await onDelete?.();
          onClearSelection?.();
        }}
      />
    </Card>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
    padding: 16,
  },
  body: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
    flexShrink: 1,
    minWidth: 0,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 8,
  },
});
