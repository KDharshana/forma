import { IconName } from "../components";

export type Category =
  | "All components"
  | "Data display"
  | "Inputs"
  | "Navigation"
  | "Feedback"
  | "Overlays & Layout";

export type ComponentId =
  | "metric"
  | "task"
  | "card"
  | "button"
  | "navigation"
  | "navbar"
  | "drawer"
  | "tabs"
  | "pagination"
  | "stepper"
  | "activity"
  | "list"
  | "tree"
  | "carousel"
  | "calendar"
  | "datepicker"
  | "timepicker"
  | "progress"
  | "progressbar"
  | "spinner"
  | "skeleton"
  | "toast"
  | "badges"
  | "segmented"
  | "avatars"
  | "avatar"
  | "toggle"
  | "switch"
  | "checkbox"
  | "radio"
  | "slider"
  | "rating"
  | "colorpicker"
  | "input"
  | "formlabel"
  | "formfield"
  | "combobox"
  | "dropdown"
  | "multiselect"
  | "richtext"
  | "filterbar"
  | "accordion"
  | "divider"
  | "chip"
  | "alertdialog"
  | "modal"
  | "bottomsheet"
  | "popover"
  | "fileuploader"
  | "breadcrumbs"
  | "fab"
  | "notifications"
  | "commandpalette"
  | "settingslist"
  | "swipeablerow"
  | "relativetime"
  | "loadmore"
  | "phoneinput"
  | "numpad"
  | "emailchipinput"
  | "durationinput"
  | "inlineedit"
  | "daterangepicker"
  | "sortgroup";

export type Entry = {
  id: ComponentId;
  name: string;
  description: string;
  category: Category;
  icon: IconName;
  file: string;
  dependencies: string[];
  background: string;
  tag?: string;
  usage: string;
};

export const categories: Category[] = [
  "All components",
  "Inputs",
  "Data display",
  "Navigation",
  "Feedback",
  "Overlays & Layout",
];

export const registry: Entry[] = [
  {
    id: "metric",
    name: "Metric card",
    description: "Your numbers, with perspective and trendlines.",
    category: "Data display",
    icon: "chart",
    file: "MetricCard.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#edf0e5",
    tag: "Popular",
    usage: `import { MetricCard } from './components/MetricCard';\n\n<MetricCard\n  title="Total revenue"\n  value="$24,680"\n  change="+18.6%"\n  points={[\n    { label: 'Mon', value: 30 },\n    { label: 'Tue', value: 46 },\n    { label: 'Wed', value: 40 },\n    { label: 'Thu', value: 65 },\n    { label: 'Fri', value: 57 },\n    { label: 'Sat', value: 78 },\n    { label: 'Sun', value: 94 },\n  ]}\n/>`,
  },
  {
    id: "task",
    name: "Task card",
    description: "A home for the work that matters.",
    category: "Data display",
    icon: "layers",
    file: "TaskCard.tsx",
    dependencies: ["AvatarGroup.tsx", "Badge.tsx", "Icon.tsx", "theme.ts"],
    background: "#f0edf5",
    tag: "Interactive",
    usage: `import { useState } from 'react';\nimport { TaskCard } from './components/TaskCard';\n\nexport function Example() {\n  const [done, setDone] = useState(false);\n  return <TaskCard\n    title="Website exploration"\n    description="A fresh direction for something great."\n    people={[{ name: 'Alex Chen' }, { name: 'Sam Lee' }]}\n    progress={64}\n    due="Oct 24"\n    completed={done}\n    onToggle={() => setDone(!done)}\n  />;\n}`,
  },
  {
    id: "card",
    name: "Structured card",
    description: "Versatile content container with header, badges, and footer.",
    category: "Data display",
    icon: "grid",
    file: "Card.tsx",
    dependencies: ["theme.ts"],
    background: "#f5f6f2",
    usage: `import { Card } from './components/Card';\nimport { Badge } from './components/Badge';\n\n<Card\n  title="Customer Contract"\n  subtitle="Active agreement for Q4"\n  badge={<Badge tone="success">Active</Badge>}\n>\n  <Text>Review deliverables and milestones.</Text>\n</Card>`,
  },
  {
    id: "button",
    name: "Button",
    description: "Small actions. A strong first impression.",
    category: "Inputs",
    icon: "plus",
    file: "Button.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f0f1ec",
    usage: `import { Button } from './components/Button';\n\n<Button icon="arrow" onPress={() => console.log('Continue')}>\n  Get started\n</Button>\n\n<Button variant="secondary" icon="plus" onPress={() => {}}>\n  Create project\n</Button>\n\n<Button variant="outline" onPress={() => {}}>\n  Learn more\n</Button>`,
  },
  {
    id: "checkbox",
    name: "Checkbox",
    description: "Accessible toggleable checkbox with label and hints.",
    category: "Inputs",
    icon: "check",
    file: "Checkbox.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#edf3ea",
    usage: `import { useState } from 'react';\nimport { Checkbox } from './components/Checkbox';\n\nexport function Example() {\n  const [checked, setChecked] = useState(true);\n  return <Checkbox\n    checked={checked}\n    onChange={setChecked}\n    label="Agree to terms"\n    description="Receive occasional updates"\n  />;\n}`,
  },
  {
    id: "radio",
    name: "Radio button",
    description: "Mutually exclusive selection with descriptive options.",
    category: "Inputs",
    icon: "spark",
    file: "RadioButton.tsx",
    dependencies: ["theme.ts"],
    background: "#f2f0ea",
    usage: `import { useState } from 'react';\nimport { RadioGroup } from './components/RadioButton';\n\nexport function Example() {\n  const [plan, setPlan] = useState('pro');\n  return <RadioGroup\n    value={plan}\n    onChange={setPlan}\n    options={[\n      { value: 'free', label: 'Starter', description: 'Up to 3 members' },\n      { value: 'pro', label: 'Professional', description: 'Unlimited seats' },\n    ]}\n  />;\n}`,
  },
  {
    id: "switch",
    name: "Switch",
    description: "Smooth animated binary toggle switch.",
    category: "Inputs",
    icon: "settings",
    file: "Switch.tsx",
    dependencies: ["theme.ts"],
    background: "#edf2ee",
    usage: `import { useState } from 'react';\nimport { Switch } from './components/Switch';\n\nexport function Example() {\n  const [enabled, setEnabled] = useState(true);\n  return <Switch\n    value={enabled}\n    onChange={setEnabled}\n    label="Dark appearance"\n  />;\n}`,
  },
  {
    id: "slider",
    name: "Slider",
    description: "Smooth range input with track fill and draggable thumb.",
    category: "Inputs",
    icon: "sliders",
    file: "Slider.tsx",
    dependencies: ["theme.ts"],
    background: "#f1f0e6",
    usage: `import { useState } from 'react';\nimport { Slider } from './components/Slider';\n\nexport function Example() {\n  const [val, setVal] = useState(45);\n  return <Slider\n    value={val}\n    onChange={setVal}\n    min={0}\n    max={100}\n    label="Budget allocation"\n    valueFormatter={(v) => \`\${v}%\`}\n  />;\n}`,
  },
  {
    id: "input",
    name: "Text input",
    description: "Form input with icons, hints, and error states.",
    category: "Inputs",
    icon: "mail",
    file: "Input.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f0edf3",
    usage: `import { useState } from 'react';\nimport { Input } from './components/Input';\n\nexport function Example() {\n  const [email, setEmail] = useState('');\n  return <Input\n    label="Email address"\n    icon="mail"\n    placeholder="you@studio.com"\n    value={email}\n    onChangeText={setEmail}\n  />;\n}`,
  },
  {
    id: "formlabel",
    name: "Form label",
    description: "Label with required asterisk and optional pill badges.",
    category: "Inputs",
    icon: "tag",
    file: "FormLabel.tsx",
    dependencies: ["theme.ts"],
    background: "#eef2eb",
    usage: `import { FormLabel } from './components/FormLabel';\n\n<FormLabel label="Project title" required hint="Choose a unique name" />`,
  },
  {
    id: "formfield",
    name: "Form field",
    description: "Wrapper pairing label, control, character count, and error.",
    category: "Inputs",
    icon: "edit",
    file: "FormField.tsx",
    dependencies: ["FormLabel.tsx", "Icon.tsx", "theme.ts"],
    background: "#f3efe6",
    usage: `import { FormField } from './components/FormField';\nimport { Input } from './components/Input';\n\n<FormField label="Team size" helpText="Enter approximate number">\n  <Input placeholder="e.g. 12" />\n</FormField>`,
  },
  {
    id: "combobox",
    name: "Combobox",
    description: "Searchable select input with filterable options.",
    category: "Inputs",
    icon: "search",
    file: "Combobox.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#edf1f4",
    tag: "Searchable",
    usage: `import { useState } from 'react';\nimport { Combobox } from './components/Combobox';\n\nexport function Example() {\n  const [selected, setSelected] = useState('react');\n  return <Combobox\n    value={selected}\n    onChange={setSelected}\n    options={[\n      { value: 'react', label: 'React Native' },\n      { value: 'expo', label: 'Expo SDK' },\n      { value: 'ts', label: 'TypeScript' },\n    ]}\n  />;\n}`,
  },
  {
    id: "dropdown",
    name: "Dropdown menu",
    description: "Contextual actions menu with icons, shortcuts, and dividers.",
    category: "Inputs",
    icon: "moreVertical",
    file: "Dropdown.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f0eee7",
    usage: `import { Dropdown } from './components/Dropdown';\n\n<Dropdown\n  items={[\n    { id: 'edit', label: 'Edit record', icon: 'edit' },\n    { id: 'dup', label: 'Duplicate', icon: 'copy' },\n    { id: 'del', label: 'Delete', icon: 'trash', danger: true },\n  ]}\n  onSelect={(item) => console.log(item.id)}\n/>`,
  },
  {
    id: "multiselect",
    name: "Multi-select",
    description: "Select multiple options with removable tag chips.",
    category: "Inputs",
    icon: "layers",
    file: "MultiSelect.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f1edf5",
    usage: `import { useState } from 'react';\nimport { MultiSelect } from './components/MultiSelect';\n\nexport function Example() {\n  const [tags, setTags] = useState(['design', 'engineering']);\n  return <MultiSelect\n    value={tags}\n    onChange={setTags}\n    options={[\n      { value: 'design', label: 'Design' },\n      { value: 'engineering', label: 'Engineering' },\n      { value: 'product', label: 'Product' },\n    ]}\n  />;\n}`,
  },
  {
    id: "calendar",
    name: "Calendar",
    description: "Inline monthly calendar with day selection.",
    category: "Inputs",
    icon: "calendar",
    file: "Calendar.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f2efe8",
    usage: `import { useState } from 'react';\nimport { Calendar } from './components/Calendar';\n\nexport function Example() {\n  const [date, setDate] = useState(new Date());\n  return <Calendar value={date} onChange={setDate} />;\n}`,
  },
  {
    id: "datepicker",
    name: "Date picker",
    description: "Date selection with quick presets, confirm, and cancel.",
    category: "Inputs",
    icon: "calendar",
    file: "DatePicker.tsx",
    dependencies: [
      "Button.tsx",
      "Calendar.tsx",
      "Icon.tsx",
      "ModalDialog.tsx",
      "theme.ts",
    ],
    background: "#eaf0ed",
    usage: `import { useState } from 'react';\nimport { DatePicker } from './components/DatePicker';\n\nexport function Example() {\n  const [date, setDate] = useState(new Date());\n  return <DatePicker value={date} onChange={setDate} />;\n}`,
  },
  {
    id: "timepicker",
    name: "Time picker",
    description: "Editable hours and minutes with 12-hour or 24-hour display.",
    category: "Inputs",
    icon: "clock",
    file: "TimePicker.tsx",
    dependencies: [
      "Button.tsx",
      "Icon.tsx",
      "Input.tsx",
      "ModalDialog.tsx",
      "SegmentedControl.tsx",
      "theme.ts",
    ],
    background: "#efeef4",
    usage: `import { useState } from 'react';\nimport { TimePicker } from './components/TimePicker';\n\nexport function Example() {\n  const [time, setTime] = useState('09:30 AM');\n  return <TimePicker value={time} onChange={setTime} />;\n}`,
  },
  {
    id: "rating",
    name: "Rating",
    description: "Interactive 5-star rating with customizable score display.",
    category: "Inputs",
    icon: "star",
    file: "Rating.tsx",
    dependencies: ["theme.ts"],
    background: "#f4f1e6",
    usage: `import { useState } from 'react';\nimport { Rating } from './components/Rating';\n\nexport function Example() {\n  const [score, setScore] = useState(4);\n  return <Rating value={score} onChange={setScore} showScore />;\n}`,
  },
  {
    id: "colorpicker",
    name: "Color picker",
    description: "Palette swatch picker with custom hex code input.",
    category: "Inputs",
    icon: "spark",
    file: "ColorPicker.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f2edf2",
    usage: `import { useState } from 'react';\nimport { ColorPicker } from './components/ColorPicker';\n\nexport function Example() {\n  const [color, setColor] = useState('#d4ef78');\n  return <ColorPicker value={color} onChange={setColor} label="Accent color" />;\n}`,
  },
  {
    id: "richtext",
    name: "Rich text editor",
    description:
      "Selection-aware Markdown formatting with a basic rendered preview.",
    category: "Inputs",
    icon: "code",
    file: "RichTextEditor.tsx",
    dependencies: [
      "Button.tsx",
      "Icon.tsx",
      "Input.tsx",
      "ModalDialog.tsx",
      "theme.ts",
    ],
    background: "#edf0f4",
    usage: `import { useState } from 'react';\nimport { RichTextEditor } from './components/RichTextEditor';\n\nexport function Example() {\n  const [text, setText] = useState('**Hello** world');\n  return <RichTextEditor value={text} onChange={setText} />;\n}`,
  },
  {
    id: "filterbar",
    name: "Filter bar",
    description: "Search bar with toggleable filter chips and counter.",
    category: "Inputs",
    icon: "filter",
    file: "FilterBar.tsx",
    dependencies: ["Icon.tsx", "TagChip.tsx", "theme.ts"],
    background: "#eef2ec",
    usage: `import { useState } from 'react';\nimport { FilterBar } from './components/FilterBar';\n\nexport function Example() {\n  const [q, setQ] = useState('');\n  const [filters, setFilters] = useState(['active']);\n  return <FilterBar\n    query={q}\n    onQueryChange={setQ}\n    filters={[{ id: 'active', label: 'Active', count: 12 }]}\n    selectedFilterIds={filters}\n    onToggleFilter={(id) => setFilters([id])}\n  />;\n}`,
  },
  {
    id: "fileuploader",
    name: "File uploader",
    description: "Choose documents, review upload progress, and remove files.",
    category: "Inputs",
    icon: "upload",
    file: "FileUploader.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f3edf0",
    usage: `import { FileUploader } from './components/FileUploader';\n\n<FileUploader\n  label="Documents"\n  hint="Upload contracts or invoices"\n  onUpload={(files) => console.log(files)}\n/>`,
  },
  {
    id: "toggle",
    name: "Settings toggle row",
    description: "Row combining icon, title, description, and switch.",
    category: "Inputs",
    icon: "settings",
    file: "ToggleRow.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#eef1eb",
    usage: `import { useState } from 'react';\nimport { ToggleRow } from './components/ToggleRow';\n\nexport function Example() {\n  const [enabled, setEnabled] = useState(true);\n  return <ToggleRow\n    title="Notifications"\n    description="Stay in the loop"\n    value={enabled}\n    onChange={setEnabled}\n  />;\n}`,
  },
  {
    id: "navbar",
    name: "Navbar",
    description: "Top navigation bar with brand, links, and action buttons.",
    category: "Navigation",
    icon: "menu",
    file: "Navbar.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#e8eff2",
    usage: `import { Navbar } from './components/Navbar';\n\n<Navbar\n  activeId="home"\n  onSelect={(id) => console.log(id)}\n  items={[\n    { id: 'home', label: 'Overview' },\n    { id: 'team', label: 'Team', badge: 4 },\n  ]}\n/>`,
  },
  {
    id: "navigation",
    name: "Floating navigation",
    description: "A familiar feeling, a lighter footprint.",
    category: "Navigation",
    icon: "home",
    file: "BottomNav.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#ebf0eb",
    usage: `import { useState } from 'react';\nimport { BottomNav } from './components/BottomNav';\n\nexport function Example() {\n  const [tab, setTab] = useState('home');\n  return <BottomNav\n    value={tab}\n    onChange={setTab}\n    items={[\n      { id: 'home', label: 'Home', icon: 'home' },\n      { id: 'activity', label: 'Activity', icon: 'chart' },\n    ]}\n  />;\n}`,
  },
  {
    id: "drawer",
    name: "Drawer navigation",
    description: "Slide-out navigation drawer with categorized sections.",
    category: "Navigation",
    icon: "menu",
    file: "Drawer.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#eef2e7",
    usage: `import { useState } from 'react';\nimport { Drawer } from './components/Drawer';\n\nexport function Example() {\n  const [open, setOpen] = useState(false);\n  return <Drawer\n    visible={open}\n    onClose={() => setOpen(false)}\n    activeId="dashboard"\n    onSelect={(id) => console.log(id)}\n    sections={[{\n      title: 'Main',\n      items: [{ id: 'dashboard', label: 'Dashboard', icon: 'home' }]\n    }]}\n  />;\n}`,
  },
  {
    id: "tabs",
    name: "Tabs",
    description: "Tabbed navigation with pill and underline indicators.",
    category: "Navigation",
    icon: "layers",
    file: "Tabs.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f0edf3",
    usage: `import { useState } from 'react';\nimport { Tabs } from './components/Tabs';\n\nexport function Example() {\n  const [tab, setTab] = useState('all');\n  return <Tabs\n    value={tab}\n    onChange={setTab}\n    items={[\n      { id: 'all', label: 'All files', count: 24 },\n      { id: 'shared', label: 'Shared', count: 6 },\n    ]}\n  />;\n}`,
  },
  {
    id: "segmented",
    name: "Segmented control",
    description: "A simple switch in perspective.",
    category: "Navigation",
    icon: "filter",
    file: "SegmentedControl.tsx",
    dependencies: ["theme.ts"],
    background: "#eeeef4",
    usage: `import { useState } from 'react';\nimport { SegmentedControl } from './components/SegmentedControl';\n\nexport function Example() {\n  const [period, setPeriod] = useState('Week');\n  return <SegmentedControl\n    options={['Day', 'Week', 'Month']}\n    value={period}\n    onChange={setPeriod}\n  />;\n}`,
  },
  {
    id: "pagination",
    name: "Pagination",
    description: "Page navigation with numbers, arrows, and record range.",
    category: "Navigation",
    icon: "chevronRight",
    file: "Pagination.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#edf1ee",
    usage: `import { useState } from 'react';\nimport { Pagination } from './components/Pagination';\n\nexport function Example() {\n  const [page, setPage] = useState(1);\n  return <Pagination\n    page={page}\n    totalPages={8}\n    onChange={setPage}\n    totalItems={78}\n  />;\n}`,
  },
  {
    id: "stepper",
    name: "Stepper",
    description: "Step progress indicator with completed states.",
    category: "Navigation",
    icon: "checkCircle",
    file: "Stepper.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f2ece8",
    usage: `import { useState } from 'react';\nimport { Stepper } from './components/Stepper';\n\nexport function Example() {\n  const [step, setStep] = useState(1);\n  return <Stepper\n    currentStep={step}\n    onStepPress={setStep}\n    steps={[\n      { id: '1', title: 'Account info' },\n      { id: '2', title: 'Workspace profile' },\n      { id: '3', title: 'Invite team' },\n    ]}\n  />;\n}`,
  },
  {
    id: "activity",
    name: "Activity list",
    description: "Every little update, beautifully organized.",
    category: "Data display",
    icon: "wallet",
    file: "ActivityList.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#edf1f1",
    usage: `import { ActivityList } from './components/ActivityList';\n\n<ActivityList\n  items={[{\n    id: '1', title: 'Studio project',\n    subtitle: 'Invoice paid · 10:42 AM',\n    amount: '+$1,250', icon: 'layers',\n    color: '#e5efd9',\n  }]}\n  onSelect={item => console.log(item.id)}\n/>`,
  },
  {
    id: "list",
    name: "List",
    description: "Interactive list rows with avatars, titles, and actions.",
    category: "Data display",
    icon: "menu",
    file: "List.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f0f2eb",
    usage: `import { List, ListItem } from './components/List';\n\n<List>\n  <ListItem title="Alex Chen" subtitle="Design lead" showChevron />\n  <ListItem title="Sam Lee" subtitle="Frontend engineer" showChevron />\n</List>`,
  },
  {
    id: "tree",
    name: "Tree view",
    description: "Collapsible nested tree with folders and file nodes.",
    category: "Data display",
    icon: "folder",
    file: "TreeView.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#eef2ed",
    usage: `import { TreeView } from './components/TreeView';\n\n<TreeView\n  data={[\n    {\n      id: 'src',\n      label: 'src',\n      children: [\n        { id: 'app', label: 'App.tsx' },\n        { id: 'theme', label: 'theme.ts' },\n      ]\n    }\n  ]}\n/>`,
  },
  {
    id: "carousel",
    name: "Carousel",
    description:
      "Responsive swipeable cards with slide count and previous/next controls.",
    category: "Data display",
    icon: "chevronRight",
    file: "Carousel.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f3edf1",
    usage: `import { Carousel } from './components/Carousel';\n\n<Carousel\n  slides={[\n    { id: '1', title: 'Design System', subtitle: 'Foundation guidelines' },\n    { id: '2', title: 'Mobile Prototype', subtitle: 'Interactive flows' },\n  ]}\n/>`,
  },
  {
    id: "avatars",
    name: "Avatar group",
    description: "There’s always room for your people.",
    category: "Data display",
    icon: "users",
    file: "AvatarGroup.tsx",
    dependencies: [],
    background: "#f1eee8",
    usage: `import { AvatarGroup } from './components/AvatarGroup';\n\n<AvatarGroup\n  people={[{ name: 'Alex Chen' }, { name: 'Sam Lee' }]}\n  max={3}\n  size={44}\n/>`,
  },
  {
    id: "avatar",
    name: "Avatar",
    description:
      "Individual avatar with initials, status dot, and pastel hues.",
    category: "Data display",
    icon: "users",
    file: "Avatar.tsx",
    dependencies: ["theme.ts"],
    background: "#edf3ee",
    usage: `import { Avatar } from './components/Avatar';\n\n<Avatar name="Alex Chen" size="lg" status="online" />`,
  },
  {
    id: "badges",
    name: "Status badge",
    description: "A tiny detail that says a lot.",
    category: "Feedback",
    icon: "spark",
    file: "Badge.tsx",
    dependencies: [],
    background: "#f1f0ec",
    usage: `import { Badge } from './components/Badge';\n\n<Badge tone="success">Completed</Badge>\n<Badge tone="lavender">In progress</Badge>`,
  },
  {
    id: "chip",
    name: "Tag chip",
    description: "Interactive tag chip with remove button and leading dot.",
    category: "Data display",
    icon: "tag",
    file: "TagChip.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f0efe8",
    usage: `import { TagChip } from './components/TagChip';\n\n<TagChip label="High priority" dot dotColor="#c23838" />`,
  },
  {
    id: "progress",
    name: "Progress ring",
    description: "Good things happen one step at a time.",
    category: "Feedback",
    icon: "chart",
    file: "ProgressCard.tsx",
    dependencies: ["theme.ts"],
    background: "#edf0e5",
    usage: `import { ProgressCard } from './components/ProgressCard';\n\n<ProgressCard value={78} title="A little closer, every day." />`,
  },
  {
    id: "progressbar",
    name: "Progress bar",
    description: "Linear progress bar with status tones and percentages.",
    category: "Feedback",
    icon: "sliders",
    file: "ProgressBar.tsx",
    dependencies: ["theme.ts"],
    background: "#eaf2eb",
    usage: `import { ProgressBar } from './components/ProgressBar';\n\n<ProgressBar value={64} label="Storage used" showPercent />`,
  },
  {
    id: "spinner",
    name: "Spinner loader",
    description: "Smooth rotating circular loading indicator.",
    category: "Feedback",
    icon: "refresh",
    file: "Spinner.tsx",
    dependencies: ["theme.ts"],
    background: "#edf1f3",
    usage: `import { Spinner } from './components/Spinner';\n\n<Spinner size="md" color="#232621" />`,
  },
  {
    id: "skeleton",
    name: "Skeleton placeholder",
    description:
      "Pulsing placeholders that respect reduced-motion preferences.",
    category: "Feedback",
    icon: "layers",
    file: "Skeleton.tsx",
    dependencies: ["theme.ts"],
    background: "#f0f0ea",
    usage: `import { Skeleton } from './components/Skeleton';\n\n<Skeleton width="100%" height={24} />\n<Skeleton variant="circular" width={40} />`,
  },
  {
    id: "toast",
    name: "Toast notification",
    description: "Feedback banner with tone styling, action, and dismiss.",
    category: "Feedback",
    icon: "bell",
    file: "Toast.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f4f0e8",
    usage: `import { Toast } from './components/Toast';\n\n<Toast tone="success" message="Invoice sent successfully." actionText="Undo" />`,
  },
  {
    id: "accordion",
    name: "Accordion",
    description: "Collapsible content panels with rotating chevron triggers.",
    category: "Overlays & Layout",
    icon: "chevronDown",
    file: "Accordion.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#ebf2ee",
    usage: `import { Accordion } from './components/Accordion';\n\n<Accordion items={[\n  { id: '1', title: 'What is Forma?', content: 'Thoughtful React Native primitives.' }\n]} />`,
  },
  {
    id: "divider",
    name: "Divider",
    description:
      "Horizontal or vertical separator with an optional text label.",
    category: "Overlays & Layout",
    icon: "minus" as any,
    file: "Divider.tsx",
    dependencies: ["theme.ts"],
    background: "#f1f1eb",
    usage: `import { Divider } from './components/Divider';\n\n<Divider label="OR CONTINUE" spacing={20} />`,
  },
  {
    id: "alertdialog",
    name: "Alert dialog",
    description: "Critical confirmation dialog with tone-coded actions.",
    category: "Overlays & Layout",
    icon: "alertTriangle",
    file: "AlertDialog.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#faede9",
    usage: `import { AlertDialog } from './components/AlertDialog';\n\n<AlertDialog\n  visible={true}\n  title="Delete project?"\n  description="This cannot be undone."\n  onConfirm={() => {}}\n  onClose={() => {}}\n/>`,
  },
  {
    id: "modal",
    name: "Modal dialog",
    description: "Full modal overlay with header, scrollable body, and footer.",
    category: "Overlays & Layout",
    icon: "external",
    file: "ModalDialog.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#eef1f4",
    usage: `import { ModalDialog } from './components/ModalDialog';\n\n<ModalDialog visible={true} title="Create workspace" onClose={() => {}}>\n  <Text>Modal content</Text>\n</ModalDialog>`,
  },
  {
    id: "bottomsheet",
    name: "Bottom sheet",
    description: "Scrollable sheet with close control and backdrop dismissal.",
    category: "Overlays & Layout",
    icon: "chevronUp",
    file: "BottomSheet.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#edf2ed",
    usage: `import { BottomSheet } from './components/BottomSheet';\n\n<BottomSheet visible={true} title="Filters" onClose={() => {}}>\n  <Text>Filter controls</Text>\n</BottomSheet>`,
  },
  {
    id: "popover",
    name: "Popover",
    description: "Contextual floating card triggered by button.",
    category: "Overlays & Layout",
    icon: "spark",
    file: "Popover.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f1edf5",
    usage: `import { Popover } from './components/Popover';\nimport { Button } from './components/Button';\n\n<Popover\n  trigger={<Button>Open</Button>}\n  content={<Text>Popover content</Text>}\n/>`,
  },
  {
    id: "breadcrumbs",
    name: "Breadcrumbs",
    description: "Hierarchical path navigation with truncation and icons.",
    category: "Navigation",
    icon: "chevronRight",
    file: "Breadcrumbs.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f7f8f5",
    usage: `import { Breadcrumbs } from './components/Breadcrumbs';\n\n<Breadcrumbs\n  items={[\n    { id: '1', label: 'Inventory' },\n    { id: '2', label: 'Warehouses' },\n    { id: '3', label: 'Peenya Hub' },\n  ]}\n  onSelect={(item) => console.log(item)}\n/>`,
  },
  {
    id: "fab",
    name: "Floating action button (FAB)",
    description: "Elevated primary trigger with optional extended label.",
    category: "Navigation",
    icon: "plus",
    file: "FAB.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#edf0e5",
    usage: `import { FAB } from './components/FAB';\n\n<FAB icon="plus" label="New Invoice" onPress={() => {}} />`,
  },
  {
    id: "notifications",
    name: "Notification list",
    description:
      "Activity feed with unread counters, tabs, and action buttons.",
    category: "Feedback",
    icon: "bell",
    file: "NotificationList.tsx",
    dependencies: ["Badge.tsx", "Icon.tsx", "theme.ts"],
    background: "#fafbf8",
    usage: `import { NotificationList } from './components/NotificationList';\n\n<NotificationList\n  items={[\n    { id: '1', title: 'Payment realized', message: 'Invoice #841 cleared.', timestamp: '5m ago', unread: true }\n  ]}\n/>`,
  },
  {
    id: "commandpalette",
    name: "Command palette",
    description:
      "Quick ⌘K search overlay with keyboard shortcuts and grouping.",
    category: "Navigation",
    icon: "search",
    file: "CommandPalette.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f0f2eb",
    usage: `import { CommandPalette } from './components/CommandPalette';\n\n<CommandPalette visible={true} onClose={() => {}} items={[]} />`,
  },
  {
    id: "settingslist",
    name: "Settings list",
    description:
      "Structured iOS/Mac-style settings groups with toggles and chevrons.",
    category: "Data display",
    icon: "settings",
    file: "SettingsList.tsx",
    dependencies: ["Switch.tsx", "Badge.tsx", "Icon.tsx", "theme.ts"],
    background: "#edf0ea",
    usage: `import { SettingsList } from './components/SettingsList';\n\n<SettingsList sections={[]} />`,
  },
  {
    id: "swipeablerow",
    name: "Swipeable row",
    description: "Interactive row with revealable contextual action tray.",
    category: "Data display",
    icon: "moreVertical",
    file: "SwipeableRow.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f7f8f5",
    usage: `import { SwipeableRow } from './components/SwipeableRow';\n\n<SwipeableRow rightActions={[{ id: 'del', label: 'Delete', onPress: () => {} }]}>\n  <Text>Item row</Text>\n</SwipeableRow>`,
  },
  {
    id: "relativetime",
    name: "Relative time",
    description:
      "Accessible time-ago formatter with live updating and tooltips.",
    category: "Data display",
    icon: "calendar",
    file: "RelativeTime.tsx",
    dependencies: ["theme.ts"],
    background: "#f3f5ee",
    usage: `import { RelativeTime } from './components/RelativeTime';\n\n<RelativeTime date={new Date()} live />`,
  },
  {
    id: "loadmore",
    name: "Load more",
    description: "Paginated list footer with spinner, error, and end states.",
    category: "Data display",
    icon: "chevronDown",
    file: "LoadMore.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f5f6f2",
    usage: `import { LoadMore } from './components/LoadMore';\n\n<LoadMore status="idle" onLoadMore={() => {}} />`,
  },
  {
    id: "phoneinput",
    name: "Phone input",
    description: "International dial-code picker with phone number field.",
    category: "Inputs",
    icon: "phone",
    file: "PhoneInput.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#fafbf8",
    usage: `import { PhoneInput } from './components/PhoneInput';\n\n<PhoneInput value="" onChangeText={() => {}} />`,
  },
  {
    id: "numpad",
    name: "NumPad keypad",
    description: "Tactile on-screen keypad for PIN, POS, and cash counters.",
    category: "Inputs",
    icon: "grid",
    file: "NumPad.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#eff2ea",
    usage: `import { NumPad } from './components/NumPad';\n\n<NumPad value="1234" onChange={() => {}} />`,
  },
  {
    id: "emailchipinput",
    name: "Email chip input",
    description: "Converts typed and pasted emails into validated tag chips.",
    category: "Inputs",
    icon: "mail",
    file: "EmailChipInput.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f7f8f4",
    usage: `import { EmailChipInput } from './components/EmailChipInput';\n\n<EmailChipInput value={['dev@corp.in']} onChange={() => {}} />`,
  },
  {
    id: "durationinput",
    name: "Duration input",
    description: "Days, hours, and minutes duration steppers.",
    category: "Inputs",
    icon: "calendar",
    file: "DurationInput.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f4f6ef",
    usage: `import { DurationInput } from './components/DurationInput';\n\n<DurationInput value={{ days: 1, hours: 4, minutes: 30 }} onChange={() => {}} />`,
  },
  {
    id: "inlineedit",
    name: "Inline edit field",
    description: "Click-to-edit inline field with checkmark save and cancel.",
    category: "Inputs",
    icon: "edit",
    file: "InlineEditField.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f6f8f1",
    usage: `import { InlineEditField } from './components/InlineEditField';\n\n<InlineEditField value="Apex Industrial Hub" onSave={() => {}} />`,
  },
  {
    id: "daterangepicker",
    name: "Date range picker",
    description: "Start and end date range selector with quick preset chips.",
    category: "Inputs",
    icon: "calendar",
    file: "DateRangePicker.tsx",
    dependencies: ["Calendar.tsx", "Button.tsx", "Icon.tsx", "theme.ts"],
    background: "#edf1ea",
    usage: `import { DateRangePicker } from './components/DateRangePicker';\n\n<DateRangePicker value={{ startDate: new Date(), endDate: new Date() }} onChange={() => {}} />`,
  },
  {
    id: "sortgroup",
    name: "Sort & group controls",
    description: "Table and list toolbar for sorting order and grouping.",
    category: "Data display",
    icon: "filter",
    file: "SortGroupControls.tsx",
    dependencies: ["Icon.tsx", "theme.ts"],
    background: "#f2f4ec",
    usage: `import { SortGroupControls } from './components/SortGroupControls';\n\n<SortGroupControls sortFields={[{ id: 'name', label: 'Name' }]} selectedSort="name" onSortChange={() => {}} sortDirection="asc" onDirectionToggle={() => {}} />`,
  },
];
