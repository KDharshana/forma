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
import { colors } from "./theme";
import { Icon } from "./Icon";

export interface EmailChipInputProps {
  /** Controlled array of email strings */
  value?: string[];
  /** Initial array of email strings for uncontrolled usage */
  defaultValue?: string[];
  /** Callback fired when the email list changes */
  onChange?: (emails: string[]) => void;
  /** Optional custom email format validator function */
  validator?: (email: string) => boolean;
  /** Optional field label */
  label?: string;
  /** Placeholder text when no chips are present */
  placeholder?: string;
  /** Error message string */
  error?: string;
  /** Helper hint message string */
  hint?: string;
  /** Disables input interaction */
  disabled?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailChipInput({
  value: controlledValue,
  defaultValue = [],
  onChange,
  validator,
  label,
  placeholder = "Add email...",
  error,
  hint,
  disabled = false,
  style,
}: EmailChipInputProps) {
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const emails = isControlled ? controlledValue : internalValue;

  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const isValidEmail = (email: string) => {
    if (validator) return validator(email);
    return DEFAULT_EMAIL_REGEX.test(email);
  };

  const addEmails = (raw: string) => {
    const candidates = raw
      .split(/[,;\s]+/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0);

    if (candidates.length === 0) return;

    // Deduplicate against existing
    const newItems = [...emails];
    for (const c of candidates) {
      if (!newItems.includes(c)) {
        newItems.push(c);
      }
    }
    if (!isControlled) {
      setInternalValue(newItems);
    }
    onChange?.(newItems);
    setText("");
  };

  const removeEmail = (index: number) => {
    if (disabled) return;
    const next = [...emails];
    next.splice(index, 1);
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const handleKeyPress = (e: any) => {
    if (e.nativeEvent.key === "Backspace" && text === "" && emails.length > 0) {
      removeEmail(emails.length - 1);
    }
  };

  return (
    <View style={[s.wrapper, style]}>
      {label && <Text style={s.label}>{label}</Text>}

      <View
        style={[
          s.container,
          focused && s.containerFocused,
          error ? s.containerError : undefined,
          disabled && s.containerDisabled,
        ]}
      >
        <View style={s.chipsWrap}>
          {emails.map((email, index) => {
            const isValid = isValidEmail(email);

            return (
              <View
                key={`${email}-${index}`}
                style={[s.chip, !isValid && s.chipInvalid]}
              >
                <Text
                  style={[s.chipText, !isValid && s.chipTextInvalid]}
                  numberOfLines={1}
                >
                  {email}
                </Text>
                {!disabled && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${email}`}
                    onPress={() => removeEmail(index)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={({ pressed, hovered }: any) => [
                      s.removeBtn,
                      hovered && { opacity: 0.8 },
                      pressed && { opacity: 0.6 },
                      {
                        outlineWidth: 0,
                        outlineColor: "transparent",
                        ...(Platform.OS === "web"
                          ? ({ cursor: "pointer", outlineStyle: "none" } as any)
                          : {}),
                      },
                    ]}
                  >
                    <Icon
                      name="close"
                      size={12}
                      color={isValid ? colors.muted : colors.danger}
                    />
                  </Pressable>
                )}
              </View>
            );
          })}

          <TextInput
            value={text}
            onChangeText={(t) => {
              if (t.endsWith(",") || t.endsWith(" ") || t.endsWith(";")) {
                addEmails(t);
              } else {
                setText(t);
              }
            }}
            onSubmitEditing={() => addEmails(text)}
            onKeyPress={handleKeyPress}
            onBlur={() => {
              setFocused(false);
              if (text.trim()) addEmails(text);
            }}
            onFocus={() => setFocused(true)}
            placeholder={emails.length === 0 ? placeholder : ""}
            placeholderTextColor={colors.muted}
            editable={!disabled}
            keyboardType="email-address"
            autoCapitalize="none"
            style={s.input}
          />
        </View>
      </View>

      {(error || hint) && (
        <Text
          accessibilityRole={error ? "alert" : undefined}
          style={[s.hint, error ? s.hintError : undefined]}
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
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.1,
  },
  container: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: "center",
  },
  containerFocused: {
    borderColor: colors.ink,
  },
  containerError: {
    borderColor: colors.danger,
  },
  containerDisabled: {
    opacity: 0.5,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    paddingVertical: 4,
    paddingLeft: 8,
    paddingRight: 6,
    gap: 6,
    maxWidth: "100%",
  },
  chipInvalid: {
    backgroundColor: colors.dangerBg,
    borderColor: "#f5c6c2",
  },
  chipText: {
    fontSize: 12,
    color: colors.ink,
    fontWeight: "500",
    flexShrink: 1,
  },
  chipTextInvalid: {
    color: colors.danger,
  },
  removeBtn: {
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    minWidth: 120,
    fontSize: 14,
    color: colors.ink,
    paddingVertical: 4,
    paddingHorizontal: 6,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  hint: {
    fontSize: 12,
    color: colors.muted,
  },
  hintError: {
    color: colors.danger,
  },
});
