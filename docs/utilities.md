---
title: Hooks and Utilities
menu_order: 4
---

# Hooks and Utilities

Besides the components, `@artisanpack-ui/react` exports a few functions. All of them are available from the package root as well as the subpath shown.

## Toasts

Render one `Toaster` near the root of the app, then create toasts from anywhere, including outside React components:

```tsx
import { Toaster, toast } from '@artisanpack-ui/react';

export function App() {
  return (
    <>
      <Routes />
      <Toaster placement="bottom-end" />
    </>
  );
}

// Anywhere:
const id = toast.create({ title: 'Listing archived', color: 'success' });
toast.dismiss(id);
```

| Export                    | Subpath     | What it does                                                                                                                                                                                                          |
| ------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Toaster`                 | `/feedback` | The toast region. Props include `placement`, `max`, `duration` (ms) and `toaster`.                                                                                                                                    |
| `toast`                   | `/feedback` | The default toaster: `create(options)` returns an id; `update(id, options)`, `dismiss(id)` and `remove(id)`. Options include `title`, `description`, `color`, `icon`, `duration` and `action` (`{ label, onClick }`). |
| `createToaster(options?)` | `/feedback` | A separate toaster, for a second region. Pass it to a `Toaster` with the `toaster` prop.                                                                                                                              |

The options are shared with Livewire and Vue; see the [Toast page](https://docs.artisanpackui.dev/documentation/design-system/components/toast).

## Icons

| Export                                    | Subpath | What it does                                                                                   |
| ----------------------------------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `registerIcons(set)`                      | `/form` | Adds or replaces named icons in the registry that `leadingIcon` and the other icon props read. |
| `registerDirectionalIcons(names)`         | `/form` | Marks icon names that mirror in right-to-left text.                                            |
| `isSafeIconBody(body)`, `UnsafeIconError` | `/form` | The check the registry applies to icon markup, and the error it throws.                        |

These are re-exported from `@artisanpack-ui/behavior/icons`. See [Icons](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons) for the default set and the rules for registered markup.

## Helpers

| Export                                   | Subpath       | What it does                                                                  |
| ---------------------------------------- | ------------- | ----------------------------------------------------------------------------- |
| `avatarInitials(name)`                   | `/data`       | Up to two uppercase initials, from the first and last words of a name.        |
| `avatarColor(name)`                      | `/data`       | The color a name hashes to, the same in every stack.                          |
| `tableValue(row, path)`                  | `/data`       | Reads a dot path (`'author.name'`) from a row, as Table does for column keys. |
| `paginationRange(page, count, siblings)` | `/navigation` | The page numbers Pagination shows, with `null` for each gap.                  |
| `passwordStrength(value)`                | `/form`       | The strength level Password shows, from 0 (empty) to 4.                       |
| `formatFileSize(bytes)`                  | `/form`       | A size as text, such as `2.4 MB`.                                             |

Constants such as `PASSWORD_LABELS`, `SELECT_DEFAULT_PLACEHOLDER` and `FILE_DEFAULT_REMOVE_LABEL` hold the default English strings, for reference when you translate the matching props.

## Theme

`ThemeScript` is covered in [Theming](Theming), with `ThemeProvider` and `useTheme`.

## Behavior hooks

The components run on the hooks in `@artisanpack-ui/behavior/react` (`useDialog`, `useCombobox`, `useTabs`, …), which return Zag's API for building your own markup on the same state machines. They're part of `@artisanpack-ui/behavior`, not this package; see [React and Vue](https://docs.artisanpackui.dev/documentation/design-system/behavior/react-and-vue).
