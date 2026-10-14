import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { colors, mono } from "./theme";
import { Icon } from "./Icon";

export interface DurationValue {
  days: number;
  hours: number;
  minutes: number;
}

export interface DurationInputProps {
  /** Controlled duration value */
  value?: DurationValue;
  /** Initial duration value for uncontrolled usage */
  defaultValue?: DurationValue;
  /** Callback fired when duration value changes */
  onChange?: (val: DurationValue) => void;
  /** Units displayed in the stepper row */
  units?: Array<"days" | "hours" | "minutes">;
  /** Optional field label */
  label?: string;
  /** Optional helper hint */
  hint?: string;
  /** Error state or error message string */
  error?: boolean | string;
  /** Disables duration input interaction */
  disabled?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

export function DurationInput({
  value: controlledValue,
  defaultValue = { days: 0, hours: 0, minutes: 0 },
  onChange,
  units = ["days", "hours", "minutes"],
  label,
  hint,
  error,
  disabled = false,
  style,
}: DurationInputProps) {
  const [internalValue, setInternalValue] = useState<DurationValue>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const updateUnit = (unit: keyof DurationValue, delta: number) => {
    if (disabled) return;
    const current = currentValue[unit] || 0;
    const next = Math.max(0, current + delta);
    const updated = {
      ...currentValue,
      [unit]: next,
    };
    if (!isControlled) {
      setInternalValue(updated);
    }
    onChange?.(updated);
  };

  const setUnitDirect = (unit: keyof DurationValue, text: string) => {
    if (disabled) return;
    const parsed = parseInt(text.replace(/[^0-9]/g, ""), 10);
    const updated = {
      ...currentValue,
      [unit]: isNaN(parsed) ? 0 : parsed,
    };
    if (!isControlled) {
      setInternalValue(updated);
    }
    onChange?.(updated);
  };

  const hasError = !!error;
  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <View style={[s.wrapper, style]}>
      {label && <Text style={s.label}>{label}</Text>}

      <View style={s.unitsRow}>
        {units.map((unit) => {
          const val = currentValue[unit] || 0;
          const unitAbbr = unit === "days" ? "d" : unit === "hours" ? "h" : "m";
          const unitName =
            unit === "days" ? "Days" : unit === "hours" ? "Hours" : "Mins";

          return (
            <View
              key={unit}
              style={[s.unitCard, hasError && s.unitCardError]}
            >
              <Text style={s.unitLabel}>{unitName}</Text>
              <View style={[s.stepperWrap, disabled && s.stepperDisabled]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Decrease ${unit}`}
                  accessibilityState={{ disabled: disabled || val <= 0 }}
                  disabled={disabled || val <= 0}
                  onPress={() => updateUnit(unit, -1)}
                  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  style={({ pressed, hovered }: any) => [
                    s.stepperBtn,
                    (hovered || pressed) &&
                      !disabled &&
                      val > 0 && { backgroundColor: colors.canvas },
                    pressed && !disabled && s.stepperBtnPressed,
                    (disabled || val <= 0) && s.stepperBtnDisabled,
                    {
                      outlineWidth: 0,
                      outlineColor: "transparent",
                      ...(Platform.OS === "web"
                        ? ({
                            cursor:
                              disabled || val <= 0 ? "not-allowed" : "pointer",
                            outlineStyle: "none",
                          } as any)
                        : {}),
                    },
                  ]}
                >
                  <Icon
                    name="arrowDown"
                    size={13}
                    color={val <= 0 || disabled ? colors.line : colors.ink}
                  />
                </Pressable>

                <View style={s.inputContainer}>
                  <TextInput
                    value={String(val)}
                    onChangeText={(t) => setUnitDirect(unit, t)}
                    keyboardType="number-pad"
                    editable={!disabled}
                    accessibilityLabel={`${unitName} count`}
                    style={s.numberInput}
                  />
                  <Text style={s.abbrText}>{unitAbbr}</Text>
                </View>

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Increase ${unit}`}
                  accessibilityState={{ disabled }}
                  disabled={disabled}
                  onPress={() => updateUnit(unit, 1)}
                  hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                  style={({ pressed, hovered }: any) => [
                    s.stepperBtn,
                    (hovered || pressed) &&
                      !disabled && { backgroundColor: colors.canvas },
                    pressed && !disabled && s.stepperBtnPressed,
                    disabled && s.stepperBtnDisabled,
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
                  <Icon
                    name="arrowUp"
                    size={13}
                    color={disabled ? colors.line : colors.ink}
                  />
                </Pressable>
              </View>
            </View>
          );
        })}
      </View>

      {(errorMessage || hint) && (
        <Text
          accessibilityRole={errorMessage ? "alert" : undefined}
          style={[s.hint, errorMessage ? s.hintError : undefined]}
        >
          {errorMessage || hint}
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    gap: 6,
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.1,
  },
  unitsRow: {
    flexDirection: "row",
    gap: 10,
  },
  unitCard: {
    flex: 1,
    minWidth: 90,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
    gap: 6,
  },
  unitCardError: {
    borderColor: colors.danger,
  },
  unitLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  stepperWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.canvas,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    minHeight: 44,
    width: "100%",
  },
  stepperDisabled: {
    opacity: 0.5,
  },
  stepperBtn: {
    width: 38,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paper,
  },
  stepperBtnPressed: {
    backgroundColor: colors.line,
  },
  stepperBtnDisabled: {
    opacity: 0.4,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  numberInput: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: mono,
    color: colors.ink,
    textAlign: "center",
    minWidth: 24,
    paddingVertical: 4,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  abbrText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    marginLeft: 2,
  },
  hint: {
    fontSize: 12,
    color: colors.muted,
  },
  hintError: {
    color: colors.danger,
  },
});
