---
title: FAQ
menu_order: 95
meta_description: Short answers to common questions about ArtisanPack UI React, from Tailwind and DaisyUI to Next.js, React versions and bundle size.
---

# FAQ

## Do I need Tailwind CSS?

No. The components are styled by `@artisanpack-ui/css`, which is plain CSS in cascade layers. If your app uses Tailwind CSS 4, import the design system from your Tailwind stylesheet after the `@layer` line. See [Load the CSS](installation.md#load-the-css).

## Does it still use DaisyUI?

No. Since 2.0 nothing depends on DaisyUI. Remove it if nothing else in your app uses it. See [Upgrading from 1.x](upgrading.md).

## Where are the props for each component?

On the component's page in the design system documentation. Each page has a React tab, live examples and tables of the component's props, parts and events. [Components](components.md) links to every page.

## Can I use the components in Next.js Server Components?

Yes. Every module starts with a `'use client'` directive, so you can import the components into Server Components, layouts and pages. Props passed from a Server Component have to be serializable, so pass callbacks from a client component of your own. See [Server Rendering](server-rendering.md#nextjs-app-router).

## Does it work with React 18?

Yes. Both packages support React 18 and 19, and moving between them needs no changes to how you use the components. See [React 18 and 19](react-versions.md).

## Do I need `@artisanpack-ui/react-laravel`?

Only for a Laravel app built with Inertia. It adds Inertia navigation, form helpers, auth helpers and flash messages. The components work in any React app without it. See [Laravel and Inertia](laravel-inertia.md).

## Can I upgrade from 1.x one page at a time?

No. 1.x and 2.0 can't be mixed in one app, so upgrade the whole app at once, on a branch. The codemod rewrites most of the changes for you. See [Upgrading from 1.x](upgrading.md).

## Why doesn't `ThemeProvider` change the theme?

`ThemeProvider` is kept for 1.x apps and only holds a color scheme in React context. It doesn't set `data-theme` on `<html>`. Use `ThemeToggle`, or `applyTheme()` from `@artisanpack-ui/behavior`, to change the theme. See [Theming](theming.md).

## How do I keep the bundle small?

Import from the category subpaths, such as `@artisanpack-ui/react/form`, when bundle size matters. The AI components are only on `@artisanpack-ui/react/ai`, so they never reach your bundle unless you import them. See [Bundle Size](bundle-size.md).

## Can I use the behavior without the styles?

Yes. Load the [headless](https://docs.artisanpackui.dev/documentation/design-system/theming/headless) build of `@artisanpack-ui/css` to keep the markup and behavior and write the visual styles yourself. To build your own markup on the same state machines, use the hooks in `@artisanpack-ui/behavior/react`. See [Hooks and Utilities](utilities.md#behavior-hooks).

## How do I translate the components' text?

Most built-in strings have a prop: the `…Label` props on components such as `ThemeToggle`, and the `labels` prop on the AI components. Constants such as `PASSWORD_LABELS` hold the English defaults for reference. See [Hooks and Utilities](utilities.md#helpers) and [Translating the AI components](ai-components.md#translating).

## Does it look the same as the Livewire and Vue libraries?

Yes. All three render the same components, with the same props, parts, keyboard behavior and markup, styled by the same CSS, so themes and presets carry across stacks.

## What license is it under?

Both packages are MIT licensed.
