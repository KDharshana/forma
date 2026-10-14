import React, { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";

export interface SkeletonProps {
  /** Width dimension or percentage */
  width?: number | string;
  /** Height dimension or percentage */
  height?: number | string;
  /** Shape variant */
  variant?: "text" | "circular" | "rectangular";
  /** Border radius override */
  borderRadius?: number;
  /** Custom background skeleton color */
  color?: string;
  /** Loading state flag; if false and children are provided, renders children */
  loading?: boolean;
  /** Optional content rendered when loading is false */
  children?: React.ReactNode;
  /** Container style */
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({
  width = "100%",
  height = 16,
  variant = "text",
  borderRadius,
  color = colors.line,
  loading = true,
  children,
  style,
}: SkeletonProps) {
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

  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (reduceMotion) {
      pulseAnim.setValue(0.6);
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.9,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim, reduceMotion]);

  if (!loading && children) {
    return <>{children}</>;
  }

  const radius =
    borderRadius !== undefined
      ? borderRadius
      : variant === "circular"
        ? 999
        : variant === "text"
          ? 6
          : 12;

  const resolvedHeight =
    variant === "circular" && typeof width === "number" ? width : height;

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      accessibilityRole="none"
      accessibilityLabel="Loading..."
      aria-busy={true}
      style={[
        s.skeleton,
        {
          width: width as any,
          height: resolvedHeight as any,
          borderRadius: radius,
          backgroundColor: color,
          opacity: pulseAnim,
        },
        style,
      ]}
    />
  );
}

const s = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.line,
  },
});
