import React from "react";
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

export interface BottomSheetProps {
  /** Controls bottom sheet visibility */
  visible: boolean;
  /** Callback fired when sheet is dismissed */
  onClose: () => void;
  /** Optional title for sheet header */
  title?: string;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Primary content inside scrollable body */
  children: React.ReactNode;
  /** Optional sticky footer content */
  footer?: React.ReactNode;
  /** Maximum height constraint (defaults to "85%") */
  maxHeight?: ViewStyle["maxHeight"];
  /** Whether to show top visual drag handle pill (defaults to true) */
  showHandle?: boolean;
  /** Whether to show header close 'X' button (defaults to true) */
  showCloseButton?: boolean;
  /** Whether clicking the backdrop dismisses the sheet (defaults to true) */
  closeOnBackdropPress?: boolean;
  /** Sheet container style override */
  style?: StyleProp<ViewStyle>;
  /** Content container style for inner scroll view */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Header style override */
  headerStyle?: StyleProp<ViewStyle>;
  /** Footer style override */
  footerStyle?: StyleProp<ViewStyle>;
}

export function BottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxHeight = "85%",
  showHandle = true,
  showCloseButton = true,
  closeOnBackdropPress = true,
  style,
  contentContainerStyle,
  headerStyle,
  footerStyle,
}: BottomSheetProps) {
  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  const hasHeader = !!title || !!subtitle || showCloseButton;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable
          accessible={false}
          style={s.backdrop}
          onPress={handleBackdropPress}
        >
          <Pressable
            accessible={false}
            role="dialog"
            accessibilityViewIsModal
            accessibilityLabel={title || "Bottom sheet dialog"}
            style={[s.sheet, { maxHeight }, style]}
            onPress={(e) => e.stopPropagation()}
          >
            {showHandle && <View style={s.handle} />}

            {hasHeader && (
              <View style={[s.header, headerStyle]}>
                <View style={s.headerTextWrap}>
                  {!!title && (
                    <Text
                      accessibilityRole="header"
                      numberOfLines={2}
                      style={s.title}
                    >
                      {title}
                    </Text>
                  )}
                  {!!subtitle && (
                    <Text numberOfLines={2} style={s.subtitle}>
                      {subtitle}
                    </Text>
                  )}
                </View>

                {showCloseButton && (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Close bottom sheet"
                    onPress={onClose}
                    style={({ pressed, hovered }: any) => [
                      s.closeBtn,
                      (hovered || pressed) && { backgroundColor: colors.line },
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <Icon name="close" size={16} color={colors.ink} />
                  </Pressable>
                )}
              </View>
            )}

            <ScrollView
              style={s.body}
              contentContainerStyle={[s.bodyContent, contentContainerStyle]}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>

            {footer && (
              <View style={[s.footer, footerStyle]}>{footer}</View>
            )}
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    width: "100%",
    maxWidth: 640,
    alignSelf: "center",
    backgroundColor: colors.paper,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    borderBottomWidth: 0,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
    ...(Platform.OS === "web"
      ? ({
          boxShadow: "0px -8px 32px rgba(0,0,0,0.15)",
          outlineStyle: "none",
        } as any)
      : {}),
    outlineWidth: 0,
    outlineColor: "transparent",
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
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
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.muted,
    marginTop: 2,
    flexShrink: 1,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ cursor: "pointer", outlineStyle: "none" } as any)
      : {}),
  },
  body: {
    flexShrink: 1,
    flexGrow: 0,
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
