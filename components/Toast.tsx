import React, { useEffect, useRef } from "react";
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
import { Icon, IconName } from "./Icon";

export type ToastTone = "success" | "danger" | "warning" | "info" | "neutral";

export interface ToastProps {
  /** Optional title */
  title?: string;
  /** Toast message */
  message: string;
  /** Semantic color tone */
  tone?: ToastTone;
  /** Custom icon override */
  icon?: IconName;
  /** Action button text */
  actionText?: string;
  /** Action button callback */
  onAction?: () => void;
  /** Dismiss callback */
  onDismiss?: () => void;
  /** Auto-dismiss duration in milliseconds */
  durationMs?: number;
  /** Controlled visibility flag */
  visible?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Title text style */
  titleStyle?: StyleProp<TextStyle>;
  /** Message text style */
  messageStyle?: StyleProp<TextStyle>;
}

const toneStyles: Record<
  ToastTone,
  { bg: string; border: string; icon: IconName; iconColor: string }
> = {
  success: {
    bg: colors.successBg,
    border: colors.success,
    icon: "checkCircle",
    iconColor: colors.success,
  },
  danger: {
    bg: colors.dangerBg,
    border: colors.danger,
    icon: "alertCircle",
    iconColor: colors.danger,
  },
  warning: {
    bg: colors.warningBg,
    border: colors.warning,
    icon: "alertTriangle",
    iconColor: colors.warning,
  },
  info: {
    bg: colors.infoBg,
    border: colors.info,
    icon: "infoCircle",
    iconColor: colors.info,
  },
  neutral: {
    bg: colors.paper,
    border: colors.line,
    icon: "spark",
    iconColor: colors.ink,
  },
};

export function Toast({
  title,
  message,
  tone = "neutral",
  icon,
  actionText,
  onAction,
  onDismiss,
  durationMs,
  visible = true,
  style,
  titleStyle,
  messageStyle,
}: ToastProps) {
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;
  const conf = toneStyles[tone];
  const iconName = icon || conf.icon;

  useEffect(() => {
    if (!visible || !durationMs || durationMs < 0 || !onDismiss) return;
    const timer = setTimeout(() => {
      dismissRef.current?.();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [durationMs, message, title, visible, !!onDismiss]);

  if (!visible) return null;

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        s.container,
        { backgroundColor: conf.bg, borderColor: conf.border },
        style,
      ]}
    >
      <View style={s.iconWrap}>
        <Icon name={iconName} size={16} color={conf.iconColor} />
      </View>

      <View style={s.textContainer}>
        {title && (
          <Text style={[s.title, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        )}
        <Text style={[s.message, messageStyle]} numberOfLines={3}>
          {message}
        </Text>
      </View>

      {actionText && onAction && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={actionText}
          onPress={onAction}
          style={({ pressed, hovered }: any) => [
            s.actionBtn,
            (hovered || pressed) && { opacity: 0.8 },
          ]}
        >
          <Text style={s.actionText}>{actionText}</Text>
        </Pressable>
      )}

      {onDismiss && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss notification"
          onPress={onDismiss}
          style={({ pressed, hovered }: any) => [
            s.dismissBtn,
            (hovered || pressed) && { opacity: 0.7 },
          ]}
        >
          <Icon name="close" size={14} color={colors.ink} />
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
    width: "100%",
    maxWidth: 420,
    boxShadow: "0px 6px 20px rgba(35, 38, 33, 0.08)",
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  message: {
    fontSize: 12,
    color: colors.ink,
    lineHeight: 16,
    flexShrink: 1,
  },
  actionBtn: {
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    flexShrink: 0,
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
  dismissBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
});
