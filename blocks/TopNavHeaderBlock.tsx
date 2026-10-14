import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Avatar,
  Badge,
  Dropdown,
  DropdownItem,
  Input,
  colors,
  Icon,
} from "../components";

export interface TopNavHeaderBlockProps {
  workspaceName?: string;
  onWorkspacePress?: () => void;
  onSearch?: (query: string) => void;
  onNotifications?: () => void;
  notificationCount?: number;
  userName?: string;
  userActions?: DropdownItem[];
  onUserAction?: (item: DropdownItem) => void;
  accent?: string;
  style?: ViewStyle;
}

export function TopNavHeaderBlock({
  workspaceName = "Workspace",
  onWorkspacePress,
  onSearch,
  onNotifications,
  notificationCount = 0,
  userName,
  userActions = [],
  onUserAction,
  accent = colors.lime,
  style,
}: TopNavHeaderBlockProps) {
  const [query, setQuery] = useState("");
  const [width, setWidth] = useState(0);
  const compact = width < 680;
  const identity = (
    <View style={s.identity}>
      <View style={[s.mark, { backgroundColor: accent }]}>
        <Icon name="layers" size={18} />
      </View>
      <Text style={s.workspace}>{workspaceName}</Text>
      {onWorkspacePress && <Icon name="chevronDown" size={16} />}
    </View>
  );
  const user = userName ? (
    <View style={s.identity}>
      <Avatar name={userName} size="sm" />
      {!compact && <Text style={s.userName}>{userName}</Text>}
    </View>
  ) : null;
  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[s.header, style]}
    >
      <View style={s.topRow}>
        {onWorkspacePress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Switch workspace: ${workspaceName}`}
            onPress={onWorkspacePress}
            style={s.workspaceButton}
          >
            {identity}
          </Pressable>
        ) : (
          identity
        )}
        <View style={s.actions}>
          {onNotifications && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ""}`}
              onPress={onNotifications}
              style={s.iconButton}
            >
              <Icon name="bell" size={20} />
              {notificationCount > 0 && (
                <Badge>{String(notificationCount)}</Badge>
              )}
            </Pressable>
          )}
          {user &&
            (userActions.length > 0 && onUserAction ? (
              <Dropdown
                placeholder="Account menu"
                align="right"
                trigger={user}
                items={userActions}
                onSelect={onUserAction}
              />
            ) : (
              user
            ))}
        </View>
      </View>
      {onSearch && (
        <Input
          label=""
          accessibilityLabel="Search workspace"
          placeholder="Search workspace"
          icon="search"
          value={query}
          onChangeText={(value) => {
            setQuery(value);
            onSearch(value);
          }}
          accent={accent}
        />
      )}
    </View>
  );
}
const s = StyleSheet.create({
  header: {
    width: "100%",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
  },
  topRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexShrink: 1,
    minWidth: 0,
  },
  workspaceButton: {
    minHeight: 44,
    justifyContent: "center",
    maxWidth: "100%",
  },
  workspace: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.ink,
    flexShrink: 1,
  },
  mark: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconButton: {
    minHeight: 44,
    minWidth: 44,
    padding: 8,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  userName: { fontSize: 14, color: colors.ink, flexShrink: 1 },
});
