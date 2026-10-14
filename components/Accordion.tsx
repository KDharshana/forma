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
import { colors } from "./theme";
import { Icon, IconName } from "./Icon";

export interface AccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: IconName;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: React.ReactNode;
}

export interface AccordionProps {
  /** Array of accordion items */
  items: AccordionItem[];
  /** Controlled open item IDs */
  openIds?: string[];
  /** Default open item IDs for uncontrolled state */
  defaultOpenIds?: string[];
  /** Callback fired when open items change */
  onOpenChange?: (openIds: string[]) => void;
  /** Callback fired when an item is toggled */
  onToggle?: (id: string, isOpen: boolean) => void;
  /** Whether multiple items can be opened simultaneously */
  allowMultiple?: boolean;
  /** Accent color for active chevron badge */
  accent?: string;
  /** Disables the entire accordion */
  disabled?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom item card style */
  itemStyle?: StyleProp<ViewStyle>;
  /** Custom header style */
  headerStyle?: StyleProp<ViewStyle>;
  /** Custom content body style */
  bodyStyle?: StyleProp<ViewStyle>;
}

export function Accordion({
  items,
  openIds: controlledOpenIds,
  defaultOpenIds = [],
  onOpenChange,
  onToggle,
  allowMultiple = false,
  accent = colors.lime,
  disabled = false,
  style,
  itemStyle,
  headerStyle,
  bodyStyle,
}: AccordionProps) {
  const [internalOpenIds, setInternalOpenIds] = useState<string[]>(
    allowMultiple ? defaultOpenIds : defaultOpenIds.slice(0, 1),
  );

  const isControlled = controlledOpenIds !== undefined;
  const currentOpenIds = isControlled ? controlledOpenIds : internalOpenIds;

  const toggle = (id: string, itemDisabled?: boolean) => {
    if (disabled || itemDisabled) return;

    const isOpen = currentOpenIds.includes(id);
    let nextOpenIds: string[];

    if (isOpen) {
      nextOpenIds = currentOpenIds.filter((item) => item !== id);
    } else {
      nextOpenIds = allowMultiple ? [...currentOpenIds, id] : [id];
    }

    if (!isControlled) {
      setInternalOpenIds(nextOpenIds);
    }

    onOpenChange?.(nextOpenIds);
    onToggle?.(id, !isOpen);
  };

  return (
    <View style={[s.container, style]}>
      {items.map((item) => {
        const isOpen = currentOpenIds.includes(item.id);
        const itemDisabled = disabled || item.disabled;

        return (
          <View
            key={item.id}
            style={[
              s.card,
              isOpen && s.cardOpen,
              itemDisabled && s.cardDisabled,
              itemStyle,
            ]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.title}
              accessibilityState={{
                expanded: isOpen,
                disabled: !!itemDisabled,
              }}
              disabled={itemDisabled}
              onPress={() => toggle(item.id, item.disabled)}
              style={({ pressed, hovered }: any) => [
                s.header,
                (pressed || hovered) &&
                  !itemDisabled && { backgroundColor: colors.canvas },
                itemDisabled && { opacity: 0.55 },
                headerStyle,
              ]}
            >
              {item.icon && (
                <View style={s.iconWrap}>
                  <Icon name={item.icon} size={16} color={colors.ink} />
                </View>
              )}

              <View style={s.titleWrap}>
                <Text style={s.title}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={s.subtitle}>{item.subtitle}</Text>
                )}
              </View>

              {item.badge && <View style={s.badgeWrap}>{item.badge}</View>}

              <View
                style={[s.chevronWrap, isOpen && { backgroundColor: accent }]}
              >
                <Icon
                  name={isOpen ? "chevronUp" : "chevronDown"}
                  size={14}
                  color={colors.ink}
                />
              </View>
            </Pressable>

            {isOpen && (
              <View style={[s.body, bodyStyle]}>
                {typeof item.content === "string" ? (
                  <Text style={s.bodyText}>{item.content}</Text>
                ) : (
                  item.content
                )}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
    gap: 10,
  },
  card: {
    backgroundColor: colors.paper,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
  },
  cardOpen: {
    borderColor: colors.line,
  },
  cardDisabled: {
    backgroundColor: colors.canvas,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
    gap: 12,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({
          cursor: "pointer",
          outlineStyle: "none",
        } as any)
      : {}),
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
  titleWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
    flexShrink: 1,
  },
  badgeWrap: {
    flexShrink: 0,
  },
  chevronWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  bodyText: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },
});
