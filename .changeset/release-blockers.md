---
'@artisanpack-ui/react': minor
'@artisanpack-ui/react-laravel': minor
---

Finish the move off DaisyUI for 2.0.

**`@artisanpack-ui/react`**

- The deprecated 1.x components are now aliases of their design-system replacements, so they render markup `@artisanpack-ui/css` styles. Each maps its 1.x props and warns once in development: `Modal` → `Dialog`, `Dropdown`/`DropdownItem` → `DropdownMenu`/`DropdownMenuItem`, `SpotlightSearch` → `Spotlight` (keeping `filterFn` and `maxResults`), `Sidebar` → `AppShell`, `Radio` → `RadioGroup`, `Editor` → `CodeEditor`, and `ToastProvider`/`useToast`/`ToastMessage` → `Toaster`, `toast.create()` and `Toast`. Props with no equivalent (`Modal`'s `bottom`, `Dropdown`'s `top` and `hover`, `Sidebar`'s `side` and `overlay`, `Radio`'s `color`) are ignored. Refs now point at the replacement's element.
- **Breaking:** the root no longer re-exports the 1.x types `DaisyColor`, `Size`, `GlassProps`, `ColorProps` and `FormFieldProps`. Use each component's own types.
- `SettingsPage`, `UsageDashboard` and `FeatureToggles` take a `labels` prop for their text, with English defaults in `SETTINGS_PAGE_LABELS`, `USAGE_DASHBOARD_LABELS` and `FEATURE_TOGGLES_LABELS`.

**Both packages**

- The built modules start with `'use client'`, so React Server Components (Next.js App Router) can render the components, `ThemeScript` included.
- `"sideEffects": false`, so bundlers can drop unused components from a root import.

**`@artisanpack-ui/react-laravel`**

- `InertiaToastProvider` and `useFlashMessages` show flash messages with the design-system `Toaster` and `toast.create()`: all four types (`success`, `error`, `warning`, `info`), each once per Inertia visit, so Strict Mode or a re-render with the same messages doesn't repeat them. `InertiaToastProvider` takes the `Toaster`'s props; the 1.x `position` and `defaultDuration` still map.
- `InertiaLink` with `asButton` renders the design-system Button markup (`.apui-button`); `color` takes the Button colors (1.x `ghost` and `outline` map to neutral ghost and outline buttons) and there's a new `variant` prop.
- `useInertiaForm().field()` keeps a number field a number when its control sends text, and returns an `onBlur` that validates the field once the form uses Laravel Precognition (`form.withPrecognition()`); without Precognition there's no `onBlur`.
