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

export interface SwipeAction {
  id: string;
  label: string;
  icon?: IconName;
  variant?: "danger" | "primary" | "neutral";
  onPress: () => void;
}

export interface SwipeableRowProps {
  /** Row body content */
  children: React.ReactNode;
  /** Right-hand swipe actions */
  rightActions?: SwipeAction[];
  /** Left-hand swipe actions */
  leftActions?: SwipeAction[];
  /** Controlled revealed state */
  revealed?: boolean;
  /** Uncontrolled initial revealed state */
  defaultRevealed?: boolean;
  /** Callback fired when actions tray reveal state toggles */
  onRevealChange?: (revealed: boolean) => void;
  /** Whether the swipeable actions are disabled */
  disabled?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Content wrapper style */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Actions tray container style */
  actionsTrayStyle?: StyleProp<ViewStyle>;
}

export function SwipeableRow({
  children,
  rightActions = [],
  leftActions = [],
  revealed: controlledRevealed,
  defaultRevealed = false,
  onRevealChange,
  disabled = false,
  style,
  contentContainerStyle,
  actionsTrayStyle,
}: SwipeableRowProps) {
  const isControlled = controlledRevealed !== undefined;
  const [internalRevealed, setInternalRevealed] = useState(defaultRevealed);
  const isRevealed = isControlled ? controlledRevealed : internalRevealed;

  const toggleReveal = () => {
    if (disabled) return;
    const next = !isRevealed;
    if (!isControlled) {
      setInternalRevealed(next);
    }
    onRevealChange?.(next);
  };

  const getActionBg = (variant?: string) => {
    if (variant === "danger") return colors.dangerBg;
    if (variant === "primary") return colors.lime;
    return colors.canvas;
  };

  const getActionColor = (variant?: string) => {
    if (variant === "danger") return colors.danger;
    if (variant === "primary") return colors.ink;
    return colors.ink;
  };

  const hasActions = rightActions.length > 0 || leftActions.length > 0;

  return (
    <View style={[s.container, disabled && s.containerDisabled, style]}>
      <View style={s.mainRow}>
        <View style={[s.contentWrap, contentContainerStyle]}>{children}</View>

        {/* Action Toggle */}
        {hasActions && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isRevealed ? "Hide actions" : "Show actions"}
            accessibilityState={{ expanded: isRevealed, disabled }}
            disabled={disabled}
            onPress={toggleReveal}
            style={({ pressed, hovered }: any) => [
              s.triggerBtn,
              (hovered || pressed) && !disabled && { opacity: 0.75 },
              isRevealed && s.triggerBtnActive,
            ]}
          >
            <Icon
              name={isRevealed ? "close" : "moreVertical"}
              size={16}
              color={colors.muted}
            />
          </Pressable>
        )}
      </View>

      {/* Revealed Actions Tray */}
      {isRevealed && !disabled && (
        <View style={[s.actionsTray, actionsTrayStyle]}>
          {leftActions.map((act) => (
            <Pressable
              key={act.id}
              accessibilityRole="button"
              accessibilityLabel={act.label}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              onPress={() => {
                act.onPress();
                toggleReveal();
              }}
              style={({ pressed, hovered }: any) => [
                s.actionBtn,
                { backgroundColor: getActionBg(act.variant) },
                (hovered || pressed) && { opacity: 0.8 },
              ]}
            >
              {act.icon && (
                <Icon
                  name={act.icon}
                  size={15}
                  color={getActionColor(act.variant)}
                />
              )}
              <Text
                style={[s.actionText, { color: getActionColor(act.variant) }]}
              >
                {act.label}
              </Text>
            </Pressable>
          ))}

          {rightActions.map((act) => (
            <Pressable
              key={act.id}
              accessibilityRole="button"
              accessibilityLabel={act.label}
              hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              onPress={() => {
                act.onPress();
                toggleReveal();
              }}
              style={({ pressed, hovered }: any) => [
                s.actionBtn,
                { backgroundColor: getActionBg(act.variant) },
                (hovered || pressed) && { opacity: 0.8 },
              ]}
            >
              {act.icon && (
                <Icon
                  name={act.icon}
                  size={15}
                  color={getActionColor(act.variant)}
                />
              )}
              <Text
                style={[s.actionText, { color: getActionColor(act.variant) }]}
              >
                {act.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: colors.paper,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  mainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentWrap: {
    flex: 1,
    minWidth: 0,
  },
  triggerBtn: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  triggerBtnActive: {
    backgroundColor: colors.canvas,
  },
  actionsTray: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.canvas,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
    minHeight: 44,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
