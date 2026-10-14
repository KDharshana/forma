import React from "react";
import { Platform, StyleProp, ViewStyle } from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import { colors } from "./theme";

export type IconName =
  | "arrow"
  | "arrowUp"
  | "arrowDown"
  | "arrowLeft"
  | "arrowRight"
  | "chevron"
  | "chevronLeft"
  | "chevronRight"
  | "chevronDown"
  | "chevronUp"
  | "check"
  | "plus"
  | "close"
  | "search"
  | "grid"
  | "layers"
  | "code"
  | "copy"
  | "home"
  | "chart"
  | "users"
  | "settings"
  | "calendar"
  | "bell"
  | "wallet"
  | "book"
  | "spark"
  | "external"
  | "menu"
  | "filter"
  | "download"
  | "phone"
  | "mail"
  | "sun"
  | "eye"
  | "eyeOff"
  | "lock"
  | "unlock"
  | "shield"
  | "key"
  | "trash"
  | "edit"
  | "moreHorizontal"
  | "moreVertical"
  | "upload"
  | "file"
  | "folder"
  | "star"
  | "alertCircle"
  | "alertTriangle"
  | "infoCircle"
  | "checkCircle"
  | "refresh"
  | "share"
  | "send"
  | "clock"
  | "tag"
  | "dollar"
  | "printer"
  | "sliders"
  | "minus"
  | "list";

const paths: Record<IconName, string> = {
  arrow: "M4 12h16m-6-6 6 6-6 6",
  arrowUp: "M6 18 18 6M6 6h12v12",
  arrowDown: "M12 4v16m-6-6 6 6 6-6",
  arrowLeft: "M20 12H4m6-6-6 6 6 6",
  arrowRight: "M4 12h16m-6-6 6 6-6 6",
  chevron: "m9 5 7 7-7 7",
  chevronLeft: "m15 5-7 7 7 7",
  chevronRight: "m9 18 6-6-6-6",
  chevronDown: "m6 9 6 6 6-6",
  chevronUp: "m18 15-6-6-6 6",
  check: "m5 12 4 4L19 6",
  plus: "M12 5v14M5 12h14",
  close: "m6 6 12 12M6 18 18 6",
  search: "m16 16 4 4",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  layers: "m12 3 10 5-10 5L2 8l10-5Zm-10 9 10 5 10-5M2 16l10 5 10-5",
  code: "m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16",
  copy: "M8 8h12v12H8zM16 8V4H4v12h4",
  home: "m3 10 9-7 9 7v11h-6v-8H9v8H3V10Z",
  chart: "M4 3v17h17M8 16v-5m5 5V7m5 9V3",
  users: "M3 21v-3a5 5 0 0 1 10 0v3m4-8a5 5 0 0 1 5 5v3M16 3a4 4 0 0 1 0 8",
  settings: "M9 3h6l1 4 4 1v7l-4 1-1 5H9l-1-5-5-1V8l5-1 1-4Z",
  calendar: "M4 5h16v16H4zM4 10h16M8 3v4m8-4v4M8 14h2m4 0h2m-8 3h2",
  bell: "M18 8a6 6 0 0 0-12 0c0 8-3 8-3 9h18c0-1-3-1-3-9M10 21h4",
  wallet: "M3 5h17v15H3zM20 10h-7v5h7M3 5V3h13",
  book: "M3 3h7l2 2 2-2h7v17h-7l-2 2-2-2H3V3Zm9 2v17",
  spark: "m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z",
  external: "M13 3h8v8M10 14 21 3M9 3H3v18h18v-6",
  menu: "M4 6h16M4 12h16M4 18h16",
  filter: "M3 6h18M6 12h12M9 18h6",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  phone: "M7 2h10v20H7zM10 18h4",
  mail: "M3 5h18v14H3zM3 5l9 8 9-8",
  sun: "M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2",
  eye: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",
  eyeOff:
    "M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20",
  lock: "M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5z",
  unlock: "M7 11V7a5 5 0 0 1 9.9-1M5 11h14v10H5z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  key: "m21 3-9 9m3-3 2 2m-4 0 2 2M7.5 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z",
  trash:
    "M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  edit: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7m-1.5-8.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z",
  moreHorizontal: "M12 12h.01M19 12h.01M5 12h.01",
  moreVertical: "M12 12h.01M12 19h.01M12 5h.01",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m14-7-5-5-5 5m5-5v12",
  file: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM13 2v7h7",
  folder:
    "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
  star: "m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  alertCircle: "M12 8v4m0 4h.01M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0Z",
  alertTriangle:
    "m10.29 3.86-8.6 14.9A1 1 0 0 0 2.55 20h18.9a1 1 0 0 0 .86-1.24l-8.6-14.9a1 1 0 0 0-1.72 0zM12 9v4m0 4h.01",
  infoCircle: "M12 16v-4m0-4h.01M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0Z",
  checkCircle: "M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3",
  refresh: "M23 4v6h-6m-9.5 9A9 9 0 0 0 20 15M1 20v-6h6m9.5-9A9 9 0 0 0 4 9",
  share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8m-4-6-4-4-4 4m4-4v13",
  send: "m22 2-11 11m11-11-7 20-4-9-9-4 20-7z",
  clock: "M12 6v6l4 2M22 12A10 10 0 1 1 2 12a10 10 0 0 1 20 0Z",
  tag: "m20.59 13.41-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  dollar: "M12 1v22m5-18H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  printer:
    "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2m-12 0v4h12v-4",
  sliders: "M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6",
  minus: "M5 12h14",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
};

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Icon({
  name,
  size = 18,
  color = colors.ink,
  strokeWidth = 1.6,
  style,
  accessibilityLabel,
}: IconProps) {
  const isDecorative = !accessibilityLabel;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      {...(isDecorative
        ? Platform.OS === "web"
          ? { "aria-hidden": true }
          : {
              accessibilityElementsHidden: true,
              importantForAccessibility: "no-hide-descendants" as const,
            }
        : {
            accessibilityRole: "image",
            accessibilityLabel,
          })}
    >
      <Path d={paths[name]} />
      {name === "search" && <Circle cx="10.5" cy="10.5" r="6.5" />}
      {name === "users" && <Circle cx="8" cy="7" r="4" />}
      {name === "settings" && <Circle cx="12" cy="12" r="3" />}
      {name === "sun" && <Circle cx="12" cy="12" r="5" />}
      {name === "eye" && <Circle cx="12" cy="12" r="3" />}
      {name === "tag" && <Circle cx="7" cy="7" r="1" />}
    </Svg>
  );
}
