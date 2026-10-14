import React from "react";
import {
  ActivityIndicator,
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

export type FABVariant = "primary" | "dark" | "secondary" | "outline";
export type FABSize = "sm" | "md" | "lg";
export type FABPosition =
  | "bottom-right"
  | "bottom-left"
  | "bottom-center"
  | "relative";

export interface FABProps {
  /** Optional icon name (defaults to "plus") */
  icon?: IconName;
  /** Optional text label for extended FAB */
  label?: string;
  /** Color theme variant */
  variant?: FABVariant;
  /** Size preset */
  size?: FABSize;
  /** Positioning mode */
  position?: FABPosition;
  /** Callback fired when pressed */
  onPress?: () => void;
  /** Disables FAB interactions */
  disabled?: boolean;
  /** Shows loading indicator */
  loading?: boolean;
  /** Optional notification badge counter */
  badge?: string | number;
  /** Accessibility label override */
  accessibilityLabel?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom label text style */
  textStyle?: StyleProp<TextStyle>;
}

export function FAB({
  icon = "plus",
  label,
  variant = "primary",
  size = "md",
  position = "relative",
  onPress,
  disabled = false,
  loading = false,
  badge,
  accessibilityLabel,
  style,
  textStyle,
}: FABProps) {
  const isExtended = !!label;
  const isInactive = disabled || loading;

  const bgStyle = {
    primary: s.bgPrimary,
    dark: s.bgDark,
    secondary: s.bgSecondary,
    outline: s.bgOutline,
  }[variant];

  const textColor = {
    primary: colors.ink,
    dark: colors.paper,
    secondary: colors.ink,
    outline: colors.ink,
  }[variant];

  const iconColor = textColor;

  const sizeStyle = {
    sm: isExtended ? s.sizeExtendedSm : s.sizeSm,
    md: isExtended ? s.sizeExtendedMd : s.sizeMd,
    lg: isExtended ? s.sizeExtendedLg : s.sizeLg,
  }[size];

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  }[size];

  const posStyle = {
    "bottom-right": s.posBottomRight,
    "bottom-left": s.posBottomLeft,
    "bottom-center": s.posBottomCenter,
    relative: undefined,
  }[position];

  return (
    <View style={[posStyle, style]} pointerEvents="box-none">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          accessibilityLabel || label || "Floating action button"
        }
        accessibilityState={{ disabled: isInactive, busy: loading }}
        disabled={isInactive}
        onPress={onPress}
        style={({ pressed, hovered }: any) => [
          s.base,
          bgStyle,
          sizeStyle,
          (hovered || pressed) && !isInactive && { opacity: 0.9 },
          pressed && !isInactive && s.pressed,
          isInactive && s.disabled,
          {
            outlineWidth: 0,
            outlineColor: "transparent",
            ...(Platform.OS === "web"
              ? ({
                  cursor: isInactive ? "not-allowed" : "pointer",
                  outlineStyle: "none",
                } as any)
              : {}),
          },
        ]}
      >
        <View style={s.contentRow}>
          {loading ? (
            <ActivityIndicator size="small" color={textColor} />
          ) : (
            icon && (
              <Icon
                name={icon}
                size={iconSize}
                color={disabled ? colors.muted : iconColor}
              />
            )
          )}
          {label && (
            <Text
              style={[
                s.label,
                { color: disabled ? colors.muted : textColor },
                size === "sm" && s.labelSm,
                size === "lg" && s.labelLg,
                textStyle,
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          )}
        </View>

        {badge !== undefined && (
          <View style={s.badge}>
            <Text style={s.badgeText}>{badge}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "transparent",
    ...cardShadow,
    ...Platform.select({
      web: {
        userSelect: "none",
        transition:
          "transform 150ms ease, box-shadow 150ms ease, opacity 150ms ease",
      },
      default: {
        elevation: 6,
      },
    }),
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  disabled: {
    opacity: 0.45,
  },

  // Variants
  bgPrimary: {
    backgroundColor: colors.lime,
    borderColor: "#c1dd62",
  },
  bgDark: {
    backgroundColor: colors.ink,
    borderColor: colors.ink,
  },
  bgSecondary: {
    backgroundColor: colors.canvas,
    borderColor: colors.line,
  },
  bgOutline: {
    backgroundColor: colors.paper,
    borderColor: colors.ink,
  },

  // Sizes (Icon only)
  sizeSm: {
    width: 44,
    height: 44,
  },
  sizeMd: {
    width: 52,
    height: 52,
  },
  sizeLg: {
    width: 60,
    height: 60,
  },

  // Sizes (Extended with Label)
  sizeExtendedSm: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sizeExtendedMd: {
    minHeight: 52,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sizeExtendedLg: {
    minHeight: 60,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },

  // Label text
  label: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  labelSm: {
    fontSize: 13,
  },
  labelLg: {
    fontSize: 15,
  },

  // Positions
  posBottomRight: {
    position: "absolute",
    right: 20,
    bottom: 24,
    zIndex: 99,
  },
  posBottomLeft: {
    position: "absolute",
    left: 20,
    bottom: 24,
    zIndex: 99,
  },
  posBottomCenter: {
    position: "absolute",
    left: "50%",
    bottom: 24,
    transform: [{ translateX: -50 }],
    zIndex: 99,
  },

  // Badge counter
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.paper,
  },
  badgeText: {
    color: colors.paper,
    fontSize: 11,
    fontWeight: "700",
  },
});
