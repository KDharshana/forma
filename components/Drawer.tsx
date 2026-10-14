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
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "./theme";
import { Icon, IconName } from "./Icon";

export interface DrawerItem {
  id: string;
  label: string;
  icon: IconName;
  badge?: string | number;
  disabled?: boolean;
}

export interface DrawerSection {
  title?: string;
  items: DrawerItem[];
}

export interface DrawerProps {
  /** Controls drawer visibility (alias for open) */
  visible?: boolean;
  /** Controls drawer visibility */
  open?: boolean;
  /** Callback fired when drawer is dismissed */
  onClose: () => void;
  /** Grouped sections of navigation items */
  sections: DrawerSection[];
  /** Controlled active item ID */
  activeId?: string;
  /** Initial active item ID for uncontrolled state */
  defaultActiveId?: string;
  /** Callback fired when an item is selected */
  onSelect?: (id: string) => void;
  /** Custom header element */
  header?: React.ReactNode;
  /** Custom sticky footer element */
  footer?: React.ReactNode;
  /** Accent color for brand dot and active badges */
  accent?: string;
  /** Drawer panel style */
  style?: StyleProp<ViewStyle>;
  /** Content container style for scroll view */
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function Drawer({
  visible,
  open,
  onClose,
  sections,
  activeId: controlledActiveId,
  defaultActiveId,
  onSelect,
  header,
  footer,
  accent = colors.lime,
  style,
  contentContainerStyle,
}: DrawerProps) {
  const isVisible = visible !== undefined ? visible : !!open;

  const [internalActiveId, setInternalActiveId] = useState<string>(
    defaultActiveId || sections[0]?.items[0]?.id || "",
  );

  const isControlled = controlledActiveId !== undefined;
  const currentActiveId = isControlled ? controlledActiveId : internalActiveId;

  const handleItemPress = (item: DrawerItem) => {
    if (item.disabled) return;
    if (!isControlled) {
      setInternalActiveId(item.id);
    }
    onSelect?.(item.id);
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <Pressable
          accessible={false}
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <SafeAreaView
          edges={["top", "bottom", "left"]}
          role="dialog"
          accessibilityLabel="Navigation"
          accessibilityViewIsModal
          style={[s.drawerPanel, style]}
        >
          <View style={s.defaultHeader}>
            <View style={s.headerBrandArea}>
              {header || (
                <View style={s.brandRow}>
                  <View style={[s.brandDot, { backgroundColor: accent }]} />
                  <Text numberOfLines={1} style={s.brandTitle}>
                    Navigation
                  </Text>
                </View>
              )}
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close navigation drawer"
              onPress={onClose}
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
              <Icon name="close" size={18} color={colors.ink} />
            </Pressable>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            style={s.scrollArea}
            contentContainerStyle={[s.content, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
          >
            {sections.map((sec, secIdx) => (
              <View key={secIdx} style={s.section}>
                {sec.title && <Text style={s.sectionTitle}>{sec.title}</Text>}
                {sec.items.map((item) => {
                  const isActive = item.id === currentActiveId;
                  const itemDisabled = !!item.disabled;

                  return (
                    <Pressable
                      key={item.id}
                      accessibilityRole="button"
                      accessibilityLabel={item.label}
                      accessibilityState={{
                        selected: isActive,
                        disabled: itemDisabled,
                      }}
                      disabled={itemDisabled}
                      onPress={() => handleItemPress(item)}
                      style={({ pressed, hovered }: any) => [
                        s.item,
                        isActive && s.itemActive,
                        !isActive &&
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
                      <Icon
                        name={item.icon}
                        size={17}
                        color={isActive ? colors.ink : colors.muted}
                      />
                      <Text
                        numberOfLines={1}
                        style={[
                          s.itemLabel,
                          isActive && { color: colors.ink, fontWeight: "600" },
                        ]}
                      >
                        {item.label}
                      </Text>
                      {item.badge !== undefined && (
                        <View
                          style={[
                            s.badge,
                            isActive && { backgroundColor: accent },
                          ]}
                        >
                          <Text style={s.badgeText}>{item.badge}</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          {footer && <View style={s.footer}>{footer}</View>}
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    flexDirection: "row",
  },
  drawerPanel: {
    width: 300,
    maxWidth: "90%",
    height: "100%",
    backgroundColor: colors.paper,
    borderRightWidth: 1,
    borderRightColor: colors.line,
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 16,
    ...(Platform.OS === "web"
      ? ({ boxShadow: "6px 0px 24px rgba(0,0,0,0.12)" } as any)
      : {}),
  },
  defaultHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerBrandArea: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  closeBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 20,
  },
  section: {
    gap: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
    paddingHorizontal: 8,
  },
  item: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
  },
  itemActive: {
    backgroundColor: colors.canvas,
  },
  itemLabel: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    color: colors.muted,
    fontWeight: "500",
    letterSpacing: -0.1,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: colors.line,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.ink,
    lineHeight: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
