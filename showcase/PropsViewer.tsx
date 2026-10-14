import React, { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { colors, mono } from "../components/theme";
import { Icon } from "../components/Icon";
import { propsRegistry, PropDoc } from "./propsRegistry";
import { Entry } from "./registry";
import { BlockEntry } from "./blockRegistry";

export interface PropsViewerProps {
  entry: Entry | BlockEntry;
  accent?: string;
}

export function PropsViewer({ entry, accent = colors.lime }: PropsViewerProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 700;
  const isSmall = width < 480;

  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "required" | "optional">(
    "all",
  );
  const [copied, setCopied] = useState(false);

  // Look up props definition
  const doc =
    propsRegistry[entry.file] ||
    propsRegistry[`components/${entry.file}`] ||
    propsRegistry[`blocks/${entry.file}`];

  const allProps = useMemo(() => doc?.props || [], [doc]);

  const requiredCount = useMemo(
    () => allProps.filter((p) => !p.optional).length,
    [allProps],
  );
  const optionalCount = useMemo(
    () => allProps.filter((p) => p.optional).length,
    [allProps],
  );

  const filteredProps = useMemo(() => {
    return allProps.filter((prop) => {
      if (filterType === "required" && prop.optional) return false;
      if (filterType === "optional" && !prop.optional) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        prop.name.toLowerCase().includes(q) ||
        prop.type.toLowerCase().includes(q) ||
        prop.description.toLowerCase().includes(q)
      );
    });
  }, [allProps, filterType, query]);

  const copyInterface = async () => {
    if (!doc) return;
    const lines = [
      `export interface ${doc.interfaceName} {`,
      ...doc.props.map((p) => {
        const comment = p.description ? `  /** ${p.description} */\n` : "";
        const opt = p.optional ? "?" : "";
        return `${comment}  ${p.name}${opt}: ${p.type};`;
      }),
      "}",
    ];
    await Clipboard.setStringAsync(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!doc || allProps.length === 0) {
    return (
      <View style={s.emptyContainer}>
        <Icon name="code" size={32} color="#8a947d" />
        <Text style={s.emptyTitle}>Props documentation</Text>
        <Text style={s.emptyText}>
          No exported props interface was indexed for {entry.file}.
        </Text>
      </View>
    );
  }

  return (
    <View style={s.container}>
      {/* Header bar */}
      <View style={[s.headerBar, isSmall && s.headerBarMobile]}>
        <View style={s.headerInfo}>
          <View style={s.titleRow}>
            <Text style={s.interfaceName}>{doc.interfaceName}</Text>
            <View style={s.countBadge}>
              <Text style={s.countBadgeText}>{allProps.length} props</Text>
            </View>
          </View>
          <Text style={s.headerSummary}>
            {requiredCount} required · {optionalCount} optional
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Copy TypeScript interface"
          onPress={copyInterface}
          style={({ pressed }) => [
            s.copyButton,
            isSmall && s.copyButtonMobile,
            { backgroundColor: copied ? "#d4ef78" : colors.paper },
            pressed && { opacity: 0.75 },
          ]}
        >
          <Icon name={copied ? "check" : "copy"} size={14} color={colors.ink} />
          <Text style={s.copyButtonText}>
            {copied ? "Copied" : "Copy type"}
          </Text>
        </Pressable>
      </View>

      {/* Filter and search controls */}
      <View style={[s.controlsRow, isMobile && s.controlsRowMobile]}>
        <View style={[s.searchBox, isMobile && s.searchBoxMobile]}>
          <Icon name="search" size={15} color="#8a947d" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Filter props..."
            placeholderTextColor="#8a947d"
            accessibilityLabel="Filter props by name or type"
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
          {query.length > 0 && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear prop filter"
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={s.clearBtn}
              onPress={() => setQuery("")}
            >
              <Icon name="close" size={13} color="#606757" />
            </Pressable>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterTabs}
          style={isMobile ? s.filterTabsScrollMobile : undefined}
        >
          <Pressable
            accessibilityRole="tab"
            aria-selected={filterType === "all"}
            accessibilityState={{ selected: filterType === "all" }}
            onPress={() => setFilterType("all")}
            style={[s.filterChip, filterType === "all" && s.filterChipActive]}
          >
            <Text
              style={[
                s.filterChipText,
                filterType === "all" && s.filterChipTextActive,
              ]}
            >
              All ({allProps.length})
            </Text>
          </Pressable>

          {requiredCount > 0 && (
            <Pressable
              accessibilityRole="tab"
              aria-selected={filterType === "required"}
              accessibilityState={{ selected: filterType === "required" }}
              onPress={() => setFilterType("required")}
              style={[
                s.filterChip,
                filterType === "required" && s.filterChipActive,
              ]}
            >
              <Text
                style={[
                  s.filterChipText,
                  filterType === "required" && s.filterChipTextActive,
                ]}
              >
                Required ({requiredCount})
              </Text>
            </Pressable>
          )}

          <Pressable
            accessibilityRole="tab"
            aria-selected={filterType === "optional"}
            accessibilityState={{ selected: filterType === "optional" }}
            onPress={() => setFilterType("optional")}
            style={[
              s.filterChip,
              filterType === "optional" && s.filterChipActive,
            ]}
          >
            <Text
              style={[
                s.filterChipText,
                filterType === "optional" && s.filterChipTextActive,
              ]}
            >
              Optional ({optionalCount})
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* Prop List */}
      <View style={[s.propsList, isSmall && { padding: 10 }]}>
        {filteredProps.length === 0 ? (
          <View style={s.noResults}>
            <Icon name="search" size={24} color="#a1ab96" />
            <Text style={s.noResultsText}>
              No props matching &quot;{query}&quot;
            </Text>
          </View>
        ) : (
          filteredProps.map((prop) => (
            <View
              key={prop.name}
              style={[s.propCard, isSmall && s.propCardSmall]}
            >
              <View style={s.propTopRow}>
                <View style={s.propNameGroup}>
                  <Text style={s.propName}>{prop.name}</Text>
                  {prop.optional ? (
                    <View style={s.optionalBadge}>
                      <Text style={s.optionalBadgeText}>optional</Text>
                    </View>
                  ) : (
                    <View style={s.requiredBadge}>
                      <Text style={s.requiredBadgeText}>required</Text>
                    </View>
                  )}
                </View>

                {prop.defaultValue !== undefined && (
                  <View style={s.defaultChip}>
                    <Text style={s.defaultLabel}>default:</Text>
                    <Text style={s.defaultValueText}>{prop.defaultValue}</Text>
                  </View>
                )}
              </View>

              <View style={s.typeContainer}>
                <ScrollView
                  horizontal
                  nestedScrollEnabled
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.typeScroll}
                >
                  <Text style={s.typeText}>{prop.type}</Text>
                </ScrollView>
              </View>

              {Boolean(prop.description) && (
                <Text style={s.descriptionText}>{prop.description}</Text>
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4e8dc",
    borderRadius: 8,
    overflow: "hidden",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#f7f9f3",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e8dc",
    flexWrap: "wrap",
    gap: 12,
  },
  headerBarMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  headerInfo: {
    flex: 1,
    minWidth: 180,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  interfaceName: {
    fontFamily: mono,
    fontSize: 15,
    fontWeight: "700",
    color: colors.ink,
  },
  countBadge: {
    backgroundColor: "#e8ede0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countBadgeText: {
    fontFamily: mono,
    fontSize: 11,
    color: "#546045",
    fontWeight: "600",
  },
  headerSummary: {
    fontSize: 12,
    color: "#727c65",
    marginTop: 3,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d2d8c7",
    minHeight: 44,
  },
  copyButtonMobile: {
    width: "100%",
    justifyContent: "center",
  },
  copyButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
  },
  controlsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2e7",
    backgroundColor: "#fafbf8",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
    justifyContent: "space-between",
  },
  controlsRowMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d9decb",
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 44,
    flex: 1,
    minWidth: 180,
  },
  searchBoxMobile: {
    width: "100%",
    minWidth: "100%",
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.ink,
    paddingVertical: 8,
  },
  clearBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  filterTabsScrollMobile: {
    width: "100%",
  },
  filterTabs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#eef2e7",
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  filterChipActive: {
    backgroundColor: colors.ink,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#5f6853",
  },
  filterChipTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  propsList: {
    padding: 14,
    gap: 10,
    backgroundColor: "#ffffff",
  },
  propCard: {
    backgroundColor: "#fafbf8",
    borderWidth: 1,
    borderColor: "#e6ebe0",
    borderRadius: 8,
    padding: 13,
    gap: 8,
  },
  propCardSmall: {
    padding: 10,
  },
  propTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  propNameGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  propName: {
    fontFamily: mono,
    fontSize: 14,
    fontWeight: "700",
    color: colors.ink,
  },
  requiredBadge: {
    backgroundColor: "#2e3522",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  requiredBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  optionalBadge: {
    backgroundColor: "#eef2e7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  optionalBadgeText: {
    color: "#677259",
    fontSize: 10,
    fontWeight: "600",
  },
  defaultChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f0f4ea",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#dbe3d1",
  },
  defaultLabel: {
    fontSize: 11,
    color: "#748067",
  },
  defaultValueText: {
    fontFamily: mono,
    fontSize: 11,
    fontWeight: "600",
    color: "#37412c",
  },
  typeContainer: {
    backgroundColor: "#f0f4ea",
    borderWidth: 1,
    borderColor: "#dde5d4",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    maxWidth: "100%",
    overflow: "hidden",
  },
  typeScroll: {
    alignItems: "center",
    paddingRight: 10,
  },
  typeText: {
    fontFamily: mono,
    fontSize: 12,
    color: "#28341e",
    lineHeight: 18,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 20,
    color: "#37422d",
  },
  noResults: {
    paddingVertical: 40,
    alignItems: "center",
    gap: 8,
  },
  noResultsText: {
    fontSize: 13,
    color: "#7e8873",
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fafbf8",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e4e8dc",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.ink,
  },
  emptyText: {
    fontSize: 13,
    color: "#77806b",
  },
});
