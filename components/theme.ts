import { Platform } from "react-native";

export const colors = {
  ink: "#232621",
  muted: "#606858",
  line: "#e7e9e2",
  paper: "#ffffff",
  canvas: "#f7f8f5",
  lime: "#d4ef78",
  lavender: "#d9cafa",
  teal: "#c3e6df",
  apricot: "#f2ccaa",
  success: "#4f7a28",
  successBg: "#eef5e6",
  warning: "#965b12",
  warningBg: "#fef3e2",
  danger: "#a8352f",
  dangerBg: "#fdeeed",
  info: "#35668f",
  infoBg: "#e9f2fb",
};
export const mono = Platform.select({
  ios: "Menlo",
  android: "monospace",
  default: "monospace",
});
export const cardShadow = { boxShadow: "0px 6px 22px rgba(36, 43, 29, 0.04)" };
