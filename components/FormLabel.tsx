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

export interface FormLabelProps {
  /** Label text content */
  label: string;
  /** Whether the field is required (renders asterisk) */
  required?: boolean;
  /** Whether the field is optional (renders 'Optional' badge) */
  optional?: boolean;
  /** Optional secondary hint text */
  hint?: string;
  /** Disables label presentation */
  disabled?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom label text style */
  labelStyle?: StyleProp<TextStyle>;
}

export function FormLabel({
  label,
  required = false,
  optional = false,
  hint,
  disabled = false,
  style,
  labelStyle,
}: FormLabelProps) {
  return (
    <View style={[s.container, disabled && s.disabled, style]}>
      <View style={s.row}>
        <Text numberOfLines={2} style={[s.label, labelStyle]}>
          {label}
        </Text>
        {required && (
          <Text accessibilityLabel="Required" style={s.requiredMark}>
            *
          </Text>
        )}
        {optional && !required && <Text style={s.optionalBadge}>Optional</Text>}
      </View>
      {hint && (
        <Text numberOfLines={2} style={s.hint}>
          {hint}
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginBottom: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  row: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  requiredMark: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: "700",
  },
  optionalBadge: {
    fontSize: 12,
    color: colors.muted,
    backgroundColor: colors.canvas,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.line,
  },
  hint: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
    flexShrink: 1,
  },
});
