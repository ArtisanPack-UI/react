---
'@artisanpack-ui/react': minor
---

Add the Layout, Feedback and Data Display waves, Tooltip and Table on the design system (ArtisanPack-UI/design-system#58 to #62). They render the shared markup contract styled by `@artisanpack-ui/css`, and the widgets run on the behavior engine (`@artisanpack-ui/behavior/react`), so markup, keyboard and ARIA match Livewire and Vue.

- New: `AppShell`, `PageHeader`, `AccordionItem`, `Heading`, `Text`, `List` and `ListItem`, `UserMenu`, `AvatarGroup`, `ProgressRadial`, `ErrorState`, `KpiCard`, `TimelineItem`, `ImageGallery` and `ImageSlider`.
- Rebuilt in place on the design system, with breaking prop changes listed in each component's docs: `Accordion` (value-based), `Collapse`, `Divider`, `Grid` (`columns`, `minItemWidth`, `gap`), `Stack` (`orientation`), `Drawer` (opens at the end edge by default), `Popover`, `Tooltip` (`content`, logical `placement`; it takes your own control as the trigger), `Avatar`, `Badge`, `Alert` (dismisses itself), `Loading`, `Progress`, `Skeleton`, `EmptyState`, `Stat`, `Sparkline`, `Timeline`, `Diff` and `Table` (sorting, selection, expandable rows, `renderCell` and friends, pagination).
- Built-in strings are `*Label` props with English defaults, so apps can translate them.

Deprecated, still exported: `Sidebar` (use `AppShell`) and `ErrorDisplay` (use `ErrorState`). Removed: `StatGroup` (lay stats out with `Grid`).
