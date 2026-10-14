import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { Icon, IconName } from "./Icon";

export interface NavbarItem {
  id: string;
  label: string;
  icon?: IconName;
  badge?: string | number;
  disabled?: boolean;
}

export interface NavbarProps {
  /** Custom brand component */
  brand?: React.ReactNode;
  /** Brand title text when default brand is used */
  brandTitle?: string;
  /** List of navigation items */
  items: NavbarItem[];
  /** Controlled active item ID */
  activeId?: string;
  /** Uncontrolled initial active item ID */
  defaultActiveId?: string;
  /** Callback fired when an item is selected */
  onSelect?: (id: string) => void;
  /** Custom action components rendered on the right */
  actions?: React.ReactNode;
  /** Mobile hamburger menu press callback */
  onMenuPress?: () => void;
  /** Accent highlight color */
  accent?: string;
  /** Navbar container style */
  style?: StyleProp<ViewStyle>;
  /** Navigation items container style */
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function Navbar({
  brand,
  brandTitle = "Forma",
  items,
  activeId: controlledActiveId,
  defaultActiveId = items[0]?.id || "",
  onSelect,
  actions,
  onMenuPress,
  accent = colors.lime,
  style,
  contentContainerStyle,
}: NavbarProps) {
  const isControlled = controlledActiveId !== undefined;
  const [internalActiveId, setInternalActiveId] = useState(defaultActiveId);
  const currentActiveId = isControlled ? controlledActiveId : internalActiveId;

  const [width, setWidth] = useState(0);
  const compact = width < 600;

  const handleSelect = (id: string) => {
    if (!isControlled) {
      setInternalActiveId(id);
    }
    onSelect?.(id);
  };

  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[s.navbar, compact && { flexWrap: "wrap" }, style]}
    >
      <View style={s.leftSection}>
        {onMenuPress && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open navigation menu"
            onPress={onMenuPress}
            style={({ pressed, hovered }: any) => [
              s.menuBtn,
              (pressed || hovered) && { backgroundColor: colors.canvas },
            ]}
          >
            <Icon name="menu" size={18} color={colors.ink} />
          </Pressable>
        )}

        {brand || (
          <View style={s.defaultBrand}>
            <View style={[s.brandDot, { backgroundColor: accent }]} />
            <Text style={s.brandTitle}>{brandTitle}</Text>
          </View>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={compact ? { width: "100%" } : { flex: 1, minWidth: 0 }}
        contentContainerStyle={[s.centerNav, contentContainerStyle]}
      >
        {items.map((item) => {
          const isActive = item.id === currentActiveId;
          const isDisabled = item.disabled;

          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive, disabled: isDisabled }}
              disabled={isDisabled}
              onPress={() => handleSelect(item.id)}
              style={({ pressed, hovered }: any) => [
                s.navItem,
                isActive && s.navItemActive,
                (hovered || pressed) && !isActive && !isDisabled && s.navItemHovered,
                isDisabled && s.navItemDisabled,
              ]}
            >
              {item.icon && (
                <Icon
                  name={item.icon}
                  size={14}
                  color={isActive ? colors.ink : colors.muted}
                />
              )}
              <Text
                style={[
                  s.navText,
                  isActive && { color: colors.ink, fontWeight: "600" },
                ]}
              >
                {item.label}
              </Text>
              {item.badge !== undefined && (
                <View
                  style={[s.navBadge, isActive && { backgroundColor: accent }]}
                >
                  <Text style={s.navBadgeText}>{item.badge}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {actions && <View style={s.rightSection}>{actions}</View>}
    </View>
  );
}

const s = StyleSheet.create({
  navbar: {
    minHeight: 56,
    paddingVertical: 8,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: colors.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    width: "100%",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
  },
  menuBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
    borderRadius: 8,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  defaultBrand: {
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
    letterSpacing: -0.3,
  },
  centerNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  navItem: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  navItemActive: {
    backgroundColor: colors.canvas,
  },
  navItemHovered: {
    backgroundColor: colors.canvas,
  },
  navItemDisabled: {
    opacity: 0.5,
    ...(Platform.OS === "web" ? ({ cursor: "not-allowed" } as any) : {}),
  },
  navText: {
    fontSize: 14,
    color: colors.muted,
    fontWeight: "500",
  },
  navBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: colors.line,
  },
  navBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.ink,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
});
