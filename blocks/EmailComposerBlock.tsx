import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Button,
  Card,
  FileUploader,
  Input,
  UploadedFile,
  colors,
} from "../components";

export interface EmailDraft {
  recipient: string;
  subject: string;
  body: string;
  attachments: UploadedFile[];
}

export interface EmailComposerBlockProps {
  onSend?: (data: EmailDraft) => void | Promise<void>;
  onSaveDraft?: (data: EmailDraft) => void | Promise<void>;
  initialDraft?: Partial<EmailDraft>;
  accent?: string;
  style?: ViewStyle;
}

export function EmailComposerBlock({
  onSend,
  onSaveDraft,
  initialDraft,
  accent = colors.lime,
  style,
}: EmailComposerBlockProps) {
  const [recipient, setRecipient] = useState(initialDraft?.recipient || "");
  const [subject, setSubject] = useState(initialDraft?.subject || "");
  const [body, setBody] = useState(initialDraft?.body || "");
  const [attachments, setAttachments] = useState<UploadedFile[]>(
    initialDraft?.attachments || [],
  );
  const [pending, setPending] = useState<"send" | "draft" | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const submit = async (action: "send" | "draft") => {
    if (pending) return;
    const callback = action === "send" ? onSend : onSaveDraft;
    if (!callback) return;
    if (
      action === "send" &&
      (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient.trim()) ||
        !subject.trim() ||
        !body.trim())
    ) {
      setError("Enter a valid recipient, a subject, and a message.");
      return;
    }
    setError("");
    setNotice("");
    setPending(action);
    try {
      await callback({
        recipient: recipient.trim(),
        subject: subject.trim(),
        body: body.trim(),
        attachments,
      });
      setNotice(action === "send" ? "Message submitted." : "Draft saved.");
    } catch {
      setError(
        action === "send"
          ? "Couldn’t send your message. Please try again."
          : "Couldn’t save your draft. Please try again.",
      );
    } finally {
      setPending(null);
    }
  };

  const footer = (
    <View style={s.actions}>
      {onSaveDraft && (
        <Button
          variant="outline"
          onPress={() => submit("draft")}
          loading={pending === "draft"}
          disabled={pending === "send"}
        >
          Save draft
        </Button>
      )}
      <Button
        onPress={() => submit("send")}
        loading={pending === "send"}
        disabled={!onSend || pending === "draft"}
        icon="send"
        accent={accent}
      >
        Send message
      </Button>
    </View>
  );

  return (
    <Card
      title="New message"
      footer={footer}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        <Input
          label="To"
          placeholder="name@example.com"
          value={recipient}
          onChangeText={setRecipient}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!pending}
          accent={accent}
        />
        <Input
          label="Subject"
          placeholder="Add a subject"
          value={subject}
          onChangeText={setSubject}
          editable={!pending}
          accent={accent}
        />
        <Input
          label="Message"
          placeholder="Write your message…"
          value={body}
          onChangeText={setBody}
          multiline
          textAlignVertical="top"
          editable={!pending}
          style={s.message}
          accent={accent}
        />
        <FileUploader
          label="Attachments"
          files={attachments}
          onUpload={setAttachments}
          onRemove={(id) =>
            setAttachments((files) => files.filter((file) => file.id !== id))
          }
          disabled={!!pending}
          accent={accent}
        />

        {!!error && (
          <Text accessibilityLiveRegion="polite" style={s.error}>
            {error}
          </Text>
        )}
        {!!notice && (
          <Text accessibilityLiveRegion="polite" style={s.notice}>
            {notice}
          </Text>
        )}
      </View>
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
  message: {
    minHeight: 140,
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 10,
    width: "100%",
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.danger,
  },
  notice: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.success,
  },
});
