import React, { useMemo, useRef, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { Icon, IconName } from "./Icon";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: IconName;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  /** Array of menu items */
  items: DropdownItem[];
  /** Callback fired when an item is selected */
  onSelect?: (item: DropdownItem) => void;
  /** Custom trigger element (replaces default trigger pill) */
  trigger?: React.ReactNode;
  /** Default trigger placeholder label */
  placeholder?: string;
  /** Menu horizontal alignment relative to trigger */
  align?: "left" | "right";
  /** Controlled open state */
  open?: boolean;
  /** Initial open state for uncontrolled usage */
  defaultOpen?: boolean;
  /** Callback fired when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Disables dropdown interaction */
  disabled?: boolean;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom dropdown menu container style */
  menuStyle?: StyleProp<ViewStyle>;
}

export function Dropdown({
  items,
  onSelect,
  trigger,
  placeholder = "Actions",
  align = "left",
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  style,
  menuStyle,
}: DropdownProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const [coords, setCoords] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  const [menuHeight, setMenuHeight] = useState(0);
  const triggerRef = useRef<View>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const setOpenState = (next: boolean) => {
    if (disabled) return;
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
          y: rect.bottom + 4,
          width: rect.width,
          height: rect.height,
        });
        setOpenState(true);
        return;
      }

      triggerRef.current.measureInWindow((x, y, width, height) => {
        setCoords({
          x,
          y: y + height + 4,
          width,
          height,
        });
        setOpenState(true);
      });
    } else {
      setOpenState(true);
    }
  };

  const menuPlacement = useMemo(() => {
    const menuWidth = Math.max(1, Math.min(280, windowWidth - 16));
    const height = Math.min(
      menuHeight || items.length * 44 + 12,
      windowHeight - 32,
    );
    if (!coords) return { top: 16, left: 8, width: menuWidth };
    const left = Math.max(
      8,
      Math.min(
        align === "right" ? coords.x + coords.width - menuWidth : coords.x,
        windowWidth - menuWidth - 8,
      ),
    );
    const below = windowHeight - coords.y - 8;
    const above = coords.y - coords.height - 8;
    const desiredTop =
      below < height && above > below
        ? coords.y - coords.height - height - 8
        : coords.y;
    return {
      position: "absolute" as const,
      top: Math.max(8, Math.min(desiredTop, windowHeight - height - 8)),
      left,
      width: menuWidth,
    };
  }, [coords, align, windowWidth, windowHeight, items.length, menuHeight]);

  return (
    <View style={[s.container, style]}>
      <View ref={triggerRef} collapsable={false} style={s.triggerWrap}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={placeholder}
          accessibilityState={{ expanded: isOpen, disabled }}
          disabled={disabled}
          onPress={handleToggle}
          style={({ pressed, hovered }: any) => [
            s.triggerBtn,
            disabled && { opacity: 0.5 },
            (hovered || pressed) && !disabled && { opacity: 0.85 },
            {
              outlineWidth: 0,
              outlineColor: "transparent",
              ...(Platform.OS === "web"
                ? ({
                    cursor: disabled ? "not-allowed" : "pointer",
                    outlineStyle: "none",
                  } as any)
                : {}),
            },
          ]}
        >
          {trigger || (
            <View style={s.defaultTrigger}>
              <Text numberOfLines={1} style={s.triggerText}>
                {placeholder}
              </Text>
              <Icon
                name={isOpen ? "chevronUp" : "chevronDown"}
                size={14}
                color={colors.muted}
              />
            </View>
          )}
        </Pressable>
      </View>

      <Modal
        visible={isOpen && !disabled}
        transparent
        animationType="none"
        onRequestClose={() => setOpenState(false)}
      >
        <Pressable
          style={s.backdrop}
          onPress={() => setOpenState(false)}
          accessible={false}
        >
          <Pressable
            accessible={false}
            role="menu"
            accessibilityViewIsModal
            accessibilityLabel={placeholder}
            onLayout={(event) => setMenuHeight(event.nativeEvent.layout.height)}
            style={[
              s.menu,
              menuPlacement,
              { maxHeight: windowHeight - 32 },
              menuStyle,
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={{ flexShrink: 1 }}
              showsVerticalScrollIndicator={false}
            >
              {items.map((item, index) => {
                if (item.divider) {
                  return <View key={`div-${index}`} style={s.divider} />;
                }

                const itemDisabled = !!item.disabled;

                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="menuitem"
                    accessibilityState={{ disabled: itemDisabled }}
                    disabled={itemDisabled}
                    onPress={() => {
                      setOpenState(false);
                      onSelect?.(item);
                    }}
                    style={({ pressed, hovered }: any) => [
                      s.item,
                      (hovered || pressed) &&
                        !itemDisabled && { backgroundColor: colors.canvas },
                      pressed && { opacity: 0.75 },
                      itemDisabled && s.disabledItem,
                      {
                        outlineWidth: 0,
                        outlineColor: "transparent",
                        ...(Platform.OS === "web"
                          ? ({
                              cursor: itemDisabled
                                ? "not-allowed"
                                : "pointer",
                              outlineStyle: "none",
                            } as any)
                          : {}),
                      },
                    ]}
                  >
                    <View style={s.itemContent}>
                      {item.icon && (
                        <Icon
                          name={item.icon}
                          size={15}
                          color={item.danger ? colors.danger : colors.muted}
                        />
                      )}
                      <Text
                        numberOfLines={1}
                        style={[
                          s.itemLabel,
                          item.danger && { color: colors.danger },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                    {item.shortcut && (
                      <Text style={s.shortcut}>{item.shortcut}</Text>
                    )}
                  </Pressable>
                );
              })}
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
    alignSelf: "flex-start",
  },
  defaultTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    minHeight: 44,
  },
  triggerText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.ink,
    flexShrink: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "transparent",
  },
  menu: {
    backgroundColor: colors.paper,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 6,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 28,
    elevation: 10,
    ...(Platform.OS === "web"
      ? ({ boxShadow: "0px 8px 28px rgba(35, 38, 33, 0.16)" } as any)
      : {}),
  },
  item: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  disabledItem: {
    opacity: 0.4,
  },
  itemContent: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemLabel: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "500",
    color: colors.ink,
  },
  shortcut: {
    fontSize: 11,
    color: colors.muted,
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
  },
  divider: {
    height: 1,
    backgroundColor: colors.line,
    marginVertical: 4,
  },
});
