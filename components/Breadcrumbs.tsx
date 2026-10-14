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

export interface BreadcrumbItem {
  id: string;
  label: string;
  icon?: IconName;
  href?: string;
  disabled?: boolean;
}

export interface BreadcrumbsProps {
  /** Array of breadcrumb trail items */
  items: BreadcrumbItem[];
  /** Callback fired when a non-current breadcrumb item is clicked */
  onSelect?: (item: BreadcrumbItem) => void;
  /** Maximum number of breadcrumb items before collapsing intermediate items (minimum 3) */
  maxItems?: number;
  /** Optional icon name for separator (defaults to slash '/') */
  separatorIcon?: IconName;
  /** Custom separator node */
  separator?: React.ReactNode;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom item style */
  itemStyle?: StyleProp<ViewStyle>;
  /** Custom inactive label text style */
  labelStyle?: StyleProp<TextStyle>;
  /** Custom active/current label text style */
  activeLabelStyle?: StyleProp<TextStyle>;
}

export function Breadcrumbs({
  items,
  onSelect,
  maxItems = 4,
  separatorIcon,
  separator,
  style,
  itemStyle,
  labelStyle,
  activeLabelStyle,
}: BreadcrumbsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!items || items.length === 0) return null;

  // Collapse intermediate items if longer than maxItems and not user-expanded
  let displayItems = items;
  if (!isExpanded && items.length > maxItems && maxItems >= 3) {
    displayItems = [
      items[0],
      { id: "__ellipsis__", label: "…" },
      ...items.slice(items.length - (maxItems - 2)),
    ];
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[s.container, style]}
      contentContainerStyle={s.content}
    >
      {displayItems.map((item, index) => {
        const isLast = index === displayItems.length - 1;
        const isEllipsis = item.id === "__ellipsis__";
        const isDisabled = !!item.disabled;

        return (
          <React.Fragment key={item.id}>
            {index > 0 && (
              <View style={s.separatorWrap} aria-hidden={true}>
                {separator !== undefined ? (
                  separator
                ) : separatorIcon ? (
                  <Icon name={separatorIcon} size={12} color={colors.muted} />
                ) : (
                  <Text style={s.separator}>/</Text>
                )}
              </View>
            )}

            {isEllipsis ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Show all breadcrumb items"
                onPress={() => setIsExpanded(true)}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                style={({ pressed, hovered }: any) => [
                  s.ellipsisBtn,
                  hovered && { backgroundColor: colors.line },
                  pressed && { opacity: 0.7 },
                  itemStyle,
                ]}
              >
                <Text style={s.ellipsisText}>…</Text>
              </Pressable>
            ) : isLast || !onSelect || isDisabled ? (
              <View style={[s.itemWrap, itemStyle]}>
                {item.icon && (
                  <Icon
                    name={item.icon}
                    size={13}
                    color={isLast ? colors.ink : colors.muted}
                  />
                )}
                <Text
                  numberOfLines={1}
                  style={[
                    s.label,
                    isLast ? [s.labelCurrent, activeLabelStyle] : labelStyle,
                    isDisabled && { opacity: 0.5 },
                  ]}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </Text>
              </View>
            ) : (
              <Pressable
                accessibilityRole="link"
                accessibilityLabel={`Navigate to ${item.label}`}
                onPress={() => onSelect(item)}
                hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                style={({ pressed, hovered }: any) => [
                  s.linkPressable,
                  hovered && s.linkHovered,
                  pressed && { opacity: 0.65 },
                  itemStyle,
                ]}
              >
                {({ hovered }: any) => (
                  <>
                    {item.icon && (
                      <Icon
                        name={item.icon}
                        size={13}
                        color={hovered ? colors.ink : colors.muted}
                      />
                    )}
                    <Text
                      numberOfLines={1}
                      style={[
                        s.labelLink,
                        hovered && { color: colors.ink },
                        labelStyle,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </>
                )}
              </Pressable>
            )}
          </React.Fragment>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    maxWidth: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    gap: 4,
  },
  itemWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    minHeight: 44,
    paddingHorizontal: 4,
  },
  linkPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    minHeight: 44,
    paddingHorizontal: 4,
    borderRadius: 6,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ cursor: "pointer", outlineStyle: "none" } as any)
      : {}),
  },
  linkHovered: {
    backgroundColor: colors.canvas,
  },
  ellipsisBtn: {
    paddingHorizontal: 6,
    minHeight: 44,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.canvas,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ cursor: "pointer", outlineStyle: "none" } as any)
      : {}),
  },
  ellipsisText: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: "600",
  },
  label: {
    fontSize: 13,
    color: colors.muted,
  },
  labelLink: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: "500",
  },
  labelCurrent: {
    color: colors.ink,
    fontWeight: "600",
  },
  separatorWrap: {
    paddingHorizontal: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: "400",
  },
});
