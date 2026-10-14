import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
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

export interface SwitchProps {
  /** Controlled switch toggle state */
  value?: boolean;
  /** Uncontrolled initial toggle state */
  defaultValue?: boolean;
  /** Value change callback */
  onChange?: (value: boolean) => void;
  /** Value change callback alias */
  onValueChange?: (value: boolean) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Accent highlight color when switch is on */
  accent?: string;
  /** Primary label text next to the switch */
  label?: string;
  /** Accessible label */
  accessibilityLabel?: string;
  /** Secondary description text */
  description?: string;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Label text style */
  labelStyle?: StyleProp<TextStyle>;
  /** Description text style */
  descriptionStyle?: StyleProp<TextStyle>;
}

export function Switch({
  value: controlledValue,
  defaultValue = false,
  onChange,
  onValueChange,
  disabled = false,
  accent = colors.lime,
  label,
  accessibilityLabel,
  description,
  style,
  labelStyle,
  descriptionStyle,
}: SwitchProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeValue = isControlled ? controlledValue : internalValue;

  const anim = useRef(new Animated.Value(activeValue ? 1 : 0)).current;

  useEffect(() => {
    const animation = Animated.timing(anim, {
      toValue: activeValue ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [activeValue, anim]);

  const handleToggle = () => {
    if (disabled) return;
    const nextVal = !activeValue;
    if (!isControlled) {
      setInternalValue(nextVal);
    }
    onChange?.(nextVal);
    onValueChange?.(nextVal);
  };

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.line, accent],
  });

  const switchControl = (
    <Animated.View
      style={[s.track, { backgroundColor }, disabled && s.disabled]}
    >
      <Animated.View style={[s.thumb, { transform: [{ translateX }] }]} />
    </Animated.View>
  );

  if (label || description) {
    return (
      <Pressable
        accessibilityRole="switch"
        aria-checked={activeValue}
        accessibilityState={{ checked: activeValue, disabled }}
        accessibilityLabel={
          accessibilityLabel || label || description || "Toggle"
        }
        disabled={disabled}
        onPress={handleToggle}
        style={({ pressed, hovered }: any) => [
          s.rowContainer,
          (hovered || pressed) && !disabled && s.pressed,
          disabled && s.disabledRow,
          style,
        ]}
      >
        <View style={s.textContainer}>
          {label && (
            <Text
              style={[s.label, labelStyle]}
              numberOfLines={2}
            >
              {label}
            </Text>
          )}
          {description && (
            <Text
              style={[s.description, descriptionStyle]}
              numberOfLines={3}
            >
              {description}
            </Text>
          )}
        </View>
        {switchControl}
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel || "Toggle"}
      accessibilityRole="switch"
      aria-checked={activeValue}
      accessibilityState={{ checked: activeValue, disabled }}
      disabled={disabled}
      onPress={handleToggle}
      style={({ pressed, hovered }: any) => [
        s.singleContainer,
        (hovered || pressed) && !disabled && s.pressed,
        disabled && s.disabledRow,
        style,
      ]}
    >
      {switchControl}
    </Pressable>
  );
}

const s = StyleSheet.create({
  singleContainer: {
    minHeight: 44,
    minWidth: 48,
    justifyContent: "center",
    alignItems: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.paper,
    boxShadow: "0px 2px 4px rgba(35, 38, 33, 0.15)",
  },
  rowContainer: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 6,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  pressed: {
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledRow: {
    opacity: 0.5,
    ...(Platform.OS === "web" ? ({ cursor: "not-allowed" } as any) : {}),
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.ink,
    lineHeight: 20,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  description: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
    marginTop: 2,
    flexShrink: 1,
  },
});
