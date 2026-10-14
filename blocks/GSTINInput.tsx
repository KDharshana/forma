import React, { useMemo } from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Badge, Card, Input, colors, mono } from "../components";

export interface GSTINDetails {
  isValid: boolean;
  stateCode: string;
  stateName: string;
  pan: string;
  entityNumber: string;
  checksum: string;
}

export interface GSTINInputProps {
  value: string;
  onChange: (gstin: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  style?: ViewStyle;
}

const STATE_MAP: Record<string, string> = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "19": "West Bengal",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "27": "Maharashtra",
  "29": "Karnataka",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "36": "Telangana",
  "37": "Andhra Pradesh",
};

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export function parseGSTIN(raw: string): GSTINDetails {
  const gstin = raw.trim().toUpperCase();
  const isValid = GSTIN_REGEX.test(gstin);

  if (gstin.length < 2) {
    return {
      isValid: false,
      stateCode: "",
      stateName: "",
      pan: "",
      entityNumber: "",
      checksum: "",
    };
  }

  const stateCode = gstin.slice(0, 2);
  const stateName = STATE_MAP[stateCode] || "Other State/UT";
  const pan = gstin.length >= 12 ? gstin.slice(2, 12) : "";
  const entityNumber = gstin.length >= 13 ? gstin.slice(12, 13) : "";
  const checksum = gstin.length >= 15 ? gstin.slice(14, 15) : "";

  return {
    isValid,
    stateCode,
    stateName,
    pan,
    entityNumber,
    checksum,
  };
}

export function GSTINInput({
  value,
  onChange,
  label = "Goods & Services Tax Identification Number (GSTIN)",
  error,
  hint = "Format: 29AABCU9603R1ZM (15 characters)",
  required = false,
  style,
}: GSTINInputProps) {
  const details = useMemo(() => parseGSTIN(value), [value]);

  const handleChangeText = (text: string) => {
    // Force uppercase and limit to 15 alphanumeric chars
    const cleaned = text
      .toUpperCase()
      .replace(/[^0-9A-Z]/g, "")
      .slice(0, 15);
    onChange(cleaned);
  };

  const hasEntered = value.length > 0;
  const isComplete = value.length === 15;
  const validationError =
    error ||
    (isComplete && !details.isValid
      ? "Invalid GSTIN checksum or structure"
      : undefined);

  return (
    <View style={[s.container, style]}>
      <Input
        label={`${label}${required ? " *" : ""}`}
        value={value}
        onChangeText={handleChangeText}
        placeholder="29AABCU9603R1ZM"
        autoCapitalize="characters"
        maxLength={15}
        error={validationError}
        hint={!validationError ? hint : undefined}
        style={s.inputStyle}
        trailingAccessory={
          details.isValid ? (
            <Badge tone="success" dot={false}>
              Verified
            </Badge>
          ) : isComplete ? (
            <Badge tone="danger" dot={false}>
              Invalid
            </Badge>
          ) : hasEntered ? (
            <Badge tone="neutral" dot={false}>
              {`${value.length}/15`}
            </Badge>
          ) : null
        }
      />

      {/* Structured Details Card */}
      {details.isValid && (
        <View style={s.detailsCard}>
          <View style={s.detailsRow}>
            <View style={s.detailCol}>
              <Text style={s.detailLabel}>State jurisdiction</Text>
              <Text style={s.detailValue}>
                {details.stateCode} – {details.stateName}
              </Text>
            </View>

            <View style={s.detailCol}>
              <Text style={s.detailLabel}>Entity PAN</Text>
              <Text style={[s.detailValue, s.monoText]}>{details.pan}</Text>
            </View>

            <View style={s.detailCol}>
              <Text style={s.detailLabel}>Entity / Check</Text>
              <Text style={[s.detailValue, s.monoText]}>
                {details.entityNumber} / {details.checksum}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8,
  },
  inputStyle: {
    fontFamily: mono,
    letterSpacing: 1,
    fontWeight: "600",
  },
  detailsCard: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    padding: 12,
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  detailCol: {
    minWidth: 100,
    gap: 2,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  monoText: {
    fontFamily: mono,
    letterSpacing: 0.5,
  },
});
