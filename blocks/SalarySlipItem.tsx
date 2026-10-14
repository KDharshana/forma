import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Badge,
  Button,
  Card,
  Divider,
  Icon,
  colors,
  mono,
} from "../components";

export interface SalaryComponent {
  label: string;
  amount: string;
}

export interface SalarySlipItemProps {
  monthYear?: string;
  employeeName?: string;
  employeeId?: string;
  designation?: string;
  department?: string;
  earnings?: SalaryComponent[];
  deductions?: SalaryComponent[];
  netPayable?: string;
  disbursementStatus?: "paid" | "processing" | "on_hold";
  onDownloadPDF?: () => void;
  style?: ViewStyle;
}

export function SalarySlipItem({
  monthYear = "October 2026",
  employeeName = "Vikram Aditya",
  employeeId = "EMP-0492",
  designation = "Senior Supply Chain Analyst",
  department = "Logistics & Planning",
  earnings = [
    { label: "Basic Salary", amount: "₹45,000.00" },
    { label: "House Rent Allowance (HRA)", amount: "₹22,500.00" },
    { label: "Special Allowance", amount: "₹18,000.00" },
    { label: "Conveyance Allowance", amount: "₹4,500.00" },
  ],
  deductions = [
    { label: "Provident Fund (EPF)", amount: "₹5,400.00" },
    { label: "Professional Tax (PT)", amount: "₹200.00" },
    { label: "Income Tax (TDS)", amount: "₹4,800.00" },
  ],
  netPayable = "₹79,600.00",
  disbursementStatus = "paid",
  onDownloadPDF,
  style,
}: SalarySlipItemProps) {
  const statusConfig = {
    paid: { label: "Disbursed", tone: "success" as const },
    processing: { label: "Processing", tone: "warning" as const },
    on_hold: { label: "On Hold", tone: "danger" as const },
  }[disbursementStatus];

  const badge = (
    <Badge tone={statusConfig.tone} dot={true}>
      {statusConfig.label}
    </Badge>
  );

  return (
    <Card
      title={`Payslip – ${monthYear}`}
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* Employee Summary Row */}
        <View style={s.empRow}>
          <View style={s.empCol}>
            <Text style={s.empName}>{employeeName}</Text>
            <Text style={s.empMeta}>
              {designation} • {department}
            </Text>
          </View>
          <View style={s.empIdBadge}>
            <Text style={s.empIdText}>{employeeId}</Text>
          </View>
        </View>

        <Divider />

        {/* Breakdown Two Columns */}
        <View style={s.breakdownGrid}>
          {/* Earnings */}
          <View style={s.column}>
            <Text style={s.columnHeader}>Earnings</Text>
            <View style={s.linesList}>
              {earnings.map((e, idx) => (
                <View key={idx} style={s.lineRow}>
                  <Text style={s.lineLabel}>{e.label}</Text>
                  <Text style={[s.lineAmount, s.monoText]}>{e.amount}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Deductions */}
          <View style={s.column}>
            <Text style={s.columnHeader}>Deductions</Text>
            <View style={s.linesList}>
              {deductions.map((d, idx) => (
                <View key={idx} style={s.lineRow}>
                  <Text style={s.lineLabel}>{d.label}</Text>
                  <Text style={[s.lineAmountDeduct, s.monoText]}>
                    -{d.amount}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Net Pay Highlight Box */}
        <View style={s.netPayBox}>
          <View style={s.netPayInfo}>
            <Text style={s.netPayLabel}>Net Remuneration Disbursed</Text>
            <Text style={s.netPayValue}>{netPayable}</Text>
          </View>

          {onDownloadPDF && (
            <Button
              variant="outline"
              size="sm"
              icon="download"
              onPress={onDownloadPDF}
            >
              PDF Payslip
            </Button>
          )}
        </View>
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
  empRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  empCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  empName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  empMeta: {
    fontSize: 12,
    color: colors.muted,
  },
  empIdBadge: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  empIdText: {
    fontSize: 11,
    fontFamily: mono,
    fontWeight: "600",
    color: colors.muted,
  },
  breakdownGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 24,
  },
  column: {
    flex: 1,
    minWidth: 240,
    gap: 8,
  },
  columnHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  linesList: {
    gap: 6,
  },
  lineRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  lineLabel: {
    fontSize: 13,
    color: colors.ink,
  },
  lineAmount: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  lineAmountDeduct: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.danger,
  },
  monoText: {
    fontFamily: mono,
  },
  netPayBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    padding: 14,
    gap: 12,
  },
  netPayInfo: {
    gap: 2,
  },
  netPayLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
  },
  netPayValue: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -0.3,
  },
});
