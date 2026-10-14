import React, { useState } from "react";
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
import { Icon } from "./Icon";

export interface StepItem {
  id: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

export interface StepperProps {
  /** Array of steps */
  steps: StepItem[];
  /** Controlled active step index (0-indexed) */
  currentStep?: number;
  /** Uncontrolled initial step index */
  defaultCurrentStep?: number;
  /** Callback fired when user clicks a step */
  onStepPress?: (stepIndex: number) => void;
  /** Step change callback alias */
  onChange?: (stepIndex: number) => void;
  /** Accent highlight color for completed steps */
  accent?: string;
  /** Whether the stepper is disabled */
  disabled?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Step title style */
  titleStyle?: StyleProp<TextStyle>;
  /** Step description style */
  descriptionStyle?: StyleProp<TextStyle>;
}

export function Stepper({
  steps,
  currentStep: controlledStep,
  defaultCurrentStep = 0,
  onStepPress,
  onChange,
  accent = colors.lime,
  disabled = false,
  style,
  titleStyle,
  descriptionStyle,
}: StepperProps) {
  const isControlled = controlledStep !== undefined;
  const [internalStep, setInternalStep] = useState(defaultCurrentStep);
  const activeStep = isControlled ? controlledStep : internalStep;

  const handleStepClick = (index: number) => {
    if (disabled || steps[index]?.disabled) return;
    if (!isControlled) {
      setInternalStep(index);
    }
    onStepPress?.(index);
    onChange?.(index);
  };

  const isInteractive = Boolean(onStepPress || onChange) && !disabled;

  return (
    <View style={[s.container, disabled && s.containerDisabled, style]}>
      {steps.map((step, index) => {
        const isCompleted = index < activeStep;
        const isCurrent = index === activeStep;
        const isLast = index === steps.length - 1;
        const isStepDisabled = disabled || Boolean(step.disabled);

        return (
          <View key={step.id} style={s.stepWrapper}>
            <Pressable
              accessible
              accessibilityRole={isInteractive ? "button" : "text"}
              accessibilityLabel={`Step ${index + 1} of ${steps.length}: ${step.title}. ${isCurrent ? "Current step" : isCompleted ? "Completed" : "Upcoming"}`}
              accessibilityState={{ selected: isCurrent, disabled: isStepDisabled }}
              disabled={!isInteractive || isStepDisabled}
              onPress={() => handleStepClick(index)}
              style={({ pressed, hovered }: any) => [
                s.stepRow,
                (hovered || pressed) && isInteractive && !isStepDisabled && { opacity: 0.75 },
                isStepDisabled && s.stepDisabled,
              ]}
            >
              <View
                style={[
                  s.circle,
                  isCompleted && {
                    backgroundColor: accent,
                    borderColor: accent,
                  },
                  isCurrent && { borderColor: colors.ink, borderWidth: 2 },
                  !isCompleted && !isCurrent && s.upcomingCircle,
                ]}
              >
                {isCompleted ? (
                  <Icon
                    name="check"
                    size={14}
                    color={colors.ink}
                    strokeWidth={2.4}
                  />
                ) : (
                  <Text
                    style={[
                      s.stepNumber,
                      isCurrent && { color: colors.ink, fontWeight: "700" },
                    ]}
                  >
                    {index + 1}
                  </Text>
                )}
              </View>

              <View style={s.textWrapper}>
                <Text
                  style={[
                    s.title,
                    (isCurrent || isCompleted) && {
                      color: colors.ink,
                      fontWeight: "600",
                    },
                    titleStyle,
                  ]}
                  numberOfLines={1}
                >
                  {step.title}
                </Text>
                {step.description && (
                  <Text
                    style={[s.description, descriptionStyle]}
                    numberOfLines={2}
                  >
                    {step.description}
                  </Text>
                )}
              </View>
            </Pressable>

            {!isLast && (
              <View
                style={[
                  s.connectorLine,
                  isCompleted && { backgroundColor: accent },
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  stepWrapper: {
    position: "relative",
  },
  stepRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    zIndex: 2,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none" } as any)
      : {}),
  },
  stepDisabled: {
    opacity: 0.45,
    ...(Platform.OS === "web" ? ({ cursor: "not-allowed" } as any) : {}),
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
  },
  upcomingCircle: {
    backgroundColor: colors.canvas,
    borderColor: colors.line,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.muted,
  },
  textWrapper: {
    flex: 1,
    minWidth: 0,
    paddingTop: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.muted,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  description: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
    flexShrink: 1,
  },
  connectorLine: {
    width: 2,
    height: 18,
    backgroundColor: colors.line,
    marginLeft: 13,
    marginVertical: 3,
  },
});
