# Codebase map

This repository is **Forma Native**, an Expo app that doubles as a React Native component and UI-block gallery. The implementation is local and self-contained: there is no application server, database, router, or external product API in this project.

## Start here

- [`App.tsx`](App.tsx) is the application shell and most of the showcase UI. It owns the four top-level pages, filtering, responsive navigation, playground accent, detail modal, clipboard actions, documentation page, and most app-level styles.
- [`components/index.ts`](components/index.ts) is the public barrel for the reusable component collection.
- [`blocks/index.ts`](blocks/index.ts) is the public barrel for the composed UI blocks.
- [`showcase/registry.ts`](showcase/registry.ts) defines component gallery metadata, categories, source dependencies, and usage snippets.
- [`showcase/blockRegistry.ts`](showcase/blockRegistry.ts) defines the equivalent metadata for the 34 blocks.
- [`showcase/Examples.tsx`](showcase/Examples.tsx) maps component IDs to interactive component examples.
- [`showcase/BlockExamples.tsx`](showcase/BlockExamples.tsx) maps block IDs to their gallery examples.
- [`scripts/generate-sources.mjs`](scripts/generate-sources.mjs) builds [`showcase/sources.ts`](showcase/sources.ts), which embeds source text for the in-app code viewer.

## Runtime and data flow

```text
index.ts
  └─ Expo registerRootComponent(App)
      └─ App.tsx: SafeAreaProvider → Showcase
          ├─ registry.ts + blockRegistry.ts → catalog/filter/category navigation
          ├─ Examples.tsx + BlockExamples.tsx → live demos
          ├─ sources.ts → detail modal source tabs and copy action
          └─ Docs / Playground → supporting pages

components/ → standalone reusable controls and visual primitives
blocks/     → larger example screens composed from components/
```

`Showcase` switches between **Components**, **Blocks**, **Playground**, and **Documentation**. Component and block pages filter metadata by category and a shared text query. Selecting an entry opens `Detail`, which chooses the matching example renderer, displays the usage snippet and source/dependency tabs, and copies code through `expo-clipboard`. The playground previews a selected component against one of four accent colors. Example interactions mostly update local React state; callback props are demonstration hooks and there is no backend integration.

The app adapts its sidebar, card columns, detail layout, and navigation to window width. Web-specific behavior includes document title, Escape-to-close, Cmd/Ctrl+K search focus, and pointer cursors. Components use React Native primitives and styles so the same source can be bundled for web, iOS, and Android.

## Reusable components

Every component is a standalone `.tsx` module. Most export a named component and a props type, define local styles in the same file, and import shared color/icon helpers. The public exports are in `components/index.ts`.

| Area | Files |
| --- | --- |
| Foundations | `theme.ts` (shared colors, typography helper, shadow); `Icon.tsx` (SVG icon names and paths) |
| Data display | `MetricCard.tsx`, `TaskCard.tsx`, `Card.tsx`, `ActivityList.tsx`, `List.tsx`, `TreeView.tsx`, `Carousel.tsx`, `AvatarGroup.tsx`, `Avatar.tsx`, `TagChip.tsx` |
| Inputs | `Button.tsx`, `Checkbox.tsx`, `RadioButton.tsx`, `Switch.tsx`, `Slider.tsx`, `Input.tsx`, `FormLabel.tsx`, `FormField.tsx`, `Combobox.tsx`, `Dropdown.tsx`, `MultiSelect.tsx`, `Calendar.tsx`, `DatePicker.tsx`, `TimePicker.tsx`, `Rating.tsx`, `ColorPicker.tsx`, `RichTextEditor.tsx`, `FilterBar.tsx`, `FileUploader.tsx`, `ToggleRow.tsx` |
| Navigation | `Navbar.tsx`, `BottomNav.tsx`, `Drawer.tsx`, `Tabs.tsx`, `SegmentedControl.tsx`, `Pagination.tsx`, `Stepper.tsx` |
| Feedback | `Badge.tsx`, `ProgressCard.tsx`, `ProgressBar.tsx`, `Spinner.tsx`, `Skeleton.tsx`, `Toast.tsx` |
| Overlays and layout | `Accordion.tsx`, `Divider.tsx`, `AlertDialog.tsx`, `ModalDialog.tsx`, `BottomSheet.tsx`, `Popover.tsx` |

The gallery has **49 registered component demos**. `Icon.tsx` is shared infrastructure rather than a gallery entry. Some components build on others; the entry's `dependencies` in `registry.ts` drives the companion-source tabs in the detail view.

## Composed blocks

Blocks are higher-level, single-file React Native examples that compose the reusable components. Most have a domain-specific props interface, demo data/defaults, local interaction state, and a shared `accent`/`style` option. Their public exports are in `blocks/index.ts`; the gallery grouping is defined in `showcase/blockRegistry.ts`.

| Category | Files and purpose |
| --- | --- |
| Auth & Access | `AuthLoginBlock.tsx`, `SignUpBlock.tsx`, `ForgotPasswordBlock.tsx`, `TwoFactorAuthBlock.tsx` |
| Navigation & Shell | `AppShellBlock.tsx`, `TopNavHeaderBlock.tsx`, `DrawerNavBlock.tsx`, `OrgTenantSwitcherBlock.tsx` |
| Dashboard & Records | `KpiMetricGridBlock.tsx`, `DashboardAnalyticsBlock.tsx`, `ActivityTimelineBlock.tsx`, `RecordListBlock.tsx`, `BatchBulkActionsBlock.tsx`, `FilterBottomSheetBlock.tsx`, `RecordDetailHeaderBlock.tsx`, `RecordSummaryBlock.tsx`, `TabbedRecordViewBlock.tsx`, `CommentsNotesBlock.tsx`, `RelatedRecordsBlock.tsx` |
| Forms & Workflows | `MultiStepWizardBlock.tsx`, `SectionedFormBlock.tsx`, `LineItemsBlock.tsx`, `StickyActionFooterBlock.tsx`, `KanbanPipelineBlock.tsx`, `StageProgressionBlock.tsx` |
| Operations & Commerce | `FileManagerBlock.tsx`, `EmailComposerBlock.tsx`, `InvoiceQuoteBuilderBlock.tsx`, `OrderFulfillmentBlock.tsx`, `UserTeamManagementBlock.tsx`, `BillingSubscriptionBlock.tsx`, `DataExportShareBlock.tsx` |
| Feedback & States | `EmptyStateBlock.tsx`, `ErrorStateBlock.tsx` |

Blocks are front-end examples, not complete production workflows: data is seeded locally and callback props are where a host app would connect real behavior.

## Showcase support files

- `showcase/registry.ts`: 49 component records (`id`, display name, description, category, icon, filename, dependency tabs, preview background, optional tag, usage code) and component category definitions.
- `showcase/blockRegistry.ts`: 34 corresponding block records and six block categories.
- `showcase/Examples.tsx`: sample people, chart points, activity data, and the component-ID-to-demo switch.
- `showcase/BlockExamples.tsx`: block-ID-to-demo switch.
- `showcase/sources.ts`: generated dictionary keyed by source filename, containing full text for component and block `.ts`/`.tsx` files.

When adding or renaming a gallery item, keep its implementation, barrel export, registry ID/type, and example switch aligned. For blocks, also update the block registry and block example switch. The generated source dictionary is refreshed by the project scripts; edit its source modules instead of editing `sources.ts` directly.

## Project files and commands

- `index.ts`: Expo entry point; registers `App`.
- `app.json`: Expo identity, web bundler, platform settings, and status-bar plugin.
- `package.json` / lockfile: Expo SDK 57, React 19, React Native 0.86, React Native Web, SVG, safe-area context, clipboard, and TypeScript toolchain.
- `tsconfig.json`: strict TypeScript, extending Expo's base config.
- `README.md`: setup, usage, and development notes. Its component-count statement is stale: it says 12, while the current registry has 49 components and 34 blocks.
- `artifacts/`: screenshots of desktop/mobile showcase, playground, source viewer, plus a component archive; these are reference/export artifacts, not runtime modules.
- `dist/`: generated web export output; rebuild output rather than editing it as source.
- `assets/`: currently empty.

Useful scripts from `package.json`:

- `npm run web` / `npm start`: Expo development server (pre-scripts regenerate source previews).
- `npm run sources`: regenerate `showcase/sources.ts` from `components/` and `blocks/`.
- `npm run typecheck`: strict TypeScript check.
- `npm run build:web`: refresh source previews and export the web app into `dist/`.
- `npm run format`: format the configured source paths.

## Practical boundaries

- This is a copyable-source library and showcase, not a published component package: `package.json` is private and exposes no package build or release script.
- No test directory or automated test script is present in the project configuration.
- The README's “12 components” section predates the current expanded catalog; use the registries and barrels as the source of truth.
- The source generator includes `.ts` and `.tsx` files from both `components/` and `blocks/`; it writes a large generated TypeScript object for the in-app viewer.
