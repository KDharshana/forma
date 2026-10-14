import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Input,
  Switch,
  colors,
} from "../components";

export interface CommentItem {
  id: string;
  author: string;
  avatarStatus?: "online" | "away" | "offline";
  time: string;
  message: string;
  isInternal?: boolean;
}

export interface CommentsNotesBlockProps {
  initialComments?: CommentItem[];
  currentUser?: string;
  onPost?: (comment: CommentItem) => void | Promise<void>;
  accent?: string;
  style?: ViewStyle;
}

const sampleComments: CommentItem[] = [
  {
    id: "1",
    author: "Alex Chen",
    avatarStatus: "online",
    time: "2 hours ago",
    message:
      "Updated the primary button border radius to match the design tokens in Figma. Ready for review.",
  },
  {
    id: "2",
    author: "Sam Lee",
    avatarStatus: "away",
    time: "45 minutes ago",
    message:
      "Verified on iOS simulator and Web. Everything aligns with the 8px grid.",
    isInternal: true,
  },
];

export function CommentsNotesBlock({
  initialComments = sampleComments,
  currentUser = "You",
  onPost,
  accent = colors.lime,
  style,
}: CommentsNotesBlockProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [draft, setDraft] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handlePost = async () => {
    if (!draft.trim() || pending) return;
    const newComment: CommentItem = {
      id: Date.now().toString(),
      author: currentUser,
      time: "Just now",
      message: draft.trim(),
      isInternal,
    };
    setPending(true);
    setError("");
    try {
      await onPost?.(newComment);
      setComments((list) => [...list, newComment]);
      setDraft("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not post. Try again.",
      );
    } finally {
      setPending(false);
    }
  };

  const badge = <Badge tone="neutral">{comments.length}</Badge>;

  return (
    <Card
      title="Comments"
      badge={badge}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {/* Comments List */}
        <View style={s.commentsList}>
          {comments.map((c) => (
            <Card
              key={c.id}
              variant="outlined"
              style={StyleSheet.flatten([
                s.commentCard,
                c.isInternal ? s.internalCommentCard : undefined,
              ])}
            >
              <View style={s.commentTop}>
                <View style={s.authorGroup}>
                  <Avatar name={c.author} size="sm" status={c.avatarStatus} />
                  <View style={s.authorMeta}>
                    <Text style={s.authorName}>{c.author}</Text>
                    <Text style={s.timeText}>{c.time}</Text>
                  </View>
                </View>

                {c.isInternal && <Badge tone="warning">Internal Note</Badge>}
              </View>

              <Text style={s.messageText}>{c.message}</Text>
            </Card>
          ))}
        </View>

        {!!error && (
          <Text accessibilityRole="alert" style={s.errorText}>
            {error}
          </Text>
        )}

        {/* Composer */}
        <Card variant="outlined" style={s.composerCard}>
          <Input
            label=""
            multiline
            numberOfLines={3}
            editable={!pending}
            placeholder="Write a comment or note…"
            value={draft}
            onChangeText={setDraft}
            accent={accent}
            style={s.composerInput}
          />

          <View style={s.composerFooter}>
            <View style={s.switchRow}>
              <Switch
                label="Internal note"
                disabled={pending}
                value={isInternal}
                onChange={setIsInternal}
                accent={accent}
              />
            </View>

            <Button
              variant="primary"
              accent={accent}
              icon="send"
              loading={pending}
              disabled={!draft.trim()}
              onPress={handlePost}
            >
              {isInternal ? "Add note" : "Post comment"}
            </Button>
          </View>
        </Card>
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
  commentsList: {
    gap: 10,
  },
  commentCard: {
    backgroundColor: colors.canvas,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  internalCommentCard: {
    backgroundColor: "#fef9f0",
    borderColor: "#fae9d4",
  },
  commentTop: {
    flexWrap: "wrap",
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  authorGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
    flexShrink: 1,
  },
  authorMeta: {
    minWidth: 0,
    flexShrink: 1,
  },
  authorName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
    flexShrink: 1,
  },
  timeText: {
    fontSize: 11,
    color: colors.muted,
  },
  messageText: {
    fontSize: 13,
    color: colors.ink,
    lineHeight: 19,
  },
  composerCard: {
    padding: 14,
    gap: 12,
    backgroundColor: colors.paper,
    borderRadius: 14,
  },
  composerInput: {
    minHeight: 70,
    textAlignVertical: "top",
  },
  composerFooter: {
    flexWrap: "wrap",
    gap: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
  },
});
