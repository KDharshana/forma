import React, { useState } from "react";
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
import { TagChip } from "./TagChip";

export interface FilterItem {
  id: string;
  label: string;
  count?: number;
}

export interface FilterBarProps {
  /** Controlled search query string */
  query?: string;
  /** Initial query for uncontrolled state */
  defaultQuery?: string;
  /** Callback fired when search query changes */
  onQueryChange?: (q: string) => void;
  /** Array of available filter chips */
  filters: FilterItem[];
  /** Controlled array of selected filter IDs */
  selectedFilterIds?: string[];
  /** Initial selected filter IDs for uncontrolled state */
  defaultSelectedFilterIds?: string[];
  /** Callback fired when a filter chip is toggled */
  onToggleFilter?: (id: string) => void;
  /** Callback fired when 'Clear all' is pressed */
  onClearFilters?: () => void;
  /** Optional matching results counter */
  resultCount?: number;
  /** Search input placeholder text */
  placeholder?: string;
  /** Accent color for selected filter chips */
  accent?: string;
  /** Disables search and filter interactions */
  disabled?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

export function FilterBar({
  query: controlledQuery,
  defaultQuery = "",
  onQueryChange,
  filters,
  selectedFilterIds: controlledSelectedIds,
  defaultSelectedFilterIds = [],
  onToggleFilter,
  onClearFilters,
  resultCount,
  placeholder = "Search records, names, or tags...",
  accent = colors.lime,
  disabled = false,
  style,
}: FilterBarProps) {
  const [internalQuery, setInternalQuery] = useState(defaultQuery);
  const isQueryControlled = controlledQuery !== undefined;
  const currentQuery = isQueryControlled ? controlledQuery : internalQuery;

  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(
    defaultSelectedFilterIds,
  );
  const isFiltersControlled = controlledSelectedIds !== undefined;
  const currentSelectedIds = isFiltersControlled
    ? controlledSelectedIds
    : internalSelectedIds;

  const handleQueryChange = (text: string) => {
    if (!isQueryControlled) {
      setInternalQuery(text);
    }
    onQueryChange?.(text);
  };

  const handleToggle = (id: string) => {
    if (disabled) return;
    if (!isFiltersControlled) {
      setInternalSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
    }
    onToggleFilter?.(id);
  };

  const handleClearAll = () => {
    if (disabled) return;
    if (!isQueryControlled) {
      setInternalQuery("");
    }
    if (!isFiltersControlled) {
      setInternalSelectedIds([]);
    }
    onQueryChange?.("");
    onClearFilters?.();
  };

  const hasActiveFilters = currentSelectedIds.length > 0 || !!currentQuery;

  return (
    <View style={[s.container, style]}>
      <View style={s.searchRow}>
        <View style={[s.searchInputWrap, disabled && s.disabled]}>
          <Icon name="search" size={16} color={colors.muted} />
          <TextInput
            accessibilityLabel="Search records"
            value={currentQuery}
            onChangeText={handleQueryChange}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            editable={!disabled}
            style={s.input}
          />
          {currentQuery && !disabled ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear search"
              style={({ pressed, hovered }: any) => [
                s.clearSearchBtn,
                (hovered || pressed) && { opacity: 0.8 },
                {
                  outlineWidth: 0,
                  outlineColor: "transparent",
                  ...(Platform.OS === "web"
                    ? ({ cursor: "pointer", outlineStyle: "none" } as any)
                    : {}),
                },
              ]}
              onPress={() => handleQueryChange("")}
            >
              <Icon name="close" size={14} color={colors.muted} />
            </Pressable>
          ) : null}
        </View>

        {hasActiveFilters && (onClearFilters || !isFiltersControlled) && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear all filters"
            disabled={disabled}
            onPress={handleClearAll}
            style={({ pressed, hovered }: any) => [
              s.clearBtn,
              (hovered || pressed) && !disabled && { backgroundColor: colors.line },
              pressed && { opacity: 0.75 },
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
            ]}
          >
            <Text style={s.clearText}>Clear all</Text>
          </Pressable>
        )}
      </View>

      <View style={s.chipsRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1, minWidth: 0 }}
          contentContainerStyle={s.chipsScroll}
        >
          {filters.map((f) => {
            const isSelected = currentSelectedIds.includes(f.id);
            return (
              <TagChip
                key={f.id}
                label={
                  f.count !== undefined ? `${f.label} (${f.count})` : f.label
                }
                selected={isSelected}
                accent={accent}
                onPress={() => handleToggle(f.id)}
              />
            );
          })}
        </ScrollView>

        {resultCount !== undefined && (
          <Text style={s.countText}>
            {resultCount} {resultCount === 1 ? "result" : "results"}
          </Text>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
  },
  searchRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInputWrap: {
    minWidth: 160,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  disabled: {
    opacity: 0.5,
  },
  input: {
    minWidth: 0,
    flex: 1,
    fontSize: 15,
    color: colors.ink,
    padding: 0,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  clearSearchBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtn: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  clearText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.muted,
  },
  chipsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  chipsScroll: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "500",
  },
});
