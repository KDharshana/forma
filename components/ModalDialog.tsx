import React, { useEffect } from "react";
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { Icon } from "./Icon";

export interface ModalDialogProps {
  /** Visibility flag */
  visible?: boolean;
  /** Alias for visible */
  open?: boolean;
  /** Callback fired when user requests to close the dialog */
  onClose: () => void;
  /** Modal header title */
  title: string;
  /** Optional subtitle below header */
  subtitle?: string;
  /** Dialog body content */
  children: React.ReactNode;
  /** Optional dialog footer buttons or actions */
  footer?: React.ReactNode;
  /** Maximum dialog width (defaults to 480) */
  maxWidth?: number;
  /** Whether pressing the backdrop closes the modal (defaults to true) */
  closeOnBackdropPress?: boolean;
  /** Card modal container style */
  style?: StyleProp<ViewStyle>;
  /** Scrollable body content container style */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Header section style */
  headerStyle?: StyleProp<ViewStyle>;
  /** Footer section style */
  footerStyle?: StyleProp<ViewStyle>;
}

export function ModalDialog({
  visible,
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 480,
  closeOnBackdropPress = true,
  style,
  contentContainerStyle,
  headerStyle,
  footerStyle,
}: ModalDialogProps) {
  const isVisible = Boolean(visible ?? open);

  useEffect(() => {
    if (Platform.OS !== "web" || !isVisible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isVisible, onClose]);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable
          accessible={false}
          style={s.backdrop}
          onPress={closeOnBackdropPress ? onClose : undefined}
        >
          <Pressable
            accessible={false}
            role="dialog"
            accessibilityViewIsModal
            accessibilityLabel={title || "Dialog"}
            aria-modal={true}
            style={[s.modalCard, { maxWidth }, style]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[s.header, headerStyle]}>
              <View style={s.headerTextWrap}>
                <Text
                  accessibilityRole="header"
                  style={s.title}
                  numberOfLines={2}
                >
                  {title}
                </Text>
                {subtitle && (
                  <Text style={s.subtitle} numberOfLines={3}>
                    {subtitle}
                  </Text>
                )}
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close dialog"
                onPress={onClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={({ pressed, hovered }: any) => [
                  s.closeBtn,
                  (pressed || hovered) && { opacity: 0.7 },
                ]}
              >
                <Icon name="close" size={16} color={colors.ink} />
              </Pressable>
            </View>

            <ScrollView
              style={s.body}
              contentContainerStyle={[s.bodyContent, contentContainerStyle]}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
            >
              {children}
            </ScrollView>

            {footer && <View style={[s.footer, footerStyle]}>{footer}</View>}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalCard: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: colors.paper,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: "hidden",
    boxShadow: "0px 16px 40px rgba(0,0,0,0.18)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.muted,
    marginTop: 2,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  body: {
    flexShrink: 1,
    maxHeight: 460,
  },
  bodyContent: {
    padding: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.canvas,
  },
});
