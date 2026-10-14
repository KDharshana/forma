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

export interface SortField {
  id: string;
  label: string;
}

export interface GroupField {
  id: string;
  label: string;
}

export interface SortGroupControlsProps {
  /** Available sort fields */
  sortFields: SortField[];
  /** Controlled selected sort field ID */
  selectedSort?: string;
  /** Uncontrolled initial sort field ID */
  defaultSelectedSort?: string;
  /** Sort field selection callback */
  onSortChange?: (id: string) => void;
  /** Controlled sort direction */
  sortDirection?: "asc" | "desc";
  /** Uncontrolled initial sort direction */
  defaultSortDirection?: "asc" | "desc";
  /** Direction toggle callback */
  onDirectionToggle?: () => void;
  /** Direction change callback with next direction */
  onDirectionChange?: (dir: "asc" | "desc") => void;
  /** Available grouping fields */
  groupFields?: GroupField[];
  /** Controlled selected group ID */
  selectedGroup?: string;
  /** Uncontrolled initial group ID */
  defaultSelectedGroup?: string;
  /** Group selection callback */
  onGroupChange?: (id: string) => void;
  /** Whether controls are disabled */
  disabled?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Pill button style */
  pillStyle?: StyleProp<ViewStyle>;
}

export function SortGroupControls({
  sortFields,
  selectedSort: controlledSort,
  defaultSelectedSort = sortFields[0]?.id || "",
  onSortChange,
  sortDirection: controlledDir,
  defaultSortDirection = "asc",
  onDirectionToggle,
  onDirectionChange,
  groupFields,
  selectedGroup: controlledGroup,
  defaultSelectedGroup = "",
  onGroupChange,
  disabled = false,
  style,
  pillStyle,
}: SortGroupControlsProps) {
  const isControlledSort = controlledSort !== undefined;
  const [internalSort, setInternalSort] = useState(defaultSelectedSort);
  const activeSort = isControlledSort ? controlledSort : internalSort;

  const isControlledDir = controlledDir !== undefined;
  const [internalDir, setInternalDir] = useState<"asc" | "desc">(defaultSortDirection);
  const activeDir = isControlledDir ? controlledDir : internalDir;

  const isControlledGroup = controlledGroup !== undefined;
  const [internalGroup, setInternalGroup] = useState(defaultSelectedGroup);
  const activeGroup = isControlledGroup ? controlledGroup : internalGroup;

  const [sortModalOpen, setSortModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  const currentSort = sortFields.find((f) => f.id === activeSort);
  const currentGroup = groupFields?.find((g) => g.id === activeGroup);

  const handleSortSelect = (id: string) => {
    if (disabled) return;
    if (!isControlledSort) {
      setInternalSort(id);
    }
    onSortChange?.(id);
    setSortModalOpen(false);
  };

  const handleToggleDirection = () => {
    if (disabled) return;
    const nextDir = activeDir === "asc" ? "desc" : "asc";
    if (!isControlledDir) {
      setInternalDir(nextDir);
    }
    onDirectionToggle?.();
    onDirectionChange?.(nextDir);
  };

  const handleGroupSelect = (id: string) => {
    if (disabled) return;
    if (!isControlledGroup) {
      setInternalGroup(id);
    }
    onGroupChange?.(id);
    setGroupModalOpen(false);
  };

  return (
    <View style={[s.container, disabled && s.disabled, style]}>
      {/* Sort Section */}
      <View style={s.sortGroup}>
        <Text style={s.label}>Sort:</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Sort by: ${currentSort?.label || activeSort}`}
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={() => setSortModalOpen(true)}
          style={({ pressed, hovered }: any) => [
            s.pillBtn,
            (hovered || pressed) && !disabled && { backgroundColor: colors.canvas },
            pillStyle,
          ]}
        >
          <Text style={s.pillText}>{currentSort?.label || activeSort || "Sort"}</Text>
          <Icon name="chevronDown" size={12} color={colors.muted} />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Toggle sort direction, currently ${activeDir === "asc" ? "ascending" : "descending"}`}
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={handleToggleDirection}
          style={({ pressed, hovered }: any) => [
            s.dirBtn,
            (hovered || pressed) && !disabled && { backgroundColor: colors.canvas },
          ]}
        >
          <Icon
            name={activeDir === "asc" ? "arrowUp" : "arrowDown"}
            size={16}
            color={colors.ink}
          />
        </Pressable>
      </View>

      {/* Group By Section (Optional) */}
      {groupFields && groupFields.length > 0 && (
        <View style={s.sortGroup}>
          <Text style={s.label}>Group:</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Group by: ${currentGroup?.label || "None"}`}
            accessibilityState={{ disabled }}
            disabled={disabled}
            onPress={() => setGroupModalOpen(true)}
            style={({ pressed, hovered }: any) => [
              s.pillBtn,
              (hovered || pressed) && !disabled && { backgroundColor: colors.canvas },
              pillStyle,
            ]}
          >
            <Text style={s.pillText}>
              {currentGroup ? currentGroup.label : "None"}
            </Text>
            <Icon name="chevronDown" size={12} color={colors.muted} />
          </Pressable>
        </View>
      )}

      {/* Sort Selection Modal */}
      <Modal
        visible={sortModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalOpen(false)}
      >
        <Pressable
          accessible={false}
          style={s.modalOverlay}
          onPress={() => setSortModalOpen(false)}
        >
          <Pressable
            accessible={false}
            role="dialog"
            aria-modal={true}
            accessibilityLabel="Sort by"
            style={s.modalBox}
            onPress={(e) => e.stopPropagation()}
          >
            <Text accessibilityRole="header" style={s.modalTitle}>
              Sort by
            </Text>
            <ScrollView style={s.modalList} keyboardShouldPersistTaps="handled">
              {sortFields.map((f) => {
                const isSelected = f.id === activeSort;
                return (
                  <Pressable
                    key={f.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={f.label}
                    onPress={() => handleSortSelect(f.id)}
                    style={({ pressed, hovered }: any) => [
                      s.modalItem,
                      isSelected && s.modalItemSelected,
                      (hovered || pressed) && { backgroundColor: colors.canvas },
                    ]}
                  >
                    <Text
                      style={[
                        s.modalItemText,
                        isSelected && s.modalItemTextSelected,
                      ]}
                    >
                      {f.label}
                    </Text>
                    {isSelected && (
                      <Icon name="check" size={14} color={colors.ink} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Group Selection Modal */}
      {groupFields && (
        <Modal
          visible={groupModalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setGroupModalOpen(false)}
        >
          <Pressable
            accessible={false}
            style={s.modalOverlay}
            onPress={() => setGroupModalOpen(false)}
          >
            <Pressable
              accessible={false}
              role="dialog"
              aria-modal={true}
              accessibilityLabel="Group by"
              style={s.modalBox}
              onPress={(e) => e.stopPropagation()}
            >
              <Text accessibilityRole="header" style={s.modalTitle}>
                Group by
              </Text>
              <ScrollView style={s.modalList} keyboardShouldPersistTaps="handled">
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: !activeGroup }}
                  accessibilityLabel="None"
                  onPress={() => handleGroupSelect("")}
                  style={({ pressed, hovered }: any) => [
                    s.modalItem,
                    !activeGroup && s.modalItemSelected,
                    (hovered || pressed) && { backgroundColor: colors.canvas },
                  ]}
                >
                  <Text
                    style={[
                      s.modalItemText,
                      !activeGroup && s.modalItemTextSelected,
                    ]}
                  >
                    None
                  </Text>
                  {!activeGroup && (
                    <Icon name="check" size={14} color={colors.ink} />
                  )}
                </Pressable>
                {groupFields.map((g) => {
                  const isSelected = g.id === activeGroup;
                  return (
                    <Pressable
                      key={g.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={g.label}
                      onPress={() => handleGroupSelect(g.id)}
                      style={({ pressed, hovered }: any) => [
                        s.modalItem,
                        isSelected && s.modalItemSelected,
                        (hovered || pressed) && { backgroundColor: colors.canvas },
                      ]}
                    >
                      <Text
                        style={[
                          s.modalItemText,
                          isSelected && s.modalItemTextSelected,
                        ]}
                      >
                        {g.label}
                      </Text>
                      {isSelected && (
                        <Icon name="check" size={14} color={colors.ink} />
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  sortGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.muted,
  },
  pillBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
    minHeight: 44,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  dirBtn: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 8,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
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
    maxWidth: 280,
    backgroundColor: colors.paper,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 12,
    ...cardShadow,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  modalList: {
    maxHeight: 240,
    paddingTop: 4,
  },
  modalItem: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  modalItemSelected: {
    backgroundColor: colors.canvas,
  },
  modalItemText: {
    fontSize: 13,
    color: colors.ink,
  },
  modalItemTextSelected: {
    fontWeight: "700",
  },
});
