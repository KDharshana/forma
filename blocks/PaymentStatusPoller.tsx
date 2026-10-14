import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Badge,
  Button,
  Card,
  Icon,
  Spinner,
  colors,
  mono,
} from "../components";

export type PaymentPollStatus = "polling" | "success" | "failed" | "cancelled";

export interface PaymentStatusPollerProps {
  status: PaymentPollStatus;
  transactionId?: string;
  amount?: string;
  paymentMethod?: string;
  attempt?: number;
  maxAttempts?: number;
  gatewayMessage?: string;
  onRetry?: () => void;
  onCancel?: () => void;
  style?: ViewStyle;
}

export function PaymentStatusPoller({
  status,
  transactionId = "TXN-2026-94812",
  amount = "₹14,250.00",
  paymentMethod = "UPI Gateway (Razorpay)",
  attempt = 3,
  maxAttempts = 10,
  gatewayMessage,
  onRetry,
  onCancel,
  style,
}: PaymentStatusPollerProps) {
  const badgeConfig = {
    polling: { label: "Verifying...", tone: "warning" as const },
    success: { label: "Payment Confirmed", tone: "success" as const },
    failed: { label: "Payment Failed", tone: "danger" as const },
    cancelled: { label: "Session Cancelled", tone: "neutral" as const },
  }[status];

  const badge = (
    <Badge tone={badgeConfig.tone} dot={true}>
      {badgeConfig.label}
    </Badge>
  );

  return (
    <Card
      title="Gateway Payment Verification"
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* Visual Status Indicator */}
        <View style={s.centerSection}>
          {status === "polling" && (
            <View style={s.indicatorWrap}>
              <Spinner size="lg" color={colors.ink} />
              <Text style={s.pollingTitle}>Awaiting Bank Confirmation</Text>
              <Text style={s.pollingSub}>
                Attempt {attempt} of {maxAttempts} • Please do not refresh
              </Text>
            </View>
          )}

          {status === "success" && (
            <View style={s.indicatorWrap}>
              <View style={[s.iconBox, { backgroundColor: colors.successBg }]}>
                <Icon name="checkCircle" size={28} color={colors.success} />
              </View>
              <Text style={s.successTitle}>Transaction Authorized</Text>
              <Text style={s.pollingSub}>
                Funds successfully settled with merchant
              </Text>
            </View>
          )}

          {status === "failed" && (
            <View style={s.indicatorWrap}>
              <View style={[s.iconBox, { backgroundColor: colors.dangerBg }]}>
                <Icon name="alertCircle" size={28} color={colors.danger} />
              </View>
              <Text style={s.failedTitle}>Transaction Not Realized</Text>
              <Text style={s.pollingSub}>
                {gatewayMessage || "Card declined or UPI transaction expired"}
              </Text>
            </View>
          )}

          {status === "cancelled" && (
            <View style={s.indicatorWrap}>
              <View style={[s.iconBox, { backgroundColor: colors.canvas }]}>
                <Icon name="close" size={28} color={colors.muted} />
              </View>
              <Text style={s.pollingTitle}>Checkout Session Cancelled</Text>
              <Text style={s.pollingSub}>No charges were debited</Text>
            </View>
          )}
        </View>

        {/* Ledger Details */}
        <View style={s.ledgerCard}>
          <View style={s.ledgerRow}>
            <Text style={s.ledgerLabel}>Amount Payable</Text>
            <Text style={s.ledgerValue}>{amount}</Text>
          </View>
          <View style={s.ledgerRow}>
            <Text style={s.ledgerLabel}>Method</Text>
            <Text style={s.ledgerValue}>{paymentMethod}</Text>
          </View>
          <View style={s.ledgerRow}>
            <Text style={s.ledgerLabel}>Transaction Reference</Text>
            <Text style={[s.ledgerValue, s.monoText]}>{transactionId}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={s.actionsRow}>
          {status === "failed" && onRetry && (
            <Button
              variant="primary"
              size="md"
              onPress={onRetry}
              style={s.btnFlex}
            >
              Retry Payment
            </Button>
          )}
          {status === "polling" && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onPress={onCancel}
              style={s.btnFlex}
            >
              Cancel Verification
            </Button>
          )}
        </View>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  card: {
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
  },
  body: {
    gap: 16,
  },
  centerSection: {
    paddingVertical: 12,
    alignItems: "center",
  },
  indicatorWrap: {
    alignItems: "center",
    gap: 8,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  pollingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.ink,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.success,
  },
  failedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.danger,
  },
  pollingSub: {
    fontSize: 12,
    color: colors.muted,
    textAlign: "center",
  },
  ledgerCard: {
    backgroundColor: colors.canvas,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 8,
  },
  ledgerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ledgerLabel: {
    fontSize: 12,
    color: colors.muted,
  },
  ledgerValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  monoText: {
    fontFamily: mono,
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  btnFlex: {
    flex: 1,
  },
});
