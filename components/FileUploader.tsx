import React, { useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { colors } from "./theme";
import { Icon } from "./Icon";

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  progress: number; // 0 to 100
  status: "ready" | "uploading" | "completed" | "error";
  uri?: string;
  mimeType?: string;
  sizeBytes?: number;
  errorMessage?: string;
}

export interface FileUploaderProps {
  /** Array of currently selected/uploaded files */
  files?: UploadedFile[];
  /** Callback fired when files are selected or uploaded */
  onUpload?: (files: UploadedFile[]) => void;
  /** Callback fired when a file is removed */
  onRemove?: (id: string) => void;
  /** Maximum file size limit in megabytes (defaults to 10) */
  maxSizeMb?: number;
  /** Allowed file type extensions */
  acceptedTypes?: string[];
  /** Disables file picker interaction */
  disabled?: boolean;
  /** Field label */
  label?: string;
  /** Helper hint message */
  hint?: string;
  /** Error message string */
  error?: string;
  /** Accent color for progress bar */
  accent?: string;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
}

export function FileUploader({
  files: initialFiles,
  onUpload,
  onRemove,
  maxSizeMb = 10,
  acceptedTypes = ["PDF", "PNG", "JPG", "DOCX"],
  disabled = false,
  label = "Files",
  hint,
  error: controlledError,
  accent = colors.lime,
  style,
}: FileUploaderProps) {
  const [localFiles, setLocalFiles] = useState<UploadedFile[]>([]);
  const fileList = initialFiles ?? localFiles;
  const fileListRef = useRef(fileList);
  fileListRef.current = fileList;

  const [picking, setPicking] = useState(false);
  const pickingRef = useRef(false);
  const [internalError, setInternalError] = useState("");

  const displayError = controlledError || internalError;

  const mimeTypes: Record<string, string> = {
    PDF: "application/pdf",
    PNG: "image/png",
    JPG: "image/jpeg",
    JPEG: "image/jpeg",
    DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    CSV: "text/csv",
  };

  const selectFiles = async () => {
    if (disabled || pickingRef.current) return;
    pickingRef.current = true;
    setPicking(true);
    setInternalError("");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
        base64: false,
        type: acceptedTypes.length
          ? acceptedTypes.map(
              (type) =>
                mimeTypes[type.toUpperCase()] ||
                (type.includes("/") ? type : "*/*"),
            )
          : "*/*",
      });
      if (result.canceled) return;
      const accepted: UploadedFile[] = [];
      const rejected: string[] = [];
      for (const asset of result.assets) {
        const extension = asset.name.split(".").pop()?.toUpperCase();
        const allowed =
          !acceptedTypes.length ||
          acceptedTypes.some(
            (type) =>
              type === "*/*" ||
              type.toUpperCase().replace(/^\./, "") === extension ||
              (mimeTypes[type.toUpperCase()] || type) === asset.mimeType ||
              (type.endsWith("/*") &&
                asset.mimeType?.startsWith(type.slice(0, -1))),
          );
        if (
          !allowed ||
          (asset.size !== undefined && asset.size > maxSizeMb * 1024 * 1024)
        ) {
          rejected.push(
            `${asset.name}: ${allowed ? `exceeds ${maxSizeMb} MB` : "unsupported file type"}`,
          );
          continue;
        }
        accepted.push({
          id: asset.uri,
          name: asset.name,
          uri: asset.uri,
          mimeType: asset.mimeType,
          sizeBytes: asset.size,
          size:
            asset.size === undefined
              ? ""
              : asset.size < 1024 * 1024
                ? `${Math.ceil(asset.size / 1024)} KB`
                : `${(asset.size / 1024 / 1024).toFixed(1)} MB`,
          progress: 0,
          status: "ready",
        });
      }
      if (accepted.length) {
        const updated = [
          ...fileListRef.current,
          ...accepted.filter(
            (file) =>
              !fileListRef.current.some((existing) => existing.id === file.id),
          ),
        ];
        setLocalFiles(updated);
        onUpload?.(updated);
      }
      if (rejected.length) setInternalError(rejected.join("\n"));
    } catch {
      setInternalError("Couldn't select files. Please try again.");
    } finally {
      pickingRef.current = false;
      setPicking(false);
    }
  };

  const handleRemove = (id: string) => {
    if (disabled) return;
    const updated = fileList.filter((f) => f.id !== id);
    setLocalFiles(updated);
    onRemove?.(id);
  };

  return (
    <View style={[s.container, style]}>
      {label && <Text style={s.label}>{label}</Text>}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Choose files to upload"
        accessibilityState={{ disabled, busy: picking }}
        disabled={disabled || picking}
        onPress={selectFiles}
        style={({ pressed, hovered }: any) => [
          s.dropzone,
          (hovered || pressed) &&
            !disabled &&
            !picking && { borderColor: colors.ink },
          (disabled || picking) && { opacity: 0.5 },
          pressed && { opacity: 0.8 },
          {
            outlineWidth: 0,
            outlineColor: "transparent",
            ...(Platform.OS === "web"
              ? ({
                  cursor: disabled || picking ? "not-allowed" : "pointer",
                  outlineStyle: "none",
                } as any)
              : {}),
          },
        ]}
      >
        <View style={s.uploadIconWrap}>
          <Icon name="upload" size={20} color={colors.ink} />
        </View>
        <Text style={s.dropTitle}>
          {picking ? "Opening file picker…" : "Choose files"}
        </Text>
        <Text style={s.dropSubtitle}>
          {acceptedTypes.length ? acceptedTypes.join(", ") : "Any file type"} ·
          up to {maxSizeMb} MB
        </Text>
      </Pressable>

      {!!displayError && (
        <Text
          accessibilityLiveRegion="polite"
          style={s.errorText}
        >
          {displayError}
        </Text>
      )}
      {hint && <Text style={s.hint}>{hint}</Text>}

      {fileList.length > 0 && (
        <View style={s.fileList}>
          {fileList.map((file) => (
            <View key={file.id} style={s.fileCard}>
              <View style={s.fileIconWrap}>
                <Icon name="file" size={16} color={colors.ink} />
              </View>

              <View style={s.fileDetails}>
                <View style={s.fileNameRow}>
                  <Text style={s.fileName} numberOfLines={1}>
                    {file.name}
                  </Text>
                  <Text style={s.fileSize}>{file.size}</Text>
                </View>

                {file.status === "uploading" ? (
                  <View
                    accessible
                    accessibilityRole="progressbar"
                    accessibilityLabel={`Uploading ${file.name}`}
                    accessibilityValue={{
                      min: 0,
                      max: 100,
                      now: Math.max(0, Math.min(100, file.progress || 0)),
                    }}
                    style={s.progressRow}
                  >
                    <View style={s.progressBarTrack}>
                      <View
                        style={[
                          s.progressBarFill,
                          {
                            width: `${Math.max(0, Math.min(100, file.progress || 0))}%`,
                            backgroundColor: accent,
                          },
                        ]}
                      />
                    </View>
                    <Text style={s.progressText}>
                      {Math.round(
                        Math.max(0, Math.min(100, file.progress || 0)),
                      )}
                      %
                    </Text>
                  </View>
                ) : (
                  <View style={s.statusRow}>
                    <Icon
                      name={
                        file.status === "error" ? "alertCircle" : "checkCircle"
                      }
                      size={13}
                      color={
                        file.status === "error" ? colors.danger : colors.success
                      }
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        s.statusText,
                        {
                          color:
                            file.status === "error"
                              ? colors.danger
                              : colors.success,
                        },
                      ]}
                    >
                      {file.status === "error"
                        ? file.errorMessage || "Upload failed"
                        : file.status === "completed"
                          ? "Uploaded"
                          : "Ready to upload"}
                    </Text>
                  </View>
                )}
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${file.name}`}
                disabled={disabled}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => handleRemove(file.id)}
                style={({ pressed, hovered }: any) => [
                  s.removeBtn,
                  hovered && !disabled && { opacity: 0.8 },
                  pressed && !disabled && { opacity: 0.6 },
                  disabled && { opacity: 0.4 },
                  {
                    outlineWidth: 0,
                    outlineColor: "transparent",
                    ...(Platform.OS === "web"
                      ? ({
                          cursor: disabled ? "not-allowed" : "pointer",
                          outlineStyle: "none",
                        } as any)
                      : {}),
                  },
                ]}
              >
                <Icon name="close" size={14} color={colors.muted} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -0.1,
    marginBottom: 6,
  },
  dropzone: {
    borderWidth: 1.5,
    borderColor: colors.line,
    borderStyle: "dashed",
    borderRadius: 14,
    backgroundColor: colors.canvas,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.paper,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.line,
  },
  dropTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  dropSubtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  hint: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.danger,
    marginTop: 8,
  },
  fileList: {
    gap: 8,
    marginTop: 12,
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.paper,
    gap: 10,
  },
  fileIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.canvas,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  fileDetails: {
    flex: 1,
    minWidth: 0,
    gap: 3,
  },
  fileNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  fileName: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.ink,
    flex: 1,
    minWidth: 0,
  },
  fileSize: {
    flexShrink: 0,
    fontSize: 11,
    color: colors.muted,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBarTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    color: colors.muted,
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusText: {
    flexShrink: 1,
    fontSize: 11,
    fontWeight: "500",
  },
  removeBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    flexShrink: 0,
  },
});
