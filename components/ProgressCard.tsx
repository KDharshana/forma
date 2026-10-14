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
import Svg, { Circle } from "react-native-svg";
import { colors, cardShadow } from "./theme";

export interface ProgressCardProps {
  /** Progress percentage value (0 to 100) */
  value: number;
  /** Primary card title or motivational text */
  title?: string;
  /** Subtitle or goal description */
  subtitle?: string;
  /** Accent highlight color for the progress ring */
  accent?: string;
  /** Optional click handler making card interactive */
  onPress?: () => void;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Title text style */
  titleStyle?: StyleProp<TextStyle>;
  /** Subtitle text style */
  subtitleStyle?: StyleProp<TextStyle>;
}

export function ProgressCard({
  value,
  title = "A little closer, every day.",
  subtitle = "Your weekly goal",
  accent = colors.lime,
  onPress,
  style,
  titleStyle,
  subtitleStyle,
}: ProgressCardProps) {
  const percent = Math.max(
    0,
    Math.min(100, Number.isFinite(value) ? value : 0),
  );
  const circumference = 2 * Math.PI * 54;

  const content = (
    <>
      <Text style={[s.subtitle, subtitleStyle]} numberOfLines={1}>
        {subtitle}
      </Text>
      <View
        style={s.ring}
        accessible
        accessibilityLabel={subtitle}
        accessibilityRole="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        accessibilityValue={{ min: 0, max: 100, now: percent }}
      >
        <Svg width={138} height={138} viewBox="0 0 138 138">
          <Circle
            cx={69}
            cy={69}
            r={54}
            stroke={colors.line}
            strokeWidth={10}
            fill="none"
          />
          <Circle
            cx={69}
            cy={69}
            r={54}
            stroke={accent}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={circumference * (1 - percent / 100)}
            transform="rotate(-90 69 69)"
          />
        </Svg>
        <View style={s.center}>
          <Text style={s.value}>
            {percent}
            <Text style={s.percent}>%</Text>
          </Text>
          <Text style={s.complete}>completed</Text>
        </View>
      </View>
      <Text style={[s.title, titleStyle]} numberOfLines={2}>
        {title}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed, hovered }: any) => [
          s.card,
          (pressed || hovered) && s.cardActive,
          style,
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[s.card, style]}>{content}</View>;
}

const s = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 20,
    alignItems: "center",
    ...cardShadow,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none" } as any)
      : {}),
  },
  cardActive: {
    backgroundColor: colors.canvas,
    transform: [{ scale: 0.995 }],
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  ring: {
    marginVertical: 8,
    width: 138,
    height: 138,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    position: "absolute",
    alignItems: "center",
  },
  value: {
    fontSize: 36,
    letterSpacing: -1.5,
    color: colors.ink,
    fontWeight: "600",
  },
  percent: {
    fontSize: 19,
    fontWeight: "400",
  },
  complete: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  title: {
    color: colors.ink,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 6,
    lineHeight: 20,
  },
});
