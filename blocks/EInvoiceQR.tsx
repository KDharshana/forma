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

export type IRNStatus = "active" | "pending" | "cancelled";

export interface EInvoiceQRProps {
  irn?: string;
  ackNo?: string;
  ackDate?: string;
  status?: IRNStatus;
  documentNumber?: string;
  taxableValue?: string;
  totalTax?: string;
  invoiceTotal?: string;
  onVerify?: () => void;
  onDownloadJSON?: () => void;
  style?: ViewStyle;
}

export function EInvoiceQR({
  irn = "8f3b201a4e5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e",
  ackNo = "122410892019",
  ackDate = "14-Oct-2026 10:42:18",
  status = "active",
  documentNumber = "INV/2026/0491",
  taxableValue = "₹1,85,000.00",
  totalTax = "₹33,300.00 (18% GST)",
  invoiceTotal = "₹2,18,300.00",
  onVerify,
  onDownloadJSON,
  style,
}: EInvoiceQRProps) {
  const [copied, setCopied] = useState(false);

  const statusConfig = {
    active: { label: "IRN Active", tone: "success" as const },
    pending: { label: "IRN Pending", tone: "warning" as const },
    cancelled: { label: "IRN Cancelled", tone: "danger" as const },
  }[status];

  const handleCopyIRN = () => {
    if (
      Platform.OS === "web" &&
      typeof navigator !== "undefined" &&
      navigator.clipboard
    ) {
      navigator.clipboard.writeText(irn);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const badge = (
    <Badge tone={statusConfig.tone} dot={true}>
      {statusConfig.label}
    </Badge>
  );

  return (
    <Card
      title={`E-Invoice Compliance – ${documentNumber}`}
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* IRN Hash Bar */}
        <View style={s.irnBox}>
          <View style={s.irnHead}>
            <Text style={s.irnTitle}>Invoice Reference Number (IRN)</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Copy IRN"
              onPress={handleCopyIRN}
              style={({ pressed }) => [s.copyBtn, pressed && { opacity: 0.6 }]}
            >
              <Icon
                name={copied ? "check" : "copy"}
                size={13}
                color={colors.ink}
              />
              <Text style={s.copyText}>{copied ? "Copied" : "Copy"}</Text>
            </Pressable>
          </View>
          <Text style={s.irnHash} numberOfLines={2}>
            {irn}
          </Text>
        </View>

        {/* Metadata Grid */}
        <View style={s.metaGrid}>
          <View style={s.metaCol}>
            <Text style={s.metaLabel}>Ack Number</Text>
            <Text style={[s.metaValue, s.monoText]}>{ackNo}</Text>
          </View>
          <View style={s.metaCol}>
            <Text style={s.metaLabel}>Ack Date & Time</Text>
            <Text style={s.metaValue}>{ackDate}</Text>
          </View>
          <View style={s.metaCol}>
            <Text style={s.metaLabel}>Taxable Amount</Text>
            <Text style={s.metaValue}>{taxableValue}</Text>
          </View>
          <View style={s.metaCol}>
            <Text style={s.metaLabel}>Total Invoice Value</Text>
            <Text style={[s.metaValue, s.strongValue]}>{invoiceTotal}</Text>
          </View>
        </View>

        <Divider />

        {/* QR Preview & Digital Signature Status */}
        <View style={s.qrRow}>
          <View style={s.qrThumb}>
            {/* 14x14 QR Mock */}
            <Svg width={64} height={64}>
              {Array.from({ length: 8 }).map((_, r) =>
                Array.from({ length: 8 }).map((_, c) =>
                  (r + c) % 2 === 0 ||
                  (r === 0 && c === 0) ||
                  (r === 7 && c === 7) ? (
                    <Rect
                      key={`${r}-${c}`}
                      x={c * 8}
                      y={r * 8}
                      width={7.5}
                      height={7.5}
                      fill={colors.ink}
                    />
                  ) : null,
                ),
              )}
            </Svg>
          </View>

          <View style={s.sigInfo}>
            <View style={s.sigHead}>
              <Icon name="shield" size={14} color={colors.success} />
              <Text style={s.sigTitle}>NIC Digitally Signed & Encrypted</Text>
            </View>
            <Text style={s.sigDesc}>
              B2B invoice reported to IRP portal under Rule 48(4) of CGST Rules.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={s.actionsRow}>
          {onVerify && (
            <Button variant="secondary" size="sm" onPress={onVerify}>
              Verify with NIC
            </Button>
          )}
          {onDownloadJSON && (
            <Button variant="ghost" size="sm" onPress={onDownloadJSON}>
              Download JSON
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
  irnBox: {
    backgroundColor: colors.canvas,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 6,
  },
  irnHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  irnTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
    textTransform: "uppercase",
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    padding: 2,
  },
  copyText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.ink,
  },
  irnHash: {
    fontSize: 12,
    fontFamily: mono,
    color: colors.ink,
    lineHeight: 18,
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  metaCol: {
    flex: 1,
    minWidth: 130,
    gap: 2,
  },
  metaLabel: {
    fontSize: 11,
    color: colors.muted,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  strongValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  monoText: {
    fontFamily: mono,
  },
  qrRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  qrThumb: {
    padding: 6,
    backgroundColor: colors.paper,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  sigInfo: {
    flex: 1,
    gap: 4,
  },
  sigHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sigTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  sigDesc: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 4,
  },
});
