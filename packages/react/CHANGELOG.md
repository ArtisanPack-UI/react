# @artisanpack-ui/react

## 2.0.0

### Major Changes

- [#75](https://github.com/ArtisanPack-UI/react/pull/75) [`c9fd5de`](https://github.com/ArtisanPack-UI/react/commit/c9fd5deb90d7d228d029a7faf79761c30527c412) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - 2.0 rebuilds the library on the ArtisanPack UI design system. Components render the shared `.apui-*` markup, styled by `@artisanpack-ui/css`, with interaction from the `@artisanpack-ui/behavior` engine, so they match Livewire UI Components 3.0 and `@artisanpack-ui/vue` 2.0 prop for prop. DaisyUI is no longer used or needed, and Tailwind is optional. The 1.x components that were renamed keep working as deprecated aliases until the next major. See the upgrade guide at https://docs.artisanpackui.dev/documentation/react/upgrading, or run the `@artisanpack-ui/codemods` upgrade tool.

### Minor Changes

- [#69](https://github.com/ArtisanPack-UI/react/pull/69) [`1ab57a7`](https://github.com/ArtisanPack-UI/react/commit/1ab57a77ef7d374ec50eb406c475709c19ad5749) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add the `@artisanpack-ui/react/ai` subpath: `SettingsPage`, `UsageDashboard` and `FeatureToggles` components that consume the `artisanpack-ui/ai` JSON API, plus `createAiApiClient` and the `useStreamingText` hook. `@artisanpack-ui/react-laravel` has no source changes and bumps alongside.

- [#67](https://github.com/ArtisanPack-UI/react/pull/67) [`61b5d4f`](https://github.com/ArtisanPack-UI/react/commit/61b5d4fcb4acc4636dc7d5d0c355776eab0dcfca) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add Chart, Calendar and the Utility wave on the design system (ArtisanPack-UI/design-system#63 to [#65](https://github.com/artisanpack-ui/react/issues/65)). They render the shared markup contract styled by `@artisanpack-ui/css`, with logic from `@artisanpack-ui/behavior`, so markup, keyboard and ARIA match Livewire and Vue.
  - New: `Kbd`, `Swap` and `ThemeScript` (applies the stored theme before first paint).
  - Rebuilt in place on the design system, with breaking prop changes: `Chart` (its own SVG; `series` plus `labels`, `title` required, `tabular`; ApexCharts is no longer a peer dependency), `Calendar` (month, week, day and agenda; `date`, `weekStartsOn`), `Markdown` (GitHub-flavored, raw HTML escaped; `mode` write and split), `Code` (`numbered`, `highlight`, `fileName`, copy), `Clipboard` (`value`, `copiedLabel`, `timeout`), `Icon` (sizes, `tile`, `label`), `Carousel` (`perView`, `loop`, `autoplay` with a pause control) and `ThemeToggle` (light, dark, high contrast and system; `choices`).
  - Built-in strings are `*Label` props with English defaults, so apps can translate them.

  Upgrade notes:
  - `ThemeToggle` sets `data-theme` on `<html>` and persists the choice in localStorage under `apui-theme` (2.x did neither). Render `<ThemeScript>` in an SSR `<head>`, or inline `themeScript()` in `index.html` for SPAs, so there's no flash. It no longer requires `ThemeProvider`; under one it still drives the provider (it starts from `colorScheme`, calls `setColorScheme` on every pick and follows outside changes), and high contrast reaches the provider as `light`. `modes` is gone; use `choices`.
  - `Calendar`: the deprecated 2.x `value` (Date) seeds the shown date and re-seeds it when it changes to another day, instead of pinning it. The deprecated `onChange(Date)` therefore fires whenever the shown date moves (Today, previous, next, "+N more"), alongside `onDateChange`.
  - `Clipboard`'s `text` still works as a deprecated alias of `value`. The `ChartDataPoint` type is no longer exported: Chart takes `series` (`ChartSeries`, with `data` lined up with `labels`), and a donut is one series.

  Fixes from the PR review:
  - `ThemeToggle`: a controlled (`value` / `v-model`) pick only reports the choice; the toggle applies, stores and passes it to a 2.x provider when the parent changes the value to it (not on mount). An uncontrolled toggle with nothing stored starts on `ThemeScript`'s default and applies its own default only to a page with no `data-theme`. Controlled and unpersisted toggles ignore other tabs' stored choices.
  - `Clipboard`: the success event is `copied` (`onCopied` in React); `copy` / `onCopy` stay as deprecated aliases that never catch native copies. A new value clears a stale "Copied", and a failed copy shows the value selected so it can be copied by hand.
  - `Code` copies the exact source. `Carousel` keeps a caller's `aria-label`, keys slides by a unique `id` and puts the autoplay control first in the Tab order. `Icon` keeps a caller's `aria-label` / `aria-labelledby`. `Swap` follows a form reset.
  - `Calendar`: "+N more" moves focus to the day it opens. `Markdown`'s preview shows the edited draft after a write-to-preview switch, and a rejected controlled edit doesn't appear. `Chart`'s lines, areas and dots are keyed by position. React's callback refs update after commit, and it skips rendering Markdown while only the Write tab shows.

- [#65](https://github.com/ArtisanPack-UI/react/pull/65) [`311c868`](https://github.com/ArtisanPack-UI/react/commit/311c8684eca9eebfe898d9279193e65cff625aec) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add the Form and Navigation waves, Combobox, DatePicker and Spotlight on the design system (ArtisanPack-UI/design-system#53 to [#57](https://github.com/artisanpack-ui/react/issues/57)). They render the shared markup contract styled by `@artisanpack-ui/css`, and the widgets run on the behavior engine (`@artisanpack-ui/behavior/react`), so markup, keyboard and ARIA match Livewire and Vue.
  - New: `Combobox` (local filtering or `remote`, `multiple` with chips, `allowCreate` for tags), `RadioGroup`, `CheckboxGroup`, `Rating`, `Fieldset`, `Form`, `ValidationSummary`, `Signature`, `CodeEditor`, `Link`, `Spotlight`, `NavbarItem`, `BreadcrumbsItem`, and `MenuItem`, `MenuSub`, `MenuTitle` and `MenuSeparator` for composed menus.
  - Rebuilt in place on the design system, with breaking prop changes listed in each component's docs: `Textarea`, `Password`, `Pin`, `Range`, `Toggle`, `ColorPicker` (spec popover on the color-picker machine), `File`, `DatePicker` (with a `time` mode, ISO values), `RichTextEditor`, `Breadcrumbs`, `Pagination` (`page`, `pageCount`, `onPageChange`), `Steps` (1-based `value`), `Tabs`, `Menu` and `Navbar`. `Select` takes option groups.
  - Menu and Breadcrumbs link items take `renderLink`, so a router's link (Inertia's `Link`) renders with the same markup. `InertiaMenu` in `react-laravel` uses it and keeps its 2.x item shape (`key`, `href`, `children`, `activeKey`).
  - Built-in strings are `*Label` props with English defaults, so apps can translate them.

  Deprecated, still exported: `Radio` (use `RadioGroup`), `Editor` (use `CodeEditor`) and `SpotlightSearch` (use `Spotlight`; its `SpotlightItem` type stays importable from the deprecated module). They'll be removed in a later major release.

- [#66](https://github.com/ArtisanPack-UI/react/pull/66) [`cdff27c`](https://github.com/ArtisanPack-UI/react/commit/cdff27ccb9c1fd86d64b4fb03287ecdf02a3fec6) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add the Layout, Feedback and Data Display waves, Tooltip and Table on the design system (ArtisanPack-UI/design-system#58 to [#62](https://github.com/artisanpack-ui/react/issues/62)). They render the shared markup contract styled by `@artisanpack-ui/css`, and the widgets run on the behavior engine (`@artisanpack-ui/behavior/react`), so markup, keyboard and ARIA match Livewire and Vue.
  - New: `AppShell`, `PageHeader`, `AccordionItem`, `Heading`, `Text`, `List` and `ListItem`, `UserMenu`, `AvatarGroup`, `ProgressRadial`, `ErrorState`, `KpiCard`, `TimelineItem`, `ImageGallery` and `ImageSlider`.
  - Rebuilt in place on the design system, with breaking prop changes listed in each component's docs: `Accordion` (value-based), `Collapse`, `Divider`, `Grid` (`columns`, `minItemWidth`, `gap`), `Stack` (`orientation`), `Drawer` (opens at the end edge by default), `Popover`, `Tooltip` (`content`, logical `placement`; it takes your own control as the trigger), `Avatar`, `Badge`, `Alert` (dismisses itself), `Loading`, `Progress`, `Skeleton`, `EmptyState`, `Stat`, `Sparkline`, `Timeline`, `Diff` and `Table` (sorting, selection, expandable rows, `renderCell` and friends, pagination).
  - Built-in strings are `*Label` props with English defaults, so apps can translate them.

  Deprecated, still exported: `Sidebar` (use `AppShell`) and `ErrorDisplay` (use `ErrorState`). Removed: `StatGroup` (lay stats out with `Grid`).

- [#64](https://github.com/ArtisanPack-UI/react/pull/64) [`29e4aaf`](https://github.com/ArtisanPack-UI/react/commit/29e4aaf664c3a2fe3f2bcb3d75244fca3f8bb90f) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add `Dialog`, `DropdownMenu` (with `DropdownMenuItem`, `DropdownMenuGroup` and `DropdownMenuSeparator`), `Toast` and `Toaster` with the default `toast` toaster, built on the design system (ArtisanPack-UI/design-system#49 to [#51](https://github.com/artisanpack-ui/react/issues/51)). They render the shared markup contract (`.apui-dialog`, `.apui-dropdown-menu`, `.apui-toast`, `data-scope`/`data-part` parts) styled by `@artisanpack-ui/css`, and run on the behavior engine's machines (`@artisanpack-ui/behavior/react`), so focus, keyboard and ARIA match Livewire and Vue.
  - `Dialog` and `DropdownMenu` take `open`/`defaultOpen` with `onOpenChange(open)`, and a `portal` prop (default on) that renders the overlay at the end of the body; with `portal={false}` they render in place and on the server.
  - `DropdownMenu` reports `onSelect(value)` for action items and `onCheckedChange({ value, checked })` for checkbox and radio items, and its `items` prop renders the same markup as composition.
  - `toast.create({ title, description, color, action })` shows a toast in a `<Toaster />`; `createToaster()` makes another toaster.
  - Adds `@zag-js/react` as a dependency (the behavior engine's React adapter).

  Deprecated, still exported and unchanged: `Modal` (use `Dialog`), `Dropdown` and `DropdownItem` (use `DropdownMenu`), and `ToastProvider`, `ToastMessage` and `useToast` (use `Toaster` and `toast`). They'll be removed in a later major release.

- [#74](https://github.com/ArtisanPack-UI/react/pull/74) [`9765ef6`](https://github.com/ArtisanPack-UI/react/commit/9765ef65d37d881da74b8322258e60b7c03bbc11) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Finish the move off DaisyUI for 2.0.

  **`@artisanpack-ui/react`**
  - The deprecated 1.x components are now aliases of their design-system replacements, so they render markup `@artisanpack-ui/css` styles. Each maps its 1.x props and warns once in development: `Modal` → `Dialog`, `Dropdown`/`DropdownItem` → `DropdownMenu`/`DropdownMenuItem`, `SpotlightSearch` → `Spotlight` (keeping `filterFn` and `maxResults`), `Sidebar` → `AppShell`, `Radio` → `RadioGroup`, `Editor` → `CodeEditor`, and `ToastProvider`/`useToast`/`ToastMessage` → `Toaster`, `toast.create()` and `Toast`. Props with no equivalent (`Modal`'s `bottom`, `Dropdown`'s `top` and `hover`, `Sidebar`'s `side` and `overlay`, `Radio`'s `color`) are ignored. Refs now point at the replacement's element.
  - **Breaking:** the root no longer re-exports the 1.x types `DaisyColor`, `Size`, `GlassProps`, `ColorProps` and `FormFieldProps`. Use each component's own types.
  - `SettingsPage`, `UsageDashboard` and `FeatureToggles` take a `labels` prop for their text, with English defaults in `SETTINGS_PAGE_LABELS`, `USAGE_DASHBOARD_LABELS` and `FEATURE_TOGGLES_LABELS`.

  **Both packages**
  - The built modules start with `'use client'`, so React Server Components (Next.js App Router) can render the components, `ThemeScript` included.
  - `"sideEffects": false`, so bundlers can drop unused components from a root import.

  **`@artisanpack-ui/react-laravel`**
  - `InertiaToastProvider` and `useFlashMessages` show flash messages with the design-system `Toaster` and `toast.create()`: all four types (`success`, `error`, `warning`, `info`), each once per Inertia visit, so Strict Mode or a re-render with the same messages doesn't repeat them. `InertiaToastProvider` takes the `Toaster`'s props; the 1.x `position` and `defaultDuration` still map.
  - `InertiaLink` with `asButton` renders the design-system Button markup (`.apui-button`); `color` takes the Button colors (1.x `ghost` and `outline` map to neutral ghost and outline buttons) and there's a new `variant` prop.
  - `useInertiaForm().field()` keeps a number field a number when its control sends text, and returns an `onBlur` that validates the field once the form uses Laravel Precognition (`form.withPrecognition()`); without Precognition there's no `onBlur`.

### Patch Changes

- [#75](https://github.com/ArtisanPack-UI/react/pull/75) [`f6c81a7`](https://github.com/ArtisanPack-UI/react/commit/f6c81a7527fc44febcfc18542a4446bd95cd39a5) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Depend on the published design-system packages: `@artisanpack-ui/react` now installs `@artisanpack-ui/behavior` 1.x from npm, and neither package depends on `@artisanpack-ui/tokens` any more (nothing imports it since the move off DaisyUI). `@artisanpack-ui/react-laravel` now requires a matching `@artisanpack-ui/react` instead of any version.

## 1.0.2

### Patch Changes

- [#61](https://github.com/ArtisanPack-UI/react/pull/61) [`457db5a`](https://github.com/ArtisanPack-UI/react/commit/457db5a4476463546e28445c1624abb61112f531) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Depend on `@artisanpack-ui/tokens` `^1.0.1` instead of `*`. The tokens package moved to the design-system repo, and its next release is a breaking 2.0.0, so this keeps installs on 1.x.

## 1.0.1

### Patch Changes

- [#40](https://github.com/ArtisanPack-UI/react/pull/40) Fix `<fieldset>`/`<legend>` wrapping single-control form components ([#39](https://github.com/ArtisanPack-UI/react/issues/39)). `Input`, `Textarea`, `Password`, `Pin`, `DatePicker`, `Select`, `RichTextEditor`, `Editor`, `File`, `ColorPicker`, and `Range` now use daisyUI v5 `fieldset` utility classes on plain `<div>`/`<label>` elements. `<fieldset>`/`<legend>` HTML elements are reserved for genuine control groups (`Radio`, `Checkbox` group, `Toggle`). Inline-label mode on `Input`, `Password`, and `DatePicker` switched to daisyUI v5's `floating-label` pattern. `RichTextEditor` now uses `aria-labelledby` for its `contenteditable` region.
- [#40](https://github.com/ArtisanPack-UI/react/pull/40) Keep `Input` clear button and `Password` clear/visibility-toggle buttons in the keyboard tab order — removed `tabIndex={-1}` so they're reachable for keyboard users.
- [#41](https://github.com/ArtisanPack-UI/react/pull/41) Replace dead daisyUI v4 class names with v5 equivalents ([#36](https://github.com/ArtisanPack-UI/react/issues/36)): `Tabs` variants `tabs-bordered`/`tabs-lifted`/`tabs-boxed` → `tabs-border`/`tabs-lift`/`tabs-box`; `Card` `bordered` → `card-border`, `compact` → `card-sm` (daisyUI v5 removed `card-compact`); dropped the redundant `input-bordered` class from `Input` (v5's `.input` includes the border by default).
- [#42](https://github.com/ArtisanPack-UI/react/pull/42) Stop `Popover` and `Dropdown` from freezing the main thread when used alongside Tiptap ([#37](https://github.com/ArtisanPack-UI/react/issues/37)). `setOpen` is now referentially stable via an `isOpenRef`, so the click-outside and Escape effects no longer detach/re-attach document listeners on every toggle. In controlled mode the library no longer layers a second toggle on top of the consumer's `onClick`/`onKeyDown` — fixes the double-fire `onOpenChange` for cloned-element, Fragment, and string triggers.

### Updated dependencies

- `@artisanpack-ui/tokens@1.0.1`

## 1.0.0

### Major Changes

- [`3669646`](https://github.com/ArtisanPack-UI/react/commit/3669646d2dfceb05478ba72e88046e25fad32f25) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Initial release

### Patch Changes

- Updated dependencies [[`3669646`](https://github.com/ArtisanPack-UI/react/commit/3669646d2dfceb05478ba72e88046e25fad32f25)]:
  - @artisanpack-ui/tokens@1.0.0
