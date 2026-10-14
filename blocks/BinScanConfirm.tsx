import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Badge, Button, Card, Icon, colors, mono } from "../components";

export type ScanMatchStatus = "matched" | "mismatch" | "pending";

export interface BinScanConfirmProps {
  taskType?: "pick" | "putaway";
  targetBin?: string;
  scannedBin?: string;
  sku?: string;
  productName?: string;
  expectedQuantity?: number;
  scannedQuantity?: number;
  status?: ScanMatchStatus;
  onConfirm?: () => void;
  onRescan?: () => void;
  style?: ViewStyle;
}

export function BinScanConfirm({
  taskType = "pick",
  targetBin = "BIN-B-04-18",
  scannedBin = "BIN-B-04-18",
  sku = "VALVE-CTRL-34",
  productName = "Pneumatic Directional Control Valve",
  expectedQuantity = 12,
  scannedQuantity = 12,
  status = "matched",
  onConfirm,
  onRescan,
  style,
}: BinScanConfirmProps) {
  const isMatch = status === "matched";
  const isMismatch = status === "mismatch";

  const badgeConfig = {
    matched: { label: "Bin Verified", tone: "success" as const },
    mismatch: { label: "Bin Mismatch!", tone: "danger" as const },
    pending: { label: "Awaiting Scan", tone: "neutral" as const },
  }[status];

  const badge = (
    <Badge tone={badgeConfig.tone} dot={true}>
      {badgeConfig.label}
    </Badge>
  );

  return (
    <Card
      title={taskType === "pick" ? "Pick Verification" : "Putaway Verification"}
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* Bin Comparison Cards */}
        <View style={s.binComparisonRow}>
          {/* Target Bin */}
          <View style={s.binCol}>
            <Text style={s.binHeader}>Assigned Bin</Text>
            <View style={s.binCard}>
              <Text style={[s.binText, s.monoText]}>{targetBin}</Text>
            </View>
          </View>

          {/* Icon comparison */}
          <View style={s.statusIconWrap}>
            <Icon
              name={isMatch ? "check" : isMismatch ? "close" : "arrowRight"}
              size={18}
              color={
                isMatch
                  ? colors.success
                  : isMismatch
                    ? colors.danger
                    : colors.muted
              }
            />
          </View>

          {/* Scanned Bin */}
          <View style={s.binCol}>
            <Text style={s.binHeader}>Scanned Barcode</Text>
            <View
              style={[
                s.binCard,
                isMatch && s.binCardSuccess,
                isMismatch && s.binCardDanger,
              ]}
            >
              <Text
                style={[
                  s.binText,
                  s.monoText,
                  isMatch && s.binTextSuccess,
                  isMismatch && s.binTextDanger,
                ]}
              >
                {scannedBin || "Scan barcode..."}
              </Text>
            </View>
          </View>
        </View>

        {/* Item & SKU info */}
        <View style={s.skuCard}>
          <View style={s.skuLeft}>
            <Text style={s.productName}>{productName}</Text>
            <Text style={[s.skuCode, s.monoText]}>SKU: {sku}</Text>
          </View>

          <View style={s.qtyBadge}>
            <Text style={s.qtyLabel}>Quantity</Text>
            <Text style={[s.qtyVal, s.monoText]}>
              {scannedQuantity} / {expectedQuantity}
            </Text>
          </View>
        </View>

        {/* Mismatch Alert Notice */}
        {isMismatch && (
          <View style={s.mismatchNotice}>
            <Icon name="alertTriangle" size={16} color={colors.danger} />
            <Text style={s.mismatchText}>
              Warning: Scanned location does not match assigned picking zone!
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={s.actionsRow}>
          {onRescan && (
            <Button
              variant="outline"
              size="md"
              icon="refresh"
              onPress={onRescan}
              style={s.flexBtn}
            >
              Rescan Barcode
            </Button>
          )}

          {isMatch && onConfirm && (
            <Button
              variant="primary"
              size="md"
              onPress={onConfirm}
              style={s.flexBtn}
            >
              Confirm & Next Item
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
  binComparisonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  binCol: {
    flex: 1,
    gap: 6,
  },
  binHeader: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
  },
  binCard: {
    backgroundColor: colors.canvas,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  binCardSuccess: {
    backgroundColor: colors.successBg,
    borderColor: "#c2e0b1",
  },
  binCardDanger: {
    backgroundColor: colors.dangerBg,
    borderColor: "#f5c6c2",
  },
  binText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  binTextSuccess: {
    color: colors.success,
  },
  binTextDanger: {
    color: colors.danger,
  },
  statusIconWrap: {
    paddingTop: 18,
  },
  skuCard: {
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
  skuLeft: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  productName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  skuCode: {
    fontSize: 12,
    color: colors.muted,
  },
  qtyBadge: {
    alignItems: "flex-end",
    gap: 2,
  },
  qtyLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
  },
  qtyVal: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.ink,
  },
  mismatchNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.dangerBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f5c6c2",
    padding: 10,
    gap: 8,
  },
  mismatchText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.danger,
    flex: 1,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  flexBtn: {
    flex: 1,
  },
  monoText: {
    fontFamily: mono,
  },
});
