import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Svg, { Rect } from "react-native-svg";
import {
  Badge,
  Button,
  Card,
  Divider,
  Icon,
  colors,
  mono,
} from "../components";

export interface UPIQRProps {
  upiId?: string;
  payeeName?: string;
  amount?: number | string;
  invoiceNumber?: string;
  expiryMinutes?: number;
  onPayNow?: () => void;
  style?: ViewStyle;
}

// Generate deterministic SVG matrix pattern for mock UPI QR display
function generateQRMatrix(seed: string): boolean[][] {
  const size = 21;
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false),
  );

  // Position markers in 3 corners
  const drawCorner = (rStart: number, cStart: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[rStart + r][cStart + c] = isBorder || isCenter;
      }
    }
  };

  drawCorner(0, 0);
  drawCorner(0, size - 7);
  drawCorner(size - 7, 0);

  // Pseudo-random data filling from seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip corners
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= size - 8) ||
        (r >= size - 8 && c < 8)
      ) {
        continue;
      }
      const val = Math.abs(Math.sin(hash + r * 13 + c * 37));
      matrix[r][c] = val > 0.45;
    }
  }

  return matrix;
}

export function UPIQR({
  upiId = "billing.corp@hdfcbank",
  payeeName = "Apex Industrial Supplies Ltd",
  amount = "24,500.00",
  invoiceNumber = "INV-2026-8921",
  expiryMinutes = 15,
  onPayNow,
  style,
}: UPIQRProps) {
  const [copied, setCopied] = useState(false);
  const matrix = React.useMemo(
    () => generateQRMatrix(upiId + amount),
    [upiId, amount],
  );
  const qrSize = 168;
  const cellSize = qrSize / 21;

  const handleCopy = () => {
    if (
      Platform.OS === "web" &&
      typeof navigator !== "undefined" &&
      navigator.clipboard
    ) {
      navigator.clipboard.writeText(upiId);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badge = (
    <Badge tone="success" dot={true}>
      Instant Settlement
    </Badge>
  );

  return (
    <Card
      title="UPI Instant Collect"
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* Amount Section */}
        <View style={s.amountSection}>
          <Text style={s.amountLabel}>Total Payable</Text>
          <Text style={s.amountValue}>₹{amount}</Text>
          <Text style={s.invoiceRef}>Ref: {invoiceNumber}</Text>
        </View>

        {/* QR Code Container */}
        <View style={s.qrWrapper}>
          <View style={s.qrBox}>
            <Svg width={qrSize} height={qrSize}>
              {matrix.map((row, r) =>
                row.map((active, c) =>
                  active ? (
                    <Rect
                      key={`${r}-${c}`}
                      x={c * cellSize}
                      y={r * cellSize}
                      width={cellSize + 0.3}
                      height={cellSize + 0.3}
                      fill={colors.ink}
                    />
                  ) : null,
                ),
              )}
            </Svg>
          </View>
          <Text style={s.qrHint}>Scan with GPay, PhonePe, Paytm or BHIM</Text>
        </View>

        <Divider />

        {/* VPA Info & Actions */}
        <View style={s.vpaSection}>
          <View style={s.vpaRow}>
            <View style={s.vpaCol}>
              <Text style={s.payeeText}>{payeeName}</Text>
              <Text style={s.vpaId}>{upiId}</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Copy UPI VPA ID"
              onPress={handleCopy}
              style={({ pressed }) => [s.copyBtn, pressed && { opacity: 0.7 }]}
            >
              <Icon
                name={copied ? "check" : "copy"}
                size={14}
                color={colors.ink}
              />
              <Text style={s.copyText}>{copied ? "Copied" : "Copy VPA"}</Text>
            </Pressable>
          </View>

          {onPayNow && (
            <Button
              variant="primary"
              size="md"
              onPress={onPayNow}
              style={s.payNowBtn}
            >
              Open Installed UPI App
            </Button>
          )}

          <Text style={s.validityText}>
            Dynamic QR code expires in {expiryMinutes} minutes
          </Text>
        </View>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  card: {
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
  },
  body: {
    gap: 16,
    alignItems: "center",
  },
  amountSection: {
    alignItems: "center",
    gap: 2,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.muted,
    textTransform: "uppercase",
  },
  amountValue: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.ink,
    letterSpacing: -0.5,
  },
  invoiceRef: {
    fontSize: 12,
    color: colors.muted,
    fontFamily: mono,
  },
  qrWrapper: {
    alignItems: "center",
    gap: 10,
  },
  qrBox: {
    padding: 12,
    backgroundColor: colors.paper,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  qrHint: {
    fontSize: 12,
    color: colors.muted,
  },
  vpaSection: {
    width: "100%",
    gap: 12,
  },
  vpaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.canvas,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 10,
    gap: 8,
  },
  vpaCol: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  payeeText: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.muted,
  },
  vpaId: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: mono,
    color: colors.ink,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 6,
    paddingVertical: 5,
    paddingHorizontal: 9,
    gap: 5,
  },
  copyText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
  },
  payNowBtn: {
    width: "100%",
  },
  validityText: {
    fontSize: 11,
    color: colors.muted,
    textAlign: "center",
  },
});
