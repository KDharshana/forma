import React from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors, cardShadow } from "./theme";

export interface CardProps {
  /** Optional title for the card header */
  title?: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Optional badge component placed next to the title */
  badge?: React.ReactNode;
  /** Optional header action element (button, icon, menu) */
  action?: React.ReactNode;
  /** Primary card body content */
  children?: React.ReactNode;
  /** Optional bottom footer content */
  footer?: React.ReactNode;
  /** Visual surface variant (defaults to "surface") */
  variant?: "surface" | "outlined" | "elevated";
  /** Optional press handler making the entire card clickable */
  onPress?: () => void;
  /** Disables press interaction */
  disabled?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom content body style */
  contentStyle?: StyleProp<ViewStyle>;
  /** Custom header container style */
  headerStyle?: StyleProp<ViewStyle>;
  /** Custom footer container style */
  footerStyle?: StyleProp<ViewStyle>;
}

export function Card({
  title,
  subtitle,
  badge,
  action,
  children,
  footer,
  variant = "surface",
  onPress,
  disabled = false,
  style,
  contentStyle,
  headerStyle,
  footerStyle,
}: CardProps) {
  const cardContent = (
    <>
      {(title || subtitle || badge || action) && (
        <View style={[s.header, headerStyle]}>
          <View style={s.titleArea}>
            <View style={s.titleRow}>
              {title && (
                <Text numberOfLines={2} style={s.title}>
                  {title}
                </Text>
              )}
              {badge}
            </View>
            {subtitle && (
              <Text numberOfLines={2} style={s.subtitle}>
                {subtitle}
              </Text>
            )}
          </View>
          {action && <View style={s.actionArea}>{action}</View>}
        </View>
      )}

      {children && <View style={[s.content, contentStyle]}>{children}</View>}

      {footer && <View style={[s.footer, footerStyle]}>{footer}</View>}
    </>
  );

  const containerStyles = [
    s.card,
    variant === "outlined" && s.cardOutlined,
    variant === "elevated" && s.cardElevated,
    disabled && s.cardDisabled,
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title || "Card"}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        style={({ pressed, hovered }: any) => [
          containerStyles,
          pressed && !disabled && { opacity: 0.85 },
          hovered && !disabled && s.cardHovered,
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
        ]}
      >
        {cardContent}
      </Pressable>
    );
  }

  return <View style={containerStyles}>{cardContent}</View>;
}

const s = StyleSheet.create({
  card: {
    backgroundColor: colors.paper,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 20,
    width: "100%",
  },
  cardOutlined: {
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  cardElevated: {
    shadowColor: "#242b1d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
    ...cardShadow,
  },
  cardDisabled: {
    opacity: 0.55,
  },
  cardHovered: {
    borderColor: colors.muted,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  titleArea: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.3,
  },
  subtitle: {
    flexShrink: 1,
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
    lineHeight: 16,
  },
  actionArea: {
    alignSelf: "flex-start",
    flexShrink: 0,
  },
  content: {
    width: "100%",
  },
  footer: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
});
