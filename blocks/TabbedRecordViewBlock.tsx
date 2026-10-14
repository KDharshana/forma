import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Button,
  Card,
  Icon,
  List,
  ListItem,
  Tabs,
  colors,
} from "../components";

export interface RecordAttachment {
  id: string;
  name: string;
  detail?: string;
}

export interface TabbedRecordViewBlockProps {
  overview?: string;
  activity?: string[];
  attachments?: RecordAttachment[];
  accessDescription?: string;
  onDownload?: (file: RecordAttachment) => void;
  accent?: string;
  style?: ViewStyle;
}

export function TabbedRecordViewBlock({
  overview = "Design and development milestones for the mobile app.",
  activity = [
    "Alex updated the project scope.",
    "Sam added a review milestone.",
  ],
  attachments = [],
  accessDescription,
  onDownload,
  accent = colors.lime,
  style,
}: TabbedRecordViewBlockProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "activity", label: "Activity", count: activity.length },
    { id: "files", label: "Files", count: attachments.length },
    ...(accessDescription ? [{ id: "settings", label: "Access" }] : []),
  ];

  return (
    <Card style={StyleSheet.flatten([s.card, style])}>
      <View style={s.body}>
        <Tabs
          items={tabs}
          value={activeTab}
          onChange={setActiveTab}
          accent={accent}
          variant="underline"
        />

        <View style={s.panel}>
          {activeTab === "overview" && <Text style={s.text}>{overview}</Text>}

          {activeTab === "activity" &&
            (activity.length ? (
              <List divided style={s.list}>
                {activity.map((event, i) => (
                  <ListItem
                    key={i}
                    leading={
                      <Icon name="clock" size={15} color={colors.muted} />
                    }
                    title={event}
                  />
                ))}
              </List>
            ) : (
              <Text style={s.emptyText}>No activity yet.</Text>
            ))}

          {activeTab === "files" &&
            (attachments.length ? (
              <List divided style={s.list}>
                {attachments.map((file) => (
                  <ListItem
                    key={file.id}
                    leading={<Icon name="file" size={16} color={colors.ink} />}
                    title={file.name}
                    subtitle={file.detail}
                    trailing={
                      onDownload && (
                        <Button
                          variant="outline"
                          size="sm"
                          onPress={() => onDownload(file)}
                        >
                          Download
                        </Button>
                      )
                    }
                  />
                ))}
              </List>
            ) : (
              <Text style={s.emptyText}>No files attached.</Text>
            ))}

          {activeTab === "settings" && (
            <Text style={s.text}>
              {accessDescription || "No access restrictions configured."}
            </Text>
          )}
        </View>
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
    gap: 12,
  },
  panel: {
    paddingVertical: 8,
    gap: 12,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.ink,
  },
  list: {
    width: "100%",
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    paddingVertical: 8,
  },
});
