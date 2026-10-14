import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { Avatar, colors, Icon, IconName } from "../components";

export interface ShellNavItem {
  id: string;
  label: string;
  icon: IconName;
}
export interface AppShellBlockProps {
  title?: string;
  items?: ShellNavItem[];
  activeId?: string;
  onNavigate?: (id: string) => void;
  userName?: string;
  children?: React.ReactNode;
  accent?: string;
  style?: ViewStyle;
}
const defaultItems: ShellNavItem[] = [
  { id: "overview", label: "Overview", icon: "chart" },
  { id: "projects", label: "Projects", icon: "layers" },
  { id: "customers", label: "Customers", icon: "users" },
  { id: "settings", label: "Settings", icon: "settings" },
];

export function AppShellBlock({
  title = "Workspace",
  items = defaultItems,
  activeId,
  onNavigate,
  userName,
  children,
  accent = colors.lime,
  style,
}: AppShellBlockProps) {
  const [width, setWidth] = useState(0);
  const [localActive, setLocalActive] = useState(items[0]?.id || "");
  const selected = activeId ?? localActive;
  const compact = width < 720;
  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={[s.shell, compact && s.compact, style]}
    >
      <View style={[s.sidebar, compact && s.topNav]}>
        <View style={s.brand}>
          <View style={[s.mark, { backgroundColor: accent }]}>
            <Icon name="spark" size={18} />
          </View>
          <Text style={s.brandTitle}>{title}</Text>
        </View>
        <ScrollView
          horizontal={compact}
          showsHorizontalScrollIndicator={compact}
          contentContainerStyle={[s.nav, compact && s.horizontalNav]}
        >
          {items.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: item.id === selected }}
              onPress={() => {
                setLocalActive(item.id);
                onNavigate?.(item.id);
              }}
              style={({ pressed }) => [
                s.navItem,
                item.id === selected && { backgroundColor: accent },
                pressed && { opacity: 0.7 },
              ]}
            >
              <Icon name={item.icon} size={18} />
              <Text style={s.navLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {!!userName && !compact && (
          <View style={s.user}>
            <Avatar name={userName} size="sm" />
            <Text style={s.navLabel}>{userName}</Text>
          </View>
        )}
      </View>
      <View style={s.main}>
        <Text accessibilityRole="header" style={s.title}>
          {items.find((item) => item.id === selected)?.label || title}
        </Text>
        {children}
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  shell: {
    width: "100%",
    minHeight: 320,
    flexDirection: "row",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    backgroundColor: colors.canvas,
  },
  compact: { flexDirection: "column" },
  sidebar: {
    width: 190,
    backgroundColor: colors.paper,
    borderRightWidth: 1,
    borderRightColor: colors.line,
  },
  topNav: {
    width: "100%",
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  brand: { padding: 16, flexDirection: "row", alignItems: "center", gap: 10 },
  mark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: 16,
    color: colors.ink,
    fontWeight: "600",
    flexShrink: 1,
  },
  nav: { padding: 12, gap: 4 },
  horizontalNav: { flexDirection: "row", paddingTop: 0, gap: 8 },
  navItem: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  navLabel: { fontSize: 14, color: colors.ink, flexShrink: 1 },
  user: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  main: { flex: 1, minWidth: 0, padding: 20, gap: 16 },
  title: { fontSize: 22, color: colors.ink, fontWeight: "600" },
});
