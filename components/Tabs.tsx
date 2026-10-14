import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { Icon, IconName } from "./Icon";

export interface TabItem {
  id: string;
  label: string;
  icon?: IconName;
  count?: number | string;
  disabled?: boolean;
}

export interface TabsProps {
  /** Array of tab items */
  items: TabItem[];
  /** Controlled active tab ID */
  value?: string;
  /** Uncontrolled initial tab ID */
  defaultValue?: string;
  /** Tab change callback */
  onChange?: (id: string) => void;
  /** Tab selection callback alias */
  onSelect?: (id: string) => void;
  /** Tab design variant */
  variant?: "pill" | "underline";
  /** Highlight accent color */
  accent?: string;
  /** Whether the entire tab strip is disabled */
  disabled?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Scrollable content container style */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Individual tab item style */
  tabStyle?: StyleProp<ViewStyle>;
  /** Active tab item style */
  activeTabStyle?: StyleProp<ViewStyle>;
  /** Tab label text style */
  labelStyle?: StyleProp<TextStyle>;
}

export function Tabs({
  items,
  value: controlledValue,
  defaultValue = items[0]?.id || "",
  onChange,
  onSelect,
  variant = "pill",
  accent = colors.lime,
  disabled = false,
  style,
  contentContainerStyle,
  tabStyle,
  activeTabStyle,
  labelStyle,
}: TabsProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeValue = isControlled ? controlledValue : internalValue;

  const handleSelectTab = (id: string) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalValue(id);
    }
    onChange?.(id);
    onSelect?.(id);
  };

  return (
    <View style={[s.container, disabled && s.containerDisabled, style]} accessibilityRole="tablist">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          s.scrollContent,
          variant === "underline" && s.underlineScroll,
          contentContainerStyle,
        ]}
      >
        {items.map((tab) => {
          const isSelected = tab.id === activeValue;
          const isTabDisabled = disabled || Boolean(tab.disabled);

          if (variant === "underline") {
            return (
              <Pressable
                key={tab.id}
                accessibilityRole="tab"
                aria-selected={isSelected}
                accessibilityState={{
                  selected: isSelected,
                  disabled: isTabDisabled,
                }}
                disabled={isTabDisabled}
                onPress={() => handleSelectTab(tab.id)}
                style={({ pressed, hovered }: any) => [
                  s.underlineTab,
                  isSelected && [s.underlineTabSelected, activeTabStyle],
                  (hovered || pressed) && !isTabDisabled && !isSelected && s.underlineTabHovered,
                  isTabDisabled && s.disabled,
                  tabStyle,
                ]}
              >
                {tab.icon && (
                  <Icon
                    name={tab.icon}
                    size={15}
                    color={isSelected ? colors.ink : colors.muted}
                  />
                )}
                <Text
                  style={[
                    s.underlineText,
                    isSelected && s.underlineTextSelected,
                    labelStyle,
                  ]}
                  numberOfLines={1}
                >
                  {tab.label}
                </Text>
                {tab.count !== undefined && (
                  <View
                    style={[
                      s.countBadge,
                      isSelected && { backgroundColor: accent },
                    ]}
                  >
                    <Text style={s.countText}>{tab.count}</Text>
                  </View>
                )}
              </Pressable>
            );
          }

          return (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              aria-selected={isSelected}
              accessibilityState={{
                selected: isSelected,
                disabled: isTabDisabled,
              }}
              disabled={isTabDisabled}
              onPress={() => handleSelectTab(tab.id)}
              style={({ pressed, hovered }: any) => [
                s.pillTab,
                isSelected && [s.pillTabSelected, { backgroundColor: accent }, activeTabStyle],
                !isSelected && (hovered || pressed) && !isTabDisabled && s.pillTabHovered,
                isTabDisabled && s.disabled,
                tabStyle,
              ]}
            >
              {tab.icon && (
                <Icon
                  name={tab.icon}
                  size={14}
                  color={isSelected ? colors.ink : colors.muted}
                />
              )}
              <Text
                style={[
                  s.pillText,
                  isSelected && s.pillTextSelected,
                  labelStyle,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
              {tab.count !== undefined && (
                <View
                  style={[
                    s.countBadge,
                    {
                      backgroundColor: isSelected
                        ? "rgba(0,0,0,0.08)"
                        : colors.line,
                    },
                  ]}
                >
                  <Text style={s.countText}>{tab.count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
  },
  containerDisabled: {
    opacity: 0.6,
  },
  scrollContent: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  underlineScroll: {
    gap: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingBottom: 0,
  },
  pillTab: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  pillTabSelected: {
    borderColor: "transparent",
  },
  pillTabHovered: {
    backgroundColor: colors.line,
  },
  pillText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.muted,
  },
  pillTextSelected: {
    color: colors.ink,
    fontWeight: "600",
  },
  underlineTab: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingBottom: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  underlineTabSelected: {
    borderBottomColor: colors.ink,
  },
  underlineTabHovered: {
    borderBottomColor: colors.line,
  },
  underlineText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.muted,
  },
  underlineTextSelected: {
    color: colors.ink,
    fontWeight: "600",
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: colors.line,
  },
  countText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.ink,
  },
  disabled: {
    opacity: 0.4,
    ...(Platform.OS === "web" ? ({ cursor: "not-allowed" } as any) : {}),
  },
});
