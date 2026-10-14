import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";

export interface DividerProps {
  /** Optional text label centered between divider lines */
  label?: string;
  /** Layout orientation (defaults to "horizontal") */
  orientation?: "horizontal" | "vertical";
  /** Margin spacing (vertical for horizontal, horizontal for vertical) */
  spacing?: number;
  /** Line thickness in pixels (defaults to 1) */
  thickness?: number;
  /** Custom line color override (defaults to colors.line) */
  color?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom label text style */
  labelStyle?: StyleProp<TextStyle>;
}

export function Divider({
  label,
  orientation = "horizontal",
  spacing = 16,
  thickness = 1,
  color = colors.line,
  style,
  labelStyle,
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <View
        role="separator"
        aria-orientation="vertical"
        style={[
          s.verticalLine,
          {
            width: thickness,
            backgroundColor: color,
            marginHorizontal: spacing,
          },
          style,
        ]}
      />
    );
  }

  if (label) {
    return (
      <View
        role="separator"
        style={[s.containerWithLabel, { marginVertical: spacing }, style]}
      >
        <View
          style={[
            s.line,
            { height: thickness, backgroundColor: color, flex: 1, width: undefined },
          ]}
        />
        <Text numberOfLines={1} style={[s.label, labelStyle]}>
          {label}
        </Text>
        <View
          style={[
            s.line,
            { height: thickness, backgroundColor: color, flex: 1, width: undefined },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      role="separator"
      style={[
        s.line,
        {
          height: thickness,
          backgroundColor: color,
          marginVertical: spacing,
        },
        style,
      ]}
    />
  );
}

const s = StyleSheet.create({
  line: {
    backgroundColor: colors.line,
    width: "100%",
  },
  verticalLine: {
    minHeight: 20,
    backgroundColor: colors.line,
    alignSelf: "stretch",
  },
  containerWithLabel: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 12,
  },
  label: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
});
