import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors, cardShadow } from "./theme";
import { Icon } from "./Icon";
import { Calendar } from "./Calendar";
import { Button } from "./Button";

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface DateRangePickerProps {
  /** Controlled selected date range */
  value?: DateRange;
  /** Initial date range for uncontrolled usage */
  defaultValue?: DateRange;
  /** Callback fired when a date range is applied */
  onChange?: (range: DateRange) => void;
  /** Optional field label */
  label?: string;
  /** Text shown when no date range is selected */
  placeholder?: string;
  /** Disables date range picker interaction */
  disabled?: boolean;
  /** Error state or error message string */
  error?: boolean | string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom trigger input style */
  triggerStyle?: StyleProp<ViewStyle>;
}

interface Preset {
  label: string;
  getRange: () => DateRange;
}

const PRESETS: Preset[] = [
  {
    label: "Today",
    getRange: () => {
      const now = new Date();
      return { startDate: now, endDate: now };
    },
  },
  {
    label: "Yesterday",
    getRange: () => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return { startDate: d, endDate: d };
    },
  },
  {
    label: "Last 7 days",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: "Last 30 days",
    getRange: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: "This Month",
    getRange: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return { startDate: start, endDate: end };
    },
  },
  {
    label: "Last Month",
    getRange: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      return { startDate: start, endDate: end };
    },
  },
];

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function DateRangePicker({
  value: controlledValue,
  defaultValue,
  onChange,
  label,
  placeholder = "Select date range",
  disabled = false,
  error,
  style,
  triggerStyle,
}: DateRangePickerProps) {
  const [internalValue, setInternalValue] = useState<DateRange | undefined>(
    defaultValue,
  );
  const isControlled = controlledValue !== undefined;
  const activeRange = isControlled ? controlledValue : internalValue;

  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"start" | "end">("start");

  const [draftStart, setDraftStart] = useState<Date>(
    () => activeRange?.startDate || new Date(),
  );
  const [draftEnd, setDraftEnd] = useState<Date>(
    () => activeRange?.endDate || new Date(),
  );

  const displayString = activeRange
    ? `${formatDate(activeRange.startDate)} – ${formatDate(activeRange.endDate)}`
    : placeholder;

  const handleApply = () => {
    // Ensure startDate <= endDate
    const start = draftStart < draftEnd ? draftStart : draftEnd;
    const end = draftStart < draftEnd ? draftEnd : draftStart;
    const nextRange = { startDate: start, endDate: end };
    if (!isControlled) {
      setInternalValue(nextRange);
    }
    onChange?.(nextRange);
    setModalOpen(false);
  };

  const handlePresetSelect = (preset: Preset) => {
    const range = preset.getRange();
    setDraftStart(range.startDate);
    setDraftEnd(range.endDate);
  };

  const hasError = !!error;
  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <View style={[s.wrapper, style]}>
      {label && <Text style={s.label}>{label}</Text>}

      {/* Trigger Button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Date range: ${displayString}`}
        accessibilityState={{ expanded: modalOpen, disabled }}
        disabled={disabled}
        onPress={() => {
          if (activeRange) {
            setDraftStart(activeRange.startDate);
            setDraftEnd(activeRange.endDate);
          }
          setModalOpen(true);
        }}
        style={({ pressed, hovered }: any) => [
          s.trigger,
          hasError && s.triggerError,
          disabled && s.triggerDisabled,
          (hovered || pressed) && !disabled && { borderColor: colors.ink },
          pressed && !disabled && s.triggerPressed,
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
        <Icon name="calendar" size={16} color={colors.muted} />
        <Text
          numberOfLines={1}
          style={[s.triggerText, !activeRange && s.triggerPlaceholder]}
        >
          {displayString}
        </Text>
        <Icon name="chevronDown" size={14} color={colors.muted} />
      </Pressable>

      {errorMessage && (
        <Text
          accessibilityRole="alert"
          style={s.errorText}
        >
          {errorMessage}
        </Text>
      )}

      {/* Range Picker Modal */}
      <Modal
        visible={modalOpen && !disabled}
        transparent
        animationType="fade"
        onRequestClose={() => setModalOpen(false)}
      >
        <Pressable
          style={s.modalOverlay}
          onPress={() => setModalOpen(false)}
          accessible={false}
        >
          <Pressable
            style={s.modalBox}
            onPress={(e) => e.stopPropagation()}
            accessible={false}
          >
            {/* Header */}
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Select Date Range</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close"
                onPress={() => setModalOpen(false)}
                style={({ pressed, hovered }: any) => [
                  s.closeBtn,
                  (hovered || pressed) && { backgroundColor: colors.canvas },
                  pressed && { opacity: 0.7 },
                  {
                    outlineWidth: 0,
                    outlineColor: "transparent",
                    ...(Platform.OS === "web"
                      ? ({ cursor: "pointer", outlineStyle: "none" } as any)
                      : {}),
                  },
                ]}
              >
                <Icon name="close" size={16} color={colors.muted} />
              </Pressable>
            </View>

            {/* Presets Row */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={s.presetScroll}
              contentContainerStyle={s.presetRow}
            >
              {PRESETS.map((p) => (
                <Pressable
                  key={p.label}
                  accessibilityRole="button"
                  accessibilityLabel={`Preset: ${p.label}`}
                  onPress={() => handlePresetSelect(p)}
                  hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
                  style={({ pressed, hovered }: any) => [
                    s.presetChip,
                    (hovered || pressed) && { backgroundColor: colors.line },
                    pressed && { opacity: 0.75 },
                    {
                      outlineWidth: 0,
                      outlineColor: "transparent",
                      ...(Platform.OS === "web"
                        ? ({ cursor: "pointer", outlineStyle: "none" } as any)
                        : {}),
                    },
                  ]}
                >
                  <Text style={s.presetText}>{p.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Start vs End Date Tab Selector */}
            <View style={s.tabRow}>
              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === "start" }}
                onPress={() => setActiveTab("start")}
                style={({ pressed, hovered }: any) => [
                  s.tab,
                  activeTab === "start" && s.tabActive,
                  hovered && activeTab !== "start" && { opacity: 0.85 },
                  pressed && { opacity: 0.75 },
                  {
                    outlineWidth: 0,
                    outlineColor: "transparent",
                    ...(Platform.OS === "web"
                      ? ({ cursor: "pointer", outlineStyle: "none" } as any)
                      : {}),
                  },
                ]}
              >
                <Text style={s.tabSub}>Start date</Text>
                <Text style={s.tabDate}>{formatDate(draftStart)}</Text>
              </Pressable>

              <View style={s.tabDivider}>
                <Icon name="arrowRight" size={12} color={colors.muted} />
              </View>

              <Pressable
                accessibilityRole="tab"
                accessibilityState={{ selected: activeTab === "end" }}
                onPress={() => setActiveTab("end")}
                style={({ pressed, hovered }: any) => [
                  s.tab,
                  activeTab === "end" && s.tabActive,
                  hovered && activeTab !== "end" && { opacity: 0.85 },
                  pressed && { opacity: 0.75 },
                  {
                    outlineWidth: 0,
                    outlineColor: "transparent",
                    ...(Platform.OS === "web"
                      ? ({ cursor: "pointer", outlineStyle: "none" } as any)
                      : {}),
                  },
                ]}
              >
                <Text style={s.tabSub}>End date</Text>
                <Text style={s.tabDate}>{formatDate(draftEnd)}</Text>
              </Pressable>
            </View>

            {/* Calendar */}
            <View style={s.calendarWrap}>
              {activeTab === "start" ? (
                <Calendar
                  value={draftStart}
                  onChange={(d) => {
                    setDraftStart(d);
                    setActiveTab("end");
                  }}
                />
              ) : (
                <Calendar
                  value={draftEnd}
                  onChange={(d) => {
                    setDraftEnd(d);
                  }}
                />
              )}
            </View>

            {/* Actions */}
            <View style={s.footer}>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => setModalOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" onPress={handleApply}>
                Apply Range
              </Button>
            </View>
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
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.1,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 48,
    gap: 10,
  },
  triggerError: {
    borderColor: colors.danger,
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  triggerPressed: {
    backgroundColor: colors.canvas,
  },
  triggerText: {
    flex: 1,
    fontSize: 14,
    color: colors.ink,
    fontWeight: "500",
  },
  triggerPlaceholder: {
    color: colors.muted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(35, 38, 33, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    outlineWidth: 0,
    outlineColor: "transparent",
  },
  modalBox: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: colors.paper,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 12,
    ...cardShadow,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  closeBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  presetScroll: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  presetRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  presetChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    minHeight: 34,
    justifyContent: "center",
  },
  presetText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.ink,
  },
  tabRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.canvas,
    gap: 8,
  },
  tab: {
    flex: 1,
    padding: 8,
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: colors.paper,
    justifyContent: "center",
  },
  tabActive: {
    borderColor: colors.ink,
  },
  tabSub: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
    lineHeight: 14,
  },
  tabDate: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.ink,
    marginTop: 2,
  },
  tabDivider: {
    paddingHorizontal: 4,
  },
  calendarWrap: {
    padding: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.canvas,
    gap: 10,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
  },
});
