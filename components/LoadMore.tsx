import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { Icon } from "./Icon";

export type LoadMoreStatus = "idle" | "loading" | "error" | "allLoaded";

export interface LoadMoreProps {
  /** Current state of the pagination */
  status: LoadMoreStatus;
  /** Callback fired when user clicks to load more or retry */
  onLoadMore: () => void;
  /** Label for idle load more button */
  label?: string;
  /** Label when actively fetching */
  loadingLabel?: string;
  /** Label when all items have been loaded */
  allLoadedLabel?: string;
  /** Label displayed upon error */
  errorLabel?: string;
  /** Label on the retry button */
  retryLabel?: string;
  /** Whether loading more is disabled */
  disabled?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Button style for the action trigger */
  buttonStyle?: StyleProp<ViewStyle>;
  /** Text style */
  textStyle?: StyleProp<TextStyle>;
}

export function LoadMore({
  status,
  onLoadMore,
  label = "Load more records",
  loadingLabel = "Fetching more records...",
  allLoadedLabel = "You've reached the end",
  errorLabel = "Failed to load additional records",
  retryLabel = "Retry",
  disabled = false,
  style,
  buttonStyle,
  textStyle,
}: LoadMoreProps) {
  if (status === "allLoaded") {
    return (
      <View style={[s.container, style]}>
        <View style={s.line} />
        <Text style={[s.endText, textStyle]}>{allLoadedLabel}</Text>
        <View style={s.line} />
      </View>
    );
  }

  if (status === "loading") {
    return (
      <View style={[s.container, style]}>
        <ActivityIndicator size="small" color={colors.ink} />
        <Text style={[s.loadingText, textStyle]}>{loadingLabel}</Text>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={[s.container, s.errorContainer, style]}>
        <View style={s.errorRow}>
          <Icon name="alertCircle" size={16} color={colors.danger} />
          <Text style={[s.errorText, textStyle]}>{errorLabel}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={retryLabel}
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={onLoadMore}
          hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          style={({ pressed, hovered }: any) => [
            s.retryBtn,
            (pressed || hovered) && !disabled && s.retryBtnActive,
            disabled && s.btnDisabled,
            buttonStyle,
          ]}
        >
          <Text style={s.retryText}>{retryLabel}</Text>
        </Pressable>
      </View>
    );
  }

  // idle
  return (
    <View style={[s.container, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onLoadMore}
        style={({ pressed, hovered }: any) => [
          s.loadBtn,
          (pressed || hovered) && !disabled && s.loadBtnActive,
          disabled && s.btnDisabled,
          buttonStyle,
        ]}
      >
        <Text style={[s.loadBtnText, textStyle]}>{label}</Text>
        <Icon name="chevronDown" size={14} color={colors.ink} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    minHeight: 56,
  },
  loadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 8,
    minHeight: 44,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  loadBtnActive: {
    backgroundColor: colors.line,
  },
  btnDisabled: {
    opacity: 0.5,
    ...(Platform.OS === "web" ? ({ cursor: "not-allowed" } as any) : {}),
  },
  loadBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  loadingText: {
    fontSize: 13,
    color: colors.muted,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.line,
  },
  endText: {
    fontSize: 12,
    color: colors.muted,
    paddingHorizontal: 12,
  },
  errorContainer: {
    flexDirection: "column",
    gap: 10,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  errorText: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: "500",
  },
  retryBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.danger,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  retryBtnActive: {
    backgroundColor: colors.dangerBg,
  },
  retryText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.danger,
  },
});
