import React, { useId, useState } from "react";
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
import Svg, { ClipPath, Defs, Path, Rect } from "react-native-svg";

export interface RatingProps {
  /** Controlled rating value */
  value?: number;
  /** Uncontrolled initial rating */
  defaultValue?: number;
  /** Callback fired when rating changes */
  onChange?: (value: number) => void;
  /** Callback alias */
  onRate?: (value: number) => void;
  /** Maximum number of stars */
  max?: number;
  /** Icon size */
  size?: number;
  /** Read-only mode where stars cannot be clicked */
  readOnly?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Star filled color */
  accent?: string;
  /** Whether to show numeric score text */
  showScore?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Score text style */
  scoreStyle?: StyleProp<TextStyle>;
}

export function Rating({
  value: controlledValue,
  defaultValue = 0,
  onChange,
  onRate,
  max = 5,
  size = 20,
  readOnly = false,
  disabled = false,
  accent = "#e8b839", // warm honey gold
  showScore = false,
  style,
  scoreStyle,
}: RatingProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const activeValue = isControlled ? controlledValue : internalValue;

  const clipId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const limit = Number.isFinite(max) ? Math.max(1, Math.floor(max)) : 5;
  const score = Math.max(
    0,
    Math.min(limit, Number.isFinite(activeValue) ? activeValue : 0),
  );
  const inactive = readOnly || disabled || (!onChange && !onRate);
  const stars = Array.from({ length: limit }, (_, i) => i + 1);

  const handleRate = (star: number) => {
    if (inactive) return;
    if (!isControlled) {
      setInternalValue(star);
    }
    onChange?.(star);
    onRate?.(star);
  };

  return (
    <View
      accessible={inactive}
      accessibilityLabel={
        inactive ? `${score} out of ${limit} stars` : undefined
      }
      style={[s.container, style]}
    >
      <View style={s.starsRow}>
        {stars.map((star) => {
          const fill = Math.max(0, Math.min(1, score - star + 1));

          return (
            <Pressable
              key={star}
              disabled={inactive}
              accessible={!inactive}
              accessibilityRole={inactive ? undefined : "radio"}
              accessibilityState={{ checked: star === Math.round(score) }}
              accessibilityLabel={`Rate ${star} of ${limit} stars`}
              onPress={() => handleRate(star)}
              style={({ pressed, hovered }: any) => [
                s.starPressable,
                !inactive && { minWidth: 44, minHeight: 44 },
                (pressed || hovered) && !inactive && { transform: [{ scale: 1.15 }] },
                inactive && s.readOnly,
              ]}
            >
              <Svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                accessible={false}
                fill="none"
                stroke={colors.muted}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Defs>
                  <ClipPath id={`${clipId}-${star}`}>
                    <Rect x={0} y={0} width={24 * fill} height={24} />
                  </ClipPath>
                </Defs>
                <Path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                <Path
                  d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={accent}
                  stroke={accent}
                  clipPath={`url(#${clipId}-${star})`}
                />
              </Svg>
            </Pressable>
          );
        })}
      </View>
      {showScore && (
        <Text style={[s.scoreText, scoreStyle]}>
          {score.toFixed(1)} <Text style={s.maxText}>/ {limit}</Text>
        </Text>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  starsRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  starPressable: {
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  readOnly: {
    ...(Platform.OS === "web" ? ({ cursor: "default" } as any) : {}),
  },
  scoreText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    marginLeft: 4,
  },
  maxText: {
    fontSize: 11,
    fontWeight: "400",
    color: colors.muted,
  },
});
