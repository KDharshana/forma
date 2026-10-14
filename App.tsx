import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Modal,
  useWindowDimensions,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Clipboard from "expo-clipboard";
import Svg, { Path, Circle } from "react-native-svg";
import {
  Button,
  Icon,
  IconName,
  colors,
  mono,
  MetricCard,
  AvatarGroup,
  Badge,
} from "./components";
import {
  categories,
  Category,
  ComponentId,
  Entry,
  registry,
} from "./showcase/registry";
import {
  blockCategories,
  BlockCategory,
  BlockEntry,
  BlockId,
  blockRegistry,
} from "./showcase/blockRegistry";
import { Example, people, points } from "./showcase/Examples";
import { BlockExample } from "./showcase/BlockExamples";
import { sources } from "./showcase/sources";
import { PropsViewer } from "./showcase/PropsViewer";
import { propsRegistry } from "./showcase/propsRegistry";

type Page = "Components" | "Blocks" | "Playground" | "Documentation";
const accents = [
  { name: "Lime", color: "#d4ef78" },
  { name: "Lilac", color: "#d9cafa" },
  { name: "Seafoam", color: "#b9dfd3" },
  { name: "Apricot", color: "#f2ccaa" },
];

if (Platform.OS === "web" && typeof document !== "undefined") {
  const styleId = "forma-input-outline-reset";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      *, *:focus, *:focus-visible {
        -webkit-tap-highlight-color: transparent !important;
      }
      input, textarea, select, [contenteditable="true"] {
        outline: none !important;
        outline-color: transparent !important;
        outline-width: 0 !important;
        outline-style: none !important;
        box-shadow: none !important;
      }
      input:focus, textarea:focus, select:focus, [contenteditable="true"]:focus,
      input:focus-visible, textarea:focus-visible, select:focus-visible, [contenteditable="true"]:focus-visible {
        outline: none !important;
        outline-color: transparent !important;
        outline-width: 0 !important;
        outline-style: none !important;
        box-shadow: none !important;
      }
      button:focus, [role="button"]:focus, [role="tab"]:focus, [role="radio"]:focus,
      button:focus-visible, [role="button"]:focus-visible, [role="tab"]:focus-visible, [role="radio"]:focus-visible {
        outline: none !important;
        outline-color: transparent !important;
        outline-width: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }
}

function Mark({
  size = 28,
  color = colors.ink,
}: {
  size?: number;
  color?: string;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Path
        fill={color}
        d="M15 15H3V9a6 6 0 0 1 12 0v6Zm2 0V3h6a6 6 0 0 1 0 12h-6Zm0 2h12v6a6 6 0 0 1-12 0v-6Zm-2 0v12H9a6 6 0 0 1 0-12h6Z"
      />
    </Svg>
  );
}
function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <View style={s.logo}>
      <Mark size={compact ? 23 : 27} />
      <Text style={[s.wordmark, compact && s.wordmarkCompact]}>
        forma<Text style={{ color: "#8c987b" }}>.</Text>
      </Text>
    </View>
  );
}
function IconButton({
  icon,
  label,
  onPress,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={({ pressed }) => [s.iconButton, pressed && { opacity: 0.5 }]}
    >
      <Icon name={icon} size={17} />
    </Pressable>
  );
}

function SourceBlock({
  code,
  label = "tsx",
  maxHeight = 390,
}: {
  code: string;
  label?: string;
  maxHeight?: number;
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 700;
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setCopied(false);
    setFailed(false);
  }, [code]);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <View style={s.codeBlock}>
      <View style={s.codeToolbar}>
        <Text style={s.codeLabel}>{label}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Copy code"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={async () => {
            try {
              const ok = await Clipboard.setStringAsync(code);
              setCopied(ok);
              setFailed(!ok);
            } catch {
              setFailed(true);
            }
          }}
          style={s.copyButton}
        >
          <Icon name={copied ? "check" : "copy"} size={13} color="#c8d0bb" />
          <Text style={s.copyText}>
            {copied ? "Copied!" : failed ? "Select to copy" : "Copy code"}
          </Text>
        </Pressable>
      </View>
      <ScrollView style={{ maxHeight }} nestedScrollEnabled>
        <ScrollView
          horizontal
          nestedScrollEnabled
          contentContainerStyle={{
            padding: isMobile ? 14 : 20,
            minWidth: "100%",
          }}
        >
          <Text selectable style={s.code}>
            {code}
          </Text>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

function HeroArt() {
  return (
    <View
      style={s.heroArt}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <View style={s.artCircle} />
      <View style={s.artDottedRing} />
      <View style={s.artMetric}>
        <View style={s.artMetricTop}>
          <Text style={s.artLabel}>A little progress, every day.</Text>
          <Icon name="arrowUp" size={13} />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            gap: 7,
            marginTop: 14,
          }}
        >
          <Text style={s.artNumber}>
            78<Text style={{ fontSize: 22 }}>%</Text>
          </Text>
          <Text style={s.artSmall}>of your weekly goal</Text>
        </View>
        <View
          style={{
            height: 7,
            borderRadius: 9,
            backgroundColor: "#e8eddf",
            marginTop: 18,
          }}
        >
          <View
            style={{
              height: 7,
              width: "78%",
              borderRadius: 9,
              backgroundColor: "#a4bc6c",
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 17,
          }}
        >
          <AvatarGroup people={people.slice(0, 3)} size={25} />
          <Badge tone="success">On track</Badge>
        </View>
      </View>
      <View style={s.artPill}>
        <View style={s.artCheck}>
          <Icon name="check" size={16} />
        </View>
        <View>
          <Text style={s.artPillTitle}>Make it your own.</Text>
          <Text style={s.artPillCaption}>
            Your code. Your creative freedom.
          </Text>
        </View>
      </View>
      <View style={s.artStar}>
        <Mark size={36} color="#667448" />
      </View>
      <Text style={s.artAnnotation}>a little more human ↗</Text>
    </View>
  );
}

function Detail({
  entry,
  accent,
  onClose,
}: {
  entry: Entry | BlockEntry | null;
  accent: string;
  onClose: () => void;
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 700;
  const isSmall = width < 480;
  const [file, setFile] = useState("Props");
  useEffect(() => setFile("Props"), [entry?.id]);
  useEffect(() => {
    if (Platform.OS !== "web" || !entry) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [entry, onClose]);

  if (!entry) return null;

  const isBlock = blockRegistry.some((b) => b.id === entry.id);
  const tabs = ["Props", "Usage", entry.file, ...entry.dependencies];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <SafeAreaView
        style={[s.modalBackdrop, isMobile && s.modalBackdropMobile]}
      >
        <View
          style={[
            s.modal,
            { maxHeight: isMobile ? "98%" : "94%" },
            isSmall && s.modalSmall,
          ]}
        >
          <View style={[s.modalHeader, isSmall && s.modalHeaderSmall]}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={s.eyebrow}>{entry.category.toUpperCase()}</Text>
              <Text
                accessibilityRole="header"
                style={[s.modalTitle, isSmall && s.modalTitleSmall]}
              >
                {entry.name}
              </Text>
            </View>
            <IconButton icon="close" label="Close details" onPress={onClose} />
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text
              style={[s.modalDescription, isSmall && s.modalDescriptionSmall]}
            >
              {entry.description}
            </Text>
            <View
              style={[
                s.detailBody,
                (isMobile || ((width < 1000 || isBlock) && width < 1200)) && {
                  flexDirection: "column",
                },
                isSmall && s.detailBodySmall,
              ]}
            >
              <View
                style={[
                  s.detailPreview,
                  {
                    backgroundColor: entry.background,
                    width:
                      isMobile || width < 1000 || (isBlock && width < 1200)
                        ? "100%"
                        : isBlock
                          ? 520
                          : 380,
                  },
                  isSmall && s.detailPreviewSmall,
                ]}
              >
                <View
                  style={{
                    width: "100%",
                    maxWidth: isBlock || isMobile ? "100%" : 380,
                  }}
                >
                  {isBlock ? (
                    <BlockExample
                      key={entry.id}
                      id={entry.id as BlockId}
                      accent={accent}
                    />
                  ) : (
                    <Example
                      key={entry.id}
                      id={entry.id as ComponentId}
                      accent={accent}
                    />
                  )}
                </View>
                <View style={s.liveLabel}>
                  <View style={s.greenDot} />
                  <Text style={s.previewLabel}>LIVE PREVIEW · TRY IT OUT</Text>
                </View>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.fileTabs}
                >
                  {tabs.map((name) => (
                    <Pressable
                      key={name}
                      accessibilityRole="tab"
                      aria-selected={file === name}
                      accessibilityState={{ selected: file === name }}
                      onPress={() => setFile(name)}
                      style={[s.fileTab, file === name && s.fileTabActive]}
                    >
                      <Text
                        style={[
                          s.fileTabText,
                          file === name && {
                            color: colors.ink,
                            fontWeight: "600",
                          },
                        ]}
                      >
                        {name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
                {file === "Props" ? (
                  <PropsViewer entry={entry} accent={accent} />
                ) : (
                  <SourceBlock
                    code={
                      file === "Usage"
                        ? entry.usage
                        : sources[
                            file.includes("/")
                              ? file
                              : `${isBlock && file === entry.file ? "blocks" : "components"}/${file}`
                          ] || "// Source not loaded"
                    }
                    label={file === "Usage" ? "example.tsx" : file}
                  />
                )}
                <View style={s.sourceNote}>
                  <Icon name="code" size={15} color="#88917a" />
                  <Text style={s.sourceNoteText}>
                    {isBlock
                      ? "Copy the block and its companion blocks into blocks/, with components/ alongside it. Install react-native-svg, react-native-safe-area-context, and expo-document-picker."
                      : "Copy the component and its companion files into components/. Install react-native-svg; Drawer needs react-native-safe-area-context and FileUploader needs expo-document-picker."}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
          <View style={[s.modalFooter, isSmall && s.modalFooterSmall]}>
            <Text style={s.modalFooterText}>React Native + TypeScript</Text>
            <View
              style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
            >
              <Icon name="check" size={13} color="#728352" />
              <Text style={s.modalFooterText}>Yours to customize</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function Docs() {
  const { width } = useWindowDimensions();
  const isMobile = width < 700;
  const isSmall = width < 480;
  return (
    <View style={[s.docs, isMobile && { paddingTop: 26, paddingBottom: 20 }]}>
      <View style={s.sectionEyebrow}>
        <View style={s.greenDot} />
        <Text style={s.eyebrow}>A LITTLE LESS SETUP. A LOT MORE CREATING.</Text>
      </View>
      <Text
        accessibilityRole="header"
        style={[
          s.pageTitle,
          isMobile && {
            fontSize: isSmall ? 30 : 34,
            lineHeight: isSmall ? 35 : 40,
            letterSpacing: -1.2,
          },
        ]}
      >
        Make yourself at home.
      </Text>
      <Text
        style={[
          s.pageDescription,
          isMobile && { fontSize: 13, lineHeight: 21, marginBottom: 20 },
        ]}
      >
        A collection of thoughtfully crafted React Native components. Copy the
        source, make it yours, and build something you love.
      </Text>
      <View style={[s.docsNote, isSmall && { padding: 14, gap: 10 }]}>
        <Icon name="code" size={21} />
        <Text style={s.docsNoteText}>
          Forma is source code you own. No component package, no hidden styles,
          no lock-in. The same components power this showcase on web, iOS, and
          Android.
        </Text>
      </View>
      <View style={[s.docStep, isSmall && { gap: 12, paddingTop: 24 }]}>
        <Text style={s.stepNumber}>01</Text>
        <View style={s.stepBody}>
          <Text style={s.stepTitle}>Start with an Expo app</Text>
          <Text style={s.stepDescription}>
            Already have a React Native project? You can skip this step.
          </Text>
          <SourceBlock
            label="terminal"
            code={"npx create-expo-app@latest my-app\ncd my-app"}
            maxHeight={130}
          />
        </View>
      </View>
      <View style={[s.docStep, isSmall && { gap: 12, paddingTop: 24 }]}>
        <Text style={s.stepNumber}>02</Text>
        <View style={s.stepBody}>
          <Text style={s.stepTitle}>Install the native dependencies</Text>
          <Text style={s.stepDescription}>
            Icons and charts use React Native SVG. File selection uses Expo
            Document Picker.
          </Text>
          <SourceBlock
            label="terminal"
            code={"npx expo install react-native-svg expo-document-picker"}
            maxHeight={90}
          />
        </View>
      </View>
      <View style={[s.docStep, isSmall && { gap: 12, paddingTop: 24 }]}>
        <Text style={s.stepNumber}>03</Text>
        <View style={s.stepBody}>
          <Text style={s.stepTitle}>Pick a component. Take the source.</Text>
          <Text style={s.stepDescription}>
            Open a component in the gallery. Copy its source file and each
            companion file listed in the tabs into a components directory. The
            Usage tab provides an example you can adapt.
          </Text>
          <SourceBlock
            label="your project"
            code={
              "components/\n  theme.ts          # Shared colors and typography\n  Icon.tsx          # Small, consistent SVG icons\n  Button.tsx        # Your first component\n  ...               # Add only what you need"
            }
            maxHeight={180}
          />
        </View>
      </View>
      <View style={[s.docStep, isSmall && { gap: 12, paddingTop: 24 }]}>
        <Text style={s.stepNumber}>04</Text>
        <View style={s.stepBody}>
          <Text style={s.stepTitle}>Give it your personality</Text>
          <Text style={s.stepDescription}>
            Change the accent prop, adjust the styles, or compose something new.
            Most controls are controlled components: you own their state and
            connect the behavior to your app.
          </Text>
          <SourceBlock
            label="example.tsx"
            code={
              'import { Button } from \'./components/Button\';\n\n<Button\n  variant="secondary"\n  accent="#d9cafa"\n  icon="arrow"\n  onPress={() => console.log(\'Let’s go\')}\n>\n  Make something good\n</Button>'
            }
            maxHeight={240}
          />
        </View>
      </View>
      <View style={[s.docsNote, isSmall && { padding: 14, gap: 10 }]}>
        <Icon name="phone" size={22} />
        <Text style={s.docsNoteText}>
          In a native app, wrap your screen with SafeAreaView from
          react-native-safe-area-context. Add KeyboardAvoidingView around forms,
          and connect navigation controls to your navigator. Web previews don’t
          replace testing on a device.
        </Text>
      </View>
    </View>
  );
}

function Playground({
  accent,
  setAccent,
  openComponent,
}: {
  accent: string;
  setAccent: (color: string) => void;
  openComponent: (entry: Entry | BlockEntry) => void;
}) {
  const { width } = useWindowDimensions();
  const isMobile = width < 850;
  const isSmall = width < 480;
  const [selected, setSelected] = useState(registry[0]);
  return (
    <View
      style={[s.playground, isMobile && { paddingTop: 26, paddingBottom: 20 }]}
    >
      <View style={s.sectionEyebrow}>
        <View style={s.greenDot} />
        <Text style={s.eyebrow}>A SPACE TO MAKE IT YOURS</Text>
      </View>
      <Text
        accessibilityRole="header"
        style={[
          s.pageTitle,
          isMobile && {
            fontSize: isSmall ? 30 : 34,
            lineHeight: isSmall ? 35 : 40,
            letterSpacing: -1.2,
          },
        ]}
      >
        A little room to play.
      </Text>
      <Text
        style={[
          s.pageDescription,
          isMobile && { fontSize: 13, lineHeight: 21, marginBottom: 20 },
        ]}
      >
        Try a new hue. Find your favorite piece. See what feels like you.
      </Text>
      <View
        style={[s.playgroundWorkspace, isMobile && { flexDirection: "column" }]}
      >
        <View
          style={[
            s.playControls,
            isMobile && {
              width: "100%",
              borderRightWidth: 0,
              padding: isSmall ? 14 : 20,
            },
          ]}
        >
          <Text style={s.controlTitle}>The building block</Text>
          <ScrollView
            style={{ maxHeight: isSmall ? 280 : 360 }}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled
          >
            <View style={{ gap: 6, paddingRight: 4 }}>
              {registry.map((entry) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Preview ${entry.name}`}
                  aria-selected={selected.id === entry.id}
                  accessibilityState={{ selected: selected.id === entry.id }}
                  key={entry.id}
                  onPress={() => setSelected(entry)}
                  style={[
                    s.playOption,
                    selected.id === entry.id && { backgroundColor: "#edf1e4" },
                  ]}
                >
                  <Icon name={entry.icon} size={15} />
                  <Text style={s.playOptionText}>{entry.name}</Text>
                  {selected.id === entry.id && (
                    <Icon name="check" size={13} color="#72814f" />
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>
          <View style={s.controlDivider} />
          <Text style={s.controlTitle}>A touch of color</Text>
          <View style={s.swatches}>
            {accents.map((a) => (
              <Pressable
                key={a.name}
                accessibilityRole="radio"
                accessibilityLabel={a.name}
                aria-checked={accent === a.color}
                accessibilityState={{ checked: accent === a.color }}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                onPress={() => setAccent(a.color)}
                style={[
                  s.swatch,
                  {
                    backgroundColor: a.color,
                    borderColor: accent === a.color ? "#49523c" : "transparent",
                  },
                ]}
              >
                {accent === a.color && <Icon name="check" size={16} />}
              </Pressable>
            ))}
          </View>
          <Text style={s.colorName}>
            {accents.find((a) => a.color === accent)?.name}{" "}
            <Text style={{ color: "#a1a697" }}> / {accent.toUpperCase()}</Text>
          </Text>
        </View>
        <View
          style={[
            s.playCanvas,
            { backgroundColor: selected.background },
            isMobile && {
              padding: isSmall ? 16 : 22,
              minHeight: isSmall ? 360 : 440,
            },
          ]}
        >
          <View style={s.canvasTop}>
            <View style={s.greenDot} />
            <Text style={s.previewLabel}>LIVE PREVIEW</Text>
          </View>
          <View style={s.canvasCenter}>
            <Example key={selected.id} id={selected.id} accent={accent} />
          </View>
          <View style={s.canvasFooter}>
            <Text style={s.canvasHint}>Go ahead. It’s made to be touched.</Text>
            <Button
              variant="outline"
              icon="code"
              onPress={() => openComponent(selected)}
            >
              View code
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
}

function Showcase() {
  const { width } = useWindowDimensions();
  const desktop = width >= 1080;
  const mobile = width < 700;
  const isSmall = width < 380;
  const [page, setPage] = useState<Page>("Components");
  const [category, setCategory] = useState<Category>("All components");
  const [blockCategory, setBlockCategory] =
    useState<BlockCategory>("All blocks");
  const [query, setQuery] = useState("");
  const [accent, setAccent] = useState(colors.lime);
  const [detail, setDetail] = useState<Entry | BlockEntry | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const search = useRef<TextInput>(null);
  const collectionY = useRef(0);
  const columnCount = width >= 1340 ? 3 : width >= 760 ? 2 : 1;
  const blockColumnCount = width >= 1200 ? 2 : 1;
  const items = useMemo(
    () =>
      registry.filter(
        (entry) =>
          (category === "All components" || category === entry.category) &&
          `${entry.name} ${entry.description} ${entry.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [category, query],
  );
  const blockItems = useMemo(
    () =>
      blockRegistry.filter(
        (entry) =>
          (blockCategory === "All blocks" ||
            blockCategory === entry.category) &&
          `${entry.name} ${entry.description} ${entry.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [blockCategory, query],
  );
  const go = (next: Page) => {
    setPage(next);
    setMenuOpen(false);
    scroll.current?.scrollTo({ y: 0, animated: false });
  };
  useEffect(() => {
    if (Platform.OS !== "web") return;
    document.title = "Forma — Thoughtfully native components";
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        search.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const selectCategory = (next: Category) => {
    setCategory(next);
    setQuery("");
    go("Components");
  };
  const renderSidebar = (inDrawer: boolean) => (
    <>
      {inDrawer ? (
        <View style={s.drawerBrandRow}>
          <Logo compact={isSmall} />
          <IconButton
            icon="close"
            label="Close navigation menu"
            onPress={() => setMenuOpen(false)}
          />
        </View>
      ) : (
        <View style={s.sidebarBrand}>
          <Logo />
          <View style={s.nativeBadge}>
            <Text style={s.nativeBadgeText}>NATIVE</Text>
          </View>
        </View>
      )}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.sidebarContent}
      >
        <Text style={s.navHeading}>THE WORKSPACE</Text>
        {(
          [
            {
              name: "Components",
              icon: "grid",
              count: registry.length.toString(),
            },
            {
              name: "Blocks",
              icon: "layers",
              count: blockRegistry.length.toString(),
            },
            { name: "Playground", icon: "spark" },
            { name: "Documentation", icon: "book" },
          ] as { name: Page; icon: IconName; count?: string }[]
        ).map((item) => (
          <Pressable
            key={item.name}
            accessibilityRole="button"
            aria-selected={page === item.name}
            accessibilityState={{ selected: page === item.name }}
            onPress={() => go(item.name)}
            style={[s.navItem, page === item.name && s.navItemActive]}
          >
            <Icon
              name={item.icon}
              size={16}
              color={page === item.name ? "#465337" : "#929789"}
            />
            <Text style={[s.navText, page === item.name && s.navTextActive]}>
              {item.name}
            </Text>
            {item.count && <Text style={s.navCount}>{item.count}</Text>}
          </Pressable>
        ))}
        <Text style={[s.navHeading, { marginTop: 31 }]}>
          {page === "Blocks" ? "BLOCK CATEGORIES" : "THE COLLECTION"}
        </Text>
        {page === "Blocks"
          ? blockCategories.slice(1).map((cat) => (
              <Pressable
                key={cat}
                accessibilityRole="button"
                onPress={() => {
                  setBlockCategory(cat);
                  setQuery("");
                  go("Blocks");
                }}
                style={s.collectionNav}
              >
                <View
                  style={[
                    s.categoryDot,
                    {
                      backgroundColor:
                        (
                          {
                            "Auth & Access": "#c9bbe0",
                            "Navigation & Shell": "#afd0c7",
                            "Dashboard & Records": "#bccaa0",
                            "Forms & Workflows": "#dac6ad",
                            "Operations & Commerce": "#eed3b3",
                            "Feedback & States": "#d0dfbc",
                          } as Record<string, string>
                        )[cat] || "#bccaa0",
                    },
                  ]}
                />
                <Text style={s.collectionText}>{cat}</Text>
                <Text style={s.collectionCount}>
                  {blockRegistry
                    .filter((e) => e.category === cat)
                    .length.toString()
                    .padStart(2, "0")}
                </Text>
              </Pressable>
            ))
          : categories.slice(1).map((cat) => (
              <Pressable
                key={cat}
                accessibilityRole="button"
                onPress={() => selectCategory(cat)}
                style={s.collectionNav}
              >
                <View
                  style={[
                    s.categoryDot,
                    {
                      backgroundColor:
                        (
                          {
                            "Data display": "#bccaa0",
                            Inputs: "#c9bbe0",
                            Navigation: "#afd0c7",
                            Feedback: "#dac6ad",
                            "Overlays & Layout": "#eed3b3",
                          } as Record<string, string>
                        )[cat] || "#bccaa0",
                    },
                  ]}
                />
                <Text style={s.collectionText}>{cat}</Text>
                <Text style={s.collectionCount}>
                  {registry
                    .filter((e) => e.category === cat)
                    .length.toString()
                    .padStart(2, "0")}
                </Text>
              </Pressable>
            ))}
        <View style={s.sidebarDivider} />
        <Text style={s.navHeading}>A FEW FAVORITES</Text>
        {(page === "Blocks"
          ? blockRegistry.filter((e) =>
              ["auth-login", "dashboard-analytics", "invoice-builder"].includes(
                e.id,
              ),
            )
          : registry.filter((e) =>
              ["metric", "task", "navigation"].includes(e.id),
            )
        ).map((entry) => (
          <Pressable
            key={entry.id}
            accessibilityRole="button"
            onPress={() => {
              setDetail(entry);
              setMenuOpen(false);
            }}
            style={s.favorite}
          >
            <Text style={s.favoriteText}>{entry.name}</Text>
            <Icon name="arrowUp" size={12} color="#a6ac9e" />
          </Pressable>
        ))}
      </ScrollView>
      <View style={s.sidebarCallout}>
        <View style={s.smallFlower}>
          <Mark size={22} color="#7d8b5d" />
        </View>
        <Text style={s.calloutTitle}>Less setup. More you.</Text>
        <Text style={s.calloutDescription}>
          A starting point for your next something great.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => go("Documentation")}
          style={s.calloutLink}
        >
          <Text style={s.calloutLinkText}>Start building</Text>
          <Icon name="arrow" size={14} color="#566643" />
        </Pressable>
      </View>
      <View style={s.sidebarBottom}>
        <View style={s.greenDot} />
        <Text style={s.version}>v0.1 · Made with care</Text>
        <Icon name="spark" size={13} color="#9ca68f" />
      </View>
    </>
  );
  return (
    <SafeAreaView style={s.root} edges={["top", "bottom"]}>
      <StatusBar style="dark" />
      <View style={s.shell}>
        {desktop && <View style={s.sidebar}>{renderSidebar(false)}</View>}
        <View style={s.main}>
          <View
            style={[
              s.topbar,
              mobile && s.topbarMobile,
              isSmall && { paddingHorizontal: 12 },
            ]}
          >
            <View
              style={[
                s.breadcrumb,
                mobile && { gap: isSmall ? 6 : 8, flexShrink: 0 },
              ]}
            >
              {!desktop && (
                <IconButton
                  icon="menu"
                  label="Open navigation menu"
                  onPress={() => setMenuOpen(true)}
                />
              )}
              {!desktop ? (
                <Logo compact={isSmall} />
              ) : (
                <>
                  <Text style={s.breadcrumbMuted}>Workspace</Text>
                  <Text style={s.breadcrumbSlash}>/</Text>
                  <Text style={s.breadcrumbCurrent}>{page}</Text>
                </>
              )}
            </View>
            <View style={[s.topbarRight, mobile && s.topbarRightMobile]}>
              <View style={[s.search, mobile && s.searchMobile]}>
                <Icon name="search" size={16} color="#8b9282" />
                <TextInput
                  ref={search}
                  accessibilityLabel={
                    page === "Blocks" ? "Search blocks" : "Search components"
                  }
                  placeholder={
                    mobile
                      ? "Search…"
                      : page === "Blocks"
                        ? "Search blocks…"
                        : "Search components…"
                  }
                  placeholderTextColor="#9ba191"
                  value={query}
                  onChangeText={(value) => {
                    setQuery(value);
                    if (page !== "Blocks" && page !== "Components") {
                      setPage("Components");
                    }
                  }}
                  style={[
                    s.searchInput,
                    Platform.OS === "web"
                      ? ({
                          outlineWidth: 0,
                          outlineColor: "transparent",
                          outlineStyle: "none",
                        } as any)
                      : undefined,
                  ]}
                />
                {query ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Clear search"
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    style={s.searchClearBtn}
                    onPress={() => setQuery("")}
                  >
                    <Icon name="close" size={13} />
                  </Pressable>
                ) : (
                  !mobile && (
                    <Text style={s.shortcut}>
                      {Platform.OS === "web" ? "⌘ K" : "⌕"}
                    </Text>
                  )
                )}
              </View>
              {!mobile && <View style={s.topbarDivider} />}
              {!mobile && (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => go("Documentation")}
                  style={s.docsLink}
                >
                  <Text style={s.docsLinkText}>Get started</Text>
                  <Icon name="arrowUp" size={14} />
                </Pressable>
              )}
            </View>
          </View>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <ScrollView
              ref={scroll}
              style={s.scroll}
              contentContainerStyle={[
                s.content,
                mobile && { paddingHorizontal: 20 },
              ]}
              keyboardShouldPersistTaps="handled"
            >
              {page === "Components" && (
                <>
                  <View
                    style={[
                      s.hero,
                      mobile && { paddingTop: 28, paddingBottom: 28 },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={s.sectionEyebrow}>
                        <View style={s.greenDot} />
                        <Text style={s.eyebrow}>
                          THOUGHTFULLY NATIVE. BEAUTIFULLY SIMPLE.
                        </Text>
                      </View>
                      <Text
                        accessibilityRole="header"
                        style={[
                          s.heroTitle,
                          mobile && {
                            fontSize: isSmall ? 32 : 38,
                            lineHeight: isSmall ? 37 : 44,
                            letterSpacing: -1.5,
                          },
                        ]}
                      >
                        Small pieces.
                        <Text style={{ color: "#7e8971" }}>
                          {"\n"}Exceptional apps.
                        </Text>
                      </Text>
                      <Text
                        style={[
                          s.heroDescription,
                          mobile && {
                            fontSize: 13,
                            lineHeight: 21,
                            marginTop: 12,
                          },
                        ]}
                      >
                        Beautiful React Native components, ready to make your
                        own.{"\n"}A little less starting from scratch. A little
                        more creating.
                      </Text>
                      <View
                        style={[
                          s.heroActions,
                          mobile && { gap: 12, marginTop: 18 },
                        ]}
                      >
                        <Button
                          icon="arrow"
                          onPress={() =>
                            scroll.current?.scrollTo({
                              y: collectionY.current,
                              animated: true,
                            })
                          }
                        >
                          Explore components
                        </Button>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => go("Documentation")}
                          style={s.heroTextButton}
                        >
                          <Icon name="code" size={16} color="#7d8573" />
                          <Text style={s.heroTextButtonLabel}>
                            Your code. Your canvas.
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                    {width >= 1190 && <HeroArt />}
                  </View>
                  <View style={s.featureStrip}>
                    <View style={s.feature}>
                      <Icon name="phone" size={15} color="#7b866b" />
                      <Text style={s.featureText}>Built for React Native</Text>
                    </View>
                    <View style={s.feature}>
                      <Icon name="code" size={16} color="#7b866b" />
                      <Text style={s.featureText}>
                        Copy. Paste. Make it yours.
                      </Text>
                    </View>
                    {!mobile && (
                      <View style={s.feature}>
                        <Icon name="layers" size={16} color="#7b866b" />
                        <Text style={s.featureText}>
                          One collection. Endless possibilities.
                        </Text>
                      </View>
                    )}
                    <Text style={s.featureEnd}>CRAFTED, NOT COMPLICATED.</Text>
                  </View>
                  <View
                    onLayout={(event) => {
                      collectionY.current = event.nativeEvent.layout.y;
                    }}
                    style={s.collection}
                  >
                    <View style={s.collectionHeader}>
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 11,
                          }}
                        >
                          <Text
                            accessibilityRole="header"
                            style={s.collectionTitle}
                          >
                            The component collection
                          </Text>
                          <Text style={s.collectionTotal}>
                            {registry.length.toString().padStart(2, "0")}
                          </Text>
                        </View>
                        <Text style={s.collectionDescription}>
                          Good design is in the details. Start with a few of
                          ours.
                        </Text>
                      </View>
                      {!mobile && (
                        <View style={s.previewLegend}>
                          <View style={s.greenDot} />
                          <Text style={s.previewLegendText}>
                            Real components. Live previews.
                          </Text>
                        </View>
                      )}
                    </View>
                    <View
                      style={[
                        s.filtersRow,
                        mobile && { gap: 8, marginBottom: 16 },
                      ]}
                    >
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={s.filters}
                      >
                        {categories.map((cat) => (
                          <Pressable
                            accessibilityRole="tab"
                            aria-selected={category === cat}
                            accessibilityState={{ selected: category === cat }}
                            key={cat}
                            onPress={() => setCategory(cat)}
                            style={[
                              s.filter,
                              category === cat && s.filterActive,
                            ]}
                          >
                            <Text
                              style={[
                                s.filterText,
                                category === cat && s.filterTextActive,
                              ]}
                            >
                              {cat}
                            </Text>
                            {category === cat && (
                              <Text style={s.filterCount}>
                                {
                                  registry.filter(
                                    (e) =>
                                      cat === "All components" ||
                                      e.category === cat,
                                  ).length
                                }
                              </Text>
                            )}
                          </Pressable>
                        ))}
                      </ScrollView>
                      {!mobile && (
                        <View style={s.galleryIcon}>
                          <Icon name="grid" size={16} color="#748164" />
                        </View>
                      )}
                    </View>
                    <View style={s.gallery}>
                      {items.map((entry) => (
                        <View
                          testID={`component-${entry.id}`}
                          key={entry.id}
                          style={[
                            s.galleryCell,
                            {
                              width:
                                columnCount === 3
                                  ? "32%"
                                  : columnCount === 2
                                    ? "48.8%"
                                    : "100%",
                            },
                          ]}
                        >
                          <View style={s.galleryCard}>
                            <View
                              style={[
                                s.preview,
                                { backgroundColor: entry.background },
                                mobile && {
                                  padding: isSmall ? 12 : 16,
                                  minHeight: isSmall ? 260 : 285,
                                },
                              ]}
                            >
                              <View style={s.previewTop}>
                                <Text style={s.previewNumber}>
                                  {String(registry.indexOf(entry) + 1).padStart(
                                    2,
                                    "0",
                                  )}
                                </Text>
                                <Pressable
                                  accessibilityRole="button"
                                  accessibilityLabel={`View ${entry.name} source`}
                                  hitSlop={{
                                    top: 8,
                                    bottom: 8,
                                    left: 8,
                                    right: 8,
                                  }}
                                  onPress={() => setDetail(entry)}
                                  style={({ pressed }) => [
                                    s.previewExpand,
                                    { opacity: pressed ? 0.5 : 1 },
                                  ]}
                                >
                                  <Icon
                                    name="arrowUp"
                                    size={13}
                                    color="#77806c"
                                  />
                                </Pressable>
                              </View>
                              <View style={s.previewContent}>
                                <Example id={entry.id} accent={accent} />
                              </View>
                            </View>
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`Open ${entry.name} details`}
                              onPress={() => setDetail(entry)}
                              style={({ pressed }) => [
                                s.cardFooter,
                                mobile && { padding: 14 },
                                pressed && { backgroundColor: "#fafbf8" },
                              ]}
                            >
                              <View style={s.cardTitleRow}>
                                <Text style={s.cardTitle}>{entry.name}</Text>
                                {propsRegistry[entry.file]?.propsCount ? (
                                  <View style={s.propsCountPill}>
                                    <Text style={s.propsCountPillText}>
                                      {propsRegistry[entry.file].propsCount}{" "}
                                      props
                                    </Text>
                                  </View>
                                ) : null}
                                {entry.tag && (
                                  <Text
                                    style={[
                                      s.cardTag,
                                      entry.tag === "Popular" && {
                                        backgroundColor: "#edf2e4",
                                        color: "#73814e",
                                      },
                                    ]}
                                  >
                                    {entry.tag}
                                  </Text>
                                )}
                                <View style={{ flex: 1 }} />
                                <Icon name="code" size={14} color="#a0a793" />
                              </View>
                              <Text style={s.cardDescription}>
                                {entry.description}
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      ))}
                    </View>
                    {items.length === 0 && (
                      <View style={s.empty}>
                        <Icon name="search" size={30} color="#8b9874" />
                        <Text style={s.emptyTitle}>A little too specific?</Text>
                        <Text style={s.emptyDescription}>
                          No components match “{query}” in{" "}
                          {category.toLowerCase()}.
                        </Text>
                        <Button
                          variant="outline"
                          onPress={() => {
                            setQuery("");
                            setCategory("All components");
                          }}
                        >
                          Show all components
                        </Button>
                      </View>
                    )}
                    <View style={s.collectionBottom}>
                      <Text style={s.collectionBottomText}>
                        {items.length} thoughtfully crafted components. A good
                        place to start.
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => go("Playground")}
                        style={s.bottomLink}
                      >
                        <Text style={s.bottomLinkText}>
                          Meet your playground
                        </Text>
                        <Icon name="arrow" size={14} color="#66764f" />
                      </Pressable>
                    </View>
                  </View>
                </>
              )}
              {page === "Blocks" && (
                <>
                  <View
                    style={[
                      s.hero,
                      mobile && { paddingTop: 28, paddingBottom: 28 },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <View style={s.sectionEyebrow}>
                        <View style={s.greenDot} />
                        <Text style={s.eyebrow}>
                          COMPOSITE APPLICATION MODULES & SCREENS
                        </Text>
                      </View>
                      <Text
                        accessibilityRole="header"
                        style={[
                          s.heroTitle,
                          mobile && {
                            fontSize: isSmall ? 32 : 38,
                            lineHeight: isSmall ? 37 : 44,
                            letterSpacing: -1.5,
                          },
                        ]}
                      >
                        Ready-to-use.
                        <Text style={{ color: "#7e8971" }}>
                          {"\n"}Enterprise blocks.
                        </Text>
                      </Text>
                      <Text
                        style={[
                          s.heroDescription,
                          mobile && {
                            fontSize: 13,
                            lineHeight: 21,
                            marginTop: 12,
                          },
                        ]}
                      >
                        {blockRegistry.length} reusable blocks for records,
                        forms, and everyday workflows.
                        {"\n"}Preview each interaction and adapt the source for
                        your app.
                      </Text>
                      <View
                        style={[
                          s.heroActions,
                          mobile && { gap: 12, marginTop: 18 },
                        ]}
                      >
                        <Button
                          icon="arrow"
                          onPress={() =>
                            scroll.current?.scrollTo({
                              y: collectionY.current,
                              animated: true,
                            })
                          }
                        >
                          {"Explore " + blockRegistry.length + " blocks"}
                        </Button>
                        <Pressable
                          accessibilityRole="button"
                          onPress={() => go("Documentation")}
                          style={s.heroTextButton}
                        >
                          <Icon name="code" size={16} color="#7d8573" />
                          <Text style={s.heroTextButtonLabel}>
                            Integration & setup docs
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                  <View style={s.featureStrip}>
                    <View style={s.feature}>
                      <Icon name="layers" size={15} color="#7b866b" />
                      <Text style={s.featureText}>
                        {blockRegistry.length} Full blocks
                      </Text>
                    </View>
                    <View style={s.feature}>
                      <Icon name="shield" size={16} color="#7b866b" />
                      <Text style={s.featureText}>
                        Auth, Shell, CRM, Commerce, States
                      </Text>
                    </View>
                    {!mobile && (
                      <View style={s.feature}>
                        <Icon name="phone" size={16} color="#7b866b" />
                        <Text style={s.featureText}>
                          Web, iOS & Android Compatible
                        </Text>
                      </View>
                    )}
                    <Text style={s.featureEnd}>
                      ENTERPRISE GRADE ARCHITECTURE.
                    </Text>
                  </View>
                  <View
                    onLayout={(event) => {
                      collectionY.current = event.nativeEvent.layout.y;
                    }}
                    style={s.collection}
                  >
                    <View style={s.collectionHeader}>
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 11,
                          }}
                        >
                          <Text
                            accessibilityRole="header"
                            style={s.collectionTitle}
                          >
                            The block collection
                          </Text>
                          <Text style={s.collectionTotal}>
                            {blockRegistry.length.toString().padStart(2, "0")}
                          </Text>
                        </View>
                        <Text style={s.collectionDescription}>
                          Full-flow workflows and modular blocks. Interactive
                          previews with copyable source code.
                        </Text>
                      </View>
                      {!mobile && (
                        <View style={s.previewLegend}>
                          <View style={s.greenDot} />
                          <Text style={s.previewLegendText}>
                            Interactive blocks. Live previews.
                          </Text>
                        </View>
                      )}
                    </View>
                    <View
                      style={[
                        s.filtersRow,
                        mobile && { gap: 8, marginBottom: 16 },
                      ]}
                    >
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={s.filters}
                      >
                        {blockCategories.map((cat) => (
                          <Pressable
                            accessibilityRole="tab"
                            aria-selected={blockCategory === cat}
                            accessibilityState={{
                              selected: blockCategory === cat,
                            }}
                            key={cat}
                            onPress={() => setBlockCategory(cat)}
                            style={[
                              s.filter,
                              blockCategory === cat && s.filterActive,
                            ]}
                          >
                            <Text
                              style={[
                                s.filterText,
                                blockCategory === cat && s.filterTextActive,
                              ]}
                            >
                              {cat}
                            </Text>
                            {blockCategory === cat && (
                              <Text style={s.filterCount}>
                                {
                                  blockRegistry.filter(
                                    (e) =>
                                      cat === "All blocks" ||
                                      e.category === cat,
                                  ).length
                                }
                              </Text>
                            )}
                          </Pressable>
                        ))}
                      </ScrollView>
                      {!mobile && (
                        <View style={s.galleryIcon}>
                          <Icon name="layers" size={16} color="#748164" />
                        </View>
                      )}
                    </View>
                    <View style={s.gallery}>
                      {blockItems.map((entry) => (
                        <View
                          testID={`block-${entry.id}`}
                          key={entry.id}
                          style={[
                            s.galleryCell,
                            {
                              width: blockColumnCount === 2 ? "48.8%" : "100%",
                            },
                          ]}
                        >
                          <View style={s.galleryCard}>
                            <View
                              style={[
                                s.preview,
                                {
                                  backgroundColor: entry.background,
                                  minHeight: mobile ? 320 : 380,
                                  padding: isSmall ? 12 : 16,
                                  overflow: "hidden",
                                },
                              ]}
                            >
                              <View style={s.previewTop}>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                    flexShrink: 1,
                                  }}
                                >
                                  <Text style={s.previewNumber}>
                                    {String(
                                      blockRegistry.indexOf(entry) + 1,
                                    ).padStart(2, "0")}
                                  </Text>
                                  <Text style={s.blockCategoryBadge}>
                                    {entry.category}
                                  </Text>
                                </View>
                                <Pressable
                                  accessibilityRole="button"
                                  accessibilityLabel={`View ${entry.name} source`}
                                  hitSlop={{
                                    top: 8,
                                    bottom: 8,
                                    left: 8,
                                    right: 8,
                                  }}
                                  onPress={() => setDetail(entry)}
                                  style={({ pressed }) => [
                                    s.previewExpand,
                                    { opacity: pressed ? 0.5 : 1 },
                                  ]}
                                >
                                  <Icon
                                    name="arrowUp"
                                    size={13}
                                    color="#77806c"
                                  />
                                </Pressable>
                              </View>
                              <View style={s.blockPreviewContent}>
                                <BlockExample id={entry.id} accent={accent} />
                              </View>
                            </View>
                            <Pressable
                              accessibilityRole="button"
                              accessibilityLabel={`Open ${entry.name} details`}
                              onPress={() => setDetail(entry)}
                              style={({ pressed }) => [
                                s.cardFooter,
                                mobile && { padding: 14 },
                                pressed && { backgroundColor: "#fafbf8" },
                              ]}
                            >
                              <View style={s.cardTitleRow}>
                                <Text style={s.cardTitle}>{entry.name}</Text>
                                {propsRegistry[entry.file]?.propsCount ? (
                                  <View style={s.propsCountPill}>
                                    <Text style={s.propsCountPillText}>
                                      {propsRegistry[entry.file].propsCount}{" "}
                                      props
                                    </Text>
                                  </View>
                                ) : null}
                                {entry.tag && (
                                  <Text
                                    style={[
                                      s.cardTag,
                                      {
                                        backgroundColor: "#edf2e4",
                                        color: "#73814e",
                                      },
                                    ]}
                                  >
                                    {entry.tag}
                                  </Text>
                                )}
                                <View style={{ flex: 1 }} />
                                <Icon name="code" size={14} color="#a0a793" />
                              </View>
                              <Text style={s.cardDescription}>
                                {entry.description}
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      ))}
                    </View>
                    {blockItems.length === 0 && (
                      <View style={s.empty}>
                        <Icon name="search" size={30} color="#8b9874" />
                        <Text style={s.emptyTitle}>No matching blocks</Text>
                        <Text style={s.emptyDescription}>
                          No blocks match “{query}” in{" "}
                          {blockCategory.toLowerCase()}.
                        </Text>
                        <Button
                          variant="outline"
                          onPress={() => {
                            setQuery("");
                            setBlockCategory("All blocks");
                          }}
                        >
                          Show all blocks
                        </Button>
                      </View>
                    )}
                    <View style={s.collectionBottom}>
                      <Text style={s.collectionBottomText}>
                        {blockItems.length} application blocks. Ready to compose
                        into screens.
                      </Text>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => go("Components")}
                        style={s.bottomLink}
                      >
                        <Text style={s.bottomLinkText}>
                          Browse component primitives
                        </Text>
                        <Icon name="arrow" size={14} color="#66764f" />
                      </Pressable>
                    </View>
                  </View>
                </>
              )}
              {page === "Documentation" && <Docs />}
              {page === "Playground" && (
                <Playground
                  accent={accent}
                  setAccent={setAccent}
                  openComponent={setDetail}
                />
              )}
              <View style={s.footer}>
                <View style={s.footerBrand}>
                  <Mark size={18} color="#8d9880" />
                  <Text style={s.footerText}>
                    A little more thought in every component.
                  </Text>
                </View>
                <Text style={s.footerRight}>
                  MADE TO MAKE IT YOURS. © 2026 FORMA
                </Text>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </View>
      <Detail entry={detail} accent={accent} onClose={() => setDetail(null)} />
      <Modal
        visible={menuOpen && !desktop}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuOpen(false)}
      >
        <View style={s.mobileMenuBackdrop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close navigation menu"
            onPress={() => setMenuOpen(false)}
            style={StyleSheet.absoluteFill}
          />
          <SafeAreaView
            style={[
              s.mobileMenu,
              { width: Math.min(310, Math.max(260, width * 0.82)) },
            ]}
            edges={["top", "bottom", "left"]}
          >
            {renderSidebar(true)}
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Showcase />
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fbfcf9" },
  shell: { flex: 1, flexDirection: "row" },
  main: { flex: 1, minWidth: 0 },
  sidebar: {
    width: 223,
    borderRightWidth: 1,
    borderColor: "#e9ece3",
    backgroundColor: "#f7f9f3",
  },
  sidebarBrand: {
    height: 83,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    gap: 12,
  },
  drawerBrandRow: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#e9ece3",
  },
  logo: { flexDirection: "row", alignItems: "center", gap: 10 },
  wordmark: {
    color: colors.ink,
    fontSize: 29,
    fontWeight: "600",
    letterSpacing: -1.5,
  },
  wordmarkCompact: {
    fontSize: 23,
    letterSpacing: -1,
  },
  nativeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#dfe4d6",
  },
  nativeBadgeText: {
    color: "#7e8b6e",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
  },
  sidebarContent: { padding: 17, paddingTop: 21 },
  navHeading: {
    fontSize: 11,
    letterSpacing: 1.7,
    color: "#9aA38e",
    fontWeight: "600",
    marginLeft: 11,
    marginBottom: 13,
  },
  navItem: {
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 4,
    borderRadius: 9,
  },
  navItemActive: { backgroundColor: "#e8eddd" },
  navText: { color: "#828b76", fontSize: 13, flex: 1 },
  navTextActive: { fontWeight: "600", color: "#4e5b3e" },
  navCount: {
    color: "#73825d",
    fontSize: 11,
    backgroundColor: "#f5f7ef",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  collectionNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  categoryDot: { width: 6, height: 6, borderRadius: 2 },
  collectionText: { fontSize: 13, color: "#808976", flex: 1 },
  collectionCount: { fontSize: 11, fontFamily: mono, color: "#a8b09e" },
  sidebarDivider: {
    height: 1,
    backgroundColor: "#e5e9df",
    marginHorizontal: 11,
    marginTop: 24,
    marginBottom: 24,
  },
  favorite: {
    flexDirection: "row",
    minHeight: 44,
    paddingHorizontal: 11,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  favoriteText: { color: "#858e7b", fontSize: 12 },
  sidebarCallout: {
    margin: 19,
    marginBottom: 14,
    padding: 16,
    backgroundColor: "#edf1e5",
    borderRadius: 13,
  },
  smallFlower: { marginBottom: 12 },
  calloutTitle: { fontSize: 13, fontWeight: "600", color: "#59664a" },
  calloutDescription: {
    marginTop: 7,
    fontSize: 11,
    lineHeight: 16,
    color: "#949e88",
  },
  calloutLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
    paddingVertical: 8,
  },
  calloutLinkText: { fontSize: 12, fontWeight: "500", color: "#66764f" },
  sidebarBottom: {
    height: 50,
    borderTopWidth: 1,
    borderColor: "#e5e9de",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 24,
  },
  version: { fontSize: 11, color: "#9aa38e", flex: 1 },
  greenDot: {
    width: 5,
    height: 5,
    backgroundColor: "#9ead80",
    borderRadius: 4,
  },
  topbar: {
    height: 73,
    paddingHorizontal: 40,
    borderBottomWidth: 1,
    borderColor: "#e9ece3",
    backgroundColor: "#fbfcf9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  topbarMobile: {
    height: 64,
    paddingHorizontal: 16,
  },
  breadcrumb: { flexDirection: "row", alignItems: "center", gap: 12 },
  breadcrumbMuted: { color: "#9da592", fontSize: 12 },
  breadcrumbSlash: { color: "#c7ccbd", fontSize: 12 },
  breadcrumbCurrent: { color: "#68755b", fontSize: 12 },
  topbarRight: { flexDirection: "row", alignItems: "center", gap: 20 },
  topbarRightMobile: {
    gap: 8,
    flex: 1,
    minWidth: 100,
    justifyContent: "flex-end",
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    width: 241,
    height: 38,
    paddingHorizontal: 11,
    borderRadius: 8,
    backgroundColor: "#f4f6f0",
    borderWidth: 1,
    borderColor: "#e9ece2",
  },
  searchMobile: {
    width: undefined,
    flex: 1,
    minWidth: 100,
    maxWidth: 220,
    height: 40,
  },
  searchClearBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web" ? { outlineStyle: "none" as any } : {}),
    color: colors.ink,
    height: "100%",
  },
  shortcut: {
    fontFamily: mono,
    color: "#aab29e",
    fontSize: 11,
    backgroundColor: "#fcfdf9",
    padding: 3,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#e6eadf",
  },
  topbarDivider: { height: 20, width: 1, backgroundColor: "#e8ecdf" },
  docsLink: {
    flexDirection: "row",
    gap: 9,
    alignItems: "center",
    minHeight: 44,
  },
  docsLinkText: { fontSize: 12, fontWeight: "500", color: "#647154" },
  iconButton: {
    height: 44,
    width: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 41,
    width: "100%",
    maxWidth: 1510,
    alignSelf: "center",
  },
  hero: {
    paddingTop: 45,
    paddingBottom: 39,
    flexDirection: "row",
    alignItems: "center",
    minHeight: 301,
  },
  sectionEyebrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 17,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    fontWeight: "600",
    color: "#8d977f",
  },
  heroTitle: {
    fontSize: 53,
    lineHeight: 57,
    fontWeight: "500",
    letterSpacing: -2.8,
    color: "#293025",
  },
  heroDescription: {
    color: "#78836b",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 17,
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    marginTop: 25,
  },
  heroTextButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    minHeight: 44,
    paddingVertical: 8,
  },
  heroTextButtonLabel: { fontSize: 12, color: "#89947b" },
  heroArt: { width: 325, height: 237, marginLeft: 10 },
  artCircle: {
    width: 205,
    height: 205,
    borderRadius: 110,
    backgroundColor: "#f0f3e9",
    position: "absolute",
    top: 10,
    left: 53,
  },
  artDottedRing: {
    width: 250,
    height: 220,
    borderRadius: 150,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#dfe6d1",
    position: "absolute",
    left: 20,
    top: 14,
    transform: [{ rotate: "-20deg" }],
  },
  artMetric: {
    position: "absolute",
    top: 15,
    left: 40,
    width: 235,
    borderRadius: 17,
    backgroundColor: "#fff",
    padding: 20,
    borderWidth: 1,
    borderColor: "#e9ede1",
    transform: [{ rotate: "-7deg" }],
    boxShadow: "0px 10px 30px rgba(42, 54, 26, 0.07)",
  },
  artMetricTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  artLabel: { fontSize: 11, color: "#879376" },
  artNumber: { fontSize: 42, letterSpacing: -2, color: "#3e4a31" },
  artSmall: { fontSize: 11, color: "#a1aa95" },
  artPill: {
    position: "absolute",
    top: 167,
    right: -2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8d7",
    backgroundColor: "#f5f8ee",
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    transform: [{ rotate: "4deg" }],
    boxShadow: "0px 8px 22px rgba(42, 54, 26, 0.04)",
  },
  artCheck: {
    width: 34,
    height: 34,
    backgroundColor: "#dcebad",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 11,
  },
  artPillTitle: { color: "#566347", fontSize: 12, fontWeight: "500" },
  artPillCaption: { fontSize: 11, color: "#96a187", marginTop: 5 },
  artStar: {
    position: "absolute",
    right: 4,
    top: -1,
    transform: [{ rotate: "14deg" }],
  },
  artAnnotation: {
    fontSize: 11,
    fontStyle: "italic",
    color: "#a9b29b",
    position: "absolute",
    bottom: -4,
    left: 29,
    transform: [{ rotate: "-6deg" }],
  },
  featureStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e6ebdd",
    minHeight: 51,
    flexWrap: "wrap",
    paddingVertical: 12,
  },
  feature: { flexDirection: "row", gap: 8, alignItems: "center" },
  featureText: { color: "#8e9980", fontSize: 12 },
  featureEnd: {
    marginLeft: "auto",
    fontSize: 11,
    letterSpacing: 1.3,
    color: "#a7b099",
  },
  collection: { paddingTop: 33 },
  collectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 23,
  },
  collectionTitle: {
    fontSize: 21,
    fontWeight: "500",
    letterSpacing: -0.7,
    color: "#37422d",
  },
  collectionTotal: {
    color: "#8f9e7c",
    fontFamily: mono,
    fontSize: 11,
    backgroundColor: "#eef2e6",
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 5,
  },
  collectionDescription: { color: "#9aa48c", fontSize: 13, marginTop: 8 },
  previewLegend: { flexDirection: "row", alignItems: "center", gap: 7 },
  previewLegendText: { color: "#97a288", fontSize: 12 },
  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 21,
    gap: 16,
  },
  filters: { flexDirection: "row", gap: 8, paddingVertical: 4 },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 8,
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterActive: { backgroundColor: "#e9eddf" },
  filterText: { color: "#9aa38e", fontSize: 12 },
  filterTextActive: { color: "#60704b", fontWeight: "500" },
  filterCount: {
    fontSize: 11,
    color: "#7f8f69",
    backgroundColor: "#f7f9f2",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  galleryIcon: {
    width: 33,
    height: 31,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e0e6d6",
    backgroundColor: "#f2f5eb",
    alignItems: "center",
    justifyContent: "center",
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 24,
  },
  galleryCell: { alignSelf: "stretch" },
  galleryCard: {
    flex: 1,
    borderRadius: 13,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e4e9da",
    backgroundColor: "#fff",
  },
  preview: {
    minHeight: 298,
    flex: 1,
    padding: 23,
    justifyContent: "center",
    overflow: "hidden",
  },
  previewTop: {
    position: "absolute",
    top: 10,
    left: 13,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 1,
  },
  previewNumber: { fontSize: 11, fontFamily: mono, color: "#a3ac96" },
  previewExpand: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    backgroundColor: "#ffffff65",
  },
  previewContent: {
    width: "100%",
    maxWidth: 380,
    alignSelf: "center",
    paddingTop: 9,
  },
  cardFooter: { padding: 17, minHeight: 80 },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    rowGap: 6,
  },
  cardTitle: { fontSize: 14, color: "#48563a", fontWeight: "600" },
  cardTag: {
    fontSize: 11,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    color: "#9a8aa9",
    backgroundColor: "#f1ecf7",
  },
  propsCountPill: {
    backgroundColor: "#edf2e4",
    borderWidth: 1,
    borderColor: "#dae2cf",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  propsCountPillText: {
    fontFamily: mono,
    fontSize: 11,
    fontWeight: "600",
    color: "#576646",
  },
  cardDescription: { fontSize: 12, color: "#7e8a70", marginTop: 8 },
  collectionBottom: {
    paddingVertical: 29,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    flexWrap: "wrap",
  },
  collectionBottomText: { fontSize: 12, color: "#a3ad96" },
  bottomLink: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    minHeight: 44,
    paddingVertical: 8,
  },
  bottomLinkText: { fontSize: 12, color: "#7c8a69" },
  footer: {
    minHeight: 88,
    borderTopWidth: 1,
    borderColor: "#e7ecde",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    flexWrap: "wrap",
    paddingVertical: 24,
    marginTop: 16,
  },
  footerBrand: { flexDirection: "row", gap: 10, alignItems: "center" },
  footerText: { color: "#98a38a", fontSize: 12 },
  footerRight: { color: "#a5af99", fontSize: 11, letterSpacing: 1 },
  empty: {
    minHeight: 300,
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
  },
  emptyTitle: { fontSize: 21, color: "#65794e" },
  emptyDescription: { fontSize: 14, color: "#94a183", textAlign: "center" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "#17220fa6",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  modalBackdropMobile: {
    padding: 8,
  },
  modal: {
    backgroundColor: "#fbfcf9",
    width: "100%",
    maxWidth: 1020,
    borderRadius: 20,
    overflow: "hidden",
    boxShadow: "0px 30px 100px rgba(0,0,0,0.25)",
  },
  modalSmall: {
    borderRadius: 14,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 26,
    paddingBottom: 14,
  },
  modalHeaderSmall: {
    padding: 16,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 26,
    letterSpacing: -0.8,
    fontWeight: "500",
    color: colors.ink,
    marginTop: 7,
  },
  modalTitleSmall: {
    fontSize: 22,
    letterSpacing: -0.5,
  },
  modalDescription: {
    fontSize: 14,
    color: "#8e9882",
    marginHorizontal: 26,
    marginBottom: 22,
  },
  modalDescriptionSmall: {
    marginHorizontal: 16,
    marginBottom: 14,
  },
  detailBody: {
    flexDirection: "row",
    paddingHorizontal: 26,
    paddingBottom: 26,
    gap: 22,
    alignItems: "stretch",
  },
  detailBodySmall: {
    paddingHorizontal: 14,
    paddingBottom: 18,
    gap: 14,
  },
  detailPreview: {
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 370,
  },
  detailPreviewSmall: {
    padding: 14,
    minHeight: 280,
  },
  liveLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 27,
  },
  previewLabel: { fontSize: 11, letterSpacing: 1.1, color: "#8b9879" },
  fileTabs: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 11,
    minHeight: 44,
    alignItems: "center",
  },
  fileTab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    minHeight: 44,
    justifyContent: "center",
  },
  fileTabActive: { backgroundColor: "#e9eddf" },
  fileTabText: { fontSize: 12, color: "#9ba58d" },
  sourceNote: {
    flexDirection: "row",
    gap: 9,
    marginTop: 14,
    paddingHorizontal: 2,
  },
  sourceNoteText: { color: "#8d9980", fontSize: 12, lineHeight: 18, flex: 1 },
  modalFooter: {
    paddingHorizontal: 26,
    paddingVertical: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderColor: "#e6ebdd",
  },
  modalFooterSmall: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  modalFooterText: { fontSize: 12, color: "#96a087" },
  codeBlock: {
    backgroundColor: "#252d22",
    borderRadius: 11,
    overflow: "hidden",
  },
  codeToolbar: {
    backgroundColor: "#2d3629",
    paddingLeft: 18,
    paddingRight: 10,
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeLabel: { color: "#9aa98a", fontFamily: mono, fontSize: 11 },
  code: { color: "#d3debf", fontFamily: mono, fontSize: 12, lineHeight: 22 },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    minHeight: 40,
  },
  copyText: { color: "#b1bda2", fontSize: 12 },
  docs: { maxWidth: 840, paddingTop: 45, paddingBottom: 24 },
  pageTitle: {
    fontSize: 43,
    fontWeight: "500",
    color: "#37442c",
    letterSpacing: -1.8,
    marginBottom: 14,
  },
  pageDescription: {
    fontSize: 14,
    lineHeight: 22,
    color: "#96a287",
    marginBottom: 30,
  },
  docsNote: {
    padding: 21,
    backgroundColor: "#edf2e5",
    borderRadius: 12,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    marginVertical: 10,
  },
  docsNoteText: { flex: 1, color: "#869676", fontSize: 13, lineHeight: 20 },
  docStep: { flexDirection: "row", gap: 20, paddingTop: 34 },
  stepNumber: {
    fontFamily: mono,
    fontSize: 12,
    color: "#92a17e",
    backgroundColor: "#eaf0df",
    width: 35,
    height: 35,
    borderRadius: 10,
    textAlign: "center",
    paddingTop: 9,
  },
  stepBody: { flex: 1, minWidth: 0 },
  stepTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#4e603e",
    marginTop: 5,
  },
  stepDescription: {
    fontSize: 13,
    lineHeight: 21,
    color: "#97a38b",
    marginTop: 10,
    marginBottom: 15,
  },
  playground: { paddingTop: 45, paddingBottom: 20 },
  playgroundWorkspace: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e1e8d7",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
  },
  playControls: {
    width: 254,
    padding: 20,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderColor: "#e1e8d7",
  },
  controlTitle: {
    fontSize: 12,
    letterSpacing: 0.6,
    color: "#7b8d68",
    fontWeight: "600",
    marginBottom: 14,
  },
  playOption: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  playOptionText: { color: "#859778", fontSize: 13, flex: 1 },
  controlDivider: { height: 1, backgroundColor: "#e7eddf", marginVertical: 22 },
  swatches: { flexDirection: "row", gap: 12, flexWrap: "wrap" },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  colorName: { color: "#7b8e67", fontSize: 12, marginTop: 12 },
  playCanvas: {
    flex: 1,
    minHeight: 580,
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: 28,
  },
  canvasTop: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    marginBottom: 16,
  },
  canvasCenter: {
    flex: 1,
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    justifyContent: "center",
    marginVertical: 16,
  },
  canvasFooter: {
    alignItems: "center",
    gap: 12,
    marginTop: 16,
  },
  canvasHint: { color: "#98a889", fontSize: 12 },
  mobileMenuBackdrop: { flex: 1, backgroundColor: "#18201077" },
  mobileMenu: {
    width: 290,
    height: "100%",
    backgroundColor: "#f7f9f3",
    borderRightWidth: 1,
    borderColor: "#e3e7dc",
  },
  blockCategoryBadge: {
    fontSize: 11,
    fontFamily: mono,
    color: "#77806c",
    backgroundColor: "#ffffffaa",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  blockPreviewContent: {
    width: "100%",
    alignSelf: "center",
    paddingTop: 28,
  },
});
