import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { Icon } from "./Icon";

export interface PopoverProps {
  /** Trigger element that toggles the popover */
  trigger: React.ReactNode;
  /** Popover body content */
  content: React.ReactNode;
  /** Optional title in the popover header */
  title?: string;
  /** Desired popover card width (defaults to 280) */
  width?: number;
  /** Preferred placement relative to trigger */
  placement?: "bottom" | "top";
  /** Controlled open state */
  open?: boolean;
  /** Uncontrolled initial open state */
  defaultOpen?: boolean;
  /** Callback fired when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the popover trigger is disabled */
  disabled?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Card popup style */
  cardStyle?: StyleProp<ViewStyle>;
  /** Content container style */
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function Popover({
  trigger,
  content,
  title,
  width = 280,
  placement = "bottom",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  style,
  cardStyle,
  contentContainerStyle,
}: PopoverProps) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const [coords, setCoords] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const [cardHeight, setCardHeight] = useState(200);
  const triggerRef = useRef<View>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const setOpenState = (next: boolean) => {
    if (disabled && next) return;
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  };

  const handleToggle = () => {
    if (disabled) return;
    if (isOpen) {
      setOpenState(false);
      return;
    }

    if (triggerRef.current) {
      if (
        Platform.OS === "web" &&
        typeof (triggerRef.current as any)?.getBoundingClientRect === "function"
      ) {
        const rect = (triggerRef.current as any).getBoundingClientRect();
        setCoords({
          x: rect.left,
          y: rect.bottom + 6,
          width: rect.width,
          height: rect.height,
        });
        setOpenState(true);
        return;
      }

      triggerRef.current.measureInWindow((x, y, w, h) => {
        setCoords({
          x,
          y: y + h + 6,
          width: w,
          height: h,
        });
        setOpenState(true);
      });
    } else {
      setOpenState(true);
    }
  };

  useEffect(() => {
    if (Platform.OS !== "web" || !isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenState(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const popoverPlacement = useMemo(() => {
    const cardWidth = Math.max(1, Math.min(width, windowWidth - 24));
    const height = Math.min(cardHeight, windowHeight - 24);
    if (!coords) return { top: 12, left: 12, width: cardWidth };
    const left = Math.max(
      12,
      Math.min(
        coords.x + coords.width / 2 - cardWidth / 2,
        windowWidth - cardWidth - 12,
      ),
    );
    const above = coords.y - coords.height - height - 12;
    const top =
      (placement === "top" || coords.y + height > windowHeight - 12) &&
      above >= 12
        ? above
        : coords.y;
    return {
      position: "absolute" as const,
      top: Math.max(12, Math.min(top, windowHeight - height - 12)),
      left,
      width: cardWidth,
    };
  }, [coords, placement, width, windowWidth, windowHeight, cardHeight]);

  return (
    <View style={[s.container, style]}>
      <View ref={triggerRef} collapsable={false} style={s.triggerWrap}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={title || "Show details"}
          accessibilityState={{ expanded: isOpen, disabled }}
          disabled={disabled}
          style={({ pressed, hovered }: any) => [
            s.triggerBtn,
            (pressed || hovered) && !disabled && { opacity: 0.8 },
            disabled && { opacity: 0.5 },
          ]}
          onPress={handleToggle}
        >
          {trigger}
        </Pressable>
      </View>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setOpenState(false)}
      >
        <Pressable
          style={s.backdrop}
          onPress={() => setOpenState(false)}
          accessible={false}
        >
          <Pressable
            accessible={false}
            role="dialog"
            accessibilityViewIsModal
            accessibilityLabel={title || "Details"}
            onLayout={(event) => setCardHeight(event.nativeEvent.layout.height)}
            style={[
              s.popoverCard,
              popoverPlacement,
              { maxHeight: windowHeight - 24 },
              cardStyle,
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={s.header}>
              <Text
                accessibilityRole="header"
                style={s.title}
                numberOfLines={1}
              >
                {title}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close popover"
                onPress={() => setOpenState(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={({ pressed, hovered }: any) => [
                  s.closeBtn,
                  (pressed || hovered) && { opacity: 0.7 },
                ]}
              >
                <Icon name="close" size={14} color={colors.muted} />
              </Pressable>
            </View>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={s.body}
              contentContainerStyle={contentContainerStyle}
            >
              {content}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    position: "relative",
  },
  triggerWrap: {
    alignSelf: "flex-start",
  },
  triggerBtn: {
    minHeight: 44,
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "transparent",
  },
  popoverCard: {
    backgroundColor: colors.paper,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    zIndex: 9999,
    ...Platform.select({
      web: {
        boxShadow: "0px 10px 30px rgba(0,0,0,0.14)",
      },
      default: {
        elevation: 8,
      },
    }),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    flexShrink: 1,
    minWidth: 0,
  },
  closeBtn: {
    width: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  body: {
    flexShrink: 1,
    width: "100%",
  },
});
