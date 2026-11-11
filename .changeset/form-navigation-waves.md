---
'@artisanpack-ui/react': minor
'@artisanpack-ui/react-laravel': minor
---

Add the Form and Navigation waves, Combobox, DatePicker and Spotlight on the design system (ArtisanPack-UI/design-system#53 to #57). They render the shared markup contract styled by `@artisanpack-ui/css`, and the widgets run on the behavior engine (`@artisanpack-ui/behavior/react`), so markup, keyboard and ARIA match Livewire and Vue.

- New: `Combobox` (local filtering or `remote`, `multiple` with chips, `allowCreate` for tags), `RadioGroup`, `CheckboxGroup`, `Rating`, `Fieldset`, `Form`, `ValidationSummary`, `Signature`, `CodeEditor`, `Link`, `Spotlight`, `NavbarItem`, `BreadcrumbsItem`, and `MenuItem`, `MenuSub`, `MenuTitle` and `MenuSeparator` for composed menus.
- Rebuilt in place on the design system, with breaking prop changes listed in each component's docs: `Textarea`, `Password`, `Pin`, `Range`, `Toggle`, `ColorPicker` (spec popover on the color-picker machine), `File`, `DatePicker` (with a `time` mode, ISO values), `RichTextEditor`, `Breadcrumbs`, `Pagination` (`page`, `pageCount`, `onPageChange`), `Steps` (1-based `value`), `Tabs`, `Menu` and `Navbar`. `Select` takes option groups.
- Menu and Breadcrumbs link items take `renderLink`, so a router's link (Inertia's `Link`) renders with the same markup. `InertiaMenu` in `react-laravel` uses it and keeps its 2.x item shape (`key`, `href`, `children`, `activeKey`).
- Built-in strings are `*Label` props with English defaults, so apps can translate them.

Deprecated, still exported: `Radio` (use `RadioGroup`), `Editor` (use `CodeEditor`) and `SpotlightSearch` (use `Spotlight`; its `SpotlightItem` type stays importable from the deprecated module). They'll be removed in a later major release.
