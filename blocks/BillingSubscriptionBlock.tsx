import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Badge,
  Button,
  Card,
  Divider,
  List,
  ListItem,
  colors,
} from "../components";

export interface BillingInvoice {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Open" | "Overdue";
}

export interface BillingSubscriptionBlockProps {
  planName?: string;
  price?: string;
  paymentMethod?: string;
  invoices?: BillingInvoice[];
  onUpgrade?: () => void;
  onUpdateCard?: () => void;
  onDownloadInvoice?: (invoice: BillingInvoice) => void;
  accent?: string;
  style?: ViewStyle;
}

export function BillingSubscriptionBlock({
  planName = "Pro",
  price = "$49 / month",
  paymentMethod,
  invoices = [],
  onUpgrade,
  onUpdateCard,
  onDownloadInvoice,
  accent = colors.lime,
  style,
}: BillingSubscriptionBlockProps) {
  return (
    <Card title="Billing" style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        {/* Current Plan */}
        <View style={s.planRow}>
          <View style={s.planInfo}>
            <Text style={s.planLabel}>Current subscription</Text>
            <Text style={s.planName}>{planName}</Text>
            <Text style={s.planPrice}>{price}</Text>
          </View>
          {onUpgrade && (
            <Button variant="secondary" accent={accent} onPress={onUpgrade}>
              Change plan
            </Button>
          )}
        </View>

        <Divider spacing={14} />

        {/* Payment Method */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Payment method</Text>
          <View style={s.methodRow}>
            <Text style={s.methodText}>
              {paymentMethod || "No payment method on file"}
            </Text>
            {onUpdateCard && (
              <Button variant="outline" onPress={onUpdateCard}>
                {paymentMethod ? "Update" : "Add payment method"}
              </Button>
            )}
          </View>
        </View>

        <Divider spacing={14} />

        {/* Invoices */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Invoices</Text>
          {invoices.length === 0 ? (
            <Text style={s.emptyText}>No invoices yet.</Text>
          ) : (
            <List divided style={s.list}>
              {invoices.map((invoice) => (
                <ListItem
                  key={invoice.id}
                  title={invoice.date}
                  subtitle={invoice.id}
                  trailing={
                    <View style={s.invoiceTrailing}>
                      <Text style={s.invoiceAmount}>{invoice.amount}</Text>
                      <Badge
                        tone={
                          invoice.status === "Paid"
                            ? "success"
                            : invoice.status === "Overdue"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {invoice.status}
                      </Badge>
                      {onDownloadInvoice && (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="download"
                          onPress={() => onDownloadInvoice(invoice)}
                        >
                          Download
                        </Button>
                      )}
                    </View>
                  }
                />
              ))}
            </List>
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
    width: "100%",
    gap: 6,
  },
  planRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  planInfo: {
    flexGrow: 1,
    flexBasis: 160,
    minWidth: 0,
  },
  planLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  planName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.ink,
    marginTop: 2,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  methodRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  methodText: {
    fontSize: 13,
    color: colors.muted,
    flexShrink: 1,
    minWidth: 0,
  },
  list: {
    width: "100%",
  },
  invoiceTrailing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
    flexWrap: "wrap",
  },
  invoiceAmount: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    paddingVertical: 4,
  },
});
