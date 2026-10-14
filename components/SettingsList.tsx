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
import { colors, cardShadow } from "./theme";
import { Icon, IconName } from "./Icon";
import { Switch } from "./Switch";
import { Badge } from "./Badge";

export interface SettingsItem {
  id: string;
  label: string;
  description?: string;
  icon?: IconName;
  type: "toggle" | "link" | "value" | "button";
  value?: string | boolean;
  onValueChange?: (val: boolean) => void;
  onPress?: () => void;
  badge?: string;
  badgeTone?: "neutral" | "lavender" | "success" | "warning" | "danger";
  destructive?: boolean;
  disabled?: boolean;
}

export interface SettingsSection {
  id: string;
  title?: string;
  description?: string;
  items: SettingsItem[];
}

export interface SettingsListProps {
  /** Array of settings sections */
  sections: SettingsSection[];
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Card section container style */
  cardStyle?: StyleProp<ViewStyle>;
  /** Section title text style */
  sectionTitleStyle?: StyleProp<TextStyle>;
}

export function SettingsList({
  sections,
  style,
  cardStyle,
  sectionTitleStyle,
}: SettingsListProps) {
  return (
    <View style={[s.container, style]}>
      {sections.map((section, secIdx) => (
        <View
          key={section.id}
          style={[s.section, secIdx > 0 && s.sectionMargin]}
        >
          {section.title && (
            <Text style={[s.sectionTitle, sectionTitleStyle]}>
              {section.title}
            </Text>
          )}

          <View style={[s.card, cardStyle]}>
            {section.items.map((item, itemIdx) => {
              const isLast = itemIdx === section.items.length - 1;
              const isInteractive =
                item.type === "link" ||
                item.type === "button" ||
                (item.type === "value" && !!item.onPress);

              const content = (
                <View
                  style={[
                    s.row,
                    !isLast && s.rowDivider,
                    item.disabled && s.rowDisabled,
                  ]}
                >
                  {/* Left Icon */}
                  {item.icon && (
                    <View
                      style={[
                        s.iconWrap,
                        item.destructive && s.iconWrapDestructive,
                      ]}
                    >
                      <Icon
                        name={item.icon}
                        size={16}
                        color={item.destructive ? colors.danger : colors.ink}
                      />
                    </View>
                  )}

                  {/* Label & Description */}
                  <View style={s.labelCol}>
                    <Text
                      style={[s.label, item.destructive && s.labelDestructive]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                    {item.description && (
                      <Text style={s.description} numberOfLines={2}>
                        {item.description}
                      </Text>
                    )}
                  </View>

                  {/* Right Accessory */}
                  <View style={s.accessoryCol}>
                    {item.badge && (
                      <Badge tone={item.badgeTone || "neutral"} dot={false}>
                        {item.badge}
                      </Badge>
                    )}

                    {item.type === "toggle" && (
                      <Switch
                        value={!!item.value}
                        onChange={(v) => item.onValueChange?.(v)}
                        disabled={item.disabled}
                      />
                    )}

                    {item.type === "value" && (
                      <Text style={s.valueText} numberOfLines={1}>
                        {String(item.value ?? "")}
                      </Text>
                    )}

                    {item.type === "link" && (
                      <Icon
                        name="chevronRight"
                        size={14}
                        color={colors.muted}
                      />
                    )}
                  </View>
                </View>
              );

              if (isInteractive && !item.disabled) {
                return (
                  <Pressable
                    key={item.id}
                    onPress={item.onPress}
                    accessibilityRole="button"
                    accessibilityLabel={item.label}
                    accessibilityState={{ disabled: item.disabled }}
                    style={({ pressed, hovered }: any) => [
                      s.pressable,
                      (hovered || pressed) && s.pressed,
                    ]}
                  >
                    {content}
                  </Pressable>
                );
              }

              return <View key={item.id}>{content}</View>;
            })}
          </View>

          {section.description && (
            <Text style={s.sectionFooterText}>{section.description}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
  },
  section: {
    gap: 6,
  },
  sectionMargin: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 12,
  },
  sectionFooterText: {
    fontSize: 12,
    color: colors.muted,
    paddingHorizontal: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  card: {
    backgroundColor: colors.paper,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    ...cardShadow,
  },
  pressable: {
    backgroundColor: colors.paper,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  pressed: {
    backgroundColor: colors.canvas,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    minHeight: 48,
    gap: 12,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconWrapDestructive: {
    backgroundColor: colors.dangerBg,
  },
  labelCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.ink,
    flexShrink: 1,
  },
  labelDestructive: {
    color: colors.danger,
    fontWeight: "600",
  },
  description: {
    fontSize: 12,
    color: colors.muted,
    lineHeight: 16,
    flexShrink: 1,
  },
  accessoryCol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  valueText: {
    fontSize: 13,
    color: colors.muted,
  },
});
