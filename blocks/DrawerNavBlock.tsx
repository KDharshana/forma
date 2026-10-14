import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors, Icon, IconName } from "../components";

export interface DrawerNavBlockProps {
  title?: string;
  activeId?: string;
  onSelect?: (id: string) => void;
  accent?: string;
  style?: ViewStyle;
}

interface DrawerNavItem {
  id: string;
  label: string;
  icon: IconName;
  badge?: string;
}

interface DrawerNavSection {
  title: string;
  items: DrawerNavItem[];
}

export function DrawerNavBlock({
  title = "Workspace",
  activeId,
  onSelect,
  accent = colors.lime,
  style,
}: DrawerNavBlockProps) {
  const [localActive, setActive] = useState("dashboard");
  const active = activeId ?? localActive;

  const sections: DrawerNavSection[] = [
    {
      title: "Workspace",
      items: [
        { id: "dashboard", label: "Dashboard", icon: "grid" as const },
        { id: "activity", label: "Activity", icon: "clock" as const },
        { id: "analytics", label: "Analytics", icon: "chart" as const },
      ],
    },
    {
      title: "Management",
      items: [
        { id: "team", label: "Team", icon: "users" as const },
        { id: "documents", label: "Documents", icon: "folder" as const },
        { id: "billing", label: "Subscriptions", icon: "wallet" as const },
      ],
    },
    {
      title: "Settings",
      items: [
        { id: "preferences", label: "Preferences", icon: "settings" as const },
        { id: "security", label: "Security", icon: "shield" as const },
      ],
    },
  ];

  return (
    <View style={[s.drawerContainer, style]}>
      {/* Brand Header */}
      <View style={s.header}>
        <View style={s.brandGroup}>
          <View style={[s.brandMark, { backgroundColor: accent }]}>
            <Icon name="spark" size={16} color={colors.ink} />
          </View>
          <View>
            <Text accessibilityRole="header" style={s.brandTitle}>
              {title}
            </Text>
          </View>
        </View>
      </View>

      {/* Nav List */}
      <ScrollView style={s.scrollArea} contentContainerStyle={s.content}>
        {sections.map((section, idx) => (
          <View key={idx} style={s.section}>
            <Text style={s.sectionTitle}>{section.title}</Text>
            {section.items.map((item) => {
              const isSelected = active === item.id;
              return (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => {
                    setActive(item.id);
                    onSelect?.(item.id);
                  }}
                  style={({ pressed }) => [
                    s.navItem,
                    isSelected && { backgroundColor: colors.canvas },
                    pressed &&
                      !isSelected && { backgroundColor: colors.canvas },
                  ]}
                >
                  <Icon
                    name={item.icon}
                    size={16}
                    color={isSelected ? colors.ink : colors.muted}
                  />
                  <Text
                    style={[
                      s.navLabel,
                      isSelected && { color: colors.ink, fontWeight: "600" },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.badge && (
                    <View
                      style={[
                        s.badgeWrap,
                        isSelected && { backgroundColor: accent },
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
    </View>
  );
}

const s = StyleSheet.create({
  drawerContainer: {
    width: "100%",
    maxWidth: 320,
    maxHeight: 600,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0px 8px 24px rgba(35, 38, 33, 0.05)",
  },
  header: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  brandGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandMark: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
  scrollArea: {
    flexGrow: 0,
  },
  content: {
    padding: 14,
    gap: 16,
  },
  section: {
    gap: 3,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  navItem: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    ...(Platform.OS === "web" ? { cursor: "pointer" as any } : {}),
  },
  navLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.muted,
    fontWeight: "500",
  },
  badgeWrap: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    backgroundColor: colors.line,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.ink,
  },
});
