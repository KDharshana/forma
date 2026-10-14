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

export interface SegmentedControlProps<T extends string = string> {
  /** Array of available options */
  options: readonly T[] | T[];
  /** Controlled selected option */
  value?: T;
  /** Uncontrolled initial selected option */
  defaultValue?: T;
  /** Selection change callback */
  onChange?: (value: T) => void;
  /** Value change callback alias */
  onValueChange?: (value: T) => void;
  /** Accent highlight color for active tab */
  accent?: string;
  /** Whether the segmented control is disabled */
  disabled?: boolean;
  /** Track container style */
  style?: StyleProp<ViewStyle>;
  /** Segment item style */
  itemStyle?: StyleProp<ViewStyle>;
  /** Label text style */
  labelStyle?: StyleProp<TextStyle>;
}

export function SegmentedControl<T extends string = string>({
  options,
  value: controlledValue,
  defaultValue = options[0],
  onChange,
  onValueChange,
  accent = colors.ink,
  disabled = false,
  style,
  itemStyle,
  labelStyle,
}: SegmentedControlProps<T>) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const activeValue = isControlled ? controlledValue : internalValue;

  const handleSelect = (option: T) => {
    if (disabled || option === activeValue) return;
    if (!isControlled) {
      setInternalValue(option);
    }
    onChange?.(option);
    onValueChange?.(option);
  };

  return (
    <View
      style={[s.track, disabled && s.trackDisabled, style]}
      accessibilityRole="tablist"
    >
      {options.map((option) => {
        const isSelected = activeValue === option;

        return (
          <Pressable
            key={option}
            accessibilityRole="tab"
            aria-selected={isSelected}
            accessibilityState={{ selected: isSelected, disabled }}
            disabled={disabled}
            onPress={() => handleSelect(option)}
            style={({ pressed, hovered }: any) => [
              s.item,
              isSelected && {
                backgroundColor: accent,
                boxShadow: "0px 2px 6px rgba(0,0,0,0.08)",
              },
              !isSelected && (hovered || pressed) && !disabled && s.itemHovered,
              (pressed && isSelected) && { opacity: 0.8 },
              itemStyle,
            ]}
          >
            <Text
              style={[
                s.label,
                {
                  color: isSelected
                    ? accent === colors.ink
                      ? colors.paper
                      : colors.ink
                    : colors.muted,
                  fontWeight: isSelected ? "600" : "500",
                },
                labelStyle,
              ]}
              numberOfLines={1}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  track: {
    flexDirection: "row",
    borderRadius: 30,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 4,
    width: "100%",
  },
  trackDisabled: {
    opacity: 0.5,
  },
  item: {
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 0,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  itemHovered: {
    backgroundColor: colors.line,
  },
  label: {
    fontSize: 14,
    textAlign: "center",
    flexShrink: 1,
    minWidth: 0,
  },
});
