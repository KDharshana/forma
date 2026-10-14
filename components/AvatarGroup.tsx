import React, { useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { colors } from "./theme";

export interface Person {
  name: string;
  color?: string;
  image?: string;
  avatarUrl?: string;
  id?: string;
}

export interface AvatarGroupProps {
  /** List of people to display */
  people: Person[];
  /** Maximum number of visible avatars before overflow indicator */
  max?: number;
  /** Diameter of each avatar circle in pixels (defaults to 34) */
  size?: number;
  /** Overlap margin in pixels (defaults to size * 0.26) */
  overlap?: number;
  /** Container style */
  style?: StyleProp<ViewStyle>;
  /** Callback fired when the overflow badge is pressed */
  onPressMore?: () => void;
  /** Callback fired when a visible avatar is pressed */
  onPressPerson?: (person: Person, index: number) => void;
}

const defaultShades = [
  "#d4ef78", // lime
  "#d9cafa", // lavender
  "#c3e6df", // teal
  "#f2ccaa", // apricot
  "#cad7bf", // sage
  "#edd9dc", // rose
];

function GroupAvatarItem({
  person,
  index,
  size,
  overlap,
  onPress,
}: {
  person: Person;
  index: number;
  size: number;
  overlap: number;
  onPress?: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const imgUri = person.image || person.avatarUrl;
  const showImage = !!imgUri && !imgFailed;

  const initials = person.name
    ? person.name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .filter(Boolean)
        .join("")
        .toUpperCase()
    : "•";

  // Enforce minimum font size of 11px
  const fontSize = Math.max(11, Math.round(size * 0.38));
  const bgColor =
    person.color || defaultShades[index % defaultShades.length];

  const content = showImage ? (
    <Image
      source={{ uri: imgUri }}
      onError={() => setImgFailed(true)}
      style={{
        width: size - 4,
        height: size - 4,
        borderRadius: (size - 4) / 2,
      }}
      resizeMode="cover"
    />
  ) : (
    <Text style={[s.initials, { fontSize }]}>{initials}</Text>
  );

  const itemStyle = [
    s.avatar,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      marginLeft: index ? -overlap : 0,
      backgroundColor: bgColor,
      zIndex: 10 - index,
    },
  ];

  if (onPress) {
    const hitPadding = size < 44 ? Math.ceil((44 - size) / 2) : 0;
    const hitSlop =
      hitPadding > 0
        ? {
            top: hitPadding,
            bottom: hitPadding,
            left: hitPadding,
            right: hitPadding,
          }
        : undefined;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View ${person.name}`}
        onPress={onPress}
        hitSlop={hitSlop}
        style={({ pressed, hovered }: any) => [
          itemStyle,
          pressed && { opacity: 0.8 },
          hovered && { transform: [{ translateY: -2 }] },
          {
            outlineWidth: 0,
            outlineColor: "transparent",
            ...(Platform.OS === "web"
              ? ({ cursor: "pointer", outlineStyle: "none" } as any)
              : {}),
          },
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={person.name}
      style={itemStyle}
    >
      {content}
    </View>
  );
}

export function AvatarGroup({
  people,
  max = 3,
  size = 34,
  overlap,
  style,
  onPressMore,
  onPressPerson,
}: AvatarGroupProps) {
  const effectiveOverlap =
    overlap !== undefined ? overlap : Math.max(6, Math.round(size * 0.26));
  const visible = people.slice(0, Math.max(1, max));
  const overflowCount = people.length - visible.length;

  // Enforce minimum font size of 11px
  const fontSize = Math.max(11, Math.round(size * 0.36));

  return (
    <View
      accessible
      accessibilityLabel={`Group of ${people.length} people: ${people
        .map((p) => p.name)
        .join(", ")}`}
      style={[s.row, style]}
    >
      {visible.map((person, i) => (
        <GroupAvatarItem
          key={person.id || `${person.name}-${i}`}
          person={person}
          index={i}
          size={size}
          overlap={effectiveOverlap}
          onPress={
            onPressPerson ? () => onPressPerson(person, i) : undefined
          }
        />
      ))}

      {overflowCount > 0 &&
        (onPressMore ? (() => {
          const hitPadding = size < 44 ? Math.ceil((44 - size) / 2) : 0;
          const hitSlop =
            hitPadding > 0
              ? {
                  top: hitPadding,
                  bottom: hitPadding,
                  left: hitPadding,
                  right: hitPadding,
                }
              : undefined;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${overflowCount} more people`}
              onPress={onPressMore}
              hitSlop={hitSlop}
              style={({ pressed, hovered }: any) => [
                s.avatar,
                s.overflowBadge,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  marginLeft: -effectiveOverlap,
                  zIndex: 0,
                  outlineWidth: 0,
                  outlineColor: "transparent",
                  ...(Platform.OS === "web"
                    ? ({ cursor: "pointer", outlineStyle: "none" } as any)
                    : {}),
                },
                pressed && { opacity: 0.8 },
                hovered && { transform: [{ translateY: -2 }] },
              ]}
            >
              <Text style={[s.overflowText, { fontSize }]}>+{overflowCount}</Text>
            </Pressable>
          );
        })() : (
          <View
            accessible
            accessibilityRole="text"
            accessibilityLabel={`${overflowCount} more people`}
            style={[
              s.avatar,
              s.overflowBadge,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                marginLeft: -effectiveOverlap,
                zIndex: 0,
              },
            ]}
          >
            <Text style={[s.overflowText, { fontSize }]}>+{overflowCount}</Text>
          </View>
        ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.paper,
    overflow: "hidden",
  },
  initials: {
    color: colors.ink,
    fontWeight: "600",
    textAlign: "center",
  },
  overflowBadge: {
    backgroundColor: colors.canvas,
    borderColor: colors.paper,
    borderWidth: 2,
  },
  overflowText: {
    color: colors.muted,
    fontWeight: "600",
    textAlign: "center",
  },
});
