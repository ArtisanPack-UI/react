# @artisanpack-ui/react

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
