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
import { colors, cardShadow, mono } from "./theme";
import { Icon } from "./Icon";

export interface NumPadProps {
  /** Controlled numeric value */
  value?: string;
  /** Uncontrolled initial value */
  defaultValue?: string;
  /** Callback fired when numeric value changes */
  onChange?: (val: string) => void;
  /** Maximum number of digits allowed */
  maxLength?: number;
  /** Input mode: pin, cash, or general quantity */
  mode?: "pin" | "cash" | "quantity";
  /** Optional custom extra key (e.g. '.' or '00') */
  extraKey?: string;
  /** Optional submit handler */
  onSubmit?: () => void;
  /** Submit button text */
  submitLabel?: string;
  /** Whether to mask digits as pin dots */
  mask?: boolean;
  /** Whether the keypad is disabled */
  disabled?: boolean;
  /** Error message or flag */
  error?: boolean | string;
  /** Keypad container style */
  style?: StyleProp<ViewStyle>;
  /** Submit button style */
  submitStyle?: StyleProp<ViewStyle>;
  /** Display wrapper style */
  displayStyle?: StyleProp<ViewStyle>;
}

export function NumPad({
  value: controlledValue,
  defaultValue = "",
  onChange,
  maxLength = 6,
  mode = "pin",
  extraKey = mode === "cash" ? "." : "",
  onSubmit,
  submitLabel = "Enter",
  mask = mode === "pin",
  disabled = false,
  error,
  style,
  submitStyle,
  displayStyle,
}: NumPadProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? controlledValue : internalValue;

  const updateValue = (next: string) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const handleDigit = (digit: string) => {
    if (maxLength && currentValue.length >= maxLength) return;
    updateValue(currentValue + digit);
  };

  const handleBackspace = () => {
    if (currentValue.length > 0) {
      updateValue(currentValue.slice(0, -1));
    }
  };

  const handleClear = () => {
    updateValue("");
  };

  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [extraKey || "C", "0", "backspace"],
  ];

  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <View style={[s.container, disabled && s.containerDisabled, style]}>
      {/* Readout Display */}
      <View
        style={[
          s.displayWrap,
          hasError && s.displayWrapError,
          displayStyle,
        ]}
      >
        {mask ? (
          <View style={s.pinDotsRow}>
            {Array.from({ length: maxLength }).map((_, i) => (
              <View
                key={i}
                style={[
                  s.pinDot,
                  i < currentValue.length && s.pinDotFilled,
                  hasError && s.pinDotError,
                ]}
              />
            ))}
          </View>
        ) : (
          <Text
            style={[s.displayText, hasError && s.displayTextError]}
            numberOfLines={1}
          >
            {currentValue.length === 0 ? "0" : currentValue}
          </Text>
        )}
      </View>

      {errorMessage && (
        <Text accessibilityLiveRegion="polite" style={s.errorText}>
          {errorMessage}
        </Text>
      )}

      {/* Grid of keys */}
      <View style={s.keysGrid}>
        {keys.map((row, rowIdx) => (
          <View key={rowIdx} style={s.keyRow}>
            {row.map((k, colIdx) => {
              if (!k) {
                return <View key={colIdx} style={s.keyPlaceholder} />;
              }

              if (k === "backspace") {
                return (
                  <Pressable
                    key={colIdx}
                    accessibilityRole="button"
                    accessibilityLabel="Delete last digit"
                    accessibilityState={{ disabled }}
                    disabled={disabled}
                    onPress={handleBackspace}
                    style={({ pressed, hovered }: any) => [
                      s.keyBtn,
                      s.actionKeyBtn,
                      (pressed || hovered) && !disabled && s.keyPressed,
                    ]}
                  >
                    <Icon name="arrowLeft" size={18} color={colors.ink} />
                  </Pressable>
                );
              }

              if (k === "C") {
                return (
                  <Pressable
                    key={colIdx}
                    accessibilityRole="button"
                    accessibilityLabel="Clear all digits"
                    accessibilityState={{ disabled }}
                    disabled={disabled}
                    onPress={handleClear}
                    style={({ pressed, hovered }: any) => [
                      s.keyBtn,
                      s.actionKeyBtn,
                      (pressed || hovered) && !disabled && s.keyPressed,
                    ]}
                  >
                    <Text style={s.clearKeyText}>C</Text>
                  </Pressable>
                );
              }

              return (
                <Pressable
                  key={colIdx}
                  accessibilityRole="button"
                  accessibilityLabel={`Key ${k}`}
                  accessibilityState={{ disabled }}
                  disabled={disabled}
                  onPress={() => handleDigit(k)}
                  style={({ pressed, hovered }: any) => [
                    s.keyBtn,
                    (pressed || hovered) && !disabled && s.keyPressed,
                  ]}
                >
                  <Text style={s.digitKeyText}>{k}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {onSubmit && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={submitLabel}
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={onSubmit}
          style={({ pressed, hovered }: any) => [
            s.submitBtn,
            (pressed || hovered) && !disabled && { opacity: 0.85 },
            disabled && { opacity: 0.5 },
            submitStyle,
          ]}
        >
          <Text style={s.submitBtnText}>{submitLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 320,
    alignSelf: "center",
    backgroundColor: colors.paper,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    gap: 16,
    ...cardShadow,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  displayWrap: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.canvas,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
  },
  displayWrapError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  displayText: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.ink,
    fontFamily: mono,
    letterSpacing: 2,
  },
  displayTextError: {
    color: colors.danger,
  },
  pinDotsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.muted,
    backgroundColor: "transparent",
  },
  pinDotFilled: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  pinDotError: {
    borderColor: colors.danger,
    backgroundColor: colors.danger,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    textAlign: "center",
  },
  keysGrid: {
    gap: 8,
  },
  keyRow: {
    flexDirection: "row",
    gap: 8,
  },
  keyPlaceholder: {
    flex: 1,
    height: 52,
  },
  keyBtn: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({
          outlineStyle: "none",
          cursor: "pointer",
          userSelect: "none",
        } as any)
      : {}),
  },
  actionKeyBtn: {
    backgroundColor: colors.canvas,
  },
  keyPressed: {
    backgroundColor: colors.line,
    transform: [{ scale: 0.96 }],
  },
  digitKeyText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.ink,
  },
  clearKeyText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.muted,
  },
  submitBtn: {
    height: 46,
    backgroundColor: colors.lime,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
});
