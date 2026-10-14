import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { AlertDialog, Button, Card, colors } from "../components";

export interface StickyActionFooterBlockProps {
  changeCount?: number;
  onSave?: () => void | Promise<void>;
  onDiscard?: () => void | Promise<void>;
  accent?: string;
  style?: ViewStyle;
}

export function StickyActionFooterBlock({
  changeCount = 0,
  onSave,
  onDiscard,
  accent = colors.lime,
  style,
}: StickyActionFooterBlockProps) {
  const [confirm, setConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (pending || !onSave) return;
    setPending(true);
    setError("");
    try {
      await onSave();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save. Try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Card style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        <Text accessibilityLiveRegion="polite" style={s.title}>
          {changeCount > 0
            ? `${changeCount} unsaved ${changeCount === 1 ? "change" : "changes"}`
            : "No unsaved changes"}
        </Text>

        <View style={s.actions}>
          {onDiscard && (
            <Button
              variant="outline"
              disabled={pending || changeCount <= 0}
              onPress={() => setConfirm(true)}
            >
              Discard
            </Button>
          )}
          {onSave && (
            <Button
              accent={accent}
              loading={pending}
              disabled={changeCount <= 0}
              onPress={save}
            >
              Save changes
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
        title="Discard changes?"
        description="Your unsaved edits will be lost."
        confirmText="Discard"
        onConfirm={async () => {
          await onDiscard?.();
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
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  title: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
    minWidth: 0,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 8,
  },
});
