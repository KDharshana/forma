import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors, cardShadow } from "./theme";
import { Icon } from "./Icon";
import { AvatarGroup, Person } from "./AvatarGroup";
import { Badge } from "./Badge";

export interface TaskCardProps {
  /** Task title */
  title: string;
  /** Task description */
  description?: string;
  /** Assigned people */
  people?: Person[];
  /** Progress percentage (0 to 100) */
  progress?: number;
  /** Due date text */
  due?: string;
  /** Controlled completed state */
  completed?: boolean;
  /** Uncontrolled initial completed state */
  defaultCompleted?: boolean;
  /** Toggle completion callback */
  onToggle?: (completed: boolean) => void;
  /** Change callback alias */
  onChange?: (completed: boolean) => void;
  /** Optional click handler for entire card */
  onPress?: () => void;
  /** Highlight accent color */
  accent?: string;
  /** Whether the task card is disabled */
  disabled?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Title text style */
  titleStyle?: StyleProp<TextStyle>;
  /** Description text style */
  descriptionStyle?: StyleProp<TextStyle>;
}

export function TaskCard({
  title,
  description,
  people = [],
  progress = 0,
  due,
  completed: controlledCompleted,
  defaultCompleted = false,
  onToggle,
  onChange,
  onPress,
  accent = colors.lime,
  disabled = false,
  style,
  titleStyle,
  descriptionStyle,
}: TaskCardProps) {
  const isControlled = controlledCompleted !== undefined;
  const [internalCompleted, setInternalCompleted] = useState(defaultCompleted);
  const isCompleted = isControlled ? controlledCompleted : internalCompleted;

  const handleToggle = () => {
    if (disabled) return;
    const next = !isCompleted;
    if (!isControlled) {
      setInternalCompleted(next);
    }
    onToggle?.(next);
    onChange?.(next);
  };

  const percent = isCompleted
    ? 100
    : Math.max(0, Math.min(100, Number.isFinite(progress) ? progress : 0));

  const cardContent = (
    <>
      <View style={s.row}>
        <Badge tone={isCompleted ? "success" : "lavender"}>
          {isCompleted ? "Completed" : "In progress"}
        </Badge>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityLabel={`Complete ${title}`}
          aria-checked={isCompleted}
          accessibilityState={{ checked: isCompleted, disabled }}
          disabled={disabled}
          onPress={handleToggle}
          style={({ pressed, hovered }: any) => [
            s.checkTarget,
            (hovered || pressed) && !disabled && { opacity: 0.75 },
          ]}
        >
          <View
            style={[
              s.checkbox,
              isCompleted && { backgroundColor: accent, borderColor: accent },
            ]}
          >
            {isCompleted && <Icon name="check" size={13} color={colors.ink} />}
          </View>
        </Pressable>
      </View>

      <Text
        style={[
          s.title,
          isCompleted && s.titleCompleted,
          titleStyle,
        ]}
        numberOfLines={2}
      >
        {title}
      </Text>

      {description && (
        <Text style={[s.description, descriptionStyle]} numberOfLines={3}>
          {description}
        </Text>
      )}

      {(people.length > 0 || due) && (
        <View style={[s.row, { marginTop: 18 }]}>
          {people.length > 0 ? (
            <AvatarGroup people={people} size={30} />
          ) : (
            <View />
          )}
          {due && (
            <View style={s.dueRow}>
              <Icon name="calendar" size={13} color={colors.muted} />
              <Text style={s.due}>{due}</Text>
            </View>
          )}
        </View>
      )}

      <View style={[s.row, { marginTop: 18 }]}>
        <Text style={s.due}>Progress</Text>
        <Text style={s.percent}>{percent}%</Text>
      </View>

      <View
        accessibilityRole="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        accessibilityValue={{ min: 0, max: 100, now: percent }}
        style={s.track}
      >
        <View
          style={[
            s.progress,
            { width: `${percent}%`, backgroundColor: accent },
          ]}
        />
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed, hovered }: any) => [
          s.card,
          (hovered || pressed) && !disabled && s.cardHovered,
          disabled && s.disabled,
          style,
        ]}
      >
        {cardContent}
      </Pressable>
    );
  }

  return (
    <View style={[s.card, disabled && s.disabled, style]}>
      {cardContent}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderRadius: 20,
    padding: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.line,
    ...cardShadow,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none" } as any)
      : {}),
  },
  cardHovered: {
    backgroundColor: colors.canvas,
  },
  disabled: {
    opacity: 0.6,
  },
  row: {
    flexWrap: "wrap",
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkTarget: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "flex-end",
    justifyContent: "center",
    marginVertical: -8,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paper,
  },
  title: {
    fontSize: 16,
    color: colors.ink,
    fontWeight: "600",
    marginTop: 14,
    letterSpacing: -0.3,
    flexShrink: 1,
    minWidth: 0,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: colors.muted,
  },
  description: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
    flexShrink: 1,
    minWidth: 0,
  },
  dueRow: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  due: {
    fontSize: 12,
    color: colors.muted,
  },
  percent: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
  },
  track: {
    height: 6,
    backgroundColor: colors.canvas,
    borderRadius: 4,
    marginTop: 8,
    overflow: "hidden",
  },
  progress: {
    height: 6,
    borderRadius: 4,
  },
});
