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
import { Icon } from "./Icon";

export interface CheckboxProps {
  /** Controlled checked state */
  checked?: boolean;
  /** Initial checked state for uncontrolled usage */
  defaultChecked?: boolean;
  /** Callback fired when checked state changes */
  onChange?: (checked: boolean) => void;
  /** Alternative callback fired when checked state changes */
  onToggle?: (checked: boolean) => void;
  /** Primary label text */
  label?: string;
  /** Secondary description text */
  description?: string;
  /** Disables toggle interaction */
  disabled?: boolean;
  /** Shows indeterminate dash indicator */
  indeterminate?: boolean;
  /** Error state or error message string */
  error?: boolean | string;
  /** Accent color for checked box (defaults to colors.lime) */
  accent?: string;
  /** Custom outer container style */
  style?: StyleProp<ViewStyle>;
  /** Custom box square style */
  boxStyle?: StyleProp<ViewStyle>;
  /** Custom label text style */
  labelStyle?: StyleProp<TextStyle>;
}

export function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  onToggle,
  label,
  description,
  disabled = false,
  indeterminate = false,
  error,
  accent = colors.lime,
  style,
  boxStyle,
  labelStyle,
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const isChecked = isControlled ? controlledChecked : internalChecked;
  const isSelected = isChecked || indeterminate;

  const handlePress = () => {
    if (disabled) return;
    const nextChecked = indeterminate ? true : !isChecked;
    if (!isControlled) {
      setInternalChecked(nextChecked);
    }
    onChange?.(nextChecked);
    onToggle?.(nextChecked);
  };

  const hasError = !!error;
  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <View style={[s.wrapper, style]}>
      <Pressable
        accessibilityRole="checkbox"
        aria-checked={indeterminate ? "mixed" : isChecked}
        accessibilityState={{
          checked: indeterminate ? "mixed" : isChecked,
          disabled,
        }}
        accessibilityLabel={label || "Select"}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        disabled={disabled}
        onPress={handlePress}
        style={({ pressed }: any) => [
          s.container,
          disabled && s.disabled,
          pressed && !disabled && s.pressed,
          {
            outlineWidth: 0,
            outlineColor: "transparent",
            ...(Platform.OS === "web"
              ? ({
                  cursor: disabled ? "not-allowed" : "pointer",
                  outlineStyle: "none",
                } as any)
              : {}),
          },
        ]}
      >
        {({ hovered }: any) => (
          <>
            <View
              style={[
                s.box,
                isSelected && { backgroundColor: accent, borderColor: accent },
                !isSelected && s.boxUnchecked,
                hovered && !isSelected && !disabled && { borderColor: colors.ink },
                hasError && { borderColor: colors.danger },
                boxStyle,
              ]}
            >
              {isChecked && !indeterminate && (
                <Icon
                  name="check"
                  size={13}
                  color={colors.ink}
                  strokeWidth={2.4}
                />
              )}
              {indeterminate && (
                <View
                  style={[s.indeterminateDash, { backgroundColor: colors.ink }]}
                />
              )}
            </View>

            {(label || description) && (
              <View style={s.textContainer}>
                {label && (
                  <Text
                    numberOfLines={2}
                    style={[
                      s.label,
                      hasError && { color: colors.danger },
                      labelStyle,
                    ]}
                  >
                    {label}
                  </Text>
                )}
                {description && (
                  <Text numberOfLines={3} style={s.description}>
                    {description}
                  </Text>
                )}
              </View>
            )}
          </>
        )}
      </Pressable>

      {errorMessage && (
        <Text
          accessibilityRole="alert"
          style={s.errorText}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    gap: 4,
  },
  container: {
    minHeight: 44,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    paddingVertical: 4,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.45,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  boxUnchecked: {
    backgroundColor: colors.paper,
    borderColor: colors.line,
  },
  indeterminateDash: {
    width: 10,
    height: 2,
    borderRadius: 1,
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
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginLeft: 30,
  },
});
