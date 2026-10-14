import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Badge,
  Card,
  Input,
  SegmentedControl,
  colors,
  mono,
} from "../components";

export type ChequeStatus = "pending" | "deposited" | "cleared" | "bounced";

export interface ChequeData {
  bankName: string;
  chequeNumber: string;
  ifscCode: string;
  chequeDate: string;
  amount: string;
  status: ChequeStatus;
  drawerAccount?: string;
}

export interface ChequeFieldsProps {
  value: ChequeData;
  onChange: (val: ChequeData) => void;
  readOnly?: boolean;
  style?: ViewStyle;
}

export function ChequeFields({
  value,
  onChange,
  readOnly = false,
  style,
}: ChequeFieldsProps) {
  const updateField = (field: keyof ChequeData, val: any) => {
    onChange({
      ...value,
      [field]: val,
    });
  };

  const statusTone: Record<
    ChequeStatus,
    "neutral" | "warning" | "success" | "danger"
  > = {
    pending: "neutral",
    deposited: "warning",
    cleared: "success",
    bounced: "danger",
  };

  const statusLabels: Record<ChequeStatus, string> = {
    pending: "Pending Deposit",
    deposited: "In Clearing",
    cleared: "Cleared & Realized",
    bounced: "Dishonored / Bounced",
  };

  const badge = (
    <Badge tone={statusTone[value.status]} dot={true}>
      {statusLabels[value.status]}
    </Badge>
  );

  return (
    <Card
      title="Cheque / DD Instrument"
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* Status segmented switcher if editable */}
        {!readOnly && (
          <View style={s.statusSelector}>
            <Text style={s.subLabel}>Clearing Status</Text>
            <SegmentedControl<ChequeStatus>
              options={["pending", "deposited", "cleared", "bounced"]}
              value={value.status}
              onChange={(id) => updateField("status", id)}
            />
          </View>
        )}

        {/* Bank & Cheque No Grid */}
        <View style={s.row}>
          <View style={s.colFlex2}>
            <Input
              label="Issuing Bank Name"
              value={value.bankName}
              onChangeText={(t) => updateField("bankName", t)}
              placeholder="e.g. State Bank of India"
              editable={!readOnly}
            />
          </View>

          <View style={s.colFlex1}>
            <Input
              label="Cheque No (6 Digits)"
              value={value.chequeNumber}
              onChangeText={(t) =>
                updateField(
                  "chequeNumber",
                  t.replace(/[^0-9]/g, "").slice(0, 6),
                )
              }
              placeholder="004812"
              keyboardType="number-pad"
              maxLength={6}
              style={s.monoInput}
              editable={!readOnly}
            />
          </View>
        </View>

        {/* Date, IFSC & Amount */}
        <View style={s.row}>
          <View style={s.colFlex1}>
            <Input
              label="Instrument Date"
              value={value.chequeDate}
              onChangeText={(t) => updateField("chequeDate", t)}
              placeholder="YYYY-MM-DD"
              editable={!readOnly}
            />
          </View>

          <View style={s.colFlex1}>
            <Input
              label="IFSC Code"
              value={value.ifscCode}
              onChangeText={(t) =>
                updateField(
                  "ifscCode",
                  t
                    .toUpperCase()
                    .replace(/[^0-9A-Z]/g, "")
                    .slice(0, 11),
                )
              }
              placeholder="SBIN0001234"
              autoCapitalize="characters"
              maxLength={11}
              style={s.monoInput}
              editable={!readOnly}
            />
          </View>

          <View style={s.colFlex1}>
            <Input
              label="Cheque Amount (₹)"
              value={value.amount}
              onChangeText={(t) => updateField("amount", t)}
              placeholder="50,000.00"
              keyboardType="decimal-pad"
              style={s.monoInput}
              editable={!readOnly}
            />
          </View>
        </View>

        {value.drawerAccount && (
          <View style={s.accountNote}>
            <Text style={s.accountNoteText}>
              Drawer A/C: {value.drawerAccount}
            </Text>
          </View>
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
    gap: 16,
  },
  statusSelector: {
    gap: 6,
  },
  subLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.muted,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  colFlex2: {
    flex: 2,
    minWidth: 180,
  },
  colFlex1: {
    flex: 1,
    minWidth: 140,
  },
  monoInput: {
    fontFamily: mono,
    letterSpacing: 0.5,
  },
  accountNote: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
  },
  accountNoteText: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: mono,
  },
});
