import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { FormLabel } from "./FormLabel";
import { Icon } from "./Icon";

export interface FormFieldProps {
  /** Form field label */
  label?: string;
  /** Whether the field is required (displays asterisk) */
  required?: boolean;
  /** Whether the field is optional (displays 'Optional' badge) */
  optional?: boolean;
  /** Sub-label hint text */
  hint?: string;
  /** Validation error message */
  error?: string;
  /** Help/instructional text shown below the input */
  helpText?: string;
  /** Character counter constraint */
  charCount?: { current: number; max: number };
  /** Disables label and field presentation */
  disabled?: boolean;
  /** Input component element */
  children: React.ReactNode;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom input control wrapper style */
  controlStyle?: StyleProp<ViewStyle>;
  /** Custom error text style */
  errorStyle?: StyleProp<TextStyle>;
}

export function FormField({
  label,
  required,
  optional,
  hint,
  error,
  helpText,
  charCount,
  disabled = false,
  children,
  style,
  controlStyle,
  errorStyle,
}: FormFieldProps) {
  return (
    <View style={[s.field, style]}>
      {label && (
        <FormLabel
          label={label}
          required={required}
          optional={optional}
          hint={hint}
          disabled={disabled}
        />
      )}

      <View style={[s.controlContainer, controlStyle]}>{children}</View>

      {!!(error || helpText || charCount) && (
        <View style={s.footer}>
          {error ? (
            <View style={s.errorRow}>
              <Icon name="alertCircle" size={13} color={colors.danger} />
              <Text
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
                style={[s.errorText, errorStyle]}
              >
                {error}
              </Text>
            </View>
          ) : helpText ? (
            <Text style={s.helpText}>{helpText}</Text>
          ) : (
            <View />
          )}

          {charCount && (
            <Text
              style={[
                s.charCount,
                charCount.current > charCount.max && s.charCountExceeded,
              ]}
            >
              {charCount.current}/{charCount.max}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  field: {
    width: "100%",
    marginBottom: 16,
  },
  controlContainer: {
    width: "100%",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    minHeight: 18,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flex: 1,
    minWidth: 0,
  },
  errorText: {
    flexShrink: 1,
    fontSize: 12,
    color: colors.danger,
    lineHeight: 16,
  },
  helpText: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 16,
    flex: 1,
    minWidth: 0,
  },
  charCount: {
    fontSize: 11,
    color: colors.muted,
    marginLeft: 8,
    flexShrink: 0,
  },
  charCountExceeded: {
    color: colors.danger,
    fontWeight: "600",
  },
});
