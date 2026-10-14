import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { Icon } from "./Icon";

export interface PaginationProps {
  /** Controlled current page (1-indexed) */
  page?: number;
  /** Uncontrolled initial page */
  defaultPage?: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback fired when page changes */
  onChange?: (page: number) => void;
  /** Page change callback alias */
  onPageChange?: (page: number) => void;
  /** Total items count for summary calculation */
  totalItems?: number;
  /** Number of items per page */
  pageSize?: number;
  /** Accent color for the active page button */
  accent?: string;
  /** Whether pagination controls are disabled */
  disabled?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Page button style */
  buttonStyle?: StyleProp<ViewStyle>;
  /** Active page button style */
  activeButtonStyle?: StyleProp<ViewStyle>;
  /** Text style for summaries and numbers */
  textStyle?: StyleProp<TextStyle>;
}

export function Pagination({
  page: controlledPage,
  defaultPage = 1,
  totalPages,
  onChange,
  onPageChange,
  totalItems,
  pageSize = 10,
  accent = colors.lime,
  disabled = false,
  style,
  buttonStyle,
  activeButtonStyle,
  textStyle,
}: PaginationProps) {
  const isControlled = controlledPage !== undefined;
  const [internalPage, setInternalPage] = useState(defaultPage);
  const activePageProp = isControlled ? controlledPage : internalPage;

  const [width, setWidth] = useState(0);
  const count = Math.max(
    1,
    Math.floor(Number.isFinite(totalPages) ? totalPages : 1),
  );
  const current = Math.max(
    1,
    Math.min(count, Math.floor(Number.isFinite(activePageProp) ? activePageProp : 1)),
  );
  const size = Math.max(
    1,
    Math.floor(Number.isFinite(pageSize) ? pageSize : 10),
  );
  const items =
    totalItems === undefined
      ? undefined
      : Math.max(0, Math.floor(Number.isFinite(totalItems) ? totalItems : 0));
  const start =
    items === 0 ? 0 : Math.min(items ?? Infinity, (current - 1) * size + 1);
  const end = Math.min(items ?? current * size, current * size);
  const compact = width < 440;

  const handlePageSelect = (nextPage: number) => {
    if (disabled || nextPage < 1 || nextPage > count || nextPage === current) return;
    if (!isControlled) {
      setInternalPage(nextPage);
    }
    onChange?.(nextPage);
    onPageChange?.(nextPage);
  };

  const pages: (number | "…")[] = [];
  const candidates =
    count <= 5
      ? Array.from({ length: count }, (_, i) => i + 1)
      : [...new Set([1, current - 1, current, current + 1, count])]
          .filter((n) => n >= 1 && n <= count)
          .sort((a, b) => a - b);
  candidates.forEach((number, index) => {
    if (index && number - candidates[index - 1] > 1) pages.push("…");
    pages.push(number);
  });

  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[s.container, style]}
    >
      {items !== undefined && (
        <Text style={[s.summary, textStyle]} accessibilityLiveRegion="polite">
          {items === 0 ? "No items" : `${start}–${end} of ${items}`}
        </Text>
      )}
      {items !== 0 && (
        <View style={s.controls}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous page"
            accessibilityState={{ disabled: disabled || current <= 1 }}
            disabled={disabled || current <= 1}
            onPress={() => handlePageSelect(current - 1)}
            style={({ pressed, hovered }: any) => [
              s.button,
              (pressed || hovered) && !disabled && current > 1 && s.buttonHovered,
              (disabled || current <= 1) && s.disabled,
              buttonStyle,
            ]}
          >
            <Icon name="chevronLeft" size={18} color={colors.ink} />
          </Pressable>
          {compact ? (
            <Text
              accessibilityLiveRegion="polite"
              style={[s.current, textStyle]}
            >
              Page {current} of {count}
            </Text>
          ) : (
            pages.map((number, index) =>
              number === "…" ? (
                <Text key={`gap-${index}`} style={s.gap}>
                  …
                </Text>
              ) : (
                <Pressable
                  key={number}
                  accessibilityRole="button"
                  accessibilityLabel={`Page ${number}`}
                  accessibilityState={{
                    selected: number === current,
                    disabled,
                  }}
                  disabled={disabled}
                  onPress={() => handlePageSelect(number)}
                  style={({ pressed, hovered }: any) => [
                    s.button,
                    (pressed || hovered) &&
                      !disabled &&
                      number !== current &&
                      s.buttonHovered,
                    number === current && [
                      s.buttonActive,
                      {
                        backgroundColor: accent,
                        borderColor: accent,
                      },
                      activeButtonStyle,
                    ],
                    disabled && s.disabled,
                    buttonStyle,
                  ]}
                >
                  <Text
                    style={[
                      s.page,
                      number === current && s.pageActive,
                      textStyle,
                    ]}
                  >
                    {number}
                  </Text>
                </Pressable>
              ),
            )
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next page"
            accessibilityState={{ disabled: disabled || current >= count }}
            disabled={disabled || current >= count}
            onPress={() => handlePageSelect(current + 1)}
            style={({ pressed, hovered }: any) => [
              s.button,
              (pressed || hovered) && !disabled && current < count && s.buttonHovered,
              (disabled || current >= count) && s.disabled,
              buttonStyle,
            ]}
          >
            <Icon name="chevronRight" size={18} color={colors.ink} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    paddingVertical: 8,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  summary: {
    fontSize: 13,
    color: colors.muted,
    flexShrink: 1,
    minWidth: 0,
  },
  current: {
    fontSize: 14,
    color: colors.ink,
    paddingHorizontal: 8,
  },
  button: {
    minWidth: 44,
    minHeight: 44,
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  buttonHovered: {
    backgroundColor: colors.canvas,
  },
  buttonActive: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  page: {
    fontSize: 14,
    color: colors.ink,
    fontWeight: "500",
  },
  pageActive: {
    fontWeight: "700",
  },
  gap: {
    width: 20,
    textAlign: "center",
    color: colors.muted,
    fontSize: 14,
  },
  disabled: {
    opacity: 0.35,
    ...(Platform.OS === "web" ? ({ cursor: "not-allowed" } as any) : {}),
  },
});
