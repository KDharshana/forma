import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Button,
  Card,
  Combobox,
  Divider,
  Input,
  Switch,
  colors,
} from "../components";

export interface ProfileData {
  fullName: string;
  handle: string;
  bio: string;
  emailDigest: boolean;
  marketingEmail: boolean;
  timezone: string;
}

export interface SectionedFormBlockProps {
  initialProfile?: Partial<ProfileData>;
  onCancel?: () => void;
  onSave?: (data: ProfileData) => void | Promise<void>;
  accent?: string;
  style?: ViewStyle;
}

export function SectionedFormBlock({
  onSave,
  initialProfile,
  onCancel,
  accent = colors.lime,
  style,
}: SectionedFormBlockProps) {
  const [fullName, setFullName] = useState(initialProfile?.fullName ?? "");
  const [handle, setHandle] = useState(initialProfile?.handle ?? "");
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [emailDigest, setEmailDigest] = useState(
    initialProfile?.emailDigest ?? true,
  );
  const [marketingEmail, setMarketingEmail] = useState(
    initialProfile?.marketingEmail ?? false,
  );
  const [timezone, setTimezone] = useState(
    initialProfile?.timezone ?? "Asia/Kolkata",
  );

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (pending || !onSave) return;
    if (!fullName.trim() || !/^@?[a-zA-Z0-9_]{2,30}$/.test(handle)) {
      setError(
        "Enter your name and a handle of 2–30 letters, numbers, or underscores.",
      );
      return;
    }
    setPending(true);
    setError("");
    try {
      await onSave({
        fullName: fullName.trim(),
        handle,
        bio,
        emailDigest,
        marketingEmail,
        timezone,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save. Try again.",
      );
    } finally {
      setPending(false);
    }
  };

  const footer = (
    <View style={s.footer}>
      {onCancel && (
        <Button variant="ghost" disabled={pending} onPress={onCancel}>
          Cancel
        </Button>
      )}
      <Button
        variant="primary"
        accent={accent}
        icon="check"
        disabled={!onSave}
        loading={pending}
        onPress={save}
      >
        Save changes
      </Button>
    </View>
  );

  return (
    <Card footer={footer} style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        {/* Section 1: Identity & Profile */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Public Profile</Text>
          <View style={s.formGrid}>
            <Input
              label="Full name"
              value={fullName}
              onChangeText={setFullName}
              accent={accent}
            />
            <Input
              label="Handle"
              autoCapitalize="none"
              autoCorrect={false}
              value={handle}
              onChangeText={setHandle}
              hint="Used in @mentions and team notifications"
              accent={accent}
            />
            <Input
              label="Short bio"
              multiline
              value={bio}
              onChangeText={setBio}
              accent={accent}
            />
          </View>
        </View>

        <Divider spacing={12} />

        {/* Section 2: Notifications */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Communication Preferences</Text>
          <View style={s.switchList}>
            <Switch
              value={emailDigest}
              onChange={setEmailDigest}
              label="Weekly project digests"
              description="Summary of pull requests and design reviews"
              accent={accent}
            />
            <Switch
              value={marketingEmail}
              onChange={setMarketingEmail}
              label="Product updates & releases"
              description="Occasional notices about new components"
              accent={accent}
            />
          </View>
        </View>

        <Divider spacing={12} />

        {/* Section 3: Localization */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Regional Preferences</Text>
          <Combobox
            label="Preferred Timezone"
            value={timezone}
            onChange={setTimezone}
            accent={accent}
            options={[
              {
                value: "America/Los_Angeles",
                label: "Pacific Time — Los Angeles",
              },
              { value: "America/New_York", label: "Eastern Time — New York" },
              { value: "Etc/UTC", label: "UTC" },
              { value: "Asia/Kolkata", label: "India Standard Time" },
            ]}
          />
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
    gap: 16,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
    letterSpacing: -0.3,
  },
  formGrid: {
    gap: 12,
  },
  switchList: {
    gap: 10,
  },
  footer: {
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    width: "100%",
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
});
