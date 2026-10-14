import React, { useState } from "react";
import { Platform, StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  Card,
  Dropdown,
  Icon,
  List,
  ListItem,
  colors,
} from "../components";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Member" | "Viewer";
  status: "online" | "away" | "offline";
}

export interface UserTeamManagementBlockProps {
  initialMembers?: TeamMember[];
  onMembersChange?: (members: TeamMember[]) => void;
  onInvite?: () => void;
  accent?: string;
  style?: ViewStyle;
}

const sampleTeam: TeamMember[] = [
  {
    id: "1",
    name: "Alex Chen",
    email: "alex@forma.dev",
    role: "Owner",
    status: "online",
  },
  {
    id: "2",
    name: "Sam Lee",
    email: "sam@forma.dev",
    role: "Admin",
    status: "away",
  },
  {
    id: "3",
    name: "Jordan Park",
    email: "jordan@forma.dev",
    role: "Member",
    status: "offline",
  },
  {
    id: "4",
    name: "Riley Taylor",
    email: "riley@forma.dev",
    role: "Viewer",
    status: "online",
  },
];

export function UserTeamManagementBlock({
  initialMembers = sampleTeam,
  onMembersChange,
  onInvite,
  accent = colors.lime,
  style,
}: UserTeamManagementBlockProps) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [memberToRemove, setMemberToRemove] = useState<TeamMember | null>(null);

  const update = (next: TeamMember[]) => {
    setMembers(next);
    onMembersChange?.(next);
  };

  const changeRole = (id: string, newRole: TeamMember["role"]) =>
    update(
      members.map((member) =>
        member.id === id && member.role !== "Owner"
          ? { ...member, role: newRole }
          : member,
      ),
    );

  const removeMember = (id: string) =>
    update(
      members.filter((member) => member.id !== id || member.role === "Owner"),
    );

  const action = onInvite ? (
    <Button variant="secondary" accent={accent} icon="plus" onPress={onInvite}>
      Invite member
    </Button>
  ) : undefined;

  const countBadge = (
    <Badge tone="neutral">
      {`${members.length} ${members.length === 1 ? "member" : "members"}`}
    </Badge>
  );

  return (
    <Card
      title="Team"
      badge={countBadge}
      action={action}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {members.length === 0 ? (
          <Text style={s.emptyText}>No team members yet.</Text>
        ) : (
          <List divided style={s.list}>
            {members.map((member) => (
              <ListItem
                key={member.id}
                leading={
                  <Avatar name={member.name} size="md" status={member.status} />
                }
                title={member.name}
                subtitle={member.email}
                trailing={
                  <View style={s.roleControl}>
                    {member.role === "Owner" ? (
                      <Badge tone="neutral">Owner</Badge>
                    ) : (
                      <Dropdown
                        placeholder={`Role for ${member.name}`}
                        trigger={
                          <View style={s.roleTrigger}>
                            <Text style={s.roleText}>{member.role}</Text>
                            <Icon
                              name="chevronDown"
                              size={12}
                              color={colors.muted}
                            />
                          </View>
                        }
                        items={[
                          { id: "Admin", label: "Admin - Can edit settings" },
                          { id: "Member", label: "Member - Can edit records" },
                          { id: "Viewer", label: "Viewer - Read only" },
                          { id: "div", label: "", divider: true },
                          {
                            id: "remove",
                            label: "Remove from workspace",
                            danger: true,
                          },
                        ]}
                        onSelect={(item) => {
                          if (item.id === "remove") setMemberToRemove(member);
                          else if (
                            ["Admin", "Member", "Viewer"].includes(item.id)
                          )
                            changeRole(
                              member.id,
                              item.id as TeamMember["role"],
                            );
                        }}
                      />
                    )}
                  </View>
                }
              />
            ))}
          </List>
        )}
      </View>

      <AlertDialog
        visible={!!memberToRemove}
        title="Remove team member?"
        description={
          memberToRemove
            ? `${memberToRemove.name} will be removed from this team.`
            : ""
        }
        confirmText="Remove member"
        onClose={() => setMemberToRemove(null)}
        onConfirm={() => {
          if (memberToRemove) removeMember(memberToRemove.id);
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
  },
  list: {
    width: "100%",
  },
  roleControl: {
    flexShrink: 0,
    alignItems: "flex-end",
  },
  roleTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    ...(Platform.OS === "web" ? { cursor: "pointer" as any } : {}),
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.ink,
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    paddingVertical: 8,
  },
});
