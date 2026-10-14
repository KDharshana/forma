import React, { useEffect, useState } from "react";
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

export interface CalendarProps {
  /** Controlled selected date */
  value?: Date;
  /** Initial selected date for uncontrolled state */
  defaultValue?: Date;
  /** Callback fired when a date is selected */
  onChange?: (date: Date) => void;
  /** Callback fired when the displayed month changes */
  onMonthChange?: (date: Date) => void;
  /** Earliest selectable date */
  minDate?: Date;
  /** Latest selectable date */
  maxDate?: Date;
  /** Accent color for selected date pill */
  accent?: string;
  /** Disables date selection interactions */
  disabled?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

export function Calendar({
  value: controlledValue,
  defaultValue,
  onChange,
  onMonthChange,
  minDate,
  maxDate,
  accent = colors.lime,
  disabled = false,
  style,
}: CalendarProps) {
  const [internalValue, setInternalValue] = useState<Date>(() => {
    if (defaultValue instanceof Date && Number.isFinite(defaultValue.getTime())) {
      return defaultValue;
    }
    return new Date();
  });

  const isControlled = controlledValue !== undefined;
  const selection = isControlled
    ? controlledValue instanceof Date && Number.isFinite(controlledValue.getTime())
      ? controlledValue
      : new Date()
    : internalValue;

  const [month, setMonth] = useState<Date>(
    () => new Date(selection.getFullYear(), selection.getMonth(), 1),
  );

  const selectedYear = selection.getFullYear();
  const selectedMonth = selection.getMonth();

  useEffect(() => {
    setMonth(new Date(selectedYear, selectedMonth, 1));
  }, [selectedYear, selectedMonth]);

  const year = month.getFullYear();
  const m = month.getMonth();
  const offset = (new Date(year, m, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const totalCells = Math.ceil((offset + daysInMonth) / 7) * 7;

  const handleMonthShift = (direction: number) => {
    const nextMonth = new Date(year, m + direction, 1);
    setMonth(nextMonth);
    onMonthChange?.(nextMonth);
  };

  const isDateDisabled = (d: Date) => {
    if (disabled) return true;
    if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) {
      return true;
    }
    if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59, 59)) {
      return true;
    }
    return false;
  };

  const handleDaySelect = (day: number) => {
    const date = new Date(year, m, day);
    if (isDateDisabled(date)) return;

    if (!isControlled) {
      setInternalValue(date);
    }
    onChange?.(date);
  };

  return (
    <View style={[s.card, style]}>
      <View style={s.heading}>
        <Text style={s.title}>
          {month.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <View style={s.arrowsRow}>
          {[-1, 1].map((direction) => (
            <Pressable
              key={direction}
              accessibilityRole="button"
              accessibilityLabel={
                direction < 0 ? "Previous month" : "Next month"
              }
              accessibilityState={{ disabled }}
              disabled={disabled}
              onPress={() => handleMonthShift(direction)}
              style={({ pressed, hovered }: any) => [
                s.arrow,
                (hovered || pressed) && !disabled && { backgroundColor: colors.canvas },
                pressed && { opacity: 0.7 },
                disabled && { opacity: 0.4 },
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
              <Icon
                name={direction < 0 ? "chevronLeft" : "chevron"}
                size={14}
                color={colors.ink}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <View style={s.grid}>
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day, i) => (
          <View key={i} style={s.weekdayCell}>
            <Text style={s.weekdayText}>{day}</Text>
          </View>
        ))}

        {Array.from({ length: totalCells }, (_, i) => {
          const day = i - offset + 1;
          const valid = day > 0 && day <= daysInMonth;
          if (!valid) {
            return <View key={i} style={s.dayCell} />;
          }

          const cellDate = new Date(year, m, day);
          const cellDisabled = isDateDisabled(cellDate);
          const selected =
            selection.getFullYear() === year &&
            selection.getMonth() === m &&
            selection.getDate() === day;

          return (
            <Pressable
              key={i}
              accessibilityRole="button"
              accessibilityLabel={cellDate.toLocaleDateString("en-US", {
                dateStyle: "full",
              })}
              accessibilityState={{
                selected,
                disabled: cellDisabled,
              }}
              disabled={cellDisabled}
              onPress={() => handleDaySelect(day)}
              style={({ pressed, hovered }: any) => [
                s.dayCell,
                {
                  outlineWidth: 0,
                  outlineColor: "transparent",
                  ...(Platform.OS === "web"
                    ? ({
                        cursor: cellDisabled ? "not-allowed" : "pointer",
                        outlineStyle: "none",
                      } as any)
                    : {}),
                },
              ]}
            >
              {({ pressed, hovered }: any) => (
                <View
                  style={[
                    s.numberWrap,
                    selected && { backgroundColor: accent },
                    !selected &&
                      (hovered || pressed) &&
                      !cellDisabled && { backgroundColor: colors.canvas },
                    cellDisabled && { opacity: 0.35 },
                  ]}
                >
                  <Text
                    style={[
                      s.numberText,
                      selected && s.numberSelected,
                      cellDisabled && { color: colors.muted },
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    width: "100%",
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.2,
  },
  arrowsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  arrow: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  weekdayCell: {
    width: "14.285714%",
    minHeight: 32,
    flexGrow: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
  },
  dayCell: {
    width: "14.285714%",
    minHeight: 44,
    flexGrow: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  numberWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "500",
  },
  numberSelected: {
    fontWeight: "700",
  },
});
