import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Button, Card, Input, colors } from "../components";
import { LineItem, LineItemsBlock } from "./LineItemsBlock";

export interface InvoiceItem {
  id: string;
  name: string;
  hours: number;
  rate: number;
}

export interface InvoiceDraft {
  invoiceNumber: string;
  client: string;
  items: LineItem[];
}

export interface InvoiceQuoteBuilderBlockProps {
  onSendInvoice?: (invoice: InvoiceDraft) => void | Promise<void>;
  onDownload?: (invoice: InvoiceDraft) => void | Promise<void>;
  initialItems?: InvoiceItem[];
  accent?: string;
  style?: ViewStyle;
}

export function InvoiceQuoteBuilderBlock({
  onSendInvoice,
  onDownload,
  initialItems = [{ id: "1", name: "Design", hours: 4, rate: 120 }],
  accent = colors.lime,
  style,
}: InvoiceQuoteBuilderBlockProps) {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [client, setClient] = useState("");
  const [items, setItems] = useState<LineItem[]>(
    initialItems.map((i) => ({
      id: i.id,
      description: i.name,
      quantity: i.hours,
      unitPrice: i.rate,
    })),
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const run = async (
    action: (invoice: InvoiceDraft) => void | Promise<void>,
  ) => {
    if (pending) return;
    if (
      !invoiceNumber.trim() ||
      !client.trim() ||
      !items.length ||
      items.some((i) => !i.description.trim() || i.quantity <= 0)
    ) {
      setError(
        "Enter an invoice number, client, and at least one complete line item.",
      );
      return;
    }
    setPending(true);
    setError("");
    try {
      await action({
        invoiceNumber: invoiceNumber.trim(),
        client: client.trim(),
        items,
      });
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not complete this action.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <Card title="Invoice" style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        <View style={s.fields}>
          <View style={s.field}>
            <Input
              label="Invoice number"
              placeholder="e.g. INV-2026-001"
              value={invoiceNumber}
              onChangeText={setInvoiceNumber}
              accent={accent}
            />
          </View>
          <View style={s.field}>
            <Input
              label="Bill to"
              placeholder="Client or company name"
              value={client}
              onChangeText={setClient}
              accent={accent}
            />
          </View>
        </View>

        <LineItemsBlock
          initialItems={items}
          onItemsChange={setItems}
          accent={accent}
          style={{ padding: 0, borderWidth: 0, backgroundColor: "transparent" }}
        />

        {!!error && (
          <Text accessibilityRole="alert" style={s.errorText}>
            {error}
          </Text>
        )}

        {(onDownload || onSendInvoice) && (
          <View style={s.actions}>
            {onDownload && (
              <Button
                variant="outline"
                disabled={pending}
                onPress={() => run(onDownload)}
              >
                Download PDF
              </Button>
            )}
            {onSendInvoice && (
              <Button
                accent={accent}
                loading={pending}
                onPress={() => run(onSendInvoice)}
              >
                Send invoice
              </Button>
            )}
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
    width: "100%",
    gap: 18,
  },
  fields: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  field: {
    flex: 1,
    flexBasis: 180,
    minWidth: 0,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-end",
    paddingTop: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
});
