import React, { useState } from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { Icon, IconName } from "./Icon";

export interface InputProps extends TextInputProps {
  /** Optional label text above the input */
  label?: string;
  /** Error message to display below input */
  error?: string;
  /** Helper hint message to display below input */
  hint?: string;
  /** Icon name to display at the start of the input */
  icon?: IconName;
  /** Leading icon alias */
  leadingIcon?: IconName;
  /** Leading accessory node */
  leadingAccessory?: React.ReactNode;
  /** Trailing accessory node (e.g. eye icon for password) */
  trailingAccessory?: React.ReactNode;
  /** Accent color for focus ring or selection */
  accent?: string;
  /** Container style */
  containerStyle?: StyleProp<ViewStyle>;
  /** Field container style */
  fieldStyle?: StyleProp<ViewStyle>;
  /** Text input style */
  style?: StyleProp<TextStyle>;
  /** Disabled state */
  disabled?: boolean;
}

export function Input({
  label,
  error,
  hint,
  icon,
  leadingIcon,
  leadingAccessory,
  trailingAccessory,
  accent = colors.lime,
  containerStyle,
  fieldStyle,
  style,
  disabled,
  editable,
  ...props
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const isEditable = disabled !== undefined ? !disabled : editable !== false;
  const activeIcon = leadingIcon || icon;

  return (
    <View style={[s.wrapper, containerStyle]}>
      {!!label && <Text style={s.label}>{label}</Text>}
      <View
        style={[
          s.field,
          !isEditable && s.fieldDisabled,
          {
            borderColor: error ? colors.danger : focused ? colors.ink : colors.line,
            backgroundColor: focused ? colors.paper : colors.canvas,
          },
          fieldStyle,
        ]}
      >
        {leadingAccessory}
        {activeIcon && <Icon name={activeIcon} size={16} color={colors.muted} />}
        <TextInput
          {...props}
          editable={isEditable}
          accessibilityLabel={props.accessibilityLabel || label}
          accessibilityState={{
            disabled: !isEditable,
            ...props.accessibilityState,
          }}
          placeholderTextColor={colors.muted}
          selectionColor={accent || colors.ink}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          style={[s.input, style]}
        />
        {trailingAccessory}
      </View>
      {(error || hint) && (
        <Text
          accessibilityLiveRegion="polite"
          style={[s.hint, error ? s.hintError : {}]}
        >
          {error || hint}
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
    fontWeight: "500",
    color: colors.ink,
  },
  field: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  fieldDisabled: {
    opacity: 0.55,
    backgroundColor: colors.canvas,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.ink,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  hint: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
  hintError: {
    color: colors.danger,
    fontWeight: "500",
  },
});
