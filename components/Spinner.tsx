import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "./theme";

export interface SpinnerProps {
  /** Spinner size variant or custom number in px */
  size?: "sm" | "md" | "lg" | number;
  /** Custom spinner accent stroke color */
  color?: string;
  /** Stroke thickness in px */
  strokeWidth?: number;
  /** Optional visible text label */
  label?: string;
  /** Accessible label description */
  accessibilityLabel?: string;
  /** Layout direction when label is present */
  direction?: "row" | "column";
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Label text style */
  labelStyle?: StyleProp<TextStyle>;
}

export function Spinner({
  size = "md",
  color = colors.ink,
  strokeWidth = 2.5,
  label,
  accessibilityLabel = "Loading",
  direction = "row",
  style,
  labelStyle,
}: SpinnerProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active) setReduceMotion(value);
    });
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => {
      active = false;
      listener.remove();
    };
  }, []);

  const spinValue = useRef(new Animated.Value(0)).current;

  const dimension =
    typeof size === "number"
      ? Math.max(8, Number.isFinite(size) ? size : 24)
      : size === "sm"
        ? 16
        : size === "lg"
          ? 36
          : 24;

  useEffect(() => {
    if (reduceMotion) {
      spinValue.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 850,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spinValue, reduceMotion]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const calculatedStrokeWidth = Math.max(
    1,
    Math.min(dimension / 4, Number.isFinite(strokeWidth) ? strokeWidth : 2.5),
  );
  const radius = (dimension - calculatedStrokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  const spinnerSvg = (
    <Animated.View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ busy: true }}
      style={[
        s.spinnerBox,
        {
          width: dimension,
          height: dimension,
          transform: [{ rotate: spin }],
        },
      ]}
    >
      <Svg width={dimension} height={dimension}>
        <Circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke={colors.line}
          strokeWidth={calculatedStrokeWidth}
          fill="none"
        />
        <Circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          stroke={color}
          strokeWidth={calculatedStrokeWidth}
          strokeDasharray={`${circumference * 0.3} ${circumference * 0.7}`}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </Animated.View>
  );

  if (label) {
    return (
      <View
        style={[
          s.wrapper,
          direction === "column" ? s.wrapperCol : s.wrapperRow,
          style,
        ]}
      >
        {spinnerSvg}
        <Text style={[s.label, labelStyle]}>{label}</Text>
      </View>
    );
  }

  return <View style={[s.container, style]}>{spinnerSvg}</View>;
}

const s = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  wrapperRow: {
    flexDirection: "row",
  },
  wrapperCol: {
    flexDirection: "column",
  },
  label: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: "500",
  },
});
