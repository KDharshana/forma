import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { Icon } from "./Icon";
import { Calendar } from "./Calendar";
import { ModalDialog } from "./ModalDialog";
import { Button } from "./Button";

export interface DatePickerProps {
  /** Controlled selected date */
  value?: Date;
  /** Initial selected date for uncontrolled state */
  defaultValue?: Date;
  /** Callback fired when a date is confirmed */
  onChange?: (date: Date) => void;
  /** Optional field label */
  label?: string;
  /** Text shown when no date is selected */
  placeholder?: string;
  /** Accent color for calendar selection */
  accent?: string;
  /** Whether to show quick preset buttons (Today, Tomorrow, 7 days) */
  presets?: boolean;
  /** Disables date picker interaction */
  disabled?: boolean;
  /** Earliest selectable date */
  minDate?: Date;
  /** Latest selectable date */
  maxDate?: Date;
  /** Error state or error message string */
  error?: boolean | string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom trigger input box style */
  triggerStyle?: StyleProp<ViewStyle>;
}

export function DatePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  label,
  placeholder = "Select date",
  accent = colors.lime,
  presets = true,
  disabled = false,
  minDate,
  maxDate,
  error,
  style,
  triggerStyle,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState<Date | undefined>(
    defaultValue instanceof Date && Number.isFinite(defaultValue.getTime())
      ? defaultValue
      : undefined,
  );

  const isControlled = controlledValue !== undefined;
  const activeDate = isControlled ? controlledValue : internalValue;
  const valid =
    activeDate instanceof Date && Number.isFinite(activeDate.getTime());

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Date>(() =>
    valid ? new Date(activeDate!) : new Date(),
  );

  const formatted = valid
    ? activeDate!.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : placeholder;

  const close = () => setOpen(false);

  const handleConfirm = () => {
    if (!isControlled) {
      setInternalValue(new Date(draft));
    }
    onChange?.(new Date(draft));
    close();
  };

  const hasError = !!error;
  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <View style={[s.container, style]}>
      {!!label && <Text style={s.label}>{label}</Text>}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label || "Date"}: ${formatted}`}
        accessibilityState={{ expanded: open, disabled }}
        disabled={disabled}
        onPress={() => {
          setDraft(valid ? new Date(activeDate!) : new Date());
          setOpen(true);
        }}
        style={({ pressed, hovered }: any) => [
          s.trigger,
          hasError && s.triggerError,
          (hovered || pressed) && !disabled && { borderColor: colors.ink },
          pressed && !disabled && { backgroundColor: colors.canvas },
          disabled && { opacity: 0.5 },
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
          triggerStyle,
        ]}
      >
        <Icon name="calendar" size={18} color={colors.muted} />
        <Text
          numberOfLines={1}
          style={[s.value, !valid && { color: colors.muted }]}
        >
          {formatted}
        </Text>
        <Icon name="chevronDown" size={16} color={colors.muted} />
      </Pressable>

      {errorMessage && (
        <Text
          accessibilityRole="alert"
          style={s.errorText}
        >
          {errorMessage}
        </Text>
      )}

      <ModalDialog
        visible={open && !disabled}
        onClose={close}
        title={label || "Select date"}
        maxWidth={400}
        footer={
          <View style={s.actions}>
            <Button variant="ghost" onPress={close}>
              Cancel
            </Button>
            <Button accent={accent} onPress={handleConfirm}>
              Confirm date
            </Button>
          </View>
        }
      >
        {presets && (
          <View style={s.presets}>
            {[
              { label: "Today", days: 0 },
              { label: "Tomorrow", days: 1 },
              { label: "In 7 days", days: 7 },
            ].map((preset) => (
              <Button
                key={preset.days}
                variant="outline"
                size="sm"
                onPress={() => {
                  const date = new Date();
                  date.setHours(0, 0, 0, 0);
                  date.setDate(date.getDate() + preset.days);
                  setDraft(date);
                }}
              >
                {preset.label}
              </Button>
            ))}
          </View>
        )}

        <Calendar
          value={draft}
          onChange={setDraft}
          minDate={minDate}
          maxDate={maxDate}
          accent={accent}
        />
      </ModalDialog>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.1,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 48,
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
  triggerError: {
    borderColor: colors.danger,
  },
  value: {
    flex: 1,
    minWidth: 0,
    fontSize: 15,
    color: colors.ink,
  },
  presets: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
  },
});
