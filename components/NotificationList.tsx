import React, { useState } from "react";
import {
  ActivityIndicator,
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
import { Icon, IconName } from "./Icon";
import { Badge } from "./Badge";

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "system"
  | "mention";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  type?: NotificationType;
  icon?: IconName;
  actionLabel?: string;
  onAction?: () => void;
}

export interface NotificationListProps {
  /** Array of notifications */
  items: NotificationItem[];
  /** Callback fired when an item is pressed */
  onItemPress?: (item: NotificationItem) => void;
  /** Callback fired when an item is dismissed */
  onDismiss?: (id: string) => void;
  /** Callback fired to mark all notifications as read */
  onMarkAllRead?: () => void;
  /** Controlled active filter */
  filter?: "all" | "unread";
  /** Initial filter */
  defaultFilter?: "all" | "unread";
  /** Filter change callback */
  onFilterChange?: (filter: "all" | "unread") => void;
  /** List header title */
  title?: string;
  /** Title shown when list is empty */
  emptyTitle?: string;
  /** Message shown when list is empty */
  emptyMessage?: string;
  /** Loading indicator */
  loading?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Scrollable content container style */
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const typeConfig: Record<
  NotificationType,
  { icon: IconName; color: string; bg: string }
> = {
  info: { icon: "infoCircle", color: colors.info, bg: colors.infoBg },
  success: { icon: "checkCircle", color: colors.success, bg: colors.successBg },
  warning: {
    icon: "alertTriangle",
    color: colors.warning,
    bg: colors.warningBg,
  },
  danger: { icon: "alertCircle", color: colors.danger, bg: colors.dangerBg },
  system: { icon: "settings", color: colors.muted, bg: colors.canvas },
  mention: { icon: "users", color: colors.ink, bg: colors.teal },
};

export function NotificationList({
  items,
  onItemPress,
  onDismiss,
  onMarkAllRead,
  filter: controlledFilter,
  defaultFilter = "all",
  onFilterChange,
  title = "Notifications",
  emptyTitle = "Inbox zero",
  emptyMessage = "You're caught up with all activity and updates.",
  loading = false,
  style,
  contentContainerStyle,
}: NotificationListProps) {
  const isControlled = controlledFilter !== undefined;
  const [internalFilter, setInternalFilter] =
    useState<"all" | "unread">(defaultFilter);
  const currentFilter = isControlled ? controlledFilter : internalFilter;

  const handleFilterSelect = (nextFilter: "all" | "unread") => {
    if (!isControlled) {
      setInternalFilter(nextFilter);
    }
    onFilterChange?.(nextFilter);
  };

  const unreadCount = items.filter((i) => i.unread).length;
  const filteredItems =
    currentFilter === "unread" ? items.filter((i) => i.unread) : items;

  return (
    <View style={[s.container, style]}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.titleRow}>
          <Text style={s.title}>{title}</Text>
          {unreadCount > 0 && (
            <Badge tone="neutral" dot={false}>
              {`${unreadCount} new`}
            </Badge>
          )}
        </View>

        {unreadCount > 0 && onMarkAllRead && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Mark all read"
            onPress={onMarkAllRead}
            style={({ pressed, hovered }: any) => [
              s.markAllBtn,
              (pressed || hovered) && { opacity: 0.7 },
            ]}
          >
            <Text style={s.markAllText}>Mark all read</Text>
          </Pressable>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={s.tabRow}>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: currentFilter === "all" }}
          onPress={() => handleFilterSelect("all")}
          style={[s.tab, currentFilter === "all" && s.tabActive]}
        >
          <Text
            style={[s.tabText, currentFilter === "all" && s.tabTextActive]}
          >
            All ({items.length})
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: currentFilter === "unread" }}
          onPress={() => handleFilterSelect("unread")}
          style={[s.tab, currentFilter === "unread" && s.tabActive]}
        >
          <Text
            style={[s.tabText, currentFilter === "unread" && s.tabTextActive]}
          >
            Unread ({unreadCount})
          </Text>
        </Pressable>
      </View>

      {/* Items or Empty */}
      {loading ? (
        <View style={s.loadingWrap}>
          <ActivityIndicator size="small" color={colors.ink} />
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={s.emptyWrap}>
          <View style={s.emptyIcon}>
            <Icon name="bell" size={24} color={colors.muted} />
          </View>
          <Text style={s.emptyTitleText}>{emptyTitle}</Text>
          <Text style={s.emptyMessageText}>{emptyMessage}</Text>
        </View>
      ) : (
        <ScrollView
          style={s.listScroll}
          contentContainerStyle={[s.listContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {filteredItems.map((item) => {
            const config = typeConfig[item.type || "info"];
            const iconName = item.icon || config.icon;

            return (
              <Pressable
                key={item.id}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}, ${item.message}`}
                onPress={() => onItemPress && onItemPress(item)}
                style={({ pressed, hovered }: any) => [
                  s.itemCard,
                  item.unread && s.itemUnread,
                  (pressed || hovered) && s.itemPressed,
                ]}
              >
                <View style={[s.iconBox, { backgroundColor: config.bg }]}>
                  <Icon name={iconName} size={16} color={config.color} />
                </View>

                <View style={s.textCol}>
                  <View style={s.itemHeadRow}>
                    <Text
                      style={[s.itemTitle, item.unread && s.itemTitleUnread]}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text style={s.timeText}>{item.timestamp}</Text>
                  </View>

                  <Text style={s.messageText} numberOfLines={2}>
                    {item.message}
                  </Text>

                  {item.actionLabel && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={item.actionLabel}
                      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                      onPress={(e) => {
                        e.stopPropagation();
                        if (item.onAction) item.onAction();
                      }}
                      style={({ pressed, hovered }: any) => [
                        s.actionBtn,
                        (pressed || hovered) && { opacity: 0.75 },
                      ]}
                    >
                      <Text style={s.actionText}>{item.actionLabel}</Text>
                      <Icon name="arrowRight" size={12} color={colors.ink} />
                    </Pressable>
                  )}
                </View>

                <View style={s.rightActions}>
                  {item.unread && <View style={s.unreadDot} />}
                  {onDismiss && (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Dismiss notification"
                      hitSlop={{ top: 11, bottom: 11, left: 11, right: 11 }}
                      onPress={(e) => {
                        e.stopPropagation();
                        onDismiss(item.id);
                      }}
                      style={({ pressed, hovered }: any) => [
                        s.dismissBtn,
                        (pressed || hovered) && { opacity: 0.6 },
                      ]}
                    >
                      <Icon name="close" size={13} color={colors.muted} />
                    </Pressable>
                  )}
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.paper,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    ...cardShadow,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  markAllBtn: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 8,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  markAllText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingHorizontal: 16,
    gap: 16,
  },
  tab: {
    minHeight: 44,
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginBottom: -1,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  tabActive: {
    borderBottomColor: colors.ink,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.muted,
  },
  tabTextActive: {
    color: colors.ink,
    fontWeight: "600",
  },
  loadingWrap: {
    padding: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  listScroll: {
    maxHeight: 380,
  },
  listContent: {
    paddingVertical: 6,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    backgroundColor: colors.paper,
    gap: 12,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  itemUnread: {
    backgroundColor: colors.canvas,
  },
  itemPressed: {
    backgroundColor: colors.canvas,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  textCol: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  itemHeadRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.ink,
    flex: 1,
  },
  itemTitleUnread: {
    fontWeight: "700",
  },
  timeText: {
    fontSize: 11,
    color: colors.muted,
    flexShrink: 0,
  },
  messageText: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    minHeight: 36,
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
  },
  rightActions: {
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
    paddingTop: 2,
    flexShrink: 0,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.ink,
  },
  dismissBtn: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  emptyWrap: {
    padding: 36,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitleText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  emptyMessageText: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
    maxWidth: 240,
    lineHeight: 18,
  },
});
