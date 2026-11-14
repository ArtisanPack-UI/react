---
title: Bundle Size
menu_order: 10
---

# Bundle Size

`@artisanpack-ui/react` ships ES modules, split into shared chunks, with one entry point per category. A bundler includes the components you import and what they depend on.

## What's in your bundle

- **Component code** from `@artisanpack-ui/react`.
- **The behavior engine.** Interactive components run on `@artisanpack-ui/behavior` and what it depends on: the Zag machines (`@zag-js/react` and a package per widget), Floating UI for positioning, `@internationalized/date` for DatePicker and `marked` for Markdown. They're dependencies, so your bundler includes the parts the components you use need.
- **No CSS.** The styles come from `@artisanpack-ui/css`, loaded once for the whole app, whichever components you use. To leave out the visual layer, load the [headless](https://docs.artisanpackui.dev/documentation/design-system/theming/headless) build instead.
- **No chart library.** Chart and Sparkline draw inline SVG.

`react` and `react-dom` are peer dependencies and never bundled.

## Keeping it small

- **Import from the category subpaths** (`@artisanpack-ui/react/form`, `/layout`, …) when bundle size matters. The root re-exports every category, and the package doesn't declare `sideEffects: false`, so how much of a root import a bundler can drop depends on the bundler.
- **`/chart`** holds only `Chart`, for a page that needs a chart and nothing else from `/data`.
- **The AI components** are only on `@artisanpack-ui/react/ai`, never in the root.
- **Deprecated 1.x components** (`Modal`, `Dropdown`, `SpotlightSearch`, `Sidebar`, `Radio`, `Editor`, `ToastProvider`) also bring in `@artisanpack-ui/tokens`. Migrating off them removes it. See [Components](Components).

## Measuring

Measure your own app's bundle rather than the package: what you pay for depends on which components you use and how they share chunks. For a Vite app, `npx vite-bundle-visualizer` shows each module's share; webpack has `webpack-bundle-analyzer`.
