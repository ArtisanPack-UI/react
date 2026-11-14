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

`react` and `react-dom` are peer dependencies, so the package's own build leaves them out. Your app's bundle still includes them once, shared with the rest of your app, so count them in your app's total.

## Keeping it small

- **Import from the category subpaths** (`@artisanpack-ui/react/form`, `/layout`, …) when bundle size matters. Both packages declare `"sideEffects": false`, so a bundler can drop the components you don't use from a root import too; the subpaths just leave it less to work out.
- **`/chart`** holds only `Chart`, for a page that needs a chart and nothing else from `/data`.
- **The AI components** are only on `@artisanpack-ui/react/ai`, never in the root.
- **Deprecated 1.x components** (`Modal`, `Dropdown`, `SpotlightSearch`, `Sidebar`, `Radio`, `Editor`, `ToastProvider`) are thin aliases of their replacements, so they add little beyond the component they render. See [Components](Components).

## Measuring

Measure your own app's bundle rather than the package: what you pay for depends on which components you use and how they share chunks. For a Vite app, `npx vite-bundle-visualizer` shows each module's share; webpack has `webpack-bundle-analyzer`.
