import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import {
  Badge,
  Button,
  Card,
  Divider,
  Icon,
  colors,
  mono,
} from "../components";

export type WorkflowActionType =
  "approve" | "request_changes" | "reject" | "escalate";

export interface WorkflowActionSheetProps {
  recordTitle?: string;
  recordId?: string;
  currentStage?: string;
  onExecuteAction?: (type: WorkflowActionType, notes: string) => void;
  onCancel?: () => void;
  style?: ViewStyle;
}

export function WorkflowActionSheet({
  recordTitle = "CapEx Procurement Approval",
  recordId = "REQ-2026-8941",
  currentStage = "Finance VP Review",
  onExecuteAction,
  onCancel,
  style,
}: WorkflowActionSheetProps) {
  const [selectedAction, setSelectedAction] =
    useState<WorkflowActionType>("approve");
  const [notes, setNotes] = useState("");

  const actionsList: Array<{
    type: WorkflowActionType;
    label: string;
    description: string;
    tone: "success" | "warning" | "danger" | "neutral";
  }> = [
    {
      type: "approve",
      label: "Approve & Advance",
      description:
        "Sign off on requisition and route to purchase order creation.",
      tone: "success",
    },
    {
      type: "request_changes",
      label: "Request Clarification",
      description: "Send back to originator with review feedback.",
      tone: "warning",
    },
    {
      type: "reject",
      label: "Reject Requisition",
      description: "Decline request and terminate approval pipeline.",
      tone: "danger",
    },
    {
      type: "escalate",
      label: "Escalate to CFO",
      description: "Defer authority to senior executive sign-off.",
      tone: "neutral",
    },
  ];

  const handleConfirm = () => {
    onExecuteAction?.(selectedAction, notes);
  };

  const badge = (
    <Badge tone="lavender" dot={true}>
      {currentStage}
    </Badge>
  );

  return (
    <Card
      title={`Workflow Action – ${recordId}`}
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        <Text style={s.recordDesc}>{recordTitle}</Text>

        {/* Action Choice Tiles */}
        <View style={s.actionTiles}>
          {actionsList.map((a) => {
            const isSelected = selectedAction === a.type;
            return (
              <Pressable
                key={a.type}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setSelectedAction(a.type)}
                style={({ pressed }) => [
                  s.tile,
                  isSelected && s.tileSelected,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <View style={s.tileRadio}>
                  <View
                    style={[s.radioOuter, isSelected && s.radioOuterSelected]}
                  >
                    {isSelected && <View style={s.radioInner} />}
                  </View>
                </View>

                <View style={s.tileContent}>
                  <Text
                    style={[s.tileTitle, isSelected && s.tileTitleSelected]}
                  >
                    {a.label}
                  </Text>
                  <Text style={s.tileDesc}>{a.description}</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Divider />

        {/* Notes / Reason Text Input */}
        <View style={s.notesSection}>
          <Text style={s.notesLabel}>
            Reason or Remarks{" "}
            {selectedAction !== "approve" && (
              <Text style={s.requiredText}>(Required)</Text>
            )}
          </Text>
          <View style={s.textAreaWrap}>
            <TextInput
              multiline
              numberOfLines={3}
              value={notes}
              onChangeText={setNotes}
              placeholder={
                selectedAction === "approve"
                  ? "Optional sign-off remarks..."
                  : "Specify required adjustments or rationale..."
              }
              placeholderTextColor={colors.muted}
              style={s.textArea}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={s.footerActions}>
          {onCancel && (
            <Button variant="ghost" size="sm" onPress={onCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onPress={handleConfirm}
            disabled={selectedAction !== "approve" && notes.trim().length === 0}
          >
            Confirm Action
          </Button>
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
  recordDesc: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  actionTiles: {
    gap: 8,
  },
  tile: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.canvas,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 12,
  },
  tileSelected: {
    backgroundColor: colors.paper,
    borderColor: colors.ink,
  },
  tileRadio: {
    paddingTop: 2,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterSelected: {
    borderColor: colors.ink,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.ink,
  },
  tileContent: {
    flex: 1,
    gap: 2,
  },
  tileTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  tileTitleSelected: {
    fontWeight: "700",
  },
  tileDesc: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 16,
  },
  notesSection: {
    gap: 6,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
  },
  requiredText: {
    color: colors.danger,
    fontWeight: "500",
  },
  textAreaWrap: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    padding: 10,
    minHeight: 76,
  },
  textArea: {
    fontSize: 13,
    color: colors.ink,
    textAlignVertical: "top",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web" ? { outlineStyle: "none" as any } : {}),
  },
  footerActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
});
