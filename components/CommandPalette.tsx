import React, { useMemo, useState } from "react";
import {
  Modal,
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
import { colors, cardShadow, mono } from "./theme";
import { Icon, IconName } from "./Icon";

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  group?: string;
  icon?: IconName;
  shortcut?: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface CommandPaletteProps {
  /** Controls modal visibility */
  visible: boolean;
  /** Callback fired when palette is dismissed */
  onClose: () => void;
  /** Array of available commands */
  items: CommandItem[];
  /** Search input placeholder text */
  placeholder?: string;
  /** Message displayed when no commands match query */
  emptyMessage?: string;
  /** Callback fired when search query changes */
  onQueryChange?: (query: string) => void;
  /** Shows loading indicator */
  loading?: boolean;
  /** Disables command selection */
  disabled?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Renders inline rather than inside a Modal */
  inline?: boolean;
}

export function CommandPalette({
  visible,
  onClose,
  items,
  placeholder = "Type a command or search...",
  emptyMessage = "No matching commands found",
  onQueryChange,
  loading = false,
  disabled = false,
  style,
  inline,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.group && item.group.toLowerCase().includes(q)),
    );
  }, [items, query]);

  // Group items by category
  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const item of filteredItems) {
      const g = item.group || "Actions";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(item);
    }
    return Array.from(map.entries());
  }, [filteredItems]);

  const handleSelect = (item: CommandItem) => {
    if (disabled || item.disabled) return;
    item.onSelect();
    onClose();
    setQuery("");
  };

  const handleQueryChange = (text: string) => {
    setQuery(text);
    onQueryChange?.(text);
  };

  if (!visible) return null;

  const content = (
    <View style={[s.modalBox, style]}>
      {/* Search Header */}
      <View style={s.searchRow}>
        <Icon name="search" size={18} color={colors.muted} />
        <TextInput
          autoFocus={!inline}
          value={query}
          onChangeText={handleQueryChange}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          editable={!disabled}
          style={s.input}
        />
        {query.length > 0 ? (
          <Pressable
            onPress={() => handleQueryChange("")}
            style={s.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
          >
            <Icon name="close" size={16} color={colors.muted} />
          </Pressable>
        ) : (
          <View style={s.badgeEsc}>
            <Text style={s.escText}>ESC</Text>
          </View>
        )}
      </View>

      {/* Results List */}
      <ScrollView
        style={[s.listScroll, inline && { maxHeight: 180 }]}
        contentContainerStyle={s.listContent}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {filteredItems.length === 0 ? (
          <View style={s.emptyWrap}>
            <Text style={s.emptyText}>{emptyMessage}</Text>
          </View>
        ) : (
          grouped.map(([groupName, groupItems]) => (
            <View key={groupName} style={s.groupWrap}>
              <Text style={s.groupTitle}>{groupName}</Text>
              {groupItems.map((item) => {
                const itemDisabled = disabled || item.disabled;

                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handleSelect(item)}
                    disabled={itemDisabled}
                    accessibilityRole="button"
                    accessibilityLabel={item.label}
                    accessibilityState={{ disabled: itemDisabled }}
                    style={({ pressed, hovered }: any) => [
                      s.itemRow,
                      (hovered || pressed) &&
                        !itemDisabled && { backgroundColor: colors.canvas },
                      pressed && { opacity: 0.75 },
                      itemDisabled && { opacity: 0.4 },
                      {
                        outlineWidth: 0,
                        outlineColor: "transparent",
                        ...(Platform.OS === "web"
                          ? ({
                              cursor: itemDisabled
                                ? "not-allowed"
                                : "pointer",
                              outlineStyle: "none",
                            } as any)
                          : {}),
                      },
                    ]}
                  >
                    <View style={s.itemLeft}>
                      {item.icon ? (
                        <View style={s.iconWrap}>
                          <Icon
                            name={item.icon}
                            size={15}
                            color={colors.ink}
                          />
                        </View>
                      ) : (
                        <View style={s.dotWrap} />
                      )}
                      <View style={s.labelCol}>
                        <Text numberOfLines={1} style={s.itemLabel}>
                          {item.label}
                        </Text>
                        {item.description && (
                          <Text numberOfLines={2} style={s.itemDesc}>
                            {item.description}
                          </Text>
                        )}
                      </View>
                    </View>

                    {item.shortcut && (
                      <View style={s.shortcutBadge}>
                        <Text style={s.shortcutText}>{item.shortcut}</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>

      {/* Footer Guide */}
      <View style={s.footer}>
        <View style={s.footerHint}>
          <Text style={s.footerKey}>↵</Text>
          <Text style={s.footerText}>to select</Text>
        </View>
        <View style={s.footerHint}>
          <Text style={s.footerKey}>esc</Text>
          <Text style={s.footerText}>to dismiss</Text>
        </View>
      </View>
    </View>
  );

  if (inline) return content;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={s.backdrop}
        onPress={onClose}
        accessible={false}
      >
        <Pressable
          style={{ width: "100%", maxWidth: 580 }}
          onPress={(e) => e.stopPropagation()}
          accessible={false}
        >
          {content}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(35, 38, 33, 0.45)",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
    paddingHorizontal: 16,
    outlineWidth: 0,
    outlineColor: "transparent",
  },
  modalBox: {
    width: "100%",
    maxWidth: 580,
    backgroundColor: colors.paper,
    borderRadius: 14,
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    minHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.ink,
    paddingVertical: 8,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ cursor: "pointer", outlineStyle: "none" } as any)
      : {}),
  },
  badgeEsc: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  escText: {
    fontSize: 11,
    fontFamily: mono,
    fontWeight: "600",
    color: colors.muted,
  },
  listScroll: {
    maxHeight: 340,
  },
  listContent: {
    paddingVertical: 8,
  },
  groupWrap: {
    marginBottom: 6,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 44,
    borderRadius: 8,
    marginHorizontal: 8,
    gap: 12,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  dotWrap: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.line,
    marginLeft: 11,
    marginRight: 11,
    flexShrink: 0,
  },
  labelCol: {
    flex: 1,
    minWidth: 0,
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.ink,
    letterSpacing: -0.1,
  },
  itemDesc: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
    lineHeight: 15,
  },
  shortcutBadge: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexShrink: 0,
  },
  shortcutText: {
    fontSize: 11,
    fontFamily: mono,
    color: colors.muted,
  },
  emptyWrap: {
    padding: 32,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.canvas,
    gap: 16,
  },
  footerHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  footerKey: {
    fontSize: 11,
    fontFamily: mono,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    color: colors.ink,
  },
  footerText: {
    fontSize: 11,
    color: colors.muted,
  },
});
