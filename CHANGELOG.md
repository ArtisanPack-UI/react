# Changelog

All notable changes to the ArtisanPack UI React monorepo will be documented in this file.

Per-package changelogs are generated automatically by [Changesets](https://github.com/changesets/changesets) and can be found in each package directory.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.0.1] - 2026-05-25

### Fixed

- **`@artisanpack-ui/react` — Single-control form components rendered with `<fieldset>`/`<legend>`** ([#39](https://github.com/ArtisanPack-UI/react/issues/39), [#40](https://github.com/ArtisanPack-UI/react/pull/40)). `Input`, `Textarea`, `Password`, `Pin`, `DatePicker`, `Select`, `RichTextEditor`, `Editor`, `File`, `ColorPicker`, and `Range` now render daisyUI v5's `fieldset` utility classes on plain `<div>`/`<label>` elements instead of the `<fieldset>`/`<legend>` HTML elements. Screen readers no longer announce a lone input as a "group". `<fieldset>`/`<legend>` are reserved for genuine control groups (`Radio`, `Checkbox` group, `Toggle`). Inline-label mode on `Input`, `Password`, and `DatePicker` switched to daisyUI v5's `floating-label` pattern. `RichTextEditor` now uses `aria-labelledby` for its `contenteditable` region.
- **`@artisanpack-ui/react` — Keyboard-inaccessible action buttons** ([#40](https://github.com/ArtisanPack-UI/react/pull/40)). Removed `tabIndex={-1}` from the `Input` clear button and the `Password` clear/visibility-toggle buttons so they can be reached with the keyboard.
- **`@artisanpack-ui/react` — `Tabs` and `Card` variants emitted dead daisyUI v4 class names** ([#36](https://github.com/ArtisanPack-UI/react/issues/36), [#41](https://github.com/ArtisanPack-UI/react/pull/41)). `Tabs` `bordered`/`lifted`/`boxed` now map to `tabs-border`/`tabs-lift`/`tabs-box`. `Card` `bordered` maps to `card-border`; `compact` maps to `card-sm` (daisyUI v5 removed `card-compact`). Dropped the no-longer-needed `input-bordered` class from `Input` (v5 inputs ship with a border by default).
- **`@artisanpack-ui/react` — `Popover` and `Dropdown` froze the main thread alongside Tiptap** ([#37](https://github.com/ArtisanPack-UI/react/issues/37), [#42](https://github.com/ArtisanPack-UI/react/pull/42)). Stabilized `setOpen` with an `isOpenRef` so the click-outside and Escape effects no longer detach/re-attach document listeners on every toggle. In controlled mode the library no longer layers a second toggle on top of the consumer's `onClick`/`onKeyDown` — fixes the double-fire `onOpenChange` for cloned-element, Fragment, and string triggers.
- **`@artisanpack-ui/react-laravel` — Adapter subpath imports transitively pulled the root barrel of `@artisanpack-ui/react`** ([#38](https://github.com/ArtisanPack-UI/react/issues/38), [#43](https://github.com/ArtisanPack-UI/react/pull/43)). `InertiaToastProvider`, `useFlashMessages`, `InertiaMenu`, `InertiaBreadcrumbs`, and `InertiaPagination` now import from narrow `@artisanpack-ui/react/feedback` and `@artisanpack-ui/react/navigation` subpaths so consumers don't have to install `react-apexcharts` when they're not using charts.

### Changed

- Added source-side TypeScript path mappings for every `@artisanpack-ui/react` subpath in the root `tsconfig.json` so the type-check job can resolve subpath imports without a prior `npm run build`.

## [1.0.0] - 2026-03-31

### Added

- `@artisanpack-ui/tokens` — Design tokens package with colors, spacing, typography, shadows, animations, borders, and glass morphism presets
- `@artisanpack-ui/react` — 56+ React UI components (form, layout, navigation, data display, feedback, utility) styled with DaisyUI and Tailwind CSS
- `@artisanpack-ui/react-laravel` — Inertia.js adapter wrappers for navigation, forms, auth, layout, and toast integration
- Storybook with 56 component stories and DaisyUI theme switcher (31 themes)
- Chromatic CI integration for visual regression testing
- Changesets-based release workflow with npm publishing pipeline
- Full TypeScript support with strict mode across all packages
- React 18 and React 19 compatibility
