---
title: Upgrading from 1.x
menu_order: 12
---

# Upgrading from 1.x

`@artisanpack-ui/react` 2.0 replaces DaisyUI with the design system's CSS, renames some components and props to share one API with Livewire and Vue, and moves theming to token-based presets. A codemod does the mechanical part.

The full guide, generated from the same rules the codemod applies, covers every renamed component and every changed prop: [Upgrading @artisanpack-ui/react 1.x to 2.0](https://docs.artisanpackui.dev/documentation/design-system/upgrade/react).

## In short

Upgrade the whole app at once, on a branch: 1.x and 2.0 can't be mixed in one app.

1. Update the packages and remove DaisyUI:

   ```bash
   npm install @artisanpack-ui/react@^2 @artisanpack-ui/css
   npm uninstall daisyui
   ```

2. Preview the codemod. The dry run prints a diff and writes nothing:

   ```bash
   npx @artisanpack-ui/codemods react src --dry-run
   ```

   Then run it without `--dry-run` to apply the changes, and work through its report: the props and components it couldn't change, and every raw DaisyUI class it found.

3. Load `@artisanpack-ui/css`, with or without Tailwind, as in [Getting Started](Getting-Started), and remove the DaisyUI plugin from your Tailwind stylesheet.
4. Move your DaisyUI theme to a [preset](https://docs.artisanpackui.dev/documentation/design-system/theming/presets), and add `ThemeScript` (see [Theming](Theming)).
5. Replace the [deprecated components](Components) the codemod couldn't rewrite.

## Laravel apps

Update `@artisanpack-ui/react-laravel` alongside `@artisanpack-ui/react`: its menu, breadcrumbs and pagination now wrap the design system components, `InertiaToastProvider` shows flash messages with the design system's `Toaster`, and `InertiaLink` with `asButton` renders Button markup. `InertiaToastProvider`'s 1.x `position` and `defaultDuration` props still work but are deprecated: use `placement` and `duration`. See [Laravel and Inertia](Laravel-Inertia).
