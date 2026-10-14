import React, { useRef, useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Button, Card, Divider, Input, colors } from "../components";

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface LineItemsBlockProps {
  initialItems?: LineItem[];
  onItemsChange?: (items: LineItem[]) => void;
  taxRate?: number;
  accent?: string;
  style?: ViewStyle;
}

const defaults: LineItem[] = [
  { id: "1", description: "Design", quantity: 1, unitPrice: 480 },
  { id: "2", description: "Development", quantity: 3, unitPrice: 220 },
];

function NumericField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  return (
    <Input
      label={label}
      keyboardType="decimal-pad"
      value={draft}
      onChangeText={(text) => {
        if (/^\d*(\.\d{0,2})?$/.test(text)) {
          setDraft(text);
          onChange(Number(text) || 0);
        }
      }}
      onBlur={() => setDraft(String(Number(draft) || 0))}
    />
  );
}

export function LineItemsBlock({
  initialItems = defaults,
  onItemsChange,
  taxRate = 0,
  accent = colors.lime,
  style,
}: LineItemsBlockProps) {
  const [items, setItems] = useState(initialItems);
  const nextId = useRef(0);

  const update = (next: LineItem[]) => {
    setItems(next);
    onItemsChange?.(next);
  };

  const subtotal =
    items.reduce(
      (sum, item) => sum + Math.round(item.quantity * item.unitPrice * 100),
      0,
    ) / 100;

  const rate = Math.max(0, Number.isFinite(taxRate) ? taxRate : 0);
  const tax = Math.round(subtotal * rate * 100) / 100;
  const money = (v: number) =>
    `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const addAction = (
    <Button
      variant="outline"
      size="sm"
      onPress={() =>
        update([
          ...items,
          {
            id: `line-${Date.now()}-${nextId.current++}`,
            description: "",
            quantity: 1,
            unitPrice: 0,
          },
        ])
      }
    >
      Add line
    </Button>
  );

  return (
    <Card
      title="Line items"
      action={addAction}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {!items.length && (
          <Text style={s.emptyText}>No line items. Add a line to begin.</Text>
        )}

        {items.map((item, index) => (
          <Card key={item.id} variant="outlined" style={s.itemCard}>
            <Input
              label={`Description ${index + 1}`}
              value={item.description}
              placeholder="Item description"
              onChangeText={(description) =>
                update(
                  items.map((i) =>
                    i.id === item.id ? { ...i, description } : i,
                  ),
                )
              }
              accent={accent}
            />

            <View style={s.fields}>
              <View style={s.field}>
                <NumericField
                  label={`Quantity ${index + 1}`}
                  value={item.quantity}
                  onChange={(quantity) =>
                    update(
                      items.map((i) =>
                        i.id === item.id ? { ...i, quantity } : i,
                      ),
                    )
                  }
                />
              </View>
              <View style={s.field}>
                <NumericField
                  label={`Unit price ${index + 1}`}
                  value={item.unitPrice}
                  onChange={(unitPrice) =>
                    update(
                      items.map((i) =>
                        i.id === item.id ? { ...i, unitPrice } : i,
                      ),
                    )
                  }
                />
              </View>
            </View>

            <View style={s.itemFooter}>
              <Text style={s.itemAmount}>
                {money(Math.round(item.quantity * item.unitPrice * 100) / 100)}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => update(items.filter((i) => i.id !== item.id))}
              >
                {`Remove line ${index + 1}`}
              </Button>
            </View>
          </Card>
        ))}

        <Divider spacing={12} />

        <View style={s.summary}>
          {[
            ["Subtotal", subtotal],
            ...(rate ? [[`Tax (${rate * 100}%)`, tax]] : []),
            ["Total", subtotal + tax],
          ].map(([label, value]) => (
            <View key={label} style={s.summaryRow}>
              <Text
                style={[
                  s.summaryLabel,
                  label === "Total" && s.summaryLabelBold,
                ]}
              >
                {label}
              </Text>
              <Text
                style={[
                  s.summaryAmount,
                  label === "Total" && s.summaryAmountBold,
                ]}
              >
                {money(value as number)}
              </Text>
            </View>
          ))}
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
    gap: 14,
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    paddingVertical: 8,
  },
  itemCard: {
    padding: 14,
    gap: 12,
    backgroundColor: colors.canvas,
    borderRadius: 14,
  },
  fields: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  field: {
    flex: 1,
    flexBasis: 120,
    minWidth: 0,
  },
  itemFooter: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    paddingTop: 4,
  },
  itemAmount: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  summary: {
    gap: 8,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.muted,
  },
  summaryLabelBold: {
    fontWeight: "700",
    color: colors.ink,
    fontSize: 15,
  },
  summaryAmount: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.ink,
  },
  summaryAmountBold: {
    fontSize: 18,
    fontWeight: "700",
  },
});
