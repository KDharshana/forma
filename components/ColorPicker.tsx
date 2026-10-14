import React, { useEffect, useState } from "react";
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

export interface ColorPickerProps {
  /** Controlled hex color value */
  value?: string;
  /** Initial hex color value for uncontrolled usage */
  defaultValue?: string;
  /** Callback fired when color changes */
  onChange?: (color: string) => void;
  /** Palette swatch colors array */
  swatches?: string[];
  /** Optional field label */
  label?: string;
  /** Whether to show manual hex code input (defaults to true) */
  allowCustomHex?: boolean;
  /** Disables color selection */
  disabled?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

const defaultSwatches = [
  colors.lime, // #d4ef78
  colors.lavender, // #d9cafa
  colors.teal, // #c3e6df
  colors.apricot, // #f2ccaa
  colors.ink, // #232621
  colors.muted, // #606858
  colors.successBg, // #eef5e6
  colors.warningBg, // #fef3e2
  colors.dangerBg, // #fdeeed
  colors.infoBg, // #e9f2fb
];

export function ColorPicker({
  value: controlledValue,
  defaultValue,
  onChange,
  swatches = defaultSwatches,
  label,
  allowCustomHex = true,
  disabled = false,
  style,
}: ColorPickerProps) {
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue || swatches[0] || "#232621",
  );

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const [hexInput, setHexInput] = useState(currentValue);
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!focused) setHexInput(currentValue);
  }, [currentValue, focused]);

  const commit = () => {
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hexInput)) {
      if (!isControlled) {
        setInternalValue(hexInput);
      }
      onChange?.(hexInput);
      setError("");
    } else {
      setError("Enter a 3 or 6 digit hex color.");
    }
  };

  const handleHexChange = (text: string) => {
    let clean = text.trim();
    if (!clean.startsWith("#")) {
      clean = "#" + clean;
    }
    setHexInput(clean);
    setError("");
  };

  const handleSelectColor = (color: string) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalValue(color);
    }
    setHexInput(color);
    setError("");
    onChange?.(color);
  };

  return (
    <View style={[s.container, style]}>
      {label && <Text style={s.label}>{label}</Text>}

      <View style={s.swatchesGrid}>
        {swatches.map((color) => {
          const selected =
            (currentValue || "").toLowerCase() === color.toLowerCase();

          return (
            <Pressable
              key={color}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected, disabled }}
              accessibilityLabel={`Select color ${color}`}
              disabled={disabled}
              onPress={() => handleSelectColor(color)}
              style={({ pressed, hovered }: any) => [
                s.swatch,
                { backgroundColor: color },
                selected && s.swatchSelected,
                (hovered || pressed) && !disabled && { opacity: 0.85 },
                disabled && { opacity: 0.45 },
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
              {selected && (
                <View style={s.checkPill}>
                  <Icon
                    name="check"
                    size={13}
                    color={colors.ink}
                    strokeWidth={2.4}
                  />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {allowCustomHex && (
        <View style={s.customRow}>
          <View style={[s.previewSquare, { backgroundColor: currentValue }]} />
          <View
            style={[
              s.inputContainer,
              focused && { borderColor: colors.ink },
              disabled && { opacity: 0.5 },
            ]}
          >
            <Text style={s.hashPrefix}>#</Text>
            <TextInput
              accessibilityLabel={`${label || "Color"} hex value`}
              editable={!disabled}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                commit();
                setFocused(false);
              }}
              onSubmitEditing={commit}
              style={s.hexInput}
              value={hexInput.replace("#", "")}
              onChangeText={handleHexChange}
              maxLength={6}
              autoCapitalize="characters"
              placeholder="HEX"
              placeholderTextColor={colors.muted}
            />
          </View>
        </View>
      )}

      {!!error && (
        <Text
          accessibilityRole="alert"
          style={s.errorText}
        >
          {error}
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.2,
  },
  swatchesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  swatchSelected: {
    borderColor: colors.ink,
    borderWidth: 2,
    transform: [{ scale: 1.05 }],
  },
  checkPill: {
    backgroundColor: colors.paper,
    borderRadius: 12,
    padding: 3,
  },
  customRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  previewSquare: {
    width: 44,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 48,
    flex: 1,
  },
  hashPrefix: {
    fontSize: 16,
    color: colors.muted,
    fontWeight: "500",
  },
  hexInput: {
    flex: 1,
    fontSize: 16,
    color: colors.ink,
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    paddingLeft: 4,
    paddingVertical: 0,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    lineHeight: 16,
  },
});
