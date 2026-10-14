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
import { colors } from "./theme";
import { Icon, IconName } from "./Icon";

export interface TagChipProps {
  /** Chip text label */
  label: string;
  /** Optional icon at the front */
  icon?: IconName;
  /** Whether to show a colored dot */
  dot?: boolean;
  /** Dot color */
  dotColor?: string;
  /** Controlled selected state */
  selected?: boolean;
  /** Uncontrolled initial selected state */
  defaultSelected?: boolean;
  /** Visual variant */
  variant?: "filled" | "outline";
  /** Click callback */
  onPress?: () => void;
  /** Toggle callback */
  onToggle?: (selected: boolean) => void;
  /** Remove callback */
  onRemove?: () => void;
  /** Highlight accent color when selected */
  accent?: string;
  /** Whether the chip is disabled */
  disabled?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Label text style */
  labelStyle?: StyleProp<TextStyle>;
}

export function TagChip({
  label,
  icon,
  dot = false,
  dotColor = colors.success,
  selected: controlledSelected,
  defaultSelected = false,
  variant = "filled",
  onPress,
  onToggle,
  onRemove,
  accent = colors.lime,
  disabled = false,
  style,
  labelStyle,
}: TagChipProps) {
  const isControlled = controlledSelected !== undefined;
  const [internalSelected, setInternalSelected] = useState(defaultSelected);
  const isSelected = isControlled ? controlledSelected : internalSelected;

  const handlePress = () => {
    if (disabled) return;
    if (onToggle) {
      const next = !isSelected;
      if (!isControlled) {
        setInternalSelected(next);
      }
      onToggle(next);
    }
    onPress?.();
  };

  const isInteractive = Boolean(onPress || onToggle) && !disabled;

  const content = (
    <>
      {dot && <View style={[s.dot, { backgroundColor: dotColor }]} />}
      {icon && <Icon name={icon} size={14} color={colors.ink} />}
      <Text
        style={[
          s.label,
          isSelected && { fontWeight: "600" },
          labelStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </>
  );

  return (
    <View
      style={[
        s.chip,
        variant === "filled" ? s.chipFilled : s.chipOutline,
        isSelected && { backgroundColor: accent, borderColor: accent },
        disabled && s.chipDisabled,
        style,
      ]}
    >
      {isInteractive ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityState={{ selected: isSelected, disabled }}
          disabled={disabled}
          onPress={handlePress}
          style={({ pressed, hovered }: any) => [
            s.pressableBody,
            (hovered || pressed) && !disabled && { opacity: 0.8 },
          ]}
        >
          {content}
        </Pressable>
      ) : (
        <View style={s.staticBody}>{content}</View>
      )}

      {onRemove && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${label}`}
          accessibilityState={{ disabled }}
          disabled={disabled}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          onPress={onRemove}
          style={({ pressed, hovered }: any) => [
            s.removeBtn,
            (hovered || pressed) && !disabled && { opacity: 0.7 },
          ]}
        >
          <Icon name="close" size={13} color={colors.ink} />
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  chip: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    alignSelf: "flex-start",
    paddingLeft: 10,
    paddingRight: 6,
    gap: 4,
  },
  chipFilled: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipOutline: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  pressableBody: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  staticBody: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: 12,
    fontWeight: "500",
    color: colors.ink,
  },
  removeBtn: {
    width: 36,
    height: 36,
    minWidth: 36,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
});
