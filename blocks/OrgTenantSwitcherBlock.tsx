import React, { useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Icon,
  List,
  ListItem,
  colors,
} from "../components";

export interface Tenant {
  id: string;
  name: string;
  role: string;
  plan: "Enterprise" | "Pro" | "Starter";
  members: number;
}

export interface OrgTenantSwitcherBlockProps {
  tenants?: Tenant[];
  currentTenantId?: string;
  onSwitchTenant?: (tenant: Tenant) => void | Promise<void>;
  onCreateNew?: () => void;
  accent?: string;
  style?: ViewStyle;
}

const sampleTenants: Tenant[] = [
  {
    id: "acme",
    name: "Acme Corporation",
    role: "Owner",
    plan: "Enterprise",
    members: 42,
  },
  {
    id: "forma-labs",
    name: "Forma Labs",
    role: "Admin",
    plan: "Pro",
    members: 8,
  },
  {
    id: "personal",
    name: "Personal Projects",
    role: "Owner",
    plan: "Starter",
    members: 1,
  },
];

export function OrgTenantSwitcherBlock({
  tenants = sampleTenants,
  currentTenantId,
  onSwitchTenant,
  onCreateNew,
  accent = colors.lime,
  style,
}: OrgTenantSwitcherBlockProps) {
  const [localId, setSelectedId] = useState(tenants[0]?.id || "");
  const selectedId = currentTenantId ?? localId;
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const footer = onCreateNew ? (
    <Button
      variant="secondary"
      icon="plus"
      accent={accent}
      onPress={onCreateNew}
      disabled={pending}
      style={s.createBtn}
    >
      Create organization
    </Button>
  ) : undefined;

  return (
    <Card
      title="Switch organization"
      subtitle="Select a workspace to manage"
      footer={footer}
      style={StyleSheet.flatten([s.card, style])}
    >
      <View style={s.body}>
        {tenants.length === 0 ? (
          <Text style={s.emptyText}>No workspaces available.</Text>
        ) : (
          <List divided style={s.list}>
            {tenants.map((t) => {
              const isCurrent = t.id === selectedId;
              return (
                <ListItem
                  key={t.id}
                  leading={<Avatar name={t.name} size="md" />}
                  title={t.name}
                  subtitle={`${t.role} · ${t.members} ${t.members === 1 ? "member" : "members"}`}
                  selected={isCurrent}
                  disabled={pending}
                  onPress={async () => {
                    if (pending || isCurrent) return;
                    setPending(true);
                    setError("");
                    try {
                      await onSwitchTenant?.(t);
                      setSelectedId(t.id);
                    } catch {
                      setError("Couldn’t switch workspace. Please try again.");
                    } finally {
                      setPending(false);
                    }
                  }}
                  trailing={
                    <View style={s.trailingWrap}>
                      <Badge
                        tone={
                          t.plan === "Enterprise"
                            ? "success"
                            : t.plan === "Pro"
                              ? "lavender"
                              : "neutral"
                        }
                      >
                        {t.plan}
                      </Badge>
                      {isCurrent && (
                        <View
                          style={[s.checkWrap, { backgroundColor: accent }]}
                        >
                          <Icon
                            name="check"
                            size={12}
                            color={colors.ink}
                            strokeWidth={2.4}
                          />
                        </View>
                      )}
                    </View>
                  }
                />
              );
            })}
          </List>
        )}

        {!!error && (
          <Text accessibilityLiveRegion="polite" style={s.errorText}>
            {error}
          </Text>
        )}
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 440,
  },
  body: {
    width: "100%",
    gap: 12,
  },
  list: {
    width: "100%",
  },
  trailingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  checkWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
    paddingVertical: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 4,
  },
  createBtn: {
    width: "100%",
  },
});
