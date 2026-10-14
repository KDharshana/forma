import React from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import {
  Badge,
  Button,
  Card,
  Divider,
  Icon,
  colors,
  mono,
} from "../components";

export interface CartItem {
  id: string;
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
  unit?: string;
}

export interface OrderCartProps {
  items: CartItem[];
  onUpdateQuantity?: (id: string, qty: number) => void;
  onRemoveItem?: (id: string) => void;
  onCheckout?: () => void;
  taxRate?: number; // e.g. 0.18 for 18%
  discount?: number;
  currencySymbol?: string;
  showPeekBar?: boolean;
  style?: ViewStyle;
}

export function OrderCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  taxRate = 0.18,
  discount = 0,
  currencySymbol = "₹",
  showPeekBar = false,
  style,
}: OrderCartProps) {
  const subtotal = items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0,
  );
  const tax = subtotal * taxRate;
  const grandTotal = Math.max(0, subtotal + tax - discount);
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const badge = (
    <Badge tone="neutral" dot={false}>
      {totalItemCount} Units
    </Badge>
  );

  return (
    <View style={[s.wrapper, style]}>
      <Card title="Wholesale Order Cart" badge={badge} style={s.card}>
        <View style={s.body}>
          {/* Items Table */}
          {items.length === 0 ? (
            <View style={s.emptyCart}>
              <Icon name="wallet" size={32} color={colors.muted} />
              <Text style={s.emptyText}>Your cart is empty</Text>
            </View>
          ) : (
            <View style={s.itemsList}>
              {items.map((item) => {
                const lineTotal = item.unitPrice * item.quantity;
                return (
                  <View key={item.id} style={s.itemRow}>
                    <View style={s.itemMain}>
                      <Text style={s.itemName}>{item.name}</Text>
                      <View style={s.skuRow}>
                        <Text style={[s.skuText, s.monoText]}>
                          SKU: {item.sku}
                        </Text>
                        <Text style={s.pricePerUnit}>
                          {currencySymbol}
                          {item.unitPrice.toLocaleString()} /{" "}
                          {item.unit || "unit"}
                        </Text>
                      </View>
                    </View>

                    {/* Stepper Controls */}
                    <View style={s.controlsRow}>
                      {onUpdateQuantity && (
                        <View style={s.stepperWrap}>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Decrease quantity for ${item.name}`}
                            onPress={() => {
                              if (item.quantity > 1) {
                                onUpdateQuantity(item.id, item.quantity - 1);
                              } else if (onRemoveItem) {
                                onRemoveItem(item.id);
                              }
                            }}
                            style={({ pressed }) => [
                              s.stepBtn,
                              pressed && { backgroundColor: colors.line },
                            ]}
                          >
                            <Icon
                              name="arrowDown"
                              size={11}
                              color={colors.ink}
                            />
                          </Pressable>

                          <Text style={[s.qtyText, s.monoText]}>
                            {item.quantity}
                          </Text>

                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Increase quantity for ${item.name}`}
                            onPress={() =>
                              onUpdateQuantity(item.id, item.quantity + 1)
                            }
                            style={({ pressed }) => [
                              s.stepBtn,
                              pressed && { backgroundColor: colors.line },
                            ]}
                          >
                            <Icon name="arrowUp" size={11} color={colors.ink} />
                          </Pressable>
                        </View>
                      )}

                      <Text style={[s.lineTotalText, s.monoText]}>
                        {currencySymbol}
                        {lineTotal.toLocaleString()}
                      </Text>

                      {onRemoveItem && (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Remove ${item.name}`}
                          onPress={() => onRemoveItem(item.id)}
                          style={({ pressed }) => [
                            s.removeBtn,
                            pressed && { opacity: 0.6 },
                          ]}
                        >
                          <Icon name="trash" size={14} color={colors.muted} />
                        </Pressable>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <Divider />

          {/* Pricing Ledger */}
          <View style={s.pricingLedger}>
            <View style={s.ledgerRow}>
              <Text style={s.ledgerLabel}>Subtotal</Text>
              <Text style={[s.ledgerVal, s.monoText]}>
                {currencySymbol}
                {subtotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>

            <View style={s.ledgerRow}>
              <Text style={s.ledgerLabel}>GST / Estimated Tax (18%)</Text>
              <Text style={[s.ledgerVal, s.monoText]}>
                {currencySymbol}
                {tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
            </View>

            {discount > 0 && (
              <View style={s.ledgerRow}>
                <Text style={s.ledgerLabel}>Wholesale Discount</Text>
                <Text style={[s.discountVal, s.monoText]}>
                  -{currencySymbol}
                  {discount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </Text>
              </View>
            )}

            <View style={[s.ledgerRow, s.grandTotalRow]}>
              <Text style={s.grandTotalLabel}>Grand Total</Text>
              <Text style={[s.grandTotalVal, s.monoText]}>
                {currencySymbol}
                {grandTotal.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>

          {/* Checkout CTA */}
          {onCheckout && items.length > 0 && (
            <Button variant="primary" size="lg" onPress={onCheckout}>
              Proceed to Dispatch & Billing
            </Button>
          )}
        </View>
      </Card>

      {/* Sticky Bottom Peek Bar */}
      {showPeekBar && items.length > 0 && (
        <CartPeekBar
          itemCount={totalItemCount}
          totalAmount={`${currencySymbol}${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          onPress={onCheckout}
        />
      )}
    </View>
  );
}

export interface CartPeekBarProps {
  itemCount: number;
  totalAmount: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function CartPeekBar({
  itemCount,
  totalAmount,
  onPress,
  style,
}: CartPeekBarProps) {
  return (
    <View style={[s.peekBarContainer, style]}>
      <View style={s.peekBarLeft}>
        <View style={s.peekCountBadge}>
          <Text style={s.peekCountText}>{itemCount}</Text>
        </View>
        <View style={s.peekPriceCol}>
          <Text style={s.peekPriceLabel}>Total Payable</Text>
          <Text style={[s.peekPriceValue, s.monoText]}>{totalAmount}</Text>
        </View>
      </View>

      {onPress && (
        <Button variant="primary" size="sm" onPress={onPress}>
          Review Order
        </Button>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: 12,
  },
  card: {
    width: "100%",
  },
  body: {
    gap: 16,
  },
  emptyCart: {
    padding: 32,
    alignItems: "center",
    gap: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
  },
  itemsList: {
    gap: 12,
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
  itemMain: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  skuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  skuText: {
    fontSize: 11,
    color: colors.muted,
  },
  pricePerUnit: {
    fontSize: 12,
    color: colors.muted,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepperWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.canvas,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.line,
    height: 32,
  },
  stepBtn: {
    width: 28,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    paddingHorizontal: 8,
    fontSize: 13,
    fontWeight: "700",
    color: colors.ink,
  },
  lineTotalText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
    minWidth: 70,
    textAlign: "right",
  },
  removeBtn: {
    padding: 6,
  },
  pricingLedger: {
    gap: 6,
  },
  ledgerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  ledgerLabel: {
    fontSize: 13,
    color: colors.muted,
  },
  ledgerVal: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  discountVal: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.success,
  },
  grandTotalRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  grandTotalVal: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.ink,
  },
  monoText: {
    fontFamily: mono,
  },
  peekBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 8,
  },
  peekBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  peekCountBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.lime,
    alignItems: "center",
    justifyContent: "center",
  },
  peekCountText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.ink,
  },
  peekPriceCol: {
    gap: 2,
  },
  peekPriceLabel: {
    fontSize: 10,
    color: colors.muted,
    textTransform: "uppercase",
  },
  peekPriceValue: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink,
  },
});
