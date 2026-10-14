import React, { useState, useMemo, useEffect } from "react";
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

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  /** Controlled selected option value */
  value?: string;
  /** Initial selected option value for uncontrolled state */
  defaultValue?: string;
  /** Callback fired when selected value changes */
  onChange?: (value: string) => void;
  /** Alternative callback fired when selected value changes */
  onSelect?: (value: string) => void;
  /** List of selectable options */
  options: ComboboxOption[];
  /** Placeholder text when nothing is selected */
  placeholder?: string;
  /** Optional field label */
  label?: string;
  /** Disables combobox interaction */
  disabled?: boolean;
  /** Error state or error message string */
  error?: boolean | string;
  /** Accent color for selected option (defaults to colors.lime) */
  accent?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

export function Combobox({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onSelect,
  options,
  placeholder = "Select or search...",
  label,
  disabled = false,
  error,
  accent = colors.lime,
  style,
}: ComboboxProps) {
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === currentValue),
    [options, currentValue],
  );

  const filtered = useMemo(() => {
    if (!search) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [options, search]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const choose = (next: string) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
    onSelect?.(next);
    setOpen(false);
    setSearch("");
  };

  const hasError = !!error;
  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <View style={[s.container, style]}>
      {!!label && <Text style={s.label}>{label}</Text>}

      <View
        style={[
          s.inputBox,
          open && s.inputBoxActive,
          hasError && s.inputBoxError,
          disabled && s.disabled,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label || "Select option"}: ${selectedOption?.label || placeholder}`}
          accessibilityState={{ expanded: open, disabled }}
          disabled={disabled}
          onPress={() => {
            setOpen(!open);
            setSearch("");
          }}
          style={s.trigger}
        >
          <Text
            numberOfLines={1}
            style={[s.displayText, !selectedOption && { color: colors.muted }]}
          >
            {selectedOption?.label || placeholder}
          </Text>
          <Icon
            name={open ? "chevronUp" : "chevronDown"}
            size={16}
            color={colors.muted}
          />
        </Pressable>

        {selectedOption && !disabled && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Clear ${label || "selection"}`}
            onPress={() => choose("")}
            style={s.clear}
          >
            <Icon name="close" size={16} color={colors.muted} />
          </Pressable>
        )}
      </View>

      {errorMessage && (
        <Text
          accessibilityRole="alert"
          style={s.errorText}
        >
          {errorMessage}
        </Text>
      )}

      {open && !disabled && (
        <View style={s.dropdownList}>
          <View style={s.searchRow}>
            <Icon name="search" size={16} color={colors.muted} />
            <TextInput
              autoFocus
              accessibilityLabel={`Search ${label || "options"}`}
              value={search}
              onChangeText={setSearch}
              placeholder="Search options"
              placeholderTextColor={colors.muted}
              style={s.textInput}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={() => {
                if (filtered[0]) choose(filtered[0].value);
              }}
              onKeyPress={(event) => {
                if (event.nativeEvent.key === "Escape") setOpen(false);
              }}
            />
          </View>

          <ScrollView
            style={s.optionsScroll}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {filtered.length === 0 ? (
              <View style={s.emptyRow}>
                <Text style={s.emptyText}>No matching options</Text>
              </View>
            ) : (
              filtered.map((option) => {
                const isSelected = option.value === currentValue;
                const optDisabled = !!option.disabled;

                return (
                  <Pressable
                    key={option.value}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: isSelected,
                      disabled: optDisabled,
                    }}
                    disabled={optDisabled}
                    onPress={() => choose(option.value)}
                    style={({ pressed, hovered }: any) => [
                      s.optionRow,
                      isSelected && { backgroundColor: accent },
                      !isSelected &&
                        (hovered || pressed) &&
                        !optDisabled && { backgroundColor: colors.canvas },
                      optDisabled && { opacity: 0.4 },
                      {
                        outlineWidth: 0,
                        outlineColor: "transparent",
                        ...(Platform.OS === "web"
                          ? ({
                              cursor: optDisabled ? "not-allowed" : "pointer",
                              outlineStyle: "none",
                            } as any)
                          : {}),
                      },
                    ]}
                  >
                    <View style={s.optionTextWrap}>
                      <Text numberOfLines={1} style={s.optionLabel}>
                        {option.label}
                      </Text>
                      {!!option.description && (
                        <Text numberOfLines={2} style={s.optionDesc}>
                          {option.description}
                        </Text>
                      )}
                    </View>
                    {isSelected && (
                      <Icon name="check" size={16} color={colors.ink} />
                    )}
                  </Pressable>
                );
              })
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
    gap: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.1,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 48,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
  },
  inputBoxActive: {
    borderColor: colors.ink,
  },
  inputBoxError: {
    borderColor: colors.danger,
  },
  disabled: {
    opacity: 0.5,
  },
  trigger: {
    flex: 1,
    minWidth: 0,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingHorizontal: 14,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ cursor: "pointer", outlineStyle: "none" } as any)
      : {}),
  },
  clear: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ cursor: "pointer", outlineStyle: "none" } as any)
      : {}),
  },
  searchRow: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  textInput: {
    minWidth: 0,
    minHeight: 44,
    flex: 1,
    fontSize: 15,
    color: colors.ink,
    padding: 0,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  displayText: {
    flexShrink: 1,
    fontSize: 15,
    color: colors.ink,
  },
  dropdownList: {
    marginTop: 6,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 8,
    ...(Platform.OS === "web"
      ? ({ boxShadow: "0px 8px 24px rgba(35, 38, 33, 0.12)" } as any)
      : {}),
    overflow: "hidden",
  },
  optionsScroll: {
    maxHeight: 220,
  },
  optionRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  optionTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  optionLabel: {
    fontSize: 14,
    color: colors.ink,
    fontWeight: "500",
  },
  optionDesc: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  emptyRow: {
    padding: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 2,
  },
});
