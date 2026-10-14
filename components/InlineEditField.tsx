import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
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

export interface InlineEditFieldProps {
  /** Controlled value */
  value?: string;
  /** Uncontrolled initial value */
  defaultValue?: string;
  /** Callback fired when user saves edit */
  onSave?: (val: string) => void;
  /** Callback fired when text changes or value is saved */
  onChange?: (val: string) => void;
  /** Label above the field */
  label?: string;
  /** Placeholder when value is empty */
  placeholder?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Error state flag or error message */
  error?: boolean | string;
  /** Loading state indicator */
  loading?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Input style */
  inputStyle?: StyleProp<TextStyle>;
  /** Value text style */
  textStyle?: StyleProp<TextStyle>;
}

export function InlineEditField({
  value: controlledValue,
  defaultValue = "",
  onSave,
  onChange,
  label,
  placeholder = "Click to edit...",
  disabled = false,
  error,
  loading = false,
  style,
  inputStyle,
  textStyle,
}: InlineEditFieldProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? controlledValue : internalValue;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(currentValue);

  useEffect(() => {
    if (isControlled) {
      setDraft(controlledValue);
    }
  }, [controlledValue, isControlled]);

  const startEdit = () => {
    if (disabled || loading) return;
    setDraft(currentValue);
    setEditing(true);
  };

  const handleSave = () => {
    if (!isControlled) {
      setInternalValue(draft);
    }
    onSave?.(draft);
    onChange?.(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(currentValue);
    setEditing(false);
  };

  const handleKeyDown = (e: any) => {
    if (e.nativeEvent.key === "Enter") {
      handleSave();
    } else if (e.nativeEvent.key === "Escape") {
      handleCancel();
    }
  };

  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <View style={[s.wrapper, style]}>
      {label && <Text style={s.label}>{label}</Text>}

      {editing ? (
        <View style={[s.editingRow, hasError && s.editingRowError]}>
          <TextInput
            autoFocus
            value={draft}
            onChangeText={(txt) => {
              setDraft(txt);
              onChange?.(txt);
            }}
            onKeyPress={handleKeyDown}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            accessibilityLabel={label || placeholder}
            style={[s.input, inputStyle]}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save edit"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={handleSave}
            style={({ pressed, hovered }: any) => [
              s.actionBtn,
              s.saveBtn,
              (pressed || hovered) && { opacity: 0.8 },
            ]}
          >
            <Icon name="check" size={14} color={colors.ink} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel edit"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={handleCancel}
            style={({ pressed, hovered }: any) => [
              s.actionBtn,
              s.cancelBtn,
              (pressed || hovered) && { opacity: 0.8 },
            ]}
          >
            <Icon name="close" size={14} color={colors.muted} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit ${label || currentValue || placeholder}`}
          accessibilityState={{ disabled: !!disabled }}
          disabled={disabled || loading}
          onPress={startEdit}
          style={({ pressed, hovered }: any) => [
            s.idleRow,
            hasError && s.idleRowError,
            (hovered || pressed) && !disabled && !loading && s.idleRowHovered,
            disabled && s.idleRowDisabled,
          ]}
        >
          <Text
            style={[
              s.valueText,
              !currentValue && s.placeholderText,
              textStyle,
            ]}
            numberOfLines={1}
          >
            {currentValue || placeholder}
          </Text>
          {loading ? (
            <ActivityIndicator size="small" color={colors.muted} />
          ) : (
            !disabled && (
              <View style={s.editPencil}>
                <Icon name="edit" size={14} color={colors.muted} />
              </View>
            )
          )}
        </Pressable>
      )}

      {errorMessage && (
        <Text accessibilityLiveRegion="polite" style={s.errorText}>
          {errorMessage}
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    gap: 4,
    width: "100%",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.muted,
  },
  idleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
    minHeight: 44,
    backgroundColor: "transparent",
    gap: 8,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  idleRowHovered: {
    backgroundColor: colors.canvas,
    borderColor: colors.line,
  },
  idleRowError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  idleRowDisabled: {
    opacity: 0.5,
    ...(Platform.OS === "web" ? ({ cursor: "not-allowed" } as any) : {}),
  },
  valueText: {
    fontSize: 14,
    color: colors.ink,
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
  },
  placeholderText: {
    color: colors.muted,
    fontStyle: "italic",
  },
  editPencil: {
    padding: 2,
    opacity: 0.7,
  },
  editingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.ink,
    borderRadius: 8,
    paddingHorizontal: 10,
    minHeight: 44,
    gap: 8,
  },
  editingRowError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.ink,
    paddingVertical: 8,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  saveBtn: {
    backgroundColor: colors.lime,
  },
  cancelBtn: {
    backgroundColor: colors.canvas,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 2,
  },
});
