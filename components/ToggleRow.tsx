import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Switch,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { Icon, IconName } from "./Icon";

export interface ToggleRowProps {
  /** Row title */
  title: string;
  /** Secondary description */
  description?: string;
  /** Controlled boolean value */
  value?: boolean;
  /** Uncontrolled initial value */
  defaultValue?: boolean;
  /** Change callback */
  onChange?: (value: boolean) => void;
  /** Change callback alias */
  onValueChange?: (value: boolean) => void;
  /** Optional icon at the front */
  icon?: IconName;
  /** Accent highlight color when switch is on */
  accent?: string;
  /** Whether the row is disabled */
  disabled?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Title text style */
  titleStyle?: StyleProp<TextStyle>;
  /** Description text style */
  descriptionStyle?: StyleProp<TextStyle>;
}

export function ToggleRow({
  title,
  description,
  value: controlledValue,
  defaultValue = false,
  onChange,
  onValueChange,
  icon = "bell",
  accent = colors.lime,
  disabled = false,
  style,
  titleStyle,
  descriptionStyle,
}: ToggleRowProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeValue = isControlled ? controlledValue : internalValue;

  const handleToggle = () => {
    if (disabled) return;
    const nextVal = !activeValue;
    if (!isControlled) {
      setInternalValue(nextVal);
    }
    onChange?.(nextVal);
    onValueChange?.(nextVal);
  };

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={title}
      aria-checked={activeValue}
      accessibilityState={{ checked: activeValue, disabled }}
      disabled={disabled}
      onPress={handleToggle}
      style={({ pressed, hovered }: any) => [
        s.row,
        (hovered || pressed) && !disabled && s.rowHovered,
        disabled && s.disabled,
        style,
      ]}
    >
      <View style={s.icon}>
        <Icon name={icon} size={18} color={colors.ink} />
      </View>
      <View style={s.textCol}>
        <Text style={[s.title, titleStyle]} numberOfLines={2}>
          {title}
        </Text>
        {description && (
          <Text style={[s.description, descriptionStyle]} numberOfLines={3}>
            {description}
          </Text>
        )}
      </View>
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Switch
          accessibilityLabel={title}
          value={activeValue}
          onValueChange={handleToggle}
          disabled={disabled}
          trackColor={{ false: colors.line, true: accent }}
          thumbColor={colors.paper}
        />
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  rowHovered: {
    backgroundColor: colors.canvas,
  },
  disabled: {
    opacity: 0.5,
    ...(Platform.OS === "web" ? ({ cursor: "not-allowed" } as any) : {}),
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "500",
    flexShrink: 1,
  },
  description: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 3,
    flexShrink: 1,
  },
});
