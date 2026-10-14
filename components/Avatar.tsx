import React, { useEffect, useState } from "react";
import {
  Image,
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

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarStatus = "online" | "away" | "busy" | "offline";

export interface AvatarProps {
  /** Name of the person, used for initials fallback and accessibility */
  name: string;
  /** Image URL for remote avatar */
  imageUri?: string;
  /** Preset size or numeric pixel diameter */
  size?: AvatarSize | number;
  /** Optional status dot indicator */
  status?: AvatarStatus;
  /** Optional click/press handler */
  onPress?: () => void;
  /** Disables click interaction */
  disabled?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom initials text style */
  textStyle?: StyleProp<TextStyle>;
}

const statusColors: Record<AvatarStatus, string> = {
  online: colors.success,
  away: colors.warning,
  busy: colors.danger,
  offline: colors.muted,
};

const palette = [
  "#d4ef78", // lime
  "#d9cafa", // lavender
  "#c3e6df", // teal
  "#f2ccaa", // apricot
  "#cad7bf", // sage
  "#edd9dc", // rose
];

export function Avatar({
  name,
  imageUri,
  size = "md",
  status,
  onPress,
  disabled = false,
  style,
  textStyle,
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [imageUri]);

  const dimension =
    typeof size === "number"
      ? Math.max(16, Number.isFinite(size) ? size : 36)
      : size === "sm"
        ? 28
        : size === "lg"
          ? 44
          : size === "xl"
            ? 60
            : 36;

  const initials = (name || "")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Deterministic palette pick
  let hash = 0;
  for (let i = 0; i < (name || "").length; i++) hash += name.charCodeAt(i);
  const bgColor = palette[hash % palette.length];

  const dotSize = Math.max(8, Math.round(dimension * 0.25));
  // Guarantee minimum 11px font size
  const fontSize = Math.max(11, Math.round(dimension * 0.38));

  const content = (
    <View
      style={[
        s.container,
        { width: dimension, height: dimension, borderRadius: dimension / 2 },
      ]}
    >
      {imageUri && !failed ? (
        <Image
          source={{ uri: imageUri }}
          onError={() => setFailed(true)}
          style={[
            s.image,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
            },
          ]}
        />
      ) : (
        <View
          style={[
            s.fallback,
            {
              width: dimension,
              height: dimension,
              borderRadius: dimension / 2,
              backgroundColor: bgColor,
            },
          ]}
        >
          <Text
            style={[
              s.initials,
              { fontSize },
              textStyle,
            ]}
          >
            {initials || "•"}
          </Text>
        </View>
      )}

      {status && (
        <View
          accessibilityLabel={`Status: ${status}`}
          style={[
            s.statusDot,
            {
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: statusColors[status],
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
    </View>
  );

  if (onPress) {
    const hitPadding = dimension < 44 ? Math.ceil((44 - dimension) / 2) : 0;
    const hitSlop =
      hitPadding > 0
        ? {
            top: hitPadding,
            bottom: hitPadding,
            left: hitPadding,
            right: hitPadding,
          }
        : undefined;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${name || "Avatar"}${status ? `, ${status}` : ""}`}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        hitSlop={hitSlop}
        style={({ pressed, hovered }: any) => [
          s.pressableWrapper,
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
        {content}
      </Pressable>
    );
  }

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`${name || "Avatar"}${status ? `, ${status}` : ""}`}
      style={[s.wrapper, style]}
    >
      {content}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    alignSelf: "flex-start",
  },
  pressableWrapper: {
    alignSelf: "flex-start",
  },
  container: {
    position: "relative",
    overflow: "visible",
  },
  image: {
    resizeMode: "cover",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "600",
    color: colors.ink,
    textAlign: "center",
    includeFontPadding: false,
  },
  statusDot: {
    position: "absolute",
    borderWidth: 2,
    borderColor: colors.paper,
  },
});
