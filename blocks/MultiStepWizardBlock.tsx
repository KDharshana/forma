import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Button,
  Card,
  Checkbox,
  ColorPicker,
  Divider,
  Input,
  RadioGroup,
  Stepper,
  Switch,
  colors,
} from "../components";

export interface ProjectSetup {
  projectName: string;
  projectSlug: string;
  themeColor: string;
  visibility: string;
  enableAlerts: boolean;
}

export interface MultiStepWizardBlockProps {
  onComplete?: (data: ProjectSetup) => void | Promise<void>;
  accent?: string;
  style?: ViewStyle;
}

export function MultiStepWizardBlock({
  onComplete,
  accent = colors.lime,
  style,
}: MultiStepWizardBlockProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Form State
  const [projectName, setProjectName] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [themeColor, setThemeColor] = useState(colors.lime);
  const [visibility, setVisibility] = useState("team");
  const [enableAlerts, setEnableAlerts] = useState(true);
  const [confirmed, setConfirmed] = useState(false);

  const steps = [
    { id: "1", title: "Project Basics", description: "Name and slug" },
    { id: "2", title: "Configuration", description: "Theme and access" },
    { id: "3", title: "Review", description: "Final confirmation" },
  ];

  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleNext = async () => {
    if (pending) return;
    if (
      currentStep === 0 &&
      (!projectName.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(projectSlug))
    ) {
      setError(
        "Enter a project name and a slug using lowercase letters, numbers, and hyphens.",
      );
      return;
    }
    setError("");
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
      setConfirmed(false);
      return;
    }
    if (!confirmed || !onComplete) return;
    setPending(true);
    try {
      await onComplete({
        projectName: projectName.trim(),
        projectSlug,
        themeColor,
        visibility,
        enableAlerts,
      });
      setComplete(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not submit. Try again.",
      );
    } finally {
      setPending(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError("");
      setConfirmed(false);
    }
  };

  if (complete) {
    return (
      <Card style={StyleSheet.flatten([s.card, style])}>
        <Text accessibilityRole="header" style={s.stepTitle}>
          Project settings submitted
        </Text>
        <Text style={s.stepDesc}>
          Your workspace and repository are ready to use.
        </Text>
      </Card>
    );
  }

  const footer = (
    <View style={s.footer}>
      <Button
        variant="ghost"
        disabled={currentStep === 0 || pending}
        onPress={handleBack}
      >
        Back
      </Button>

      <Button
        variant="primary"
        accent={accent}
        icon={currentStep === 2 ? "check" : "arrow"}
        loading={pending}
        disabled={currentStep === 2 && (!confirmed || !onComplete)}
        onPress={handleNext}
      >
        {currentStep === 2 ? "Create project" : "Next step"}
      </Button>
    </View>
  );

  return (
    <Card footer={footer} style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        {/* Wizard Header with Stepper */}
        <View style={s.stepperWrap}>
          <Stepper steps={steps} currentStep={currentStep} accent={accent} />
        </View>

        <Divider spacing={12} />

        {/* Step Content */}
        <View style={s.content}>
          {currentStep === 0 && (
            <View style={s.stepBody}>
              <Text style={s.stepTitle}>Project Information</Text>

              <Input
                label="Project name"
                value={projectName}
                onChangeText={setProjectName}
                placeholder="e.g. Website Redesign"
                accent={accent}
              />
              <Input
                label="URL Slug"
                value={projectSlug}
                onChangeText={setProjectSlug}
                placeholder="e.g. website-redesign"
                autoCapitalize="none"
                autoCorrect={false}
                accent={accent}
              />
            </View>
          )}

          {currentStep === 1 && (
            <View style={s.stepBody}>
              <Text style={s.stepTitle}>Preferences & Theme</Text>

              <ColorPicker
                label="Primary theme color"
                value={themeColor}
                onChange={setThemeColor}
              />
              <RadioGroup
                value={visibility}
                onChange={setVisibility}
                accent={accent}
                options={[
                  {
                    value: "team",
                    label: "Team visibility",
                    description: "All invited collaborators",
                  },
                  {
                    value: "private",
                    label: "Restricted private",
                    description: "Only designated admins",
                  },
                ]}
              />
              <Switch
                value={enableAlerts}
                onChange={setEnableAlerts}
                label="Automated release notifications"
                description="Notify teammates on deployment"
                accent={accent}
              />
            </View>
          )}

          {currentStep === 2 && (
            <View style={s.stepBody}>
              <Text style={s.stepTitle}>Review settings</Text>

              <Card variant="outlined" style={s.reviewCard}>
                <View style={s.reviewRow}>
                  <Text style={s.reviewLabel}>Project</Text>
                  <Text style={s.reviewVal}>{projectName || "Untitled"}</Text>
                </View>
                <View style={s.reviewRow}>
                  <Text style={s.reviewLabel}>Slug</Text>
                  <Text style={s.reviewVal}>{projectSlug || "none"}</Text>
                </View>
                <View style={s.reviewRow}>
                  <Text style={s.reviewLabel}>Theme Accent</Text>
                  <View
                    style={[s.colorSample, { backgroundColor: themeColor }]}
                  />
                </View>
                <View style={s.reviewRow}>
                  <Text style={s.reviewLabel}>Access Mode</Text>
                  <Text style={s.reviewVal}>
                    {visibility === "team" ? "Team Wide" : "Restricted"}
                  </Text>
                </View>
              </Card>

              <Checkbox
                checked={confirmed}
                onChange={setConfirmed}
                label="I confirm these workspace settings are accurate"
                accent={accent}
              />
            </View>
          )}
        </View>

        {!!error && (
          <Text accessibilityRole="alert" style={s.errorText}>
            {error}
          </Text>
        )}
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
  },
  body: {
    width: "100%",
    gap: 14,
  },
  stepperWrap: {
    width: "100%",
  },
  content: {
    minHeight: 220,
    width: "100%",
  },
  stepBody: {
    gap: 14,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
    letterSpacing: -0.3,
  },
  stepDesc: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },
  reviewCard: {
    backgroundColor: colors.canvas,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  reviewRow: {
    flexWrap: "wrap",
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewLabel: {
    fontSize: 12,
    color: colors.muted,
  },
  reviewVal: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  colorSample: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
  },
  footer: {
    flexWrap: "wrap",
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
});
