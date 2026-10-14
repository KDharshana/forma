import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  AlertDialog,
  Button,
  Card,
  FileUploader,
  Icon,
  List,
  ListItem,
  TagChip,
  UploadedFile,
  colors,
} from "../components";

export interface ManagedFile {
  id: string;
  name: string;
  size: string;
  type: "pdf" | "image" | "code" | "archive";
  uploadedAt: string;
}

export interface FileManagerBlockProps {
  initialFiles?: ManagedFile[];
  onAddFiles?: (files: UploadedFile[]) => void | Promise<void>;
  onDownload?: (file: ManagedFile) => void | Promise<void>;
  onDelete?: (file: ManagedFile) => void | Promise<void>;
  accent?: string;
  style?: ViewStyle;
}

export function FileManagerBlock({
  initialFiles = [],
  onAddFiles,
  onDownload,
  onDelete,
  accent = colors.lime,
  style,
}: FileManagerBlockProps) {
  const [files, setFiles] = useState(initialFiles);
  const [selected, setSelected] = useState<UploadedFile[]>([]);
  const [filter, setFilter] = useState("all");
  const [remove, setRemove] = useState<ManagedFile | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const filtered = files.filter((f) => filter === "all" || f.type === filter);

  const run = async (action: () => void | Promise<void>) => {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await action();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not complete the action.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <Card title="Files" style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        <FileUploader
          label="Add files"
          files={selected}
          onUpload={setSelected}
          onRemove={(id) =>
            setSelected((list) => list.filter((f) => f.id !== id))
          }
          acceptedTypes={[]}
          accent={accent}
          disabled={pending}
        />

        {!!selected.length && (
          <Button
            accent={accent}
            loading={pending}
            onPress={() =>
              run(async () => {
                await onAddFiles?.(selected);
                setFiles((list) => [
                  ...list,
                  ...selected.map((f) => ({
                    id: f.id,
                    name: f.name,
                    size: f.size,
                    uploadedAt: "Just now",
                    type: (f.mimeType?.startsWith("image/")
                      ? "image"
                      : f.name.toLowerCase().endsWith(".pdf")
                        ? "pdf"
                        : /\.(zip|tar|gz)$/i.test(f.name)
                          ? "archive"
                          : "code") as ManagedFile["type"],
                  })),
                ]);
                setSelected([]);
              })
            }
          >
            {onAddFiles ? "Upload selected files" : "Add to file list"}
          </Button>
        )}

        <View style={s.chipsRow}>
          {[
            ["all", "All"],
            ["pdf", "Documents"],
            ["image", "Images"],
            ["code", "Data"],
            ["archive", "Archives"],
          ].map(([id, label]) => (
            <TagChip
              key={id}
              label={label}
              selected={filter === id}
              onPress={() => setFilter(id)}
              accent={accent}
            />
          ))}
        </View>

        {!filtered.length ? (
          <Text style={s.emptyText}>No files in this category.</Text>
        ) : (
          <List divided style={s.list}>
            {filtered.map((file) => (
              <ListItem
                key={file.id}
                leading={
                  <View style={s.iconWrap}>
                    <Icon
                      name={
                        file.type === "image"
                          ? "eye"
                          : file.type === "archive"
                            ? "layers"
                            : "file"
                      }
                      size={16}
                      color={colors.ink}
                    />
                  </View>
                }
                title={file.name}
                subtitle={[file.size, file.uploadedAt]
                  .filter(Boolean)
                  .join(" · ")}
                trailing={
                  <View style={s.actionsRow}>
                    {onDownload && (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pending}
                        onPress={() => run(() => onDownload(file))}
                      >
                        Download
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={pending}
                      onPress={() => setRemove(file)}
                    >
                      Remove
                    </Button>
                  </View>
                }
              />
            ))}
          </List>
        )}

        {!!error && (
          <Text accessibilityRole="alert" style={s.errorText}>
            {error}
          </Text>
        )}
      </View>

      <AlertDialog
        visible={!!remove}
        onClose={() => setRemove(null)}
        title="Remove file?"
        description={remove ? `Remove ${remove.name} from this list?` : ""}
        confirmText="Remove"
        onConfirm={async () => {
          if (remove) {
            await onDelete?.(remove);
            setFiles((list) => list.filter((f) => f.id !== remove.id));
          }
        }}
      />
    </Card>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
  },
  body: {
    width: "100%",
    gap: 16,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  list: {
    width: "100%",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    paddingVertical: 4,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
});
