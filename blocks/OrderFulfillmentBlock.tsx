import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Badge,
  Button,
  Card,
  Divider,
  List,
  ListItem,
  Stepper,
  colors,
} from "../components";

export interface OrderFulfillmentBlockProps {
  orderNumber?: string;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  currentStep?: number;
  items?: { name: string; quantity: number }[];
  onTrack?: () => void;
  accent?: string;
  style?: ViewStyle;
}

export function OrderFulfillmentBlock({
  orderNumber = "ORD-9412",
  trackingNumber,
  carrier,
  estimatedDelivery,
  currentStep = 0,
  items = [],
  onTrack,
  accent = colors.lime,
  style,
}: OrderFulfillmentBlockProps) {
  const steps = [
    { id: "confirmed", title: "Confirmed" },
    { id: "dispatched", title: "Dispatched" },
    { id: "transit", title: "In transit" },
    { id: "delivered", title: "Delivered" },
  ];
  const step = Math.max(0, Math.min(3, Math.floor(currentStep)));

  const badge = (
    <Badge tone={step === 3 ? "success" : "neutral"}>{steps[step].title}</Badge>
  );

  return (
    <Card
      title={`Order ${orderNumber}`}
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {(carrier || trackingNumber) && (
          <View style={s.metaRow}>
            <Text style={s.metaText}>
              {[carrier, trackingNumber].filter(Boolean).join(" · ")}
            </Text>
            {onTrack && (
              <Button variant="outline" size="sm" onPress={onTrack}>
                Track shipment
              </Button>
            )}
          </View>
        )}

        {!!estimatedDelivery && step < 3 && (
          <Text style={s.deliveryText}>
            Estimated delivery: {estimatedDelivery}
          </Text>
        )}

        <View style={s.stepperWrap}>
          <Stepper
            steps={steps}
            currentStep={step === 3 ? 4 : step}
            accent={accent}
          />
        </View>

        {!!items.length && (
          <>
            <Divider spacing={12} />
            <View style={s.itemsSection}>
              <Text style={s.sectionTitle}>Order items</Text>
              <List divided style={s.list}>
                {items.map((item, i) => (
                  <ListItem
                    key={i}
                    title={item.name}
                    trailing={
                      <Badge tone="neutral">Qty: {item.quantity}</Badge>
                    }
                  />
                ))}
              </List>
            </View>
          </>
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
    gap: 14,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  metaText: {
    fontSize: 13,
    color: colors.muted,
    flexShrink: 1,
  },
  deliveryText: {
    fontSize: 13,
    color: colors.ink,
    fontWeight: "500",
  },
  stepperWrap: {
    paddingVertical: 6,
  },
  itemsSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  list: {
    width: "100%",
  },
});
