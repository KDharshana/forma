import React, { useState, useEffect } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { Icon } from "./Icon";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  /** Controlled selected values */
  value?: string[];
  /** Uncontrolled initial selected values */
  defaultValue?: string[];
  /** Callback fired when selected values change */
  onChange?: (value: string[]) => void;
  /** Available options to select from */
  options: MultiSelectOption[];
  /** Placeholder when no items are selected */
  placeholder?: string;
  /** Label above the selector */
  label?: string;
  /** Error message or flag */
  error?: boolean | string;
  /** Disabled state */
  disabled?: boolean;
  /** Accent highlight color for selected chips */
  accent?: string;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Input container style */
  inputContainerStyle?: StyleProp<ViewStyle>;
  /** Dropdown menu style */
  dropdownStyle?: StyleProp<ViewStyle>;
}

export function MultiSelect({
  value: controlledValue,
  defaultValue = [],
  onChange,
  options,
  placeholder = "Select multiple...",
  label,
  error,
  disabled = false,
  accent = colors.lime,
  style,
  inputContainerStyle,
  dropdownStyle,
}: MultiSelectProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const currentValues = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const selectedOptions = options.filter((o) => currentValues.includes(o.value));
  const filteredOptions = options.filter(
    (o) =>
      o.label.toLowerCase().includes(query.toLowerCase()) &&
      !currentValues.includes(o.value),
  );

  const removeValue = (val: string) => {
    if (disabled) return;
    const nextValues = currentValues.filter((v) => v !== val);
    if (!isControlled) setInternalValue(nextValues);
    onChange?.(nextValues);
  };

  const addValue = (val: string) => {
    if (disabled || currentValues.includes(val)) return;
    const nextValues = [...currentValues, val];
    if (!isControlled) setInternalValue(nextValues);
    onChange?.(nextValues);
    setQuery("");
  };

  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <View style={[s.container, style]}>
      {label && <Text style={s.label}>{label}</Text>}

      <View
        style={[
          s.inputContainer,
          open && s.inputContainerActive,
          hasError && s.inputContainerError,
          disabled && s.disabled,
          inputContainerStyle,
        ]}
      >
        <View style={s.chipArea}>
          {selectedOptions.map((opt) => (
            <View key={opt.value} style={[s.chip, { backgroundColor: accent }]}>
              <Text style={s.chipText}>{opt.label}</Text>
              <Pressable
                disabled={disabled}
                accessibilityState={{ disabled }}
                accessibilityRole="button"
                accessibilityLabel={`Remove ${opt.label}`}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={(e) => {
                  e.stopPropagation();
                  removeValue(opt.value);
                }}
                style={s.chipRemove}
              >
                <Icon
                  name="close"
                  size={12}
                  color={colors.ink}
                  strokeWidth={2}
                />
              </Pressable>
            </View>
          ))}
          <TextInput
            accessibilityLabel={label || "Search options"}
            editable={!disabled}
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={() => {
              if (filteredOptions[0]) addValue(filteredOptions[0].value);
            }}
            onKeyPress={(event) => {
              if (event.nativeEvent.key === "Escape") setOpen(false);
            }}
            placeholder={selectedOptions.length === 0 ? placeholder : "Add..."}
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={(txt) => {
              setQuery(txt);
              if (!open) setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            style={s.textInput}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={open ? "Hide options" : "Show options"}
          accessibilityState={{ expanded: open, disabled }}
          disabled={disabled}
          onPress={() => setOpen(!open)}
          style={s.toggle}
        >
          <Icon
            name={open ? "chevronUp" : "chevronDown"}
            size={14}
            color={colors.muted}
          />
        </Pressable>
      </View>

      {errorMessage && (
        <Text accessibilityLiveRegion="polite" style={s.errorText}>
          {errorMessage}
        </Text>
      )}

      {open && !disabled && (
        <View style={[s.dropdown, dropdownStyle]}>
          <ScrollView
            style={{ maxHeight: 180 }}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {filteredOptions.length === 0 ? (
              <View style={s.emptyRow}>
                <Text style={s.emptyText}>
                  {options.length === selectedOptions.length
                    ? "All options selected"
                    : "No matching options"}
                </Text>
              </View>
            ) : (
              filteredOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${opt.label}`}
                  onPress={() => addValue(opt.value)}
                  style={({ pressed, hovered }: any) => [
                    s.optionRow,
                    (hovered || pressed) && s.optionRowActive,
                  ]}
                >
                  <Text style={s.optionLabel}>{opt.label}</Text>
                  <Icon name="plus" size={13} color={colors.muted} />
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
    zIndex: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.ink,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 44,
    gap: 8,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none" } as any)
      : {}),
  },
  inputContainerActive: {
    borderColor: colors.ink,
  },
  inputContainerError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  disabled: {
    opacity: 0.5,
  },
  chipArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    flex: 1,
    minWidth: 0,
  },
  toggle: {
    width: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  chip: {
    minHeight: 32,
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chipText: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: "500",
    color: colors.ink,
  },
  chipRemove: {
    padding: 2,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  textInput: {
    minHeight: 32,
    fontSize: 15,
    color: colors.ink,
    minWidth: 60,
    flex: 1,
    padding: 0,
    margin: 0,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  dropdown: {
    marginTop: 6,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    boxShadow: "0px 8px 24px rgba(35, 38, 33, 0.12)",
    overflow: "hidden",
  },
  optionRow: {
    minHeight: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  optionRowActive: {
    backgroundColor: colors.canvas,
  },
  optionLabel: {
    flexShrink: 1,
    fontSize: 13,
    color: colors.ink,
  },
  emptyRow: {
    padding: 14,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 12,
    color: colors.muted,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
  },
});
