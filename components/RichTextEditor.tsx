import React, { useRef, useState } from "react";
import {
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";
import { ModalDialog } from "./ModalDialog";
import { Input } from "./Input";
import { Button } from "./Button";

export interface RichTextEditorProps {
  /** Controlled markdown content */
  value?: string;
  /** Uncontrolled initial markdown content */
  defaultValue?: string;
  /** Change callback */
  onChange?: (value: string) => void;
  /** Change callback alias */
  onChangeText?: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label above editor */
  label?: string;
  /** Minimum height of the editor area (defaults to 140) */
  minHeight?: number;
  /** Accent highlight color */
  accent?: string;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Error message or flag */
  error?: boolean | string;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Input style */
  inputStyle?: StyleProp<TextStyle>;
  /** Toolbar container style */
  toolbarStyle?: StyleProp<ViewStyle>;
}

// A deliberately small Markdown subset, matching the formatting toolbar.
function inline(text: string): React.ReactNode[] {
  return text
    .split(
      /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g,
    )
    .map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**"))
        return (
          <Text key={i} style={{ fontWeight: "700" }}>
            {part.slice(2, -2)}
          </Text>
        );
      if (part.startsWith("*") && part.endsWith("*"))
        return (
          <Text key={i} style={{ fontStyle: "italic" }}>
            {part.slice(1, -1)}
          </Text>
        );
      if (part.startsWith("`") && part.endsWith("`"))
        return (
          <Text
            key={i}
            style={{
              fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
              backgroundColor: colors.canvas,
            }}
          >
            {part.slice(1, -1)}
          </Text>
        );
      const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
      if (link)
        return (
          <Text
            key={i}
            accessibilityRole="link"
            style={{ color: colors.info, textDecorationLine: "underline" }}
            onPress={() => {
              void Linking.openURL(link[2]).catch(() => {});
            }}
          >
            {link[1]}
          </Text>
        );
      return part;
    });
}

export function RichTextEditor({
  value: controlledValue,
  defaultValue = "",
  onChange,
  onChangeText,
  placeholder = "Write a note…",
  label,
  minHeight = 140,
  accent = colors.lime,
  disabled = false,
  error,
  style,
  inputStyle,
  toolbarStyle,
}: RichTextEditorProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isControlled ? controlledValue : internalValue;

  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const selection = useRef({ start: 0, end: 0 });
  const input = useRef<TextInput>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState("");

  const updateValue = (next: string) => {
    if (disabled) return;
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
    onChangeText?.(next);
  };

  const replace = (
    replacement: string,
    selectStart = replacement.length,
    selectEnd = selectStart,
  ) => {
    const start = Math.min(currentValue.length, selection.current.start);
    const end = Math.min(currentValue.length, selection.current.end);
    updateValue(currentValue.slice(0, start) + replacement + currentValue.slice(end));
    requestAnimationFrame(() => {
      input.current?.focus();
      input.current?.setNativeProps({
        selection: { start: start + selectStart, end: start + selectEnd },
      });
    });
  };

  const format = (prefix: string, suffix = prefix) => {
    const chosen =
      currentValue.slice(selection.current.start, selection.current.end) || "text";
    replace(
      prefix + chosen + suffix,
      prefix.length,
      prefix.length + chosen.length,
    );
  };

  const prefixLines = (prefix: string) => {
    const start =
      currentValue.lastIndexOf("\n", Math.max(0, selection.current.start - 1)) + 1;
    const end = selection.current.end;
    const text = currentValue.slice(start, end);
    selection.current = { start, end };
    replace(
      text
        .split("\n")
        .map((line) => prefix + line)
        .join("\n"),
    );
  };

  const words = currentValue.trim() ? currentValue.trim().split(/\s+/).length : 0;
  const hasError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <View style={[s.container, style]}>
      <View style={s.header}>
        {label && <Text style={s.label}>{label}</Text>}
        <View style={s.modes}>
          {(["edit", "preview"] as const).map((item) => (
            <Pressable
              key={item}
              accessibilityRole="tab"
              accessibilityState={{ selected: mode === item, disabled }}
              disabled={disabled}
              onPress={() => setMode(item)}
              style={({ pressed, hovered }: any) => [
                s.mode,
                mode === item && [s.modeActive, { backgroundColor: accent }],
                (hovered || pressed) && !disabled && mode !== item && s.modeHovered,
                disabled && s.disabled,
              ]}
            >
              <Text
                style={[
                  s.text,
                  mode === item && { fontWeight: "600" },
                ]}
              >
                {item === "edit" ? "Edit" : "Preview"}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View
        style={[
          s.box,
          hasError && s.boxError,
          disabled && s.boxDisabled,
        ]}
      >
        {mode === "edit" && (
          <View style={[s.toolbar, toolbarStyle]}>
            {[
              ["Bold", "B", () => format("**")],
              ["Italic", "I", () => format("*")],
              ["Code", "</>", () => format("`")],
              ["Bullet list", "• List", () => prefixLines("- ")],
              ["Quote", "Quote", () => prefixLines("> ")],
              [
                "Link",
                "Link",
                () => {
                  setLinkText(
                    currentValue.slice(selection.current.start, selection.current.end),
                  );
                  setLinkUrl("");
                  setLinkError("");
                  setLinkOpen(true);
                },
              ],
            ].map(([name, text, action]) => (
              <Pressable
                key={name as string}
                accessibilityRole="button"
                accessibilityLabel={name as string}
                accessibilityState={{ disabled }}
                disabled={disabled}
                onPress={action as () => void}
                style={({ pressed, hovered }: any) => [
                  s.tool,
                  (pressed || hovered) && !disabled && s.toolHovered,
                  disabled && s.disabled,
                ]}
              >
                <Text style={s.text}>{text as string}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {mode === "edit" ? (
          <TextInput
            ref={input}
            accessibilityLabel={label || "Note"}
            multiline
            textAlignVertical="top"
            editable={!disabled}
            value={currentValue}
            onChangeText={updateValue}
            onSelectionChange={(e) => {
              selection.current = e.nativeEvent.selection;
            }}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            style={[s.input, { minHeight }, inputStyle]}
          />
        ) : (
          <ScrollView
            style={{ minHeight, maxHeight: 360 }}
            contentContainerStyle={{ padding: 14, gap: 6 }}
          >
            {currentValue.trim() ? (
              currentValue.split("\n").map((line, index) => (
                <Text
                  key={index}
                  style={[s.preview, line.startsWith("> ") && s.quote]}
                >
                  {line.startsWith("- ")
                    ? ["• ", ...inline(line.slice(2))]
                    : inline(line.replace(/^> /, ""))}
                </Text>
              ))
            ) : (
              <Text style={s.muted}>Nothing to preview yet.</Text>
            )}
          </ScrollView>
        )}

        <Text style={[s.muted, s.footer]}>
          {words} {words === 1 ? "word" : "words"} · {currentValue.length} characters
        </Text>
      </View>

      {errorMessage && (
        <Text accessibilityLiveRegion="polite" style={s.errorText}>
          {errorMessage}
        </Text>
      )}

      <ModalDialog
        visible={linkOpen}
        onClose={() => setLinkOpen(false)}
        title="Insert link"
        footer={
          <Button
            accent={accent}
            onPress={() => {
              try {
                const url = new URL(linkUrl.trim());
                if (
                  !["http:", "https:"].includes(url.protocol) ||
                  !linkText.trim() ||
                  /[\]\n]/.test(linkText) ||
                  /[()\s]/.test(linkUrl.trim())
                )
                  throw new Error();
              } catch {
                setLinkError("Enter link text and a valid http or https URL.");
                return;
              }
              replace(`[${linkText.trim()}](${linkUrl.trim()})`);
              setLinkOpen(false);
            }}
          >
            Insert link
          </Button>
        }
      >
        <View style={{ gap: 12 }}>
          <Input
            label="Link text"
            value={linkText}
            onChangeText={setLinkText}
          />
          <Input
            label="URL"
            value={linkUrl}
            onChangeText={setLinkUrl}
            autoCapitalize="none"
            keyboardType="url"
            placeholder="https://"
          />
          {!!linkError && (
            <Text accessibilityRole="alert" style={{ color: colors.danger, fontSize: 12 }}>
              {linkError}
            </Text>
          )}
        </View>
      </ModalDialog>
    </View>
  );
}

const s = StyleSheet.create({
  container: { width: "100%", gap: 8 },
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: { fontSize: 14, fontWeight: "600", color: colors.ink },
  modes: { flexDirection: "row", gap: 4 },
  mode: {
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  modeHovered: {
    backgroundColor: colors.canvas,
  },
  modeActive: {
    backgroundColor: colors.lime,
  },
  text: { fontSize: 14, color: colors.ink },
  box: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors.paper,
  },
  boxError: {
    borderColor: colors.danger,
  },
  boxDisabled: {
    opacity: 0.6,
  },
  toolbar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    padding: 8,
    backgroundColor: colors.canvas,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  tool: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  toolHovered: {
    backgroundColor: colors.canvas,
    borderColor: colors.ink,
  },
  disabled: {
    opacity: 0.5,
    ...(Platform.OS === "web" ? ({ cursor: "not-allowed" } as any) : {}),
  },
  input: {
    fontSize: 16,
    lineHeight: 24,
    padding: 14,
    maxHeight: 360,
    color: colors.ink,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}),
  },
  preview: { fontSize: 16, lineHeight: 24, color: colors.ink },
  quote: {
    borderLeftWidth: 3,
    borderColor: colors.line,
    paddingLeft: 10,
    color: colors.muted,
  },
  muted: { fontSize: 12, color: colors.muted },
  footer: { padding: 12, borderTopWidth: 1, borderColor: colors.line },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 2,
  },
});
