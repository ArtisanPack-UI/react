---
'@artisanpack-ui/react': minor
---

Add Chart, Calendar and the Utility wave on the design system (ArtisanPack-UI/design-system#63 to #65). They render the shared markup contract styled by `@artisanpack-ui/css`, with logic from `@artisanpack-ui/behavior`, so markup, keyboard and ARIA match Livewire and Vue.

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
