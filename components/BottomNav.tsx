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
import { Icon, IconName } from "./Icon";
import { colors } from "./theme";

export interface NavItem {
  id: string;
  label: string;
  icon: IconName;
  badge?: number | string;
  disabled?: boolean;
}

export interface BottomNavProps {
  /** Array of bottom navigation tab items */
  items: NavItem[];
  /** Controlled active tab ID */
  value?: string;
  /** Initial active tab ID for uncontrolled usage */
  defaultValue?: string;
  /** Callback fired when selected tab changes */
  onChange?: (id: string) => void;
  /** Alternative callback fired when selected tab changes */
  onSelect?: (id: string) => void;
  /** Active item background accent color */
  accent?: string;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Individual tab item style */
  itemStyle?: StyleProp<ViewStyle>;
}

export function BottomNav({
  items,
  value: controlledValue,
  defaultValue,
  onChange,
  onSelect,
  accent = colors.lime,
  style,
  itemStyle,
}: BottomNavProps) {
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue || (items[0]?.id ?? ""),
  );

  const isControlled = controlledValue !== undefined;
  const activeId = isControlled ? controlledValue : internalValue;

  const handleSelect = (item: NavItem) => {
    if (item.disabled) return;
    if (!isControlled) {
      setInternalValue(item.id);
    }
    onChange?.(item.id);
    onSelect?.(item.id);
  };

  return (
    <View style={[s.nav, style]} accessibilityRole="tablist">
      {items.map((item) => {
        const isSelected = item.id === activeId;
        const isDisabled = !!item.disabled;

        return (
          <Pressable
            key={item.id}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{
              selected: isSelected,
              disabled: isDisabled,
            }}
            disabled={isDisabled}
            onPress={() => handleSelect(item)}
            style={({ pressed, hovered }: any) => [
              s.item,
              {
                backgroundColor: isSelected ? accent : "transparent",
                opacity: isDisabled
                  ? 0.4
                  : pressed
                    ? 0.75
                    : 1,
              },
              hovered &&
                !isSelected &&
                !isDisabled && {
                  backgroundColor: "rgba(255,255,255,0.06)",
                },
              {
                outlineWidth: 0,
                outlineColor: "transparent",
                ...(Platform.OS === "web"
                  ? ({
                      cursor: isDisabled ? "not-allowed" : "pointer",
                      outlineStyle: "none",
                    } as any)
                  : {}),
              },
              itemStyle,
            ]}
          >
            <View style={s.iconWrapper}>
              <Icon
                name={item.icon}
                color={isSelected ? colors.ink : "#b7bcaf"}
                size={19}
              />
              {item.badge !== undefined && (
                <View
                  style={[
                    s.badge,
                    isSelected && { backgroundColor: colors.ink },
                  ]}
                >
                  <Text
                    style={[
                      s.badgeText,
                      isSelected && { color: accent },
                    ]}
                  >
                    {item.badge}
                  </Text>
                </View>
              )}
            </View>

            <Text
              numberOfLines={1}
              style={[
                s.label,
                isSelected ? s.labelSelected : s.labelUnselected,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  nav: {
    backgroundColor: "#262d23",
    padding: 7,
    borderRadius: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    width: "100%",
  },
  item: {
    flex: 1,
    minWidth: 0,
    flexDirection: "column",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
    minHeight: 58,
    borderRadius: 30,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  iconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -10,
    backgroundColor: colors.danger,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 13,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    flexShrink: 1,
  },
  labelSelected: {
    color: colors.ink,
    fontWeight: "600",
  },
  labelUnselected: {
    color: "#d4d9cd",
  },
});
