import React from "react";
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

export interface Activity {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  icon: IconName;
  color: string;
  disabled?: boolean;
}

export interface ActivityListProps {
  /** List of activity items to display */
  items: Activity[];
  /** Optional section title, defaults to "Recent activity" */
  title?: string;
  /** Optional date/period badge label (e.g. "Today", "Last 7 days") */
  periodLabel?: string;
  /** Callback fired when an activity row is clicked/pressed */
  onSelect?: (item: Activity) => void;
  /** Empty state message if items array is empty */
  emptyMessage?: string;
  /** Custom empty state node */
  emptyState?: React.ReactNode;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom row style */
  rowStyle?: StyleProp<ViewStyle>;
  /** Disables row interactions */
  disabled?: boolean;
}

export function ActivityList({
  items,
  title = "Recent activity",
  periodLabel,
  onSelect,
  emptyMessage = "No activity yet.",
  emptyState,
  style,
  rowStyle,
  disabled = false,
}: ActivityListProps) {
  return (
    <View style={[s.card, style]}>
      {(title || periodLabel) && (
        <View style={s.heading}>
          {!!title && <Text style={s.title}>{title}</Text>}
          {!!periodLabel && <Text style={s.today}>{periodLabel}</Text>}
        </View>
      )}

      {items.length === 0 &&
        (emptyState || <Text style={s.emptyText}>{emptyMessage}</Text>)}

      {items.map((item, i) => {
        const isInteractive = !!onSelect && !disabled && !item.disabled;
        const isLast = i === items.length - 1;

        return (
          <Pressable
            key={item.id}
            accessibilityRole={isInteractive ? "button" : "none"}
            accessibilityLabel={`${item.title}, ${item.amount}, ${item.subtitle}`}
            accessibilityState={{
              disabled: !isInteractive,
            }}
            disabled={!isInteractive}
            onPress={() => isInteractive && onSelect?.(item)}
            style={({ pressed, hovered }: any) => [
              s.row,
              !isLast && s.border,
              isInteractive && {
                ...(Platform.OS === "web"
                  ? ({ cursor: "pointer", outlineStyle: "none" } as any)
                  : {}),
                outlineWidth: 0,
                outlineColor: "transparent",
              },
              isInteractive &&
                (hovered || pressed) && {
                  backgroundColor: colors.canvas,
                  borderRadius: 12,
                  paddingHorizontal: 8,
                  marginHorizontal: -8,
                },
              pressed && { opacity: 0.7 },
              (disabled || item.disabled) && { opacity: 0.5 },
              rowStyle,
            ]}
          >
            <View style={[s.icon, { backgroundColor: item.color }]}>
              <Icon name={item.icon} size={17} color={colors.ink} />
            </View>

            <View style={s.textContainer}>
              <Text numberOfLines={1} style={s.name}>
                {item.title}
              </Text>
              <Text numberOfLines={1} style={s.subtitle}>
                {item.subtitle}
              </Text>
            </View>

            <Text numberOfLines={1} style={s.amount}>
              {item.amount}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    width: "100%",
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: colors.ink,
    fontWeight: "600",
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  today: {
    fontSize: 12,
    color: colors.muted,
    flexShrink: 0,
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    paddingVertical: 12,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    minHeight: 56,
  },
  border: {
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.ink,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 3,
  },
  amount: {
    flexShrink: 0,
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
    textAlign: "right",
    marginLeft: 8,
  },
});
