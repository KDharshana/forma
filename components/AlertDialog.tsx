import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  ActivityIndicator,
  ScrollView,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { Icon, IconName } from "./Icon";

export type AlertTone = "danger" | "warning" | "info" | "success";

export interface AlertDialogProps {
  /** Controls modal visibility */
  visible: boolean;
  /** Callback fired when dialog is dismissed/closed */
  onClose: () => void;
  /** Modal header title */
  title: string;
  /** Primary description text */
  description: string;
  /** Custom confirm button label, defaults to "Confirm" */
  confirmText?: string;
  /** Custom cancel button label, defaults to "Cancel" */
  cancelText?: string;
  /** Callback invoked when confirm button is pressed. Can be async. */
  onConfirm: () => void | Promise<void>;
  /** Alert tone styling: danger (default), warning, info, or success */
  tone?: AlertTone;
  /** Custom icon override */
  icon?: IconName;
  /** External loading state */
  loading?: boolean;
  /** Disables dialog action buttons */
  disabled?: boolean;
  /** Whether tapping the backdrop dismisses the dialog (default true) */
  closeOnBackdropPress?: boolean;
  /** Optional custom body content below description */
  children?: React.ReactNode;
  /** Backdrop style override */
  style?: StyleProp<ViewStyle>;
  /** Card modal container style override */
  cardStyle?: StyleProp<ViewStyle>;
  /** Confirm button style override */
  confirmStyle?: StyleProp<ViewStyle>;
  /** Cancel button style override */
  cancelStyle?: StyleProp<ViewStyle>;
}

const toneConfig: Record<
  AlertTone,
  {
    bg: string;
    iconColor: string;
    defaultIcon: IconName;
    btnBg: string;
    btnColor: string;
  }
> = {
  danger: {
    bg: colors.dangerBg,
    iconColor: colors.danger,
    defaultIcon: "alertTriangle",
    btnBg: colors.danger,
    btnColor: "#ffffff",
  },
  warning: {
    bg: colors.warningBg,
    iconColor: colors.warning,
    defaultIcon: "alertCircle",
    btnBg: colors.warning,
    btnColor: "#ffffff",
  },
  info: {
    bg: colors.infoBg,
    iconColor: colors.info,
    defaultIcon: "infoCircle",
    btnBg: colors.ink,
    btnColor: "#ffffff",
  },
  success: {
    bg: colors.successBg,
    iconColor: colors.success,
    defaultIcon: "checkCircle",
    btnBg: colors.success,
    btnColor: "#ffffff",
  },
};

export function AlertDialog({
  visible,
  onClose,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  tone = "danger",
  icon,
  loading = false,
  disabled = false,
  closeOnBackdropPress = true,
  children,
  style,
  cardStyle,
  confirmStyle,
  cancelStyle,
}: AlertDialogProps) {
  const [internalPending, setInternalPending] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);

  const isPending = loading || internalPending;
  const isInactive = disabled || isPending;

  useEffect(() => {
    if (visible) setError("");
  }, [visible]);

  const handleClose = () => {
    if (!busy.current && !isPending) {
      onClose();
    }
  };

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      handleClose();
    }
  };

  const handleConfirm = async () => {
    if (busy.current || isInactive) return;
    busy.current = true;
    setInternalPending(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not complete this action. Try again.",
      );
    } finally {
      busy.current = false;
      setInternalPending(false);
    }
  };

  const conf = toneConfig[tone] || toneConfig.danger;
  const iconName = icon || conf.defaultIcon;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        accessible={false}
        style={[s.backdrop, style]}
        onPress={handleBackdropPress}
      >
        <Pressable
          accessible={false}
          role="alertdialog"
          accessibilityViewIsModal
          accessibilityLabel={title}
          style={[s.card, cardStyle]}
          onPress={(e) => e.stopPropagation()}
        >
          <ScrollView
            contentContainerStyle={s.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ width: "100%" }}
          >
            <View style={[s.iconCircle, { backgroundColor: conf.bg }]}>
              <Icon name={iconName} size={22} color={conf.iconColor} />
            </View>

            <Text style={s.title}>{title}</Text>
            <Text style={s.description}>{description}</Text>

            {children}

            {!!error && (
              <Text
                accessibilityRole="alert"
                style={[s.description, { color: colors.danger, marginTop: 4 }]}
              >
                {error}
              </Text>
            )}
          </ScrollView>

          <View style={s.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={cancelText}
              disabled={isInactive}
              accessibilityState={{ disabled: isInactive }}
              onPress={handleClose}
              style={({ pressed, hovered }: any) => [
                s.cancelBtn,
                (hovered || pressed) && !isInactive && { backgroundColor: colors.line },
                pressed && { opacity: 0.7 },
                isInactive && { opacity: 0.5 },
                cancelStyle,
              ]}
            >
              <Text style={s.cancelText}>{cancelText}</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={confirmText}
              onPress={handleConfirm}
              disabled={isInactive}
              accessibilityState={{ disabled: isInactive, busy: isPending }}
              style={({ pressed, hovered }: any) => [
                s.confirmBtn,
                { backgroundColor: conf.btnBg },
                hovered && !isInactive && { opacity: 0.9 },
                pressed && { opacity: 0.75 },
                isInactive && { opacity: 0.6 },
                confirmStyle,
              ]}
            >
              <View style={s.confirmContent}>
                {isPending && (
                  <ActivityIndicator size="small" color={conf.btnColor} />
                )}
                <Text style={[s.confirmText, { color: conf.btnColor }]}>
                  {isPending ? "Working…" : confirmText}
                </Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    maxHeight: "90%",
    backgroundColor: colors.paper,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 22,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
    ...(Platform.OS === "web"
      ? ({
          boxShadow: "0px 12px 36px rgba(0,0,0,0.18)",
          outlineStyle: "none",
        } as any)
      : {}),
    outlineWidth: 0,
    outlineColor: "transparent",
  },
  scrollContent: {
    alignItems: "center",
    width: "100%",
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    flexShrink: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.ink,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  description: {
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 16,
    flexShrink: 1,
  },
  actions: {
    flexWrap: "nowrap",
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 6,
  },
  cancelBtn: {
    flex: 1,
    minHeight: 44,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ cursor: "pointer", outlineStyle: "none" } as any)
      : {}),
  },
  cancelText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    color: colors.ink,
  },
  confirmBtn: {
    flex: 1,
    minHeight: 44,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ cursor: "pointer", outlineStyle: "none" } as any)
      : {}),
  },
  confirmContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  confirmText: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
  },
});
