import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Badge,
  Button,
  Card,
  Divider,
  ProgressBar,
  colors,
  mono,
} from "../components";

export interface StockBinLocation {
  binCode: string;
  zone: string;
  quantity: number;
}

export type StockStatusLevel =
  "sufficient" | "low" | "critical" | "out_of_stock";

export interface StockSummaryProps {
  sku?: string;
  productName?: string;
  onHand?: number;
  allocated?: number;
  safetyStock?: number;
  unit?: string;
  binLocations?: StockBinLocation[];
  onInitiateReorder?: () => void;
  style?: ViewStyle;
}

export function StockSummary({
  sku = "BRG-6204-2RS",
  productName = "Precision Deep Groove Ball Bearing 6204",
  onHand = 1420,
  allocated = 380,
  safetyStock = 500,
  unit = "units",
  binLocations = [
    { binCode: "BIN-A-04-12", zone: "Zone A (Rack 4)", quantity: 920 },
    { binCode: "BIN-C-01-08", zone: "Zone C (Bulk Overflow)", quantity: 500 },
  ],
  onInitiateReorder,
  style,
}: StockSummaryProps) {
  const atp = Math.max(0, onHand - allocated); // Available to promise

  let status: StockStatusLevel = "sufficient";
  if (onHand === 0) {
    status = "out_of_stock";
  } else if (atp < safetyStock * 0.5) {
    status = "critical";
  } else if (atp <= safetyStock) {
    status = "low";
  }

  const statusConfig = {
    sufficient: { label: "In Stock (Healthy)", tone: "success" as const },
    low: { label: "Reorder Triggered", tone: "warning" as const },
    critical: { label: "Critically Low", tone: "danger" as const },
    out_of_stock: { label: "Out of Stock", tone: "danger" as const },
  }[status];

  const badge = (
    <Badge tone={statusConfig.tone} dot={true}>
      {statusConfig.label}
    </Badge>
  );

  const stockRatio = Math.min(100, Math.round((atp / (safetyStock * 2)) * 100));

  return (
    <Card
      title={`${productName}`}
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* SKU Subhead */}
        <View style={s.skuRow}>
          <Text style={[s.skuText, s.monoText]}>SKU: {sku}</Text>
          <Text style={s.unitText}>Base UOM: {unit}</Text>
        </View>

        {/* 3 Metric Pillars */}
        <View style={s.metricGrid}>
          <View style={s.metricBox}>
            <Text style={s.metricLabel}>On-Hand Stock</Text>
            <Text style={[s.metricVal, s.monoText]}>
              {onHand.toLocaleString()}
            </Text>
          </View>

          <View style={s.metricBox}>
            <Text style={s.metricLabel}>Reserved / Allocated</Text>
            <Text style={[s.metricValAllocated, s.monoText]}>
              {allocated.toLocaleString()}
            </Text>
          </View>

          <View style={[s.metricBox, s.metricBoxHighlight]}>
            <Text style={s.metricLabelHighlight}>Available to Promise</Text>
            <Text style={[s.metricValHighlight, s.monoText]}>
              {atp.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Safety Stock Buffer Progress */}
        <View style={s.safetySection}>
          <View style={s.safetyHeader}>
            <Text style={s.safetyText}>
              Safety Threshold: {safetyStock.toLocaleString()} {unit}
            </Text>
            <Text style={s.bufferText}>
              {atp >= safetyStock
                ? `+${(atp - safetyStock).toLocaleString()} buffer units`
                : `${(safetyStock - atp).toLocaleString()} deficit units`}
            </Text>
          </View>
          <ProgressBar
            value={stockRatio}
            tone={status === "sufficient" ? "success" : "warning"}
            size="sm"
          />
        </View>

        <Divider />

        {/* Bin Locations Breakdown */}
        <View style={s.binsSection}>
          <Text style={s.binsTitle}>Storage Bin Breakdown</Text>
          <View style={s.binsList}>
            {binLocations.map((b) => (
              <View key={b.binCode} style={s.binRow}>
                <View style={s.binLeft}>
                  <Text style={[s.binCode, s.monoText]}>{b.binCode}</Text>
                  <Text style={s.binZone}>{b.zone}</Text>
                </View>
                <Text style={[s.binQty, s.monoText]}>
                  {b.quantity.toLocaleString()} {unit}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {onInitiateReorder && (
          <Button
            variant="outline"
            size="sm"
            icon="plus"
            onPress={onInitiateReorder}
          >
            Create Purchase Order Reorder
          </Button>
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
  skuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skuText: {
    fontSize: 12,
    color: colors.muted,
  },
  unitText: {
    fontSize: 12,
    color: colors.muted,
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricBox: {
    flex: 1,
    minWidth: 120,
    backgroundColor: colors.canvas,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 4,
  },
  metricBoxHighlight: {
    backgroundColor: colors.paper,
    borderColor: colors.ink,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
  },
  metricLabelHighlight: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.ink,
    textTransform: "uppercase",
  },
  metricVal: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
  },
  metricValAllocated: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.muted,
  },
  metricValHighlight: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.ink,
  },
  monoText: {
    fontFamily: mono,
  },
  safetySection: {
    gap: 8,
  },
  safetyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  safetyText: {
    fontSize: 12,
    color: colors.muted,
  },
  bufferText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
  },
  binsSection: {
    gap: 8,
  },
  binsTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  binsList: {
    gap: 6,
  },
  binRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  binLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  binCode: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.ink,
  },
  binZone: {
    fontSize: 12,
    color: colors.muted,
  },
  binQty: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
});
