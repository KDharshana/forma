import React, { useRef, useState } from "react";
import {
  PanResponder,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";

export interface SliderProps {
  /** Controlled slider value */
  value?: number;
  /** Uncontrolled initial value */
  defaultValue?: number;
  /** Value change callback */
  onChange?: (value: number) => void;
  /** Change callback alias */
  onValueChange?: (value: number) => void;
  /** Minimum slider value */
  min?: number;
  /** Maximum slider value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Whether the slider is disabled */
  disabled?: boolean;
  /** Highlight accent color for filled track */
  accent?: string;
  /** Label above the slider */
  label?: string;
  /** Whether to display formatted value next to label */
  showValue?: boolean;
  /** Custom formatter function for value display */
  valueFormatter?: (value: number) => string;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Track background style */
  trackStyle?: StyleProp<ViewStyle>;
  /** Thumb knob style */
  thumbStyle?: StyleProp<ViewStyle>;
  /** Label text style */
  labelStyle?: StyleProp<TextStyle>;
  /** Value text style */
  valueStyle?: StyleProp<TextStyle>;
}

export function Slider({
  value: controlledValue,
  defaultValue,
  onChange,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  accent = colors.lime,
  label,
  showValue = true,
  valueFormatter = (v) => `${Math.round(v)}`,
  style,
  trackStyle,
  thumbStyle,
  labelStyle,
  valueStyle,
}: SliderProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<number>(defaultValue ?? min);
  const activeValue = isControlled ? controlledValue : internalValue;

  const trackWidthRef = useRef(1);

  const upper = Math.max(min, max);
  const interval = Number.isFinite(step) && step > 0 ? step : 1;
  const clampedValue = Math.min(
    Math.max(Number.isFinite(activeValue) ? activeValue : min, min),
    upper,
  );
  const percentage = upper === min ? 0 : (clampedValue - min) / (upper - min);
  const inactive = disabled || upper === min;

  const notifyChange = (newVal: number) => {
    if (!isControlled) {
      setInternalValue(newVal);
    }
    onChange?.(newVal);
    onValueChange?.(newVal);
  };

  const latest = useRef({ min, upper, interval, inactive, notifyChange });
  latest.current = { min, upper, interval, inactive, notifyChange };

  const trackLeftRef = useRef(0);

  const updateFromPosition = (pageX: number) => {
    const { min, upper, interval, inactive, notifyChange } = latest.current;
    if (inactive) return;
    const rawRatio = Math.max(
      0,
      Math.min(1, (pageX - trackLeftRef.current) / trackWidthRef.current),
    );
    const rawVal = min + rawRatio * (upper - min);
    const steppedVal = min + Math.round((rawVal - min) / interval) * interval;
    const finalVal = Number(Math.min(Math.max(steppedVal, min), upper).toFixed(8));
    notifyChange(finalVal);
  };

  const trackRef = useRef<View>(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !latest.current.inactive,
      onMoveShouldSetPanResponder: () => !latest.current.inactive,
      onPanResponderGrant: (evt) => {
        const pageXAtPress = evt.nativeEvent.pageX;
        trackRef.current?.measure((_x, _y, _width, _height, pageX) => {
          trackLeftRef.current = pageX;
          updateFromPosition(pageXAtPress);
        });
      },
      onPanResponderMove: (evt) => {
        updateFromPosition(evt.nativeEvent.pageX);
      },
    }),
  ).current;

  const adjust = (direction: number) => {
    if (!inactive) {
      const nextVal = Number(
        Math.max(
          min,
          Math.min(upper, clampedValue + direction * interval),
        ).toFixed(8),
      );
      notifyChange(nextVal);
    }
  };

  return (
    <View style={[s.container, inactive && s.disabled, style]}>
      {(label || showValue) && (
        <View style={s.header}>
          {label && (
            <Text style={[s.label, labelStyle]} numberOfLines={1}>
              {label}
            </Text>
          )}
          {showValue && (
            <Text style={[s.value, valueStyle]} numberOfLines={1}>
              {valueFormatter(clampedValue)}
            </Text>
          )}
        </View>
      )}

      <View
        ref={trackRef}
        accessible
        focusable={!inactive}
        accessibilityRole="adjustable"
        accessibilityLabel={label || "Value"}
        accessibilityState={{ disabled: inactive }}
        accessibilityValue={{
          min,
          max: upper,
          now: clampedValue,
          text: valueFormatter(clampedValue),
        }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(event) =>
          adjust(event.nativeEvent.actionName === "increment" ? 1 : -1)
        }
        {...(Platform.OS === "web"
          ? {
              tabIndex: inactive ? -1 : 0,
              onKeyDown: (event: {
                key: string;
                preventDefault: () => void;
              }) => {
                if (
                  [
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowLeft",
                    "ArrowDown",
                    "Home",
                    "End",
                  ].includes(event.key)
                ) {
                  event.preventDefault();
                  if (inactive) return;
                  if (event.key === "Home") notifyChange(min);
                  else if (event.key === "End") notifyChange(upper);
                  else
                    adjust(
                      ["ArrowRight", "ArrowUp"].includes(event.key) ? 1 : -1,
                    );
                }
              },
            }
          : {})}
        style={s.touchArea}
        onLayout={(e) => {
          trackWidthRef.current = Math.max(1, e.nativeEvent.layout.width);
        }}
        {...panResponder.panHandlers}
      >
        <View style={[s.track, trackStyle]}>
          <View
            style={[
              s.fill,
              {
                width: `${percentage * 100}%`,
                backgroundColor: accent,
              },
            ]}
          />
        </View>
        <View
          style={[
            s.thumb,
            {
              left: `${percentage * 100}%`,
              borderColor: colors.ink,
            },
            thumbStyle,
          ]}
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.ink,
    flexShrink: 1,
    minWidth: 0,
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    flexShrink: 0,
  },
  touchArea: {
    height: 44,
    justifyContent: "center",
    position: "relative",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.line,
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
    borderRadius: 3,
  },
  thumb: {
    position: "absolute",
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.paper,
    borderWidth: 2,
    marginLeft: -12,
    top: 10,
    boxShadow: "0px 2px 6px rgba(0,0,0,0.12)",
  },
});
