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

export interface RadioOption<T extends string | number = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioButtonProps {
  /** Controlled checked state */
  checked?: boolean;
  /** Uncontrolled initial checked state */
  defaultChecked?: boolean;
  /** Toggle callback */
  onToggle?: (checked: boolean) => void;
  /** Change callback */
  onChange?: (checked: boolean) => void;
  /** Label next to the radio button */
  label?: string;
  /** Optional secondary description */
  description?: string;
  /** Whether the radio button is disabled */
  disabled?: boolean;
  /** Accent highlight color */
  accent?: string;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Label style */
  labelStyle?: StyleProp<TextStyle>;
  /** Description style */
  descriptionStyle?: StyleProp<TextStyle>;
}

export function RadioButton({
  checked: controlledChecked,
  defaultChecked = false,
  onToggle,
  onChange,
  label,
  description,
  disabled = false,
  accent = colors.lime,
  style,
  labelStyle,
  descriptionStyle,
}: RadioButtonProps) {
  const isControlled = controlledChecked !== undefined;
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = isControlled ? controlledChecked : internalChecked;

  const handlePress = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onToggle?.(next);
    onChange?.(next);
  };

  return (
    <Pressable
      accessibilityRole="radio"
      aria-checked={isChecked}
      accessibilityState={{ checked: isChecked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed, hovered }: any) => [
        s.item,
        (pressed || hovered) && !disabled && s.pressed,
        disabled && s.disabled,
        style,
      ]}
    >
      <View
        style={[
          s.outerCircle,
          isChecked ? { borderColor: colors.ink } : { borderColor: colors.line },
        ]}
      >
        {isChecked && (
          <View
            style={[
              s.innerCircle,
              { backgroundColor: accent || colors.ink },
            ]}
          />
        )}
      </View>
      {(label || description) && (
        <View style={s.textContainer}>
          {label && (
            <Text
              style={[
                s.label,
                isChecked && { color: colors.ink, fontWeight: "600" },
                labelStyle,
              ]}
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
      )}
    </Pressable>
  );
}

export interface RadioGroupProps<T extends string | number = string> {
  /** Controlled active value */
  value?: T;
  /** Uncontrolled initial active value */
  defaultValue?: T;
  /** Selection change callback */
  onChange?: (value: T) => void;
  /** Value change callback alias */
  onValueChange?: (value: T) => void;
  /** List of radio options */
  options: RadioOption<T>[];
  /** Accent highlight color */
  accent?: string;
  /** Whether the entire radio group is disabled */
  disabled?: boolean;
  /** Group container style */
  style?: StyleProp<ViewStyle>;
  /** Individual radio row item style */
  itemStyle?: StyleProp<ViewStyle>;
  /** Label style */
  labelStyle?: StyleProp<TextStyle>;
  /** Description style */
  descriptionStyle?: StyleProp<TextStyle>;
}

export function RadioGroup<T extends string | number = string>({
  value: controlledValue,
  defaultValue,
  onChange,
  onValueChange,
  options,
  accent = colors.lime,
  disabled = false,
  style,
  itemStyle,
  labelStyle,
  descriptionStyle,
}: RadioGroupProps<T>) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<T | undefined>(
    defaultValue ?? options[0]?.value,
  );
  const activeValue = isControlled ? controlledValue : internalValue;

  const handleSelect = (val: T) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
    onValueChange?.(val);
  };

  return (
    <View style={[s.group, style]} accessibilityRole="radiogroup">
      {options.map((opt) => {
        const selected = opt.value === activeValue;
        const isDisabled = disabled || opt.disabled;

        return (
          <Pressable
            key={String(opt.value)}
            accessibilityRole="radio"
            aria-checked={selected}
            accessibilityState={{ checked: selected, disabled: isDisabled }}
            accessibilityLabel={opt.label}
            disabled={isDisabled}
            onPress={() => handleSelect(opt.value)}
            style={({ pressed, hovered }: any) => [
              s.item,
              (pressed || hovered) && !isDisabled && s.pressed,
              isDisabled && s.disabled,
              itemStyle,
            ]}
          >
            <View
              style={[
                s.outerCircle,
                selected
                  ? { borderColor: colors.ink }
                  : { borderColor: colors.line },
              ]}
            >
              {selected && (
                <View
                  style={[
                    s.innerCircle,
                    { backgroundColor: accent || colors.ink },
                  ]}
                />
              )}
            </View>
            <View style={s.textContainer}>
              <Text
                style={[
                  s.label,
                  selected && { color: colors.ink, fontWeight: "600" },
                  labelStyle,
                ]}
                numberOfLines={2}
              >
                {opt.label}
              </Text>
              {opt.description && (
                <Text
                  style={[s.description, descriptionStyle]}
                  numberOfLines={3}
                >
                  {opt.description}
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  group: {
    gap: 12,
  },
  item: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.45,
    ...(Platform.OS === "web" ? ({ cursor: "not-allowed" } as any) : {}),
  },
  outerCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
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
