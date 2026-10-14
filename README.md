# Forma Native

A React Native component collection and interactive showcase inspired by the supplied mobile UI references: soft neutral surfaces, rounded cards, pill navigation, and lime, lilac, and seafoam accents.

## Run

```sh
npm install
npm run web
```

The showcase runs at **http://localhost:8082**. For a physical device on your local network, run `npm start -- --lan` and open the project in a compatible Expo Go client. Alternatively, use `npm run android` or `npm run ios` with the appropriate emulator/simulator installed.

## What’s included

- 49 component demos in `components/` and 34 composed blocks in `blocks/`.
- A responsive component gallery, live demos, search, and category filters.
- A playground with four accent palettes.
- A source viewer with usage examples, companion files, and clipboard copying.
- Getting-started documentation inside the app.
- Shared code for Android, iOS, and web. No HTML substitutes for the native components.

| Component | File | Key props |
| --- | --- | --- |
| Metric card | `MetricCard.tsx` | `points`, `title`, `value`, `change`, `accent` |
| Task card | `TaskCard.tsx` | `title`, `description`, `people`, `progress`, `due`, `completed`, `onToggle` |
| Button | `Button.tsx` | `variant`, `onPress`, `icon`, `loading`, `disabled`, `accent` |
| Floating navigation | `BottomNav.tsx` | `items`, `value`, `onChange`, `accent` |
| Activity list | `ActivityList.tsx` | `items`, `onSelect` |
| Calendar | `Calendar.tsx` | `value`, `onChange`, `accent` |
| Progress ring | `ProgressCard.tsx` | `value`, `title`, `subtitle`, `accent` |
| Segmented control | `SegmentedControl.tsx` | `options`, `value`, `onChange`, `accent` |
| Avatar group | `AvatarGroup.tsx` | `people`, `max`, `size` |
| Status badge | `Badge.tsx` | `children`, `tone`, `dot` |
| Settings toggle | `ToggleRow.tsx` | `title`, `description`, `value`, `onChange`, `icon`, `accent` |
| Text input | `Input.tsx` | `label`, `hint`, `error`, `icon`, plus `TextInputProps` |

## Use in another app

Install `react-native-svg`, `react-native-safe-area-context` for Drawer, and `expo-document-picker` for file selection, then copy the component and the companion files shown in its source tabs. These files use relative imports and can live together in any components folder. To take the entire collection, copy `components/` and import from its index.

```sh
npx expo install react-native-svg react-native-safe-area-context expo-document-picker
```

```tsx
import { Button } from './components/Button';

<Button variant="secondary" accent="#d9cafa" onPress={createProject} icon="plus">
  Create project
</Button>
```

The gallery is a local demo. Its buttons, transactions, toggles, and email form update local preview state; they do not create accounts, send email, or connect to a backend. `BottomNav` supplies a controlled selection UI; connect `onChange` to your app’s navigation. Use safe-area and keyboard handling at the screen level.

## Development

```sh
npm run typecheck       # Strict TypeScript checks
npm run format          # Format source files
npm run sources         # Refresh copyable source previews
npm run build:web       # Production web build in dist/
npx expo install --check
```

`showcase/sources.ts` is generated directly from `components/` and `blocks/`; regenerate it after editing a component or block. Startup and build scripts do this automatically. UI example state lives in `showcase/Examples.tsx`; component metadata and usage snippets live in `showcase/registry.ts`.

Built with Expo SDK 57, React Native 0.86, React 19, React Native Web, and TypeScript. Component source is formatted for copying and editing. Reference images are not included in the shipped app.

## Verification

TypeScript and production web, Android, and iOS JavaScript bundle exports are checked during development. Native bundle exports do not verify platform rendering: test on your target devices before shipping. This environment has no connected Android device or iOS simulator.


File selection uses the system document picker. `FileUploader` returns real local file URIs; uploading to a server remains the host app’s responsibility. Auth, message, and export callbacks may return a promise so the UI can display pending and failure states.

Blocks accept data and callbacks for application integration. Invoice downloads, payment changes, delivery tracking, and navigation require host callbacks. Sample records illustrate layouts; no backend service is included.
