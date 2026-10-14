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

export interface ExpenseItemLine {
  id: string;
  category: string;
  description: string;
  date: string;
  amount: string;
  hasReceipt: boolean;
}

export type ExpenseApprovalStatus =
  | "draft"
  | "submitted"
  | "manager_approved"
  | "finance_approved"
  | "reimbursed"
  | "rejected";

export interface ExpenseClaimSummaryProps {
  claimNumber?: string;
  submittedBy?: string;
  submissionDate?: string;
  totalClaimed?: string;
  totalApproved?: string;
  status?: ExpenseApprovalStatus;
  items?: ExpenseItemLine[];
  onApprove?: () => void;
  onReject?: () => void;
  onViewReceipts?: () => void;
  style?: ViewStyle;
}

export function ExpenseClaimSummary({
  claimNumber = "EXP-2026-0812",
  submittedBy = "Sunita Rao (Field Sales Lead)",
  submissionDate = "12-Oct-2026",
  totalClaimed = "₹18,450.00",
  totalApproved = "₹18,450.00",
  status = "submitted",
  items = [
    {
      id: "1",
      category: "Travel & Fuel",
      description: "Inter-city site visit (Bangalore to Mysore plant)",
      date: "09-Oct-2026",
      amount: "₹4,200.00",
      hasReceipt: true,
    },
    {
      id: "2",
      category: "Client Meeting",
      description: "Working lunch with procurement directors at Tata Motors",
      date: "10-Oct-2026",
      amount: "₹3,850.00",
      hasReceipt: true,
    },
    {
      id: "3",
      category: "Lodging",
      description: "Overnight hotel stay (Radisson Blu, Mysore)",
      date: "10-Oct-2026",
      amount: "₹8,500.00",
      hasReceipt: true,
    },
    {
      id: "4",
      category: "Tolls & Parking",
      description: "NICE road toll and airport long-term parking",
      date: "11-Oct-2026",
      amount: "₹1,900.00",
      hasReceipt: false,
    },
  ],
  onApprove,
  onReject,
  onViewReceipts,
  style,
}: ExpenseClaimSummaryProps) {
  const receiptCount = items.filter((i) => i.hasReceipt).length;

  const statusConfig: Record<
    ExpenseApprovalStatus,
    { label: string; tone: "neutral" | "warning" | "success" | "danger" }
  > = {
    draft: { label: "Draft", tone: "neutral" },
    submitted: { label: "Pending Manager Review", tone: "warning" },
    manager_approved: { label: "Manager Approved", tone: "warning" },
    finance_approved: { label: "Finance Approved", tone: "success" },
    reimbursed: { label: "Reimbursed & Closed", tone: "success" },
    rejected: { label: "Claim Rejected", tone: "danger" },
  };

  const badge = (
    <Badge tone={statusConfig[status].tone} dot={true}>
      {statusConfig[status].label}
    </Badge>
  );

  return (
    <Card
      title={`Expense Claim ${claimNumber}`}
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* Submitter Info */}
        <View style={s.headerRow}>
          <View style={s.headerCol}>
            <Text style={s.submittedByText}>{submittedBy}</Text>
            <Text style={s.metaText}>Submitted on {submissionDate}</Text>
          </View>

          <View style={s.receiptBadge}>
            <Icon name="file" size={13} color={colors.ink} />
            <Text style={s.receiptText}>{receiptCount} Receipts</Text>
          </View>
        </View>

        <Divider />

        {/* Itemized Lines */}
        <View style={s.itemsTable}>
          {items.map((item) => (
            <View key={item.id} style={s.itemRow}>
              <View style={s.itemInfo}>
                <View style={s.categoryRow}>
                  <Text style={s.categoryText}>{item.category}</Text>
                  <Text style={s.itemDate}>{item.date}</Text>
                  {item.hasReceipt ? (
                    <Badge tone="success" dot={false}>
                      Receipt
                    </Badge>
                  ) : (
                    <Badge tone="warning" dot={false}>
                      Missing receipt
                    </Badge>
                  )}
                </View>
                <Text style={s.itemDesc} numberOfLines={1}>
                  {item.description}
                </Text>
              </View>

              <Text style={[s.itemAmount, s.monoText]}>{item.amount}</Text>
            </View>
          ))}
        </View>

        {/* Totals Summary */}
        <View style={s.totalsCard}>
          <View style={s.totalsRow}>
            <Text style={s.totalLabel}>Total Claimed</Text>
            <Text style={[s.totalValue, s.monoText]}>{totalClaimed}</Text>
          </View>
          <View style={s.totalsRow}>
            <Text style={s.totalLabel}>Approved for Reimbursement</Text>
            <Text style={[s.approvedValue, s.monoText]}>{totalApproved}</Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={s.actionsRow}>
          {onViewReceipts && (
            <Button
              variant="outline"
              size="sm"
              icon="eye"
              onPress={onViewReceipts}
            >
              View Receipts
            </Button>
          )}

          {status === "submitted" && (
            <View style={s.approvalGroup}>
              {onReject && (
                <Button variant="outline" size="sm" onPress={onReject}>
                  Reject
                </Button>
              )}
              {onApprove && (
                <Button variant="primary" size="sm" onPress={onApprove}>
                  Approve Claim
                </Button>
              )}
            </View>
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
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerCol: {
    gap: 2,
  },
  submittedByText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
  metaText: {
    fontSize: 12,
    color: colors.muted,
  },
  receiptBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 5,
  },
  receiptText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
  },
  itemsTable: {
    gap: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    gap: 12,
  },
  itemInfo: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  itemDate: {
    fontSize: 11,
    color: colors.muted,
  },
  itemDesc: {
    fontSize: 12,
    color: colors.muted,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
  monoText: {
    fontFamily: mono,
  },
  totalsCard: {
    backgroundColor: colors.canvas,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 6,
  },
  totalsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 12,
    color: colors.muted,
  },
  totalValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
  },
  approvedValue: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.ink,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  approvalGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
