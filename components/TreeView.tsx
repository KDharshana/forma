import React, { useState } from "react";
import {
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
import { Icon, IconName } from "./Icon";

export interface TreeNode {
  id: string;
  label: string;
  icon?: IconName;
  children?: TreeNode[];
  badge?: string | number;
  disabled?: boolean;
}

export interface TreeViewProps {
  /** Tree hierarchy data */
  data: TreeNode[];
  /** Controlled selected node ID */
  selectedId?: string;
  /** Uncontrolled initial selected node ID */
  defaultSelectedId?: string;
  /** Node selection callback */
  onSelectNode?: (node: TreeNode) => void;
  /** Selection callback alias */
  onSelect?: (node: TreeNode) => void;
  /** Controlled expanded node IDs */
  expandedIds?: string[];
  /** Uncontrolled initial expanded node IDs */
  defaultExpandedIds?: string[];
  /** Expanded node IDs change callback */
  onExpandedChange?: (expandedIds: string[]) => void;
  /** Accent highlight color for selected item */
  accent?: string;
  /** Whether the entire tree view is disabled */
  disabled?: boolean;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Row style */
  rowStyle?: StyleProp<ViewStyle>;
  /** Node label text style */
  labelStyle?: StyleProp<TextStyle>;
}

export function TreeView({
  data,
  selectedId: controlledSelectedId,
  defaultSelectedId,
  onSelectNode,
  onSelect,
  expandedIds: controlledExpandedIds,
  defaultExpandedIds,
  onExpandedChange,
  accent = colors.lime,
  disabled = false,
  style,
  rowStyle,
  labelStyle,
}: TreeViewProps) {
  const isControlledSelected = controlledSelectedId !== undefined;
  const [internalSelectedId, setInternalSelectedId] = useState(defaultSelectedId);
  const activeSelectedId = isControlledSelected ? controlledSelectedId : internalSelectedId;

  const isControlledExpanded = controlledExpandedIds !== undefined;
  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>(
    () =>
      defaultExpandedIds ??
      data.filter((n) => n.children?.length).map((n) => n.id),
  );
  const activeExpandedIds = isControlledExpanded
    ? controlledExpandedIds
    : internalExpandedIds;

  const toggleExpand = (id: string) => {
    if (disabled) return;
    const next = activeExpandedIds.includes(id)
      ? activeExpandedIds.filter((i) => i !== id)
      : [...activeExpandedIds, id];
    if (!isControlledExpanded) {
      setInternalExpandedIds(next);
    }
    onExpandedChange?.(next);
  };

  const handleSelect = (node: TreeNode) => {
    if (disabled || node.disabled) return;
    if (!isControlledSelected) {
      setInternalSelectedId(node.id);
    }
    onSelectNode?.(node);
    onSelect?.(node);
  };

  const renderNode = (node: TreeNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = activeExpandedIds.includes(node.id);
    const isSelected = activeSelectedId === node.id;
    const isNodeDisabled = disabled || Boolean(node.disabled);

    const defaultIcon: IconName = hasChildren ? "folder" : "file";
    const iconName = node.icon || defaultIcon;

    return (
      <View key={node.id} style={s.nodeGroup}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={node.label}
          accessibilityState={{
            expanded: hasChildren ? isExpanded : undefined,
            selected: isSelected,
            disabled: isNodeDisabled,
          }}
          disabled={isNodeDisabled || (!hasChildren && !onSelectNode && !onSelect)}
          onPress={() => {
            if (hasChildren) {
              toggleExpand(node.id);
            }
            handleSelect(node);
          }}
          style={({ pressed, hovered }: any) => [
            s.nodeRow,
            { paddingLeft: 10 + Math.min(depth, 6) * 12 },
            isSelected && { backgroundColor: accent },
            (hovered || pressed) && !isSelected && !isNodeDisabled && s.nodeRowHovered,
            isNodeDisabled && s.disabled,
            rowStyle,
          ]}
        >
          {hasChildren ? (
            <View style={s.chevronBtn}>
              <Icon
                name={isExpanded ? "chevronDown" : "chevronRight"}
                size={13}
                color={colors.muted}
              />
            </View>
          ) : (
            <View style={s.chevronPlaceholder} />
          )}

          <Icon
            name={iconName}
            size={15}
            color={isSelected ? colors.ink : colors.muted}
          />

          <Text
            numberOfLines={1}
            style={[
              s.nodeLabel,
              isSelected && { color: colors.ink, fontWeight: "600" },
              labelStyle,
            ]}
          >
            {node.label}
          </Text>

          {node.badge !== undefined && (
            <View style={s.badge}>
              <Text style={s.badgeText}>{node.badge}</Text>
            </View>
          )}
        </Pressable>

        {hasChildren && isExpanded && (
          <View style={s.childrenContainer}>
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[s.tree, disabled && s.disabled, style]}>
      {data.map((node) => renderNode(node, 0))}
    </View>
  );
}

const s = StyleSheet.create({
  tree: {
    width: "100%",
  },
  nodeGroup: {
    width: "100%",
  },
  nodeRow: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 7,
    paddingRight: 12,
    borderRadius: 8,
    gap: 8,
    outlineWidth: 0,
    outlineColor: "transparent",
    ...(Platform.OS === "web"
      ? ({ outlineStyle: "none", cursor: "pointer" } as any)
      : {}),
  },
  nodeRowHovered: {
    backgroundColor: colors.canvas,
  },
  disabled: {
    opacity: 0.5,
    ...(Platform.OS === "web" ? ({ cursor: "not-allowed" } as any) : {}),
  },
  chevronBtn: {
    padding: 2,
    width: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  chevronPlaceholder: {
    width: 16,
    flexShrink: 0,
  },
  nodeLabel: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    fontSize: 13,
    color: colors.ink,
    fontWeight: "500",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.muted,
  },
  childrenContainer: {
    position: "relative",
  },
});
