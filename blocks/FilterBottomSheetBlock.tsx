import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import {
  BottomSheet,
  Button,
  Card,
  DatePicker,
  Slider,
  TagChip,
  colors,
} from "../components";

export interface FilterState {
  selectedStatus: string[];
  maxBudget: number;
  date?: Date;
}

export interface FilterBottomSheetBlockProps {
  initialFilters?: FilterState;
  visible?: boolean;
  inline?: boolean;
  onClose?: () => void;
  onApply?: (filters: FilterState) => void;
  accent?: string;
  style?: ViewStyle;
}

export function FilterBottomSheetBlock({
  initialFilters,
  visible = false,
  inline = true,
  onClose = () => {},
  onApply,
  accent = colors.lime,
  style,
}: FilterBottomSheetBlockProps) {
  const [selectedStatus, setSelectedStatus] = useState<string[]>(
    initialFilters?.selectedStatus ?? [],
  );
  const [date, setDate] = useState<Date | undefined>(initialFilters?.date);
  const [maxBudget, setMaxBudget] = useState(
    initialFilters?.maxBudget ?? 50000,
  );

  useEffect(() => {
    if (visible) {
      setSelectedStatus(initialFilters?.selectedStatus ?? []);
      setMaxBudget(initialFilters?.maxBudget ?? 50000);
      setDate(initialFilters?.date);
    }
  }, [visible, initialFilters]);

  const statuses = [
    { id: "active", label: "Active" },
    { id: "review", label: "In Review" },
    { id: "completed", label: "Completed" },
    { id: "archived", label: "Archived" },
  ];

  const toggleStatus = (id: string) => {
    if (selectedStatus.includes(id)) {
      setSelectedStatus(selectedStatus.filter((s) => s !== id));
    } else {
      setSelectedStatus([...selectedStatus, id]);
    }
  };

  const handleReset = () => {
    setSelectedStatus([]);
    setMaxBudget(50000);
    setDate(undefined);
  };

  const handleApply = () => {
    onApply?.({ selectedStatus, maxBudget, date });
    onClose();
  };

  const content = (
    <View style={s.body}>
      {/* Status section */}
      <View style={s.section}>
        <Text style={s.sectionLabel}>Record Status</Text>
        <View style={s.chipsRow}>
          {statuses.map((item) => (
            <TagChip
              key={item.id}
              label={item.label}
              selected={selectedStatus.includes(item.id)}
              accent={accent}
              onPress={() => toggleStatus(item.id)}
            />
          ))}
        </View>
      </View>

      {/* Date Picker */}
      <View style={s.section}>
        <DatePicker
          label="Created After"
          value={date}
          onChange={setDate}
          accent={accent}
        />
      </View>

      {/* Budget Slider */}
      <View style={s.section}>
        <Slider
          value={maxBudget}
          onChange={setMaxBudget}
          min={1000}
          max={50000}
          step={1000}
          label="Maximum Budget"
          valueFormatter={(v) => `$${v.toLocaleString()}`}
          accent={accent}
        />
      </View>
    </View>
  );

  const footer = (
    <View style={s.footerRow}>
      <Button variant="ghost" size="sm" onPress={handleReset}>
        Reset all
      </Button>
      <Button
        variant="primary"
        size="sm"
        accent={accent}
        disabled={!onApply}
        onPress={handleApply}
      >
        Apply filters
      </Button>
    </View>
  );

  if (inline) {
    return (
      <Card
        title="Advanced filters"
        footer={footer}
        style={StyleSheet.flatten([s.inlineCard, style])}
      >
        {content}
      </Card>
    );
  }

  return (
    <View style={style}>
      <BottomSheet
        visible={visible}
        onClose={onClose}
        title="Advanced filters"
        footer={footer}
      >
        {content}
      </BottomSheet>
    </View>
  );
}

const s = StyleSheet.create({
  inlineCard: {
    width: "100%",
    maxWidth: 520,
  },
  body: {
    gap: 18,
    width: "100%",
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.ink,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  footerRow: {
    flexWrap: "wrap",
    gap: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});
