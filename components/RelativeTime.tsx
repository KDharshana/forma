import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
} from "react-native";
import { colors } from "./theme";

export interface RelativeTimeProps {
  /** Target date instance, ISO string, or timestamp */
  date: Date | string | number;
  /** Optional text prefix */
  prefix?: string;
  /** Optional text suffix */
  suffix?: string;
  /** Whether to auto-refresh periodically */
  live?: boolean;
  /** Refresh interval in milliseconds when live is true (defaults to 30000ms) */
  intervalMs?: number;
  /** Maximum number of lines */
  numberOfLines?: number;
  /** Text style */
  style?: StyleProp<TextStyle>;
}

export function formatRelativeTime(targetDate: Date | string | number): string {
  try {
    const d = typeof targetDate === "object" ? targetDate : new Date(targetDate);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);

    if (isNaN(diffSec)) return "invalid date";

    if (diffSec < 0) {
      // In future
      const absDiff = Math.abs(diffSec);
      if (absDiff < 60) return "in moments";
      if (absDiff < 3600) return `in ${Math.floor(absDiff / 60)}m`;
      if (absDiff < 86400) return `in ${Math.floor(absDiff / 3600)}h`;
      return `in ${Math.floor(absDiff / 86400)}d`;
    }

    if (diffSec < 30) return "just now";
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 172800) return "yesterday";
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;

    // Standard short date
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  } catch {
    return "invalid date";
  }
}

export function RelativeTime({
  date,
  prefix = "",
  suffix = "",
  live = false,
  intervalMs = 30000,
  numberOfLines = 1,
  style,
}: RelativeTimeProps) {
  const [formatted, setFormatted] = useState(() => formatRelativeTime(date));

  useEffect(() => {
    setFormatted(formatRelativeTime(date));

    if (!live) return;

    const interval = setInterval(() => {
      setFormatted(formatRelativeTime(date));
    }, intervalMs);

    return () => clearInterval(interval);
  }, [date, live, intervalMs]);

  let isoString = "";
  try {
    isoString =
      typeof date === "object"
        ? date.toISOString()
        : new Date(date).toISOString();
  } catch {
    isoString = String(date);
  }

  return (
    <Text
      style={[s.text, style]}
      numberOfLines={numberOfLines}
      accessibilityLabel={`Time: ${isoString || formatted}`}
      {...Platform.select({
        web: {
          title: isoString,
        },
      })}
    >
      {prefix}
      {formatted}
      {suffix}
    </Text>
  );
}

const s = StyleSheet.create({
  text: {
    fontSize: 12,
    color: colors.muted,
  },
});
