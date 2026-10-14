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
import { ModalDialog } from "./ModalDialog";
import { Button } from "./Button";
import { Input } from "./Input";
import { SegmentedControl } from "./SegmentedControl";

export interface TimePickerProps {
  /** Controlled time string (e.g. "09:30 AM" or "14:30") */
  value?: string;
  /** Uncontrolled initial time string */
  defaultValue?: string;
  /** Time change callback */
  onChange?: (time: string) => void;
  /** Change callback alias */
  onValueChange?: (time: string) => void;
  /** Label above the time picker */
  label?: string;
  /** 24-hour mode flag */
  is24Hour?: boolean;
  /** Accent highlight color */
  accent?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
  /** Error message or flag */
  error?: string | boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Trigger button style */
  triggerStyle?: StyleProp<ViewStyle>;
}

function parse(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return null;
  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toUpperCase();
  if (minutes > 59 || hours > (period ? 12 : 23) || (period && hours < 1))
    return null;
  if (period) hours = (hours % 12) + (period === "PM" ? 12 : 0);
  return { hours, minutes };
}

export function TimePicker({
  value: controlledValue,
  defaultValue = "09:00 AM",
  onChange,
  onValueChange,
  label,
  is24Hour = false,
  accent = colors.lime,
  disabled = false,
  error: externalError,
  style,
  triggerStyle,
}: TimePickerProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeValue = isControlled ? controlledValue : internalValue;

  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState("09");
  const [minutes, setMinutes] = useState("00");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [error, setError] = useState("");

  const parsed = parse(activeValue);
  const pad = (number: number) => String(number).padStart(2, "0");
  const display = parsed
    ? `${pad(is24Hour ? parsed.hours : parsed.hours % 12 || 12)}:${pad(parsed.minutes)}${is24Hour ? "" : parsed.hours >= 12 ? " PM" : " AM"}`
    : "Select time";

  const close = () => setOpen(false);

  const start = () => {
    if (disabled) return;
    const current = parsed || { hours: 9, minutes: 0 };
    setHours(pad(is24Hour ? current.hours : current.hours % 12 || 12));
    setMinutes(pad(current.minutes));
    setPeriod(current.hours >= 12 ? "PM" : "AM");
    setError("");
    setOpen(true);
  };

  const confirm = () => {
    const h = Number(hours),
      m = Number(minutes);
    if (
      !/^\d{1,2}$/.test(hours) ||
      !/^\d{1,2}$/.test(minutes) ||
      h < (is24Hour ? 0 : 1) ||
      h > (is24Hour ? 23 : 12) ||
      m > 59
    ) {
      setError(
        `Enter hours from ${is24Hour ? "0 to 23" : "1 to 12"} and minutes from 0 to 59.`,
      );
      return;
    }
    const finalTime = `${pad(h)}:${pad(m)}${is24Hour ? "" : ` ${period}`}`;
    if (!isControlled) {
      setInternalValue(finalTime);
    }
    onChange?.(finalTime);
    onValueChange?.(finalTime);
    close();
  };

  const adjust = (field: "hours" | "minutes", delta: number) => {
    setError("");
    if (field === "hours") {
      const lower = is24Hour ? 0 : 1,
        count = is24Hour ? 24 : 12;
      const current = /^\d+$/.test(hours) ? Number(hours) : lower;
      setHours(
        pad(((((current - lower + delta) % count) + count) % count) + lower),
      );
    } else setMinutes(pad(((Number(minutes) || 0) + delta + 60) % 60));
  };

  const hasExternalError = Boolean(externalError);
  const externalErrorMessage =
    typeof externalError === "string" ? externalError : undefined;

  return (
    <View style={[s.container, style]}>
      {!!label && <Text style={s.label}>{label}</Text>}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label || "Time"}: ${display}`}
        accessibilityState={{ expanded: open, disabled }}
        disabled={disabled}
        onPress={start}
        style={({ pressed, hovered }: any) => [
          s.trigger,
          hasExternalError && s.triggerError,
          (hovered || pressed) && !disabled && { backgroundColor: colors.canvas },
          disabled && s.disabled,
          triggerStyle,
        ]}
      >
        <Icon name="clock" size={18} color={colors.muted} />
        <Text style={s.value}>{display}</Text>
        <Icon name="chevronDown" size={16} color={colors.muted} />
      </Pressable>

      {externalErrorMessage && (
        <Text accessibilityLiveRegion="polite" style={s.externalErrorText}>
          {externalErrorMessage}
        </Text>
      )}

      <ModalDialog
        visible={open && !disabled}
        onClose={close}
        title={label || "Select time"}
        maxWidth={360}
        footer={
          <View style={s.actions}>
            <Button variant="ghost" onPress={close}>
              Cancel
            </Button>
            <Button onPress={confirm} accent={accent}>
              Confirm time
            </Button>
          </View>
        }
      >
        <View style={s.columns}>
          {(["hours", "minutes"] as const).map((field) => (
            <View key={field} style={s.column}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Increase ${field}`}
                onPress={() => adjust(field, 1)}
                style={({ pressed, hovered }: any) => [
                  s.arrow,
                  (hovered || pressed) && { backgroundColor: colors.canvas },
                ]}
              >
                <Icon name="chevronUp" size={20} color={colors.ink} />
              </Pressable>
              <Input
                label={field === "hours" ? "Hours" : "Minutes"}
                value={field === "hours" ? hours : minutes}
                onChangeText={(text) => {
                  (field === "hours" ? setHours : setMinutes)(
                    text.replace(/\D/g, "").slice(0, 2),
                  );
                  setError("");
                }}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
                style={s.number}
                accent={accent}
                onSubmitEditing={confirm}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Decrease ${field}`}
                onPress={() => adjust(field, -1)}
                style={({ pressed, hovered }: any) => [
                  s.arrow,
                  (hovered || pressed) && { backgroundColor: colors.canvas },
                ]}
              >
                <Icon name="chevronDown" size={20} color={colors.ink} />
              </Pressable>
            </View>
          ))}
        </View>
        {!is24Hour && (
          <SegmentedControl
            options={["AM", "PM"] as const}
            value={period}
            onChange={(val) => setPeriod(val as "AM" | "PM")}
            accent={accent}
          />
        )}
        {!!error && (
          <Text accessibilityLiveRegion="polite" style={s.error}>
            {error}
          </Text>
        )}
      </ModalDialog>
    </View>
  );
}

const s = StyleSheet.create({
  container: { width: "100%", gap: 6 },
  label: { fontSize: 13, fontWeight: "500", color: colors.ink },
  trigger: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  triggerError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  disabled: {
    opacity: 0.5,
    ...(Platform.OS === "web" ? ({ cursor: "not-allowed" } as any) : {}),
  },
  value: { flex: 1, minWidth: 0, fontSize: 15, color: colors.ink },
  columns: { flexDirection: "row", gap: 20, marginBottom: 16 },
  column: { flex: 1, minWidth: 0 },
  arrow: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  number: { textAlign: "center", fontSize: 24 },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 8,
  },
  error: { color: colors.danger, fontSize: 13, lineHeight: 20, marginTop: 12 },
  externalErrorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 2,
  },
});
