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

export type BadgeTone =
  | "success"
  | "warning"
  | "neutral"
  | "lavender"
  | "danger"
  | "info"
  | "lime";

export interface BadgeProps {
  /** Content to display inside the badge */
  children?: React.ReactNode;
  /** Convenient string label alternative to children */
  label?: string;
  /** Color theme tone */
  tone?: BadgeTone;
  /** Whether to show a colored indicator dot */
  dot?: boolean;
  /** Badge size preset */
  size?: "sm" | "md";
  /** Optional click handler */
  onPress?: () => void;
  /** Disables click interaction */
  disabled?: boolean;
  /** Optional custom accessibility label */
  accessibilityLabel?: string;
  /** Custom badge container style */
  style?: StyleProp<ViewStyle>;
  /** Custom label text style */
  textStyle?: StyleProp<TextStyle>;
}

const toneMap: Record<BadgeTone, [string, string]> = {
  success: [colors.successBg, colors.success],
  warning: [colors.warningBg, colors.warning],
  neutral: ["#f0f1ed", colors.muted],
  lavender: [colors.lavender, colors.ink],
  danger: [colors.dangerBg, colors.danger],
  info: [colors.infoBg, colors.info],
  lime: ["#f2f9db", "#4d6b15"],
};

export function Badge({
  children,
  label,
  tone = "neutral",
  dot = true,
  size = "md",
  onPress,
  disabled = false,
  accessibilityLabel,
  style,
  textStyle,
}: BadgeProps) {
  const [backgroundColor, color] = toneMap[tone] || toneMap.neutral;
  const isSm = size === "sm";
  const content = label !== undefined ? label : children;
  const accessibleText =
    accessibilityLabel ||
    (typeof content === "string" ? `${tone} badge: ${content}` : `${tone} badge`);

  const inner = (
    <>
      {dot && (
        <View
          style={[
            s.dot,
            isSm && s.dotSm,
            { backgroundColor: color },
          ]}
        />
      )}
      {typeof content === "string" ? (
        <Text
          numberOfLines={1}
          style={[
            s.text,
            isSm && s.textSm,
            { color },
            textStyle,
          ]}
        >
          {content}
        </Text>
      ) : (
        content
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibleText}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        hitSlop={
          isSm
            ? { top: 12, bottom: 12, left: 10, right: 10 }
            : { top: 9, bottom: 9, left: 8, right: 8 }
        }
        style={({ pressed, hovered }: any) => [
          s.badge,
          isSm && s.badgeSm,
          { backgroundColor },
          pressed && { opacity: 0.75 },
          hovered && !disabled && { opacity: 0.9 },
          disabled && { opacity: 0.5 },
          {
            outlineWidth: 0,
            outlineColor: "transparent",
            ...(Platform.OS === "web"
              ? ({
                  cursor: disabled ? "not-allowed" : "pointer",
                  outlineStyle: "none",
                } as any)
              : {}),
          },
          style,
        ]}
      >
        {inner}
      </Pressable>
    );
  }

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibleText}
      style={[
        s.badge,
        isSm && s.badgeSm,
        { backgroundColor },
        style,
      ]}
    >
      {inner}
    </View>
  );
}

const s = StyleSheet.create({
  badge: {
    maxWidth: "100%",
    flexShrink: 1,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeSm: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  dotSm: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  text: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: -0.1,
  },
  textSm: {
    fontSize: 11,
    lineHeight: 14,
  },
});
