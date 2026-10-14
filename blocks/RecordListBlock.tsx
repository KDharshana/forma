import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Badge,
  Card,
  Checkbox,
  Divider,
  Input,
  Pagination,
  colors,
} from "../components";

export interface RecordItem {
  id: string;
  name: string;
  client: string;
  amount: string;
  status: "Completed" | "In progress" | "In review" | "Draft";
  date: string;
}

export interface RecordListBlockProps {
  records?: RecordItem[];
  pageSize?: number;
  onSelectionChange?: (ids: string[]) => void;
  accent?: string;
  style?: ViewStyle;
}

const sampleRecords: RecordItem[] = [
  {
    id: "REC-101",
    name: "Mobile Design System",
    client: "Acme Corp",
    amount: "$12,400",
    status: "Completed",
    date: "Oct 12, 2026",
  },
  {
    id: "REC-102",
    name: "Brand Guidelines & Icons",
    client: "Studio Vertex",
    amount: "$6,200",
    status: "In progress",
    date: "Oct 14, 2026",
  },
  {
    id: "REC-103",
    name: "Checkout Flow Audit",
    client: "Kinetics HQ",
    amount: "$8,950",
    status: "In review",
    date: "Oct 15, 2026",
  },
  {
    id: "REC-104",
    name: "Design Sprint 04",
    client: "Linear Labs",
    amount: "$4,500",
    status: "Draft",
    date: "Oct 18, 2026",
  },
  {
    id: "REC-105",
    name: "E-Commerce Design Tokens",
    client: "Northwind Retail",
    amount: "$15,200",
    status: "Completed",
    date: "Oct 20, 2026",
  },
  {
    id: "REC-106",
    name: "Accessibility Remediation",
    client: "Global Health Inc.",
    amount: "$9,100",
    status: "In review",
    date: "Oct 22, 2026",
  },
  {
    id: "REC-107",
    name: "Design System Migration",
    client: "Horizon Fintech",
    amount: "$18,750",
    status: "In progress",
    date: "Oct 24, 2026",
  },
  {
    id: "REC-108",
    name: "Customer Onboarding Audit",
    client: "SaaS Matrix",
    amount: "$5,800",
    status: "Draft",
    date: "Oct 26, 2026",
  },
];

export function RecordListBlock({
  records = sampleRecords,
  pageSize = 4,
  onSelectionChange,
  accent = colors.lime,
  style,
}: RecordListBlockProps) {
  const [width, setWidth] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const compact = width < 680;

  const filtered = useMemo(
    () =>
      records.filter((record) =>
        `${record.id} ${record.name} ${record.client} ${record.status}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
      ),
    [records, query],
  );

  const size = Math.max(
    1,
    Math.floor(Number.isFinite(pageSize) ? pageSize : 4),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * size, currentPage * size);

  const selected = selectedIds.filter((id) =>
    records.some((record) => record.id === id),
  );
  const allSelected =
    visible.length > 0 &&
    visible.every((record) => selected.includes(record.id));
  const partial =
    !allSelected && visible.some((record) => selected.includes(record.id));

  const updateSelection = (ids: string[]) => {
    setSelectedIds(ids);
    onSelectionChange?.(ids);
  };

  const toggle = (id: string) =>
    updateSelection(
      selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id],
    );

  const selectPage = () =>
    updateSelection(
      allSelected
        ? selected.filter((id) => !visible.some((record) => record.id === id))
        : [...new Set([...selected, ...visible.map((record) => record.id)])],
    );

  const badge =
    selected.length > 0 ? (
      <Badge>{`${selected.length} selected`}</Badge>
    ) : undefined;

  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      style={{ width: "100%" }}
    >
      <Card
        title="Records"
        badge={badge}
        style={StyleSheet.flatten([s.card, style])}
      >
        <View style={s.body}>
          <View style={s.searchWrap}>
            <Input
              label="Search records"
              placeholder="Name, client, or status"
              icon="search"
              value={query}
              onChangeText={(value) => {
                setQuery(value);
                setPage(1);
              }}
              accent={accent}
            />
          </View>

          {visible.length > 0 && (
            <View style={s.selectAllWrap}>
              <Checkbox
                label="Select this page"
                checked={allSelected}
                indeterminate={partial}
                onChange={selectPage}
                accent={accent}
              />
            </View>
          )}

          {!compact && visible.length > 0 && (
            <View style={s.tableHeader}>
              <Text style={[s.heading, s.nameCol]}>Record</Text>
              <Text style={[s.heading, s.clientCol]}>Client</Text>
              <Text style={[s.heading, s.statusCol]}>Status</Text>
              <Text style={[s.heading, s.amountCol]}>Amount</Text>
              <Text style={[s.heading, s.dateCol]}>Date</Text>
            </View>
          )}

          <View style={s.tableBody}>
            {visible.map((record) => (
              <View
                key={record.id}
                style={[
                  s.row,
                  selected.includes(record.id) && s.selected,
                  compact && s.compactRow,
                ]}
              >
                <View style={compact ? s.compactName : s.nameCol}>
                  <Checkbox
                    label={record.name}
                    description={record.id}
                    checked={selected.includes(record.id)}
                    onChange={() => toggle(record.id)}
                    accent={accent}
                  />
                </View>

                {compact ? (
                  <View style={s.compactDetails}>
                    <View style={s.detailLine}>
                      <Text style={s.text}>{record.client}</Text>
                      <Text style={s.amount}>{record.amount}</Text>
                    </View>
                    <View style={s.detailLine}>
                      <Badge
                        tone={
                          record.status === "Completed"
                            ? "success"
                            : record.status === "In review"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {record.status}
                      </Badge>
                      <Text style={s.text}>{record.date}</Text>
                    </View>
                  </View>
                ) : (
                  <>
                    <Text style={[s.text, s.clientCol]}>{record.client}</Text>
                    <View style={s.statusCol}>
                      <Badge
                        tone={
                          record.status === "Completed"
                            ? "success"
                            : record.status === "In review"
                              ? "warning"
                              : "neutral"
                        }
                      >
                        {record.status}
                      </Badge>
                    </View>
                    <Text style={[s.amount, s.amountCol]}>{record.amount}</Text>
                    <Text style={[s.text, s.dateCol]}>{record.date}</Text>
                  </>
                )}
              </View>
            ))}
          </View>

          {filtered.length === 0 && (
            <View style={s.empty}>
              <Text style={s.emptyTitle}>
                {query ? "No matching records" : "No records yet"}
              </Text>
              {!!query && <Text style={s.text}>Try a different search.</Text>}
            </View>
          )}

          <Divider spacing={12} />

          <View style={s.footer}>
            <Pagination
              page={currentPage}
              totalPages={pages}
              totalItems={filtered.length}
              pageSize={size}
              onChange={setPage}
              accent={accent}
            />
          </View>
        </View>
      </Card>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
    padding: 20,
    overflow: "hidden",
  },
  body: {
    width: "100%",
    gap: 12,
  },
  searchWrap: {
    width: "100%",
  },
  selectAllWrap: {
    paddingVertical: 2,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
    backgroundColor: colors.canvas,
    borderRadius: 10,
  },
  heading: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
  },
  tableBody: {
    gap: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selected: {
    backgroundColor: "#f6f9ee",
    borderColor: colors.line,
  },
  compactRow: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    borderRadius: 0,
    paddingHorizontal: 4,
  },
  compactName: {
    width: "100%",
  },
  compactDetails: {
    gap: 8,
    paddingLeft: 30,
  },
  detailLine: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  nameCol: {
    flex: 2.2,
    minWidth: 0,
  },
  clientCol: {
    flex: 1.2,
    minWidth: 0,
  },
  statusCol: {
    flex: 1.1,
    minWidth: 0,
  },
  amountCol: {
    flex: 1,
    minWidth: 0,
  },
  dateCol: {
    flex: 1.2,
    minWidth: 0,
  },
  text: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
    flexShrink: 1,
  },
  amount: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    width: "100%",
  },
  empty: {
    padding: 24,
    gap: 6,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 15,
    color: colors.ink,
    fontWeight: "600",
  },
});
