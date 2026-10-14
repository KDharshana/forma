import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Button, Card, Icon, colors } from "../components";

export interface PipelineStage {
  id: string;
  name: string;
  days?: string;
}

export interface StageProgressionBlockProps {
  stages?: PipelineStage[];
  initialStage?: number;
  onStageChange?: (stage: PipelineStage) => void;
  accent?: string;
  style?: ViewStyle;
}

const defaultStages: PipelineStage[] = [
  { id: "discovery", name: "Discovery Call", days: "2 days" },
  { id: "qualified", name: "Technical Fit", days: "5 days" },
  { id: "proposal", name: "Proposal Sent", days: "3 days" },
  { id: "negotiation", name: "Legal Review", days: "" },
  { id: "closed", name: "Closed Won", days: "" },
];

export function StageProgressionBlock({
  stages = defaultStages,
  initialStage = 0,
  onStageChange,
  accent = colors.lime,
  style,
}: StageProgressionBlockProps) {
  const [currentIdx, setCurrentIdx] = useState(initialStage);

  const select = (index: number) => {
    setCurrentIdx(index);
    if (stages[index]) onStageChange?.(stages[index]);
  };

  const advanceStage = () => {
    if (currentIdx < stages.length - 1) {
      select(currentIdx + 1);
    }
  };

  const action = (
    <Button
      variant="secondary"
      accent={accent}
      icon="arrow"
      onPress={advanceStage}
      disabled={!stages.length || currentIdx >= stages.length - 1}
    >
      Advance stage
    </Button>
  );

  return (
    <Card
      title="Pipeline"
      action={action}
      style={StyleSheet.flatten([s.card, style])}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chevronsRow}
      >
        {stages.map((stage, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <Pressable
              key={stage.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isCurrent }}
              accessibilityLabel={`${stage.name}: ${isCurrent ? "Current" : isDone ? "Completed" : "Upcoming"}`}
              onPress={() => select(idx)}
              style={({ pressed }) => [
                s.stageItem,
                isCurrent && s.stageItemCurrent,
                isDone && { backgroundColor: accent },
                pressed && { opacity: 0.8 },
              ]}
            >
              <View
                style={[
                  s.stageNumberWrap,
                  isCurrent && { backgroundColor: colors.ink },
                ]}
              >
                {isDone ? (
                  <Icon
                    name="check"
                    size={12}
                    color={colors.ink}
                    strokeWidth={2.4}
                  />
                ) : (
                  <Text
                    style={[
                      s.stageNumber,
                      isCurrent && { color: colors.paper },
                    ]}
                  >
                    {idx + 1}
                  </Text>
                )}
              </View>

              <View style={s.stageTextWrap}>
                <Text style={[s.stageName, isCurrent && { fontWeight: "700" }]}>
                  {stage.name}
                </Text>
                <Text style={s.stageDays}>
                  {isCurrent
                    ? "Current"
                    : isDone
                      ? stage.days || "Completed"
                      : "Upcoming"}
                </Text>
              </View>

              {idx < stages.length - 1 && (
                <Icon
                  name="chevronRight"
                  size={14}
                  color={isDone ? colors.ink : colors.muted}
                />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </Card>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
  },
  chevronsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  stageItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    minWidth: 150,
    ...(Platform.OS === "web" ? { cursor: "pointer" as any } : {}),
  },
  stageItemCurrent: {
    borderColor: colors.ink,
    borderWidth: 1.5,
    backgroundColor: colors.paper,
  },
  stageNumberWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  stageNumber: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.muted,
  },
  stageTextWrap: {
    flex: 1,
  },
  stageName: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
  },
  stageDays: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 1,
  },
});
