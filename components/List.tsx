import React from "react";
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

export interface ListItemProps {
  /** Unique identifier */
  id?: string;
  /** Primary title text */
  title: string;
  /** Secondary subtitle text */
  subtitle?: string;
  /** Custom leading node (e.g. icon or avatar) */
  leading?: React.ReactNode;
  /** Custom trailing node (e.g. badge, switch, or action) */
  trailing?: React.ReactNode;
  /** Whether to show a trailing chevron when interactive */
  showChevron?: boolean;
  /** Callback fired when the item is pressed */
  onPress?: () => void;
  /** Selected visual state */
  selected?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Item container style */
  style?: StyleProp<ViewStyle>;
  /** Title text style */
  titleStyle?: StyleProp<TextStyle>;
  /** Subtitle text style */
  subtitleStyle?: StyleProp<TextStyle>;
}

export function ListItem({
  title,
  subtitle,
  leading,
  trailing,
  showChevron = false,
  onPress,
  selected = false,
  disabled = false,
  style,
  titleStyle,
  subtitleStyle,
}: ListItemProps) {
  const isInteractive = Boolean(onPress) && !disabled;

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      disabled={disabled || !onPress}
      accessible={!!onPress}
      accessibilityState={onPress ? { selected, disabled } : undefined}
      onPress={onPress}
      style={({ pressed, hovered }: any) => [
        s.item,
        selected && s.itemSelected,
        isInteractive && (hovered || pressed) && s.itemActive,
        disabled && s.disabled,
        style,
      ]}
    >
      {leading && <View style={s.leading}>{leading}</View>}

      <View style={s.centerContent}>
        <Text
          style={[s.title, selected && { fontWeight: "600" }, titleStyle]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[s.subtitle, subtitleStyle]} numberOfLines={2}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={s.trailing}>
        {trailing}
        {showChevron && onPress && (
          <Icon name="chevronRight" size={14} color={colors.muted} />
        )}
      </View>
    </Pressable>
  );
}

export interface ListProps {
  /** Child items, typically ListItems */
  children: React.ReactNode;
  /** Whether to display dividers between items */
  divided?: boolean;
  /** List container style */
  style?: StyleProp<ViewStyle>;
}

export function List({ children, divided = true, style }: ListProps) {
  return (
    <View style={[s.list, divided && s.dividedList, style]}>
      {React.Children.toArray(children).map((child, index) => (
        <React.Fragment
          key={React.isValidElement(child) ? (child.key ?? index) : index}
        >
          {index > 0 && divided && (
            <View style={{ height: 1, backgroundColor: colors.line }} />
          )}
          {child}
        </React.Fragment>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  list: {
    width: "100%",
    backgroundColor: colors.paper,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  dividedList: {
    gap: 0,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
    gap: 12,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none" } as any)
      : {}),
  },
  itemSelected: {
    backgroundColor: colors.canvas,
  },
  itemActive: {
    backgroundColor: colors.canvas,
  },
  disabled: {
    opacity: 0.5,
  },
  leading: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  centerContent: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.ink,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
    lineHeight: 16,
    flexShrink: 1,
  },
  trailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
});
