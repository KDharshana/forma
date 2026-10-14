import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  ActivityList,
  Avatar,
  AvatarGroup,
  Badge,
  BottomNav,
  Button,
  Calendar,
  Card,
  Carousel,
  Checkbox,
  ColorPicker,
  Combobox,
  DatePicker,
  Divider,
  Drawer,
  Dropdown,
  FileUploader,
  FilterBar,
  FormField,
  FormLabel,
  Icon,
  Input,
  List,
  ListItem,
  MetricCard,
  ModalDialog,
  MultiSelect,
  Navbar,
  Pagination,
  Popover,
  ProgressBar,
  ProgressCard,
  RadioGroup,
  Rating,
  RichTextEditor,
  SegmentedControl,
  Skeleton,
  Slider,
  Spinner,
  Stepper,
  Switch,
  Tabs,
  TagChip,
  TaskCard,
  TimePicker,
  Toast,
  ToggleRow,
  TreeView,
  Accordion,
  AlertDialog,
  BottomSheet,
  Breadcrumbs,
  FAB,
  NotificationList,
  CommandPalette,
  SettingsList,
  SwipeableRow,
  RelativeTime,
  LoadMore,
  PhoneInput,
  NumPad,
  EmailChipInput,
  DurationInput,
  InlineEditField,
  DateRangePicker,
  SortGroupControls,
  colors,
} from "../components";
import { ComponentId } from "./registry";

export const people = [
  { name: "Alex Chen" },
  { name: "Sam Lee" },
  { name: "Jordan Park" },
  { name: "Riley Taylor" },
  { name: "Jamie Kim" },
];

export const points = [
  { label: "M", value: 29 },
  { label: "T", value: 44 },
  { label: "W", value: 36 },
  { label: "T", value: 64 },
  { label: "F", value: 51 },
  { label: "S", value: 73 },
  { label: "S", value: 92 },
];

const activities = [
  {
    id: "studio",
    title: "Studio project",
    subtitle: "Invoice paid · 10:42 AM",
    amount: "+$1,250",
    icon: "layers" as const,
    color: "#e7edd8",
  },
  {
    id: "figma",
    title: "Design tools",
    subtitle: "Subscription · 09:15 AM",
    amount: "−$24.00",
    icon: "grid" as const,
    color: "#eae2f4",
  },
  {
    id: "coffee",
    title: "Monday Coffee",
    subtitle: "Team catch-up · 08:30 AM",
    amount: "−$12.50",
    icon: "sun" as const,
    color: "#f3e8dc",
  },
];

export function Example({
  id,
  accent = colors.lime,
}: {
  id: ComponentId;
  accent?: string;
}) {
  const [done, setDone] = useState(false);
  const [tab, setTab] = useState("home");
  const [date, setDate] = useState(new Date(2026, 9, 16));
  const [time, setTime] = useState("09:30 AM");
  const [period, setPeriod] = useState("Week");
  const [notifications, setNotifications] = useState(true);
  const [updates, setUpdates] = useState(false);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [sliderVal, setSliderVal] = useState(65);
  const [ratingVal, setRatingVal] = useState(4);
  const [colorVal, setColorVal] = useState(colors.lime);
  const [comboVal, setComboVal] = useState("react");
  const [multiVal, setMultiVal] = useState(["design", "systems"]);
  const [richTextVal, setRichTextVal] = useState(
    "Thoughtful design is simple.",
  );
  const [filterQuery, setFilterQuery] = useState("");
  const [filterActive, setFilterActive] = useState(["active"]);
  const [page, setPage] = useState(1);
  const [step, setStep] = useState(1);
  const [alertOpen, setAlertOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  if (id === "metric") return <MetricCard points={points} accent={accent} />;

  if (id === "task")
    return (
      <TaskCard
        title="Website exploration"
        description={
          "A fresh direction for something great.\nLet’s make it feel a little more human."
        }
        people={people.slice(0, 3)}
        progress={64}
        due="Oct 24"
        completed={done}
        onToggle={() => setDone(!done)}
        accent={accent}
      />
    );

  if (id === "card")
    return (
      <Card
        title="Active Subscription"
        subtitle="Professional studio workspace"
        badge={<Badge tone="success">Active</Badge>}
        footer={
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={s.small}>Next renewal Nov 1st</Text>
            <Button
              variant="outline"
              onPress={() => setNotice("Managing billing")}
            >
              Manage
            </Button>
          </View>
        }
      >
        <Text style={[s.small, { marginTop: 0 }]}>
          4 of 5 team seats currently assigned.
        </Text>
      </Card>
    );

  if (id === "button")
    return (
      <View style={{ alignItems: "center", gap: 13, width: "100%" }}>
        <Button
          icon="arrow"
          onPress={() => setNotice("You’re ready to get started.")}
        >
          Get started
        </Button>
        <Button
          variant="secondary"
          accent={accent}
          icon="plus"
          onPress={() => setNotice("Project created. Make it yours!")}
        >
          Create project
        </Button>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Button
            variant="outline"
            onPress={() =>
              setNotice("Open any component to explore its source.")
            }
          >
            Learn more
          </Button>
          <Button
            variant="ghost"
            icon="arrow"
            onPress={() => setNotice("Saved for later.")}
          >
            Skip
          </Button>
        </View>
        <Text accessibilityLiveRegion="polite" style={s.notice}>
          {notice || "A good first impression, in every variant."}
        </Text>
      </View>
    );

  if (id === "navigation")
    return (
      <View style={{ width: "100%", alignItems: "center", gap: 16 }}>
        <BottomNav
          value={tab}
          onChange={setTab}
          accent={accent}
          items={[
            { id: "home", label: "Home", icon: "home" },
            { id: "activity", label: "Activity", icon: "chart" },
            { id: "team", label: "Team", icon: "users" },
            { id: "settings", label: "Settings", icon: "settings" },
          ]}
        />
        <Text style={s.notice}>Active tab: {tab}</Text>
      </View>
    );

  if (id === "navbar")
    return (
      <View style={{ width: "100%" }}>
        <Navbar
          activeId={tab}
          onSelect={setTab}
          accent={accent}
          items={[
            { id: "home", label: "Home" },
            { id: "projects", label: "Projects", badge: 3 },
          ]}
          actions={
            <Button
              variant="outline"
              onPress={() => setNotice("Search pressed")}
            >
              Search
            </Button>
          }
        />
      </View>
    );

  if (id === "drawer")
    return (
      <View style={{ width: "100%", alignItems: "center", gap: 10 }}>
        <Button
          variant="outline"
          icon="menu"
          onPress={() => setDrawerOpen(true)}
        >
          Open drawer menu
        </Button>
        <Drawer
          visible={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          activeId={tab}
          onSelect={setTab}
          accent={accent}
          sections={[
            {
              title: "Overview",
              items: [
                { id: "home", label: "Dashboard", icon: "home" },
                {
                  id: "projects",
                  label: "Projects",
                  icon: "layers",
                  badge: "12",
                },
                { id: "team", label: "Team members", icon: "users" },
              ],
            },
          ]}
        />
      </View>
    );

  if (id === "tabs")
    return (
      <View style={{ width: "100%", gap: 14 }}>
        <Tabs
          value={tab}
          onChange={setTab}
          accent={accent}
          items={[
            { id: "home", label: "Overview", count: 14 },
            { id: "activity", label: "Activity" },
            { id: "team", label: "Team", count: 5 },
          ]}
        />
        <Tabs
          variant="underline"
          value={tab}
          onChange={setTab}
          accent={accent}
          items={[
            { id: "home", label: "Overview" },
            { id: "activity", label: "Activity" },
            { id: "team", label: "Team" },
          ]}
        />
      </View>
    );

  if (id === "pagination")
    return (
      <View style={{ width: "100%" }}>
        <Pagination
          page={page}
          totalPages={6}
          totalItems={58}
          onChange={setPage}
          accent={accent}
        />
      </View>
    );

  if (id === "stepper")
    return (
      <View style={{ width: "100%" }}>
        <Stepper
          currentStep={step}
          onStepPress={setStep}
          accent={accent}
          steps={[
            { id: "1", title: "Details", description: "Project basics" },
            { id: "2", title: "Configuration", description: "Select theme" },
            { id: "3", title: "Review", description: "Ready to ship" },
          ]}
        />
      </View>
    );

  if (id === "activity")
    return (
      <View style={{ width: "100%" }}>
        <ActivityList
          items={activities}
          onSelect={(item) =>
            setNotice(`${item.title} · ${item.amount} · ${item.subtitle}`)
          }
        />
      </View>
    );

  if (id === "list")
    return (
      <View style={{ width: "100%" }}>
        <List>
          <ListItem
            title="Alex Chen"
            subtitle="Design Director"
            leading={<Avatar name="Alex Chen" size="sm" status="online" />}
            showChevron
            onPress={() => setNotice("Selected Alex Chen")}
          />
          <ListItem
            title="Sam Lee"
            subtitle="Frontend Engineer"
            leading={<Avatar name="Sam Lee" size="sm" status="away" />}
            showChevron
            onPress={() => setNotice("Selected Sam Lee")}
          />
        </List>
      </View>
    );

  if (id === "tree")
    return (
      <View style={[s.whiteCard, { padding: 12 }]}>
        <TreeView
          accent={accent}
          data={[
            {
              id: "src",
              label: "src",
              children: [
                {
                  id: "components",
                  label: "components",
                  children: [
                    { id: "button", label: "Button.tsx" },
                    { id: "badge", label: "Badge.tsx" },
                  ],
                },
                { id: "theme", label: "theme.ts" },
              ],
            },
          ]}
        />
      </View>
    );

  if (id === "carousel")
    return (
      <View style={{ width: "100%" }}>
        <Carousel
          accent={accent}
          slides={[
            {
              id: "1",
              title: "Design System",
              subtitle: "Soft neutrals and pill buttons.",
              tag: "Forma",
            },
            {
              id: "2",
              title: "Mobile Ready",
              subtitle: "React Native primitives with SVG.",
              tag: "Native",
            },
            {
              id: "3",
              title: "Zero Lock-in",
              subtitle: "Source code you own directly.",
              tag: "Open",
            },
          ]}
        />
      </View>
    );

  if (id === "calendar")
    return <Calendar value={date} onChange={setDate} accent={accent} />;

  if (id === "datepicker")
    return (
      <DatePicker
        value={date}
        onChange={setDate}
        accent={accent}
        label="Delivery date"
      />
    );

  if (id === "timepicker")
    return (
      <TimePicker
        value={time}
        onChange={setTime}
        accent={accent}
        label="Meeting time"
      />
    );

  if (id === "progress") return <ProgressCard value={78} accent={accent} />;

  if (id === "progressbar")
    return (
      <View style={[s.whiteCard, { gap: 14 }]}>
        <ProgressBar
          value={sliderVal}
          label="Project completion"
          showPercent
          accent={accent}
        />
        <ProgressBar
          value={40}
          tone="warning"
          size="sm"
          label="Storage quota"
          showPercent
        />
        <ProgressBar
          value={90}
          tone="success"
          size="lg"
          label="Automated tests"
          showPercent
        />
      </View>
    );

  if (id === "spinner")
    return (
      <View
        style={[
          s.whiteCard,
          {
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          },
        ]}
      >
        <Spinner size="sm" color={accent} />
        <Spinner size="md" color={colors.ink} />
        <Spinner size="lg" color={accent} />
      </View>
    );

  if (id === "skeleton")
    return (
      <View style={[s.whiteCard, { gap: 12 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Skeleton variant="circular" width={40} />
          <View style={{ flex: 1, gap: 6 }}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="40%" height={10} />
          </View>
        </View>
        <Skeleton width="100%" height={50} variant="rectangular" />
      </View>
    );

  if (id === "toast")
    return (
      <View style={{ width: "100%", gap: 10 }}>
        <Toast
          tone="success"
          message="File saved to workspace."
          actionText="Undo"
          onAction={() => {}}
        />
        <Toast
          tone="info"
          message="Update available for download."
          onDismiss={() => {}}
        />
      </View>
    );

  if (id === "badges")
    return (
      <View style={[s.whiteCard, { gap: 14 }]}>
        <Text style={s.cardTitle}>Status badges</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Badge tone="success">Completed</Badge>
          <Badge tone="lavender">In progress</Badge>
          <Badge tone="warning">In review</Badge>
          <Badge tone="neutral">Draft</Badge>
        </View>
      </View>
    );

  if (id === "chip")
    return (
      <View style={[s.whiteCard, { gap: 10 }]}>
        <Text style={s.cardTitle}>Interactive tags & chips</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <TagChip
            label="Active"
            dot
            dotColor={colors.success}
            accent={accent}
            selected
          />
          <TagChip
            label="High priority"
            dot
            dotColor={colors.danger}
            onRemove={() => {}}
          />
          <TagChip label="Design" icon="spark" />
        </View>
      </View>
    );

  if (id === "segmented")
    return (
      <View style={[s.whiteCard, { gap: 18 }]}>
        <Text style={s.cardTitle}>Overview period</Text>
        <SegmentedControl
          options={["Day", "Week", "Month"]}
          value={period}
          onChange={setPeriod}
          accent={accent}
        />
        <Text style={s.big}>
          {period === "Day" ? "4" : period === "Week" ? "24" : "86"}
        </Text>
      </View>
    );

  if (id === "avatars")
    return (
      <View style={[s.whiteCard, { alignItems: "center", gap: 16 }]}>
        <Text style={s.cardTitle}>Collaborators</Text>
        <AvatarGroup people={people} size={44} />
      </View>
    );

  if (id === "avatar")
    return (
      <View
        style={[
          s.whiteCard,
          {
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          },
        ]}
      >
        <Avatar name="Alex Chen" size="sm" status="online" />
        <Avatar name="Sam Lee" size="md" status="away" />
        <Avatar name="Jordan Park" size="lg" status="busy" />
      </View>
    );

  if (id === "toggle")
    return (
      <View style={s.whiteCard}>
        <ToggleRow
          title="Notifications"
          description="Stay in the loop"
          value={notifications}
          onChange={setNotifications}
          accent={accent}
        />
        <View style={{ height: 1, backgroundColor: colors.line }} />
        <ToggleRow
          title="Product updates"
          description="A little inspiration, occasionally"
          icon="spark"
          value={updates}
          onChange={setUpdates}
          accent={accent}
        />
      </View>
    );

  if (id === "switch")
    return (
      <View style={[s.whiteCard, { gap: 12 }]}>
        <Switch
          value={notifications}
          onChange={setNotifications}
          accent={accent}
          label="Push notifications"
          description="Real-time alerts for updates"
        />
      </View>
    );

  if (id === "checkbox")
    return (
      <View style={[s.whiteCard, { gap: 12 }]}>
        <Checkbox
          checked={done}
          onChange={setDone}
          label="Remember my preference"
          description="Apply across all workspaces"
          accent={accent}
        />
      </View>
    );

  if (id === "radio")
    return (
      <View style={s.whiteCard}>
        <RadioGroup
          value={period}
          onChange={setPeriod}
          accent={accent}
          options={[
            {
              value: "Day",
              label: "Daily digest",
              description: "One email every morning",
            },
            {
              value: "Week",
              label: "Weekly summary",
              description: "Consolidated report on Mondays",
            },
          ]}
        />
      </View>
    );

  if (id === "slider")
    return (
      <View style={s.whiteCard}>
        <Slider
          value={sliderVal}
          onChange={setSliderVal}
          min={0}
          max={100}
          label="Storage allocation"
          valueFormatter={(v) => `${v} GB`}
          accent={accent}
        />
      </View>
    );

  if (id === "rating")
    return (
      <View style={[s.whiteCard, { alignItems: "center", gap: 10 }]}>
        <Text style={s.cardTitle}>Rate your experience</Text>
        <Rating value={ratingVal} onChange={setRatingVal} showScore />
      </View>
    );

  if (id === "colorpicker")
    return (
      <View style={s.whiteCard}>
        <ColorPicker
          value={colorVal}
          onChange={setColorVal}
          label="Theme accent color"
        />
      </View>
    );

  if (id === "input")
    return (
      <View style={[s.whiteCard, { gap: 14 }]}>
        <Input
          label="Email address"
          icon="mail"
          placeholder="you@studio.com"
          value={email}
          onChangeText={setEmail}
          accent={accent}
          hint="We will keep your inbox tidy."
        />
      </View>
    );

  if (id === "formlabel")
    return (
      <View style={s.whiteCard}>
        <FormLabel
          label="Project identifier"
          required
          hint="Choose a lowercase slug"
        />
      </View>
    );

  if (id === "formfield")
    return (
      <View style={s.whiteCard}>
        <FormField
          label="Workspace name"
          required
          helpText="This name will appear on shared invoices"
          charCount={{ current: 12, max: 32 }}
        >
          <Input label="Workspace name" placeholder="Acme Studio" />
        </FormField>
      </View>
    );

  if (id === "combobox")
    return (
      <View style={s.whiteCard}>
        <Combobox
          label="Framework"
          value={comboVal}
          onChange={setComboVal}
          accent={accent}
          options={[
            { value: "react", label: "React Native" },
            { value: "expo", label: "Expo Router" },
            { value: "web", label: "React Native Web" },
          ]}
        />
      </View>
    );

  if (id === "dropdown")
    return (
      <View style={[s.whiteCard, { alignItems: "center" }]}>
        <Dropdown
          placeholder="More options"
          onSelect={(item) => setNotice(`Selected ${item.label}`)}
          items={[
            { id: "edit", label: "Edit details", icon: "edit" },
            { id: "copy", label: "Copy link", icon: "copy" },
            { id: "del", label: "Delete", icon: "trash", danger: true },
          ]}
        />
        {notice ? (
          <Text style={[s.notice, { marginTop: 8 }]}>{notice}</Text>
        ) : null}
      </View>
    );

  if (id === "multiselect")
    return (
      <View style={s.whiteCard}>
        <MultiSelect
          label="Skills & tags"
          value={multiVal}
          onChange={setMultiVal}
          accent={accent}
          options={[
            { value: "design", label: "UI Design" },
            { value: "systems", label: "Design Systems" },
            { value: "native", label: "React Native" },
            { value: "motion", label: "Animation" },
          ]}
        />
      </View>
    );

  if (id === "richtext")
    return (
      <View style={s.whiteCard}>
        <RichTextEditor
          label="Notes & specs"
          value={richTextVal}
          onChange={setRichTextVal}
          accent={accent}
        />
      </View>
    );

  if (id === "filterbar")
    return (
      <View style={s.whiteCard}>
        <FilterBar
          query={filterQuery}
          onQueryChange={setFilterQuery}
          filters={[
            { id: "active", label: "Active", count: 8 },
            { id: "review", label: "In Review", count: 3 },
          ]}
          selectedFilterIds={filterActive}
          onToggleFilter={(fid) =>
            setFilterActive(filterActive.includes(fid) ? [] : [fid])
          }
          resultCount={11}
          accent={accent}
        />
      </View>
    );

  if (id === "accordion")
    return (
      <View style={{ width: "100%" }}>
        <Accordion
          accent={accent}
          defaultOpenIds={["1"]}
          items={[
            {
              id: "1",
              title: "What makes Forma native?",
              content:
                "It uses pure React Native views, texts, and SVG without heavy foreign native abstractions.",
            },
            {
              id: "2",
              title: "Can I customize the accents?",
              content:
                "Yes, every component accepts an accent color prop like lime, lilac, seafoam, or apricot.",
            },
          ]}
        />
      </View>
    );

  if (id === "divider")
    return (
      <View style={[s.whiteCard, { gap: 14 }]}>
        <Text style={s.small}>Section above</Text>
        <Divider label="OR CONTINUE WITH" />
        <Text style={s.small}>Section below</Text>
      </View>
    );

  if (id === "alertdialog")
    return (
      <View style={[s.whiteCard, { alignItems: "center", gap: 10 }]}>
        <Button variant="outline" onPress={() => setAlertOpen(true)}>
          Trigger alert dialog
        </Button>
        <AlertDialog
          visible={alertOpen}
          tone="danger"
          title="Delete component?"
          description="This action cannot be undone. All saved settings will be removed."
          onConfirm={() => {
            setAlertOpen(false);
            setNotice("Deleted");
          }}
          onClose={() => setAlertOpen(false)}
        />
      </View>
    );

  if (id === "modal")
    return (
      <View style={[s.whiteCard, { alignItems: "center" }]}>
        <Button variant="outline" onPress={() => setModalOpen(true)}>
          Open modal dialog
        </Button>
        <ModalDialog
          visible={modalOpen}
          title="New Workspace"
          subtitle="Configure basic team settings"
          onClose={() => setModalOpen(false)}
          footer={
            <Button onPress={() => setModalOpen(false)}>
              Create workspace
            </Button>
          }
        >
          <Input label="Workspace title" placeholder="e.g. Acme Studio" />
        </ModalDialog>
      </View>
    );

  if (id === "bottomsheet")
    return (
      <View style={[s.whiteCard, { alignItems: "center" }]}>
        <Button variant="outline" onPress={() => setSheetOpen(true)}>
          Open bottom sheet
        </Button>
        <BottomSheet
          visible={sheetOpen}
          title="Filter preferences"
          onClose={() => setSheetOpen(false)}
        >
          <Text style={s.small}>Select filters for your view.</Text>
        </BottomSheet>
      </View>
    );

  if (id === "popover")
    return (
      <View style={[s.whiteCard, { alignItems: "center" }]}>
        <Popover
          title="Quick tip"
          trigger={
            <View
              style={{
                minHeight: 44,
                paddingHorizontal: 16,
                justifyContent: "center",
                borderWidth: 1,
                borderColor: colors.line,
                borderRadius: 22,
              }}
            >
              <Text style={{ color: colors.ink, fontSize: 14 }}>
                Open popover
              </Text>
            </View>
          }
          content={
            <Text style={s.small}>
              Forma components share a unified color token system.
            </Text>
          }
        />
      </View>
    );

  if (id === "fileuploader")
    return (
      <View style={s.whiteCard}>
        <FileUploader accent={accent} />
      </View>
    );

  if (id === "breadcrumbs")
    return (
      <View style={s.whiteCard}>
        <Breadcrumbs
          items={[
            { id: "1", label: "Inventory", icon: "layers" },
            { id: "2", label: "Distribution Hubs" },
            { id: "3", label: "South Region" },
            { id: "4", label: "Peenya Industrial Hub" },
          ]}
          onSelect={(item) => setNotice(`Navigated to: ${item.label}`)}
        />
        <Text style={s.notice}>{notice}</Text>
      </View>
    );

  if (id === "fab")
    return (
      <View
        style={[
          s.whiteCard,
          { minHeight: 140, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <FAB
            icon="plus"
            size="md"
            variant="primary"
            onPress={() => setNotice("Primary FAB pressed")}
          />
          <FAB
            icon="edit"
            label="Create Requisition"
            size="md"
            variant="dark"
            onPress={() => setNotice("Extended FAB pressed")}
          />
        </View>
        <Text style={s.notice}>{notice}</Text>
      </View>
    );

  if (id === "notifications")
    return (
      <View style={{ width: "100%" }}>
        <NotificationList
          items={[
            {
              id: "1",
              title: "Payment realized",
              message: "₹45,200 credited for invoice #INV-2026-891 via NEFT.",
              timestamp: "4m ago",
              unread: true,
              type: "success",
              actionLabel: "View Receipt",
              onAction: () => setNotice("Receipt opened"),
            },
            {
              id: "2",
              title: "Stock threshold warning",
              message: "SKU BRG-6204 has dropped below minimum safety buffer.",
              timestamp: "22m ago",
              unread: true,
              type: "warning",
              actionLabel: "Reorder",
              onAction: () => setNotice("Reorder opened"),
            },
            {
              id: "3",
              title: "Trip completed",
              message: "Vehicle KA-01-MJ-8819 arrived at Chennai Port CFS.",
              timestamp: "2h ago",
              unread: false,
              type: "info",
            },
          ]}
          onItemPress={(item) => setNotice(`Notification: ${item.title}`)}
          onDismiss={(id) => setNotice(`Dismissed notification ${id}`)}
          onMarkAllRead={() => setNotice("All notifications marked as read")}
        />
        <Text style={s.notice}>{notice}</Text>
      </View>
    );

  if (id === "commandpalette")
    return (
      <View style={{ width: "100%", gap: 8 }}>
        <CommandPalette
          inline
          visible
          onClose={() => {}}
          items={[
            {
              id: "1",
              label: "Create Tax Invoice",
              group: "Billing",
              icon: "file",
              shortcut: "⌘I",
              onSelect: () => setNotice("Selected: Create Tax Invoice"),
            },
            {
              id: "2",
              label: "Dispatch Fleet Run",
              group: "Logistics",
              icon: "arrowRight",
              shortcut: "⌘D",
              onSelect: () => setNotice("Selected: Dispatch Fleet Run"),
            },
            {
              id: "3",
              label: "Verify GSTIN",
              group: "Compliance",
              icon: "shield",
              shortcut: "⌘G",
              onSelect: () => setNotice("Selected: Verify GSTIN"),
            },
            {
              id: "4",
              label: "Scan Storage Bin",
              group: "Warehouse",
              icon: "grid",
              shortcut: "⌘B",
              onSelect: () => setNotice("Selected: Scan Storage Bin"),
            },
          ]}
        />
        {!!notice && <Text style={s.notice}>{notice}</Text>}
      </View>
    );

  if (id === "settingslist")
    return (
      <View style={{ width: "100%" }}>
        <SettingsList
          sections={[
            {
              id: "org",
              title: "Organization Preferences",
              items: [
                {
                  id: "e-inv",
                  label: "Automatic E-Invoice Reporting",
                  description:
                    "Instantly sign invoices on IRP portal upon generation",
                  type: "toggle",
                  value: true,
                  onValueChange: (v) => setNotice(`Auto E-invoice: ${v}`),
                },
                {
                  id: "gstin",
                  label: "Registered GSTIN",
                  type: "value",
                  value: "29AABCU9603R1ZM",
                  onPress: () => setNotice("Editing GSTIN"),
                },
                {
                  id: "sec",
                  label: "Two-factor authorization",
                  type: "link",
                  badge: "Active",
                  badgeTone: "success",
                  onPress: () => setNotice("2FA settings opened"),
                },
              ],
            },
            {
              id: "danger",
              items: [
                {
                  id: "del",
                  label: "Archive Business Unit",
                  destructive: true,
                  type: "button",
                  onPress: () => setNotice("Archive requested"),
                },
              ],
            },
          ]}
        />
        <Text style={s.notice}>{notice}</Text>
      </View>
    );

  if (id === "swipeablerow")
    return (
      <View style={s.whiteCard}>
        <SwipeableRow
          rightActions={[
            {
              id: "edit",
              label: "Edit",
              icon: "edit",
              variant: "primary",
              onPress: () => setNotice("Edit clicked"),
            },
            {
              id: "del",
              label: "Delete",
              icon: "trash",
              variant: "danger",
              onPress: () => setNotice("Delete clicked"),
            },
          ]}
        >
          <View style={{ padding: 12 }}>
            <Text
              style={{ fontSize: 14, fontWeight: "600", color: colors.ink }}
            >
              Invoice #INV-2026-0491
            </Text>
            <Text style={{ fontSize: 12, color: colors.muted }}>
              ₹2,18,300.00 • Peenya Warehouse
            </Text>
          </View>
        </SwipeableRow>
        <Text style={s.notice}>{notice}</Text>
      </View>
    );

  if (id === "relativetime")
    return (
      <View style={[s.whiteCard, { gap: 8 }]}>
        <Text style={{ fontSize: 13, color: colors.ink }}>
          Created:{" "}
          <RelativeTime date={new Date(Date.now() - 1000 * 60 * 12)} live />
        </Text>
        <Text style={{ fontSize: 13, color: colors.ink }}>
          Updated:{" "}
          <RelativeTime date={new Date(Date.now() - 1000 * 60 * 60 * 4)} />
        </Text>
        <Text style={{ fontSize: 13, color: colors.ink }}>
          Verified:{" "}
          <RelativeTime date={new Date(Date.now() - 1000 * 60 * 60 * 28)} />
        </Text>
      </View>
    );

  if (id === "loadmore")
    return (
      <View style={s.whiteCard}>
        <LoadMore
          status="idle"
          label="Load 20 more entries"
          onLoadMore={() => setNotice("Fetching next page of records...")}
        />
        <Text style={s.notice}>{notice}</Text>
      </View>
    );

  if (id === "phoneinput")
    return (
      <View style={s.whiteCard}>
        <PhoneInput
          label="Field Operations Dispatcher Phone"
          value={
            notice.startsWith("Phone:")
              ? notice.replace("Phone: ", "")
              : "98450 12345"
          }
          onChangeText={(v) => setNotice(`Phone: ${v}`)}
        />
        <Text style={s.notice}>{notice}</Text>
      </View>
    );

  if (id === "numpad")
    return (
      <View style={[s.whiteCard, { alignItems: "center" }]}>
        <NumPad
          value={
            notice.startsWith("PIN:") ? notice.replace("PIN: ", "") : "481"
          }
          onChange={(v) => setNotice(`PIN: ${v}`)}
          mode="pin"
          maxLength={6}
          onSubmit={() => setNotice(`PIN submitted: ${notice}`)}
        />
        <Text style={s.notice}>{notice}</Text>
      </View>
    );

  if (id === "emailchipinput")
    return (
      <View style={s.whiteCard}>
        <EmailChipInput
          label="Invoice Notification Recipients"
          value={["finance@apex.in", "audits@firm.com"]}
          onChange={(emails) => setNotice(`Emails: ${emails.join(", ")}`)}
        />
        <Text style={s.notice}>{notice}</Text>
      </View>
    );

  if (id === "durationinput")
    return (
      <View style={s.whiteCard}>
        <DurationInput
          label="Service Level Agreement (SLA) Resolution Window"
          value={{ days: 1, hours: 4, minutes: 30 }}
          onChange={(v) =>
            setNotice(`Duration: ${v.days}d ${v.hours}h ${v.minutes}m`)
          }
        />
        <Text style={s.notice}>{notice}</Text>
      </View>
    );

  if (id === "inlineedit")
    return (
      <View style={s.whiteCard}>
        <InlineEditField
          label="Business Unit Title"
          value={
            notice.startsWith("Saved:")
              ? notice.replace("Saved: ", "")
              : "Apex South Logistics Facility"
          }
          onSave={(v) => setNotice(`Saved: ${v}`)}
        />
        <Text style={s.notice}>{notice}</Text>
      </View>
    );

  if (id === "daterangepicker")
    return (
      <View style={s.whiteCard}>
        <DateRangePicker
          label="GST Billing Audit Period"
          value={{
            startDate: new Date(2026, 9, 1),
            endDate: new Date(2026, 9, 14),
          }}
          onChange={(r) =>
            setNotice(
              `Selected range: ${r.startDate.toDateString()} – ${r.endDate.toDateString()}`,
            )
          }
        />
        <Text style={s.notice}>{notice}</Text>
      </View>
    );

  if (id === "sortgroup")
    return (
      <View style={s.whiteCard}>
        <SortGroupControls
          sortFields={[
            { id: "date", label: "Created Date" },
            { id: "amount", label: "Invoice Amount" },
            { id: "status", label: "Clearing Status" },
          ]}
          selectedSort="date"
          onSortChange={(f) => setNotice(`Sort field: ${f}`)}
          sortDirection="asc"
          onDirectionToggle={() => setNotice("Toggled sort direction")}
          groupFields={[
            { id: "branch", label: "Branch Office" },
            { id: "tax_slab", label: "Tax Slab" },
          ]}
          selectedGroup="branch"
          onGroupChange={(g) => setNotice(`Group by: ${g}`)}
        />
        <Text style={s.notice}>{notice}</Text>
      </View>
    );

  return (
    <View style={s.whiteCard}>
      <Text style={s.cardTitle}>Component preview</Text>
    </View>
  );
}

const s = StyleSheet.create({
  notice: {
    color: "#6b755b",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 6,
  },
  whiteCard: {
    width: "100%",
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  cardTitle: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  small: { fontSize: 11, color: colors.muted, marginTop: 4, lineHeight: 16 },
  big: {
    fontSize: 36,
    fontWeight: "600",
    color: colors.ink,
    letterSpacing: -1.2,
  },
});
