import { registerRootComponent } from "expo";
import { Platform } from "react-native";
import App from "./App";

if (Platform.OS === "web" && typeof document !== "undefined") {
  const styleId = "forma-input-outline-reset";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      input, textarea, select, [contenteditable="true"] {
        outline: none !important;
        outline-color: transparent !important;
        outline-width: 0 !important;
        outline-style: none !important;
        box-shadow: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      input:focus, textarea:focus, select:focus, [contenteditable="true"]:focus,
      input:focus-visible, textarea:focus-visible, select:focus-visible, [contenteditable="true"]:focus-visible {
        outline: none !important;
        outline-color: transparent !important;
        outline-width: 0 !important;
        outline-style: none !important;
        box-shadow: none !important;
      }
    `;
    document.head.appendChild(style);
  }
}

registerRootComponent(App);
