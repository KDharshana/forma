import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Badge, Card, Divider, ProgressBar, colors, mono } from "../components";

export interface AdvanceInstallment {
  id: string;
  month: string;
  amount: string;
  status: "repaid" | "scheduled" | "overdue";
}

export interface EmployeeAdvanceBalanceProps {
  employeeName?: string;
  advanceId?: string;
  totalAdvance?: string;
  balanceOutstanding?: string;
  repaidAmount?: string;
  repaymentPercent?: number;
  monthlyDeduction?: string;
  installments?: AdvanceInstallment[];
  style?: ViewStyle;
}

export function EmployeeAdvanceBalance({
  employeeName = "Pooja Hegde",
  advanceId = "ADV-2026-031",
  totalAdvance = "₹30,000.00",
  balanceOutstanding = "₹10,000.00",
  repaidAmount = "₹20,000.00",
  repaymentPercent = 67,
  monthlyDeduction = "₹5,000.00 / month",
  installments = [
    { id: "1", month: "August 2026", amount: "₹5,000.00", status: "repaid" },
    { id: "2", month: "September 2026", amount: "₹5,000.00", status: "repaid" },
    { id: "3", month: "October 2026", amount: "₹5,000.00", status: "repaid" },
    { id: "4", month: "November 2026", amount: "₹5,000.00", status: "repaid" },
    {
      id: "5",
      month: "December 2026",
      amount: "₹5,000.00",
      status: "scheduled",
    },
    {
      id: "6",
      month: "January 2027",
      amount: "₹5,000.00",
      status: "scheduled",
    },
  ],
  style,
}: EmployeeAdvanceBalanceProps) {
  const isCompleted = repaymentPercent >= 100;

  const badge = (
    <Badge tone={isCompleted ? "success" : "neutral"} dot={true}>
      {isCompleted ? "Settled in Full" : `${repaymentPercent}% Recovered`}
    </Badge>
  );

  return (
    <Card
      title={`Advance Balance – ${advanceId}`}
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* Top Summary */}
        <View style={s.summaryRow}>
          <View style={s.summaryCol}>
            <Text style={s.summaryLabel}>Outstanding Balance</Text>
            <Text style={[s.outstandingValue, s.monoText]}>
              {balanceOutstanding}
            </Text>
          </View>

          <View style={s.summaryCol}>
            <Text style={s.summaryLabel}>Monthly Payroll EMI</Text>
            <Text style={[s.emiValue, s.monoText]}>{monthlyDeduction}</Text>
          </View>
        </View>

        {/* Repayment Progress */}
        <View style={s.progressSection}>
          <View style={s.progressLabelRow}>
            <Text style={s.progressText}>
              Repaid {repaidAmount} of {totalAdvance}
            </Text>
            <Text style={[s.percentText, s.monoText]}>{repaymentPercent}%</Text>
          </View>
          <ProgressBar
            value={repaymentPercent}
            tone={isCompleted ? "success" : "accent"}
            size="md"
          />
        </View>

        <Divider />

        {/* Installment History Schedule */}
        <View style={s.scheduleSection}>
          <Text style={s.scheduleTitle}>Recovery Schedule</Text>
          <View style={s.installmentsList}>
            {installments.map((inst) => {
              const tone =
                inst.status === "repaid"
                  ? "success"
                  : inst.status === "overdue"
                    ? "danger"
                    : "neutral";

              const label =
                inst.status === "repaid"
                  ? "Deducted"
                  : inst.status === "overdue"
                    ? "Overdue"
                    : "Scheduled";

              return (
                <View key={inst.id} style={s.installmentRow}>
                  <View style={s.instLeft}>
                    <Text style={s.instMonth}>{inst.month}</Text>
                    <Badge tone={tone} dot={false}>
                      {label}
                    </Badge>
                  </View>
                  <Text style={[s.instAmount, s.monoText]}>{inst.amount}</Text>
                </View>
              );
            })}
          </View>
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
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.canvas,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 12,
  },
  summaryCol: {
    gap: 2,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
  },
  outstandingValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.danger,
  },
  emiValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
  monoText: {
    fontFamily: mono,
  },
  progressSection: {
    gap: 8,
  },
  progressLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressText: {
    fontSize: 12,
    color: colors.muted,
  },
  percentText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.ink,
  },
  scheduleSection: {
    gap: 8,
  },
  scheduleTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  installmentsList: {
    gap: 6,
  },
  installmentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  instLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  instMonth: {
    fontSize: 13,
    color: colors.ink,
  },
  instAmount: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
});
