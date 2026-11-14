# @artisanpack-ui/react-laravel

## 2.0.0

### Major Changes

- [#75](https://github.com/ArtisanPack-UI/react/pull/75) [`c9fd5de`](https://github.com/ArtisanPack-UI/react/commit/c9fd5deb90d7d228d029a7faf79761c30527c412) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - 2.0 rebuilds the library on the ArtisanPack UI design system. Components render the shared `.apui-*` markup, styled by `@artisanpack-ui/css`, with interaction from the `@artisanpack-ui/behavior` engine, so they match Livewire UI Components 3.0 and `@artisanpack-ui/vue` 2.0 prop for prop. DaisyUI is no longer used or needed, and Tailwind is optional. The 1.x components that were renamed keep working as deprecated aliases until the next major. See the upgrade guide at https://docs.artisanpackui.dev/documentation/react/upgrading, or run the `@artisanpack-ui/codemods` upgrade tool.

### Minor Changes

- [#69](https://github.com/ArtisanPack-UI/react/pull/69) [`1ab57a7`](https://github.com/ArtisanPack-UI/react/commit/1ab57a77ef7d374ec50eb406c475709c19ad5749) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add the `@artisanpack-ui/react/ai` subpath: `SettingsPage`, `UsageDashboard` and `FeatureToggles` components that consume the `artisanpack-ui/ai` JSON API, plus `createAiApiClient` and the `useStreamingText` hook. `@artisanpack-ui/react-laravel` has no source changes and bumps alongside.

- [#65](https://github.com/ArtisanPack-UI/react/pull/65) [`311c868`](https://github.com/ArtisanPack-UI/react/commit/311c8684eca9eebfe898d9279193e65cff625aec) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Add the Form and Navigation waves, Combobox, DatePicker and Spotlight on the design system (ArtisanPack-UI/design-system#53 to [#57](https://github.com/artisanpack-ui/react/issues/57)). They render the shared markup contract styled by `@artisanpack-ui/css`, and the widgets run on the behavior engine (`@artisanpack-ui/behavior/react`), so markup, keyboard and ARIA match Livewire and Vue.
  - New: `Combobox` (local filtering or `remote`, `multiple` with chips, `allowCreate` for tags), `RadioGroup`, `CheckboxGroup`, `Rating`, `Fieldset`, `Form`, `ValidationSummary`, `Signature`, `CodeEditor`, `Link`, `Spotlight`, `NavbarItem`, `BreadcrumbsItem`, and `MenuItem`, `MenuSub`, `MenuTitle` and `MenuSeparator` for composed menus.
  - Rebuilt in place on the design system, with breaking prop changes listed in each component's docs: `Textarea`, `Password`, `Pin`, `Range`, `Toggle`, `ColorPicker` (spec popover on the color-picker machine), `File`, `DatePicker` (with a `time` mode, ISO values), `RichTextEditor`, `Breadcrumbs`, `Pagination` (`page`, `pageCount`, `onPageChange`), `Steps` (1-based `value`), `Tabs`, `Menu` and `Navbar`. `Select` takes option groups.
  - Menu and Breadcrumbs link items take `renderLink`, so a router's link (Inertia's `Link`) renders with the same markup. `InertiaMenu` in `react-laravel` uses it and keeps its 2.x item shape (`key`, `href`, `children`, `activeKey`).
  - Built-in strings are `*Label` props with English defaults, so apps can translate them.

  Deprecated, still exported: `Radio` (use `RadioGroup`), `Editor` (use `CodeEditor`) and `SpotlightSearch` (use `Spotlight`; its `SpotlightItem` type stays importable from the deprecated module). They'll be removed in a later major release.

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

- Updated dependencies [[`1ab57a7`](https://github.com/ArtisanPack-UI/react/commit/1ab57a77ef7d374ec50eb406c475709c19ad5749), [`61b5d4f`](https://github.com/ArtisanPack-UI/react/commit/61b5d4fcb4acc4636dc7d5d0c355776eab0dcfca), [`c9fd5de`](https://github.com/ArtisanPack-UI/react/commit/c9fd5deb90d7d228d029a7faf79761c30527c412), [`311c868`](https://github.com/ArtisanPack-UI/react/commit/311c8684eca9eebfe898d9279193e65cff625aec), [`cdff27c`](https://github.com/ArtisanPack-UI/react/commit/cdff27ccb9c1fd86d64b4fb03287ecdf02a3fec6), [`29e4aaf`](https://github.com/ArtisanPack-UI/react/commit/29e4aaf664c3a2fe3f2bcb3d75244fca3f8bb90f), [`f6c81a7`](https://github.com/ArtisanPack-UI/react/commit/f6c81a7527fc44febcfc18542a4446bd95cd39a5), [`9765ef6`](https://github.com/ArtisanPack-UI/react/commit/9765ef65d37d881da74b8322258e60b7c03bbc11)]:
  - @artisanpack-ui/react@2.0.0

## 1.0.2

### Patch Changes

- [#61](https://github.com/ArtisanPack-UI/react/pull/61) [`457db5a`](https://github.com/ArtisanPack-UI/react/commit/457db5a4476463546e28445c1624abb61112f531) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Depend on `@artisanpack-ui/tokens` `^1.0.1` instead of `*`. The tokens package moved to the design-system repo, and its next release is a breaking 2.0.0, so this keeps installs on 1.x.

- Updated dependencies [[`457db5a`](https://github.com/ArtisanPack-UI/react/commit/457db5a4476463546e28445c1624abb61112f531)]:
  - @artisanpack-ui/react@1.0.2

## 1.0.1

### Patch Changes

- [#43](https://github.com/ArtisanPack-UI/react/pull/43) Import from narrow `@artisanpack-ui/react` subpaths in the adapter source ([#38](https://github.com/ArtisanPack-UI/react/issues/38)). `InertiaToastProvider`, `useFlashMessages`, `InertiaMenu`, `InertiaBreadcrumbs`, and `InertiaPagination` previously pulled the root barrel of `@artisanpack-ui/react`, which transitively dragged in the `Chart` component and its optional `react-apexcharts` peer. Apps doing subpath imports like `@artisanpack-ui/react-laravel/feedback` now stay clean — no more `Could not resolve "react-apexcharts"` build errors, and chart code is no longer pulled into bundles that don't use it.

### Updated dependencies

- `@artisanpack-ui/react@1.0.1`
- `@artisanpack-ui/tokens@1.0.1`

## 1.0.0

### Major Changes

- [`3669646`](https://github.com/ArtisanPack-UI/react/commit/3669646d2dfceb05478ba72e88046e25fad32f25) Thanks [@ViewFromTheBox](https://github.com/ViewFromTheBox)! - Initial release

### Patch Changes

- Updated dependencies [[`3669646`](https://github.com/ArtisanPack-UI/react/commit/3669646d2dfceb05478ba72e88046e25fad32f25)]:
  - @artisanpack-ui/tokens@1.0.0
  - @artisanpack-ui/react@1.0.0
