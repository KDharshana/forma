import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { Icon } from "./Icon";

export interface CountryCode {
  code: string; // "IN", "US", etc.
  dialCode: string; // "+91", "+1", etc.
  name: string;
  flag: string;
}

export const DEFAULT_COUNTRIES: CountryCode[] = [
  { code: "IN", dialCode: "+91", name: "India", flag: "🇮🇳" },
  { code: "US", dialCode: "+1", name: "United States", flag: "🇺🇸" },
  { code: "GB", dialCode: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AE", dialCode: "+971", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SG", dialCode: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "DE", dialCode: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "AU", dialCode: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "CA", dialCode: "+1", name: "Canada", flag: "🇨🇦" },
];

export interface PhoneInputProps {
  /** Controlled phone number value */
  value?: string;
  /** Uncontrolled initial phone number value */
  defaultValue?: string;
  /** Text change callback */
  onChangeText?: (value: string) => void;
  /** Change callback alias */
  onChange?: (value: string) => void;
  /** Controlled selected country code */
  selectedCountry?: CountryCode;
  /** Uncontrolled initial country code */
  defaultCountry?: CountryCode;
  /** Country code selection callback */
  onCountryChange?: (country: CountryCode) => void;
  /** Label above the field */
  label?: string;
  /** Error message or state */
  error?: string | boolean;
  /** Helper hint message below the field */
  hint?: string;
  /** Placeholder for the number */
  placeholder?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Field container style */
  fieldStyle?: StyleProp<ViewStyle>;
  /** Text input style */
  inputStyle?: StyleProp<TextStyle>;
}

export function PhoneInput({
  value: controlledValue,
  defaultValue = "",
  onChangeText,
  onChange,
  selectedCountry: controlledCountry,
  defaultCountry = DEFAULT_COUNTRIES[0],
  onCountryChange,
  label,
  error,
  hint,
  placeholder = "98765 43210",
  disabled = false,
  style,
  fieldStyle,
  inputStyle,
}: PhoneInputProps) {
  const isControlledValue = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlledValue ? controlledValue : internalValue;

  const isControlledCountry = controlledCountry !== undefined;
  const [internalCountry, setInternalCountry] = useState(defaultCountry);
  const activeCountry = isControlledCountry ? controlledCountry : internalCountry;

  const [modalOpen, setModalOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [search, setSearch] = useState("");

  const handleTextChange = (text: string) => {
    if (disabled) return;
    if (!isControlledValue) {
      setInternalValue(text);
    }
    onChangeText?.(text);
    onChange?.(text);
  };

  const handleSelectCountry = (country: CountryCode) => {
    if (!isControlledCountry) {
      setInternalCountry(country);
    }
    onCountryChange?.(country);
    setModalOpen(false);
    setSearch("");
  };

  const filteredCountries = DEFAULT_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dialCode.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <View style={[s.wrapper, style]}>
      {label && <Text style={s.label}>{label}</Text>}

      <View
        style={[
          s.field,
          focused && s.fieldFocused,
          hasError && s.fieldError,
          disabled && s.fieldDisabled,
          fieldStyle,
        ]}
      >
        {/* Country Selector Trigger */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Select country code, current is ${activeCountry.name} ${activeCountry.dialCode}`}
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={() => setModalOpen(true)}
          style={({ pressed, hovered }: any) => [
            s.countryBtn,
            (pressed || hovered) && !disabled && { opacity: 0.75 },
          ]}
        >
          <Text style={s.flagText}>{activeCountry.flag}</Text>
          <Text style={s.dialText}>{activeCountry.dialCode}</Text>
          <Icon name="chevronDown" size={12} color={colors.muted} />
        </Pressable>

        <View style={s.separator} />

        {/* Number Input */}
        <TextInput
          value={currentValue}
          onChangeText={handleTextChange}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          keyboardType="phone-pad"
          editable={!disabled}
          accessibilityLabel={label || "Phone number"}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[s.input, inputStyle]}
        />
      </View>

      {(errorMessage || hint) && (
        <Text
          accessibilityLiveRegion="polite"
          style={[s.hint, hasError ? s.hintError : undefined]}
        >
          {errorMessage || hint}
        </Text>
      )}

      {/* Country Selection Modal */}
      <Modal
        visible={modalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}
      >
        <Pressable
          accessible={false}
          style={s.modalOverlay}
          onPress={() => setModalOpen(false)}
        >
          <Pressable
            accessible={false}
            role="dialog"
            aria-modal={true}
            accessibilityLabel="Select country"
            style={s.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={s.modalHeader}>
              <Text accessibilityRole="header" style={s.modalTitle}>
                Select Country
              </Text>
              <Pressable
                onPress={() => setModalOpen(false)}
                accessibilityRole="button"
                accessibilityLabel="Close country selector"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={s.modalCloseBtn}
              >
                <Icon name="close" size={16} color={colors.muted} />
              </Pressable>
            </View>

            <View style={s.searchWrap}>
              <Icon name="search" size={14} color={colors.muted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search country or dial code..."
                placeholderTextColor={colors.muted}
                accessibilityLabel="Search country or dial code"
                style={s.searchInput}
              />
            </View>

            <ScrollView style={s.countryList} keyboardShouldPersistTaps="handled">
              {filteredCountries.map((c) => {
                const isSelected = c.code === activeCountry.code;
                return (
                  <Pressable
                    key={c.code}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${c.name} ${c.dialCode}`}
                    onPress={() => handleSelectCountry(c)}
                    style={({ pressed, hovered }: any) => [
                      s.countryItem,
                      isSelected && s.countryItemSelected,
                      (hovered || pressed) && { backgroundColor: colors.canvas },
                    ]}
                  >
                    <Text style={s.countryItemFlag}>{c.flag}</Text>
                    <Text style={s.countryItemName}>{c.name}</Text>
                    <Text style={s.countryItemDial}>{c.dialCode}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  fieldFocused: {
    borderColor: colors.ink,
  },
  fieldError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  fieldDisabled: {
    opacity: 0.5,
    backgroundColor: colors.canvas,
  },
  countryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    gap: 6,
    paddingRight: 6,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  flagText: {
    fontSize: 16,
  },
  dialText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  separator: {
    width: 1,
    height: 20,
    backgroundColor: colors.line,
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 10,
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
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(35, 38, 33, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    width: "100%",
    maxWidth: 380,
    maxHeight: 460,
    backgroundColor: colors.paper,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  modalCloseBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: 8,
    backgroundColor: colors.canvas,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ink,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  countryList: {
    paddingVertical: 4,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 44,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 12,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  countryItemSelected: {
    backgroundColor: colors.canvas,
  },
  countryItemFlag: {
    fontSize: 18,
  },
  countryItemName: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: colors.ink,
  },
  countryItemDial: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
  },
});
