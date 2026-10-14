import React, { useState } from "react";
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
import { colors } from "./theme";
import { Icon, IconName } from "./Icon";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  /** Button content / label */
  children?: React.ReactNode;
  /** Optional title text (alternative to children) */
  title?: string;
  /** Callback fired when pressed */
  onPress?: () => void;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Accent color for secondary variant (defaults to colors.lime) */
  accent?: string;
  /** Optional icon name */
  icon?: IconName;
  /** Icon position relative to label (defaults to "right") */
  iconPosition?: "left" | "right";
  /** Disables interactions */
  disabled?: boolean;
  /** Shows loading indicator and disables interactions */
  loading?: boolean;
  /** Optional accessibility label override */
  accessibilityLabel?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom label text style */
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  children,
  title,
  onPress,
  variant = "primary",
  size = "md",
  accent = colors.lime,
  icon,
  iconPosition = "right",
  disabled = false,
  loading = false,
  accessibilityLabel,
  style,
  textStyle,
}: ButtonProps) {
  const [focused, setFocused] = useState(false);
  const inactive = !!disabled || !!loading;

  const content = title !== undefined ? title : children;
  const accessibleText =
    accessibilityLabel ||
    (typeof content === "string" ? content : undefined);

  const foreground =
    variant === "primary" || variant === "danger"
      ? "#ffffff"
      : colors.ink;

  const isSm = size === "sm";
  const isLg = size === "lg";

  const sizeStyle = isSm ? s.sizeSm : isLg ? s.sizeLg : s.sizeMd;
  const textSizeStyle = isSm ? s.textSm : isLg ? s.textLg : s.textMd;
  const iconSize = isSm ? 15 : isLg ? 18 : 16;

  const getBackgroundColor = (hovered: boolean, pressed: boolean) => {
    if (variant === "primary") return colors.ink;
    if (variant === "danger") return colors.danger;
    if (variant === "secondary") return accent;
    if ((variant === "outline" || variant === "ghost") && (hovered || pressed)) {
      return colors.canvas;
    }
    return "transparent";
  };

  const getBorderColor = () => {
    if (focused) return colors.ink;
    if (variant === "outline") return colors.line;
    return "transparent";
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibleText}
      accessibilityState={{
        disabled: inactive,
        busy: !!loading,
      }}
      disabled={inactive}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onPress={onPress}
      style={({ pressed, hovered }: any) => [
        s.button,
        sizeStyle,
        {
          backgroundColor: getBackgroundColor(hovered, pressed),
          borderColor: getBorderColor(),
          opacity: inactive && !loading ? 0.45 : pressed ? 0.75 : 1,
          transform: [{ scale: pressed && !inactive ? 0.98 : 1 }],
        },
        {
          outlineWidth: 0,
          outlineColor: "transparent",
          ...(Platform.OS === "web"
            ? ({
                cursor: inactive ? "not-allowed" : "pointer",
                outlineStyle: focused ? "solid" : "none",
                outlineWidth: focused ? 2 : 0,
                outlineColor: focused ? colors.ink : "transparent",
                outlineOffset: 2,
              } as any)
            : {}),
        },
        style,
      ]}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={foreground}
          style={s.loadingSpinner}
        />
      )}

      {icon && iconPosition === "left" && !loading && (
        <Icon name={icon} size={iconSize} color={foreground} />
      )}

      {typeof content === "string" ? (
        <Text
          numberOfLines={1}
          style={[
            s.text,
            textSizeStyle,
            { color: foreground },
            textStyle,
          ]}
        >
          {content}
        </Text>
      ) : (
        content
      )}

      {icon && iconPosition === "right" && !loading && (
        <Icon name={icon} size={iconSize} color={foreground} />
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  button: {
    maxWidth: "100%",
    borderRadius: 30,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  sizeSm: {
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sizeMd: {
    minHeight: 44,
    paddingHorizontal: 20,
    paddingVertical: 11,
  },
  sizeLg: {
    minHeight: 52,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  text: {
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "center",
  },
  textSm: {
    fontSize: 13,
    letterSpacing: -0.1,
  },
  textMd: {
    fontSize: 14,
    letterSpacing: -0.2,
  },
  textLg: {
    fontSize: 15,
    letterSpacing: -0.2,
  },
  loadingSpinner: {
    marginRight: 2,
  },
});
