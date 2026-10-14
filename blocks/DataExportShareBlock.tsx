import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Input,
  RadioGroup,
  colors,
} from "../components";

export type ExportFormat = "csv" | "xlsx" | "json" | "pdf";
export type ExportScope = "filtered" | "selected" | "all";
export interface DataExportShareBlockProps {
  totalRecords?: number;
  filteredRecords?: number;
  selectedRecords?: number;
  onExport?: (
    format: ExportFormat,
    scope: ExportScope,
    selectedFields: string[],
  ) => void | Promise<void>;
  shareUrl?: string;
  onCopyShareLink?: (link: string) => void | Promise<void>;
  onCancel?: () => void;
  accent?: string;
  style?: ViewStyle;
}

const fields = [
  { id: "id", label: "Record ID" },
  { id: "customer", label: "Customer" },
  { id: "email", label: "Email" },
  { id: "status", label: "Status" },
  { id: "amount", label: "Amount" },
  { id: "date", label: "Created date" },
  { id: "owner", label: "Owner" },
  { id: "notes", label: "Notes" },
];

export function DataExportShareBlock({
  totalRecords = 0,
  filteredRecords = 0,
  selectedRecords = 0,
  onExport,
  shareUrl,
  onCopyShareLink,
  onCancel,
  accent = colors.lime,
  style,
}: DataExportShareBlockProps) {
  const [format, setFormat] = useState<ExportFormat>("csv");
  const [scope, setScope] = useState<ExportScope>("filtered");
  const [selectedFields, setSelectedFields] = useState([
    "id",
    "customer",
    "email",
    "status",
    "amount",
    "date",
  ]);
  const [pending, setPending] = useState<"export" | "copy" | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const count = Math.max(
    0,
    scope === "all"
      ? totalRecords
      : scope === "selected"
        ? selectedRecords
        : filteredRecords,
  );

  useEffect(() => {
    setCopied(false);
  }, [shareUrl]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2400);
    return () => clearTimeout(timer);
  }, [copied]);

  const run = async (action: "export" | "copy") => {
    if (pending) return;
    setError("");
    setPending(action);
    try {
      if (action === "export" && onExport && count > 0)
        await onExport(format, scope, selectedFields);
      if (action === "copy" && onCopyShareLink && shareUrl) {
        await onCopyShareLink(shareUrl);
        setCopied(true);
      }
    } catch {
      setError(
        action === "export"
          ? "Export failed. Please try again."
          : "Couldn’t copy the link. Please try again.",
      );
    } finally {
      setPending(null);
    }
  };

  const footer = (
    <View style={s.actions}>
      {onCancel && (
        <Button variant="ghost" onPress={onCancel} disabled={!!pending}>
          Cancel
        </Button>
      )}
      <Button
        onPress={() => run("export")}
        loading={pending === "export"}
        disabled={!onExport || count === 0 || pending === "copy"}
        accent={accent}
      >
        {`Export ${count} ${count === 1 ? "record" : "records"}`}
      </Button>
    </View>
  );

  return (
    <Card
      title="Export records"
      footer={footer}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        <View style={s.section}>
          <Text style={s.label}>Format</Text>
          <RadioGroup
            value={format}
            onChange={setFormat}
            disabled={!!pending}
            accent={accent}
            options={[
              { value: "csv", label: "CSV" },
              { value: "xlsx", label: "Excel" },
              { value: "json", label: "JSON" },
              { value: "pdf", label: "PDF" },
            ]}
            style={s.options}
          />
        </View>

        <Divider spacing={12} />

        <View style={s.section}>
          <Text style={s.label}>Records to include</Text>
          <RadioGroup
            value={scope}
            onChange={setScope}
            disabled={!!pending}
            accent={accent}
            options={[
              {
                value: "filtered",
                label: `Filtered records (${Math.max(0, filteredRecords)})`,
              },
              {
                value: "selected",
                label: `Selected records (${Math.max(0, selectedRecords)})`,
                disabled: selectedRecords <= 0,
              },
              {
                value: "all",
                label: `All records (${Math.max(0, totalRecords)})`,
              },
            ]}
          />
        </View>

        <Divider spacing={12} />

        <View style={s.section}>
          <View style={s.row}>
            <Text style={s.label}>Fields</Text>
            <Button
              size="sm"
              variant="ghost"
              disabled={!!pending}
              onPress={() =>
                setSelectedFields(
                  selectedFields.length === fields.length
                    ? ["id"]
                    : fields.map((field) => field.id),
                )
              }
            >
              {selectedFields.length === fields.length
                ? "Clear optional fields"
                : "Select all"}
            </Button>
          </View>
          <View style={s.fields}>
            {fields.map((field) => (
              <Checkbox
                key={field.id}
                label={field.id === "id" ? "Record ID (required)" : field.label}
                checked={selectedFields.includes(field.id)}
                disabled={field.id === "id" || !!pending}
                accent={accent}
                style={s.field}
                onChange={() =>
                  setSelectedFields((current) =>
                    current.includes(field.id)
                      ? current.filter((id) => id !== field.id)
                      : [...current, field.id],
                  )
                }
              />
            ))}
          </View>
        </View>

        {!!shareUrl && onCopyShareLink && (
          <>
            <Divider spacing={12} />
            <View style={s.section}>
              <Input label="Share link" value={shareUrl} editable={false} />
              <Button
                variant="outline"
                onPress={() => run("copy")}
                loading={pending === "copy"}
                disabled={pending === "export"}
              >
                {copied ? "Copied" : "Copy link"}
              </Button>
            </View>
          </>
        )}

        {!!error && (
          <Text accessibilityLiveRegion="polite" style={s.error}>
            {error}
          </Text>
        )}

        {count === 0 && (
          <Text style={s.hint}>
            No records to export. Choose another selection.
          </Text>
        )}
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 640,
  },
  body: {
    width: "100%",
    gap: 16,
  },
  label: {
    fontSize: 14,
    color: colors.ink,
    fontWeight: "600",
  },
  section: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  fields: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  field: {
    flexGrow: 1,
    flexBasis: 180,
    maxWidth: "100%",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 8,
    width: "100%",
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    lineHeight: 20,
  },
  hint: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
  },
});
