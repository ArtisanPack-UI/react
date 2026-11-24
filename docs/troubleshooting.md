---
title: Troubleshooting
menu_order: 99
meta_description: Fixes for unstyled components, theme flashes, hydration warnings, unresolved subpaths, missing toasts and other common problems.
---

# Troubleshooting

## Components are unstyled

**Cause:** `@artisanpack-ui/css` isn't loaded. The components ship no CSS of their own.

**Fix:** Install `@artisanpack-ui/css` and import it once, in your app's entry or your Tailwind stylesheet. See [Load the CSS](installation.md#load-the-css).

## Tailwind restyles the components, or utilities don't override them

**Cause:** The layer order line is missing, or it comes after `@import 'tailwindcss';`. Without it, Tailwind's Preflight and the design system's layers apply in the wrong order.

**Fix:** Make `@layer theme, base, apui, components, utilities;` the first line of your Tailwind stylesheet, before any `@import`. See [With Tailwind CSS 4](installation.md#with-tailwind-css-4).

## Components look half-styled after upgrading from 1.x

**Cause:** DaisyUI is still loaded alongside the design system.

**Fix:** Remove the DaisyUI plugin from your Tailwind stylesheet and run `npm uninstall daisyui` if nothing else uses it. Then rebuild. See [Upgrading from 1.x](upgrading.md).

## The page flashes the light theme before switching to dark

**Cause:** The theme script runs after the first paint. `ThemeScript` only runs before the paint when the browser parses it from server-rendered HTML. In a client-rendered app it applies the stored choice when it mounts.

**Fix:** In a client-rendered app, inline the output of `themeScript()` from `@artisanpack-ui/behavior` in `index.html`'s `<head>`. In an Inertia app, put the script in your Blade root view. See [Apply the theme before the first paint](installation.md#apply-the-theme-before-the-first-paint).

## React warns about a hydration mismatch on `<html>`

**Cause:** The theme script sets `data-theme` on `<html>` before React hydrates, so the attribute isn't in what React rendered.

**Fix:** Add `suppressHydrationWarning` to your `<html>` element. See [Server Rendering](server-rendering.md#nextjs-app-router).

## Dialogs, popovers and tooltips are missing from the server-rendered HTML

**Cause:** This is expected. Overlay parts rendered in a portal render nothing on the server and during hydration, and appear once the component has mounted on the client.

**Fix:** Nothing to fix. If you need the content in the server output, turn off the component's `portal` prop where it has one. See [Server Rendering](server-rendering.md).

## Next.js reports "Functions cannot be passed directly to Client Components"

**Cause:** A Server Component passes a callback, such as `onValueChange` or `onOpenChange`, to one of the components. Props from a Server Component have to be serializable.

**Fix:** Move the component and its callbacks into a client component of your own (a file that starts with `'use client'`), and render that from the Server Component.

## TypeScript can't find `@artisanpack-ui/react/form` or another subpath

**Cause:** Your `moduleResolution` doesn't read the `exports` field of `package.json`.

**Fix:** Set `moduleResolution` to `bundler`, `node16` or `nodenext` in `tsconfig.json`. See [TypeScript](typescript.md#where-the-types-come-from).

## TypeScript reports "Cannot find name 'NoInfer'"

**Cause:** The package's declarations need TypeScript 5.4 or later. Older compilers don't have the `NoInfer` utility type.

**Fix:** Upgrade TypeScript to 5.4 or later. Until you can, `skipLibCheck: true` in `tsconfig.json` hides the error.

## Tests fail with "Cannot use import statement outside a module"

**Cause:** The packages ship ES modules only, and your test runner loads `node_modules` as CommonJS without transforming it. This is common with Jest.

**Fix:** Use a runner with native ES module support, such as Vitest, or configure Jest to transform the `@artisanpack-ui` packages (for example with `transformIgnorePatterns`).

## Toasts don't appear

**Cause:** No `Toaster` is mounted, or the toast was created on a different toaster from the one the `Toaster` renders.

**Fix:** Render one `Toaster` near the root of your app. If you made a second toaster with `createToaster()`, pass it to a `Toaster` with the `toaster` prop and create toasts on it. See [Toasts](utilities.md#toasts).

## Laravel flash messages don't show as toasts

**Cause:** The flash messages aren't shared with Inertia, or nothing reads them.

**Fix:** Share the messages from Laravel's `HandleInertiaRequests` middleware as `flash`, and put `InertiaToastProvider` in your layout, or call `useFlashMessages()` and render a `Toaster` yourself. See [Flash messages](laravel-inertia.md#flash-messages).

## `useAuth()` always returns a `null` user

**Cause:** The signed-in user isn't shared with Inertia as `auth.user`.

**Fix:** Share the user from `HandleInertiaRequests` as `auth.user`. See [Auth](laravel-inertia.md#auth).

## A Combobox's `onChange` never fires

**Cause:** Combobox has no `onChange`.

**Fix:** Use `onValueChange` for the selected value, and `onSearchChange` for the typed text. See [React conventions](components.md#react-conventions).

## An icon doesn't render

**Cause:** The name passed to `leadingIcon` or another icon prop isn't in the icon registry. In development, the console shows `Unknown icon "<name>". Register it with registerIcons().`

**Fix:** Use a name from the [default icon set](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons), add your own with `registerIcons()`, or pass your own SVG to the node prop (`icon`, `iconEnd`). See [Icons](utilities.md#icons).
