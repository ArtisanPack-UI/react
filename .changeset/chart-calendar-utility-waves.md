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
