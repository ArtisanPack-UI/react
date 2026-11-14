---
title: Components
menu_order: 3
---

# Components

Each component has a page in the design system documentation with a React tab, live examples, and tables of its props, parts and events. The tables below list every component in `@artisanpack-ui/react` 2.0, linked to that page, with the subpath it's exported from and the extra exports that go with it.

## Importing

Every component, and its types, is exported from the package root and from one category subpath:

```tsx
import { Button, Dialog } from '@artisanpack-ui/react';
import { Button } from '@artisanpack-ui/react/form';
import { Dialog } from '@artisanpack-ui/react/layout';
```

The subpaths are `/form`, `/layout`, `/navigation`, `/data`, `/feedback` and `/utility`. `/chart` exports only `Chart`, and `/ai` holds the [AI Components](Ai-Components), which the root doesn't export. See [Bundle Size](Bundle-Size) for when the subpaths matter.

## React conventions

The props are the design system's shared API in React spelling (`leadingIcon`, `onValueChange`). A few things are specific to React.

**Controlled and uncontrolled.** Components with state work both ways, like native inputs. Pass the value and its change callback to control them, or a default to let them manage their own state:

| State                                                  | Controlled                      | Uncontrolled     |
| ------------------------------------------------------ | ------------------------------- | ---------------- |
| A value (Input, Select, Combobox, Tabs, DatePicker, …) | `value` and `onValueChange`     | `defaultValue`   |
| Checked (Checkbox, Toggle)                             | `checked` and `onCheckedChange` | `defaultChecked` |
| Open (Dialog, Drawer, Popover, DropdownMenu, …)        | `open` and `onOpenChange`       | `defaultOpen`    |

The callbacks receive the new value itself (`onValueChange={setEmail}`), not an event. On form fields the native `onChange` still fires as well, except on Combobox, which has no `onChange`: use `onValueChange`, and `onSearchChange` for the typed text.

```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen} title="Edit profile">
  …
</Dialog>;
```

**Slots are props.** Named slots on the component pages, such as a Card's `title`, `actions` and `footer` or a Dialog's `footer` and `trigger`, are props that take any React node. The default slot is `children`.

**Data or children.** Components made of items, such as Tabs, Menu, Accordion, Breadcrumbs, Steps and DropdownMenu, take either an array of item data (`items`, or `tabs` and `steps`) or child components (`Tab`, `MenuItem`, `AccordionItem`, …).

**`className` and `classes`.** `className` goes to the component's root element. `classes` adds classes to individual parts, using the part names on the component's page; `classes.root` is merged with `className`.

```tsx
<Input label="Email" className="max-w-sm" classes={{ label: 'sr-only' }} />
```

On form fields, every other native attribute (`name`, `autoComplete`, `aria-*`, `data-*`, `id`) goes to the native control, not the root. Combobox is the exception: its native attributes go to the root `<div>`, so name the input with its `label` prop rather than `aria-label`, and `name` sets its hidden inputs (one per selected value). Each component's [markup](https://docs.artisanpackui.dev/documentation/design-system/styling/component-markup) is documented, and your own CSS wins over the component styles without `!important` because of the [cascade layers](https://docs.artisanpackui.dev/documentation/design-system/styling/cascade-layers).

**Refs.** Components forward their ref. On form fields it points at the native control (`<input>`, `<select>`, `<textarea>`), except Combobox, whose ref is its root `<div>` (calling `focus()` on it won't focus the input). On CheckboxGroup, RadioGroup and Fieldset it points at the `<fieldset>`, and elsewhere at the root element or the element its documentation names.

**Icons.** Props such as `leadingIcon` take a name from the [icon registry](https://docs.artisanpackui.dev/documentation/design-system/foundations/icons). `registerIcons` is also exported from `@artisanpack-ui/react`. Most of these props have a node counterpart (`icon`, `iconEnd`) for your own SVG.

**Theme script.** `ThemeScript` isn't a component on the design system pages; see [Theming](Theming).

## Actions

| Component                                                                                    | Subpath       | Also exported |
| -------------------------------------------------------------------------------------------- | ------------- | ------------- |
| [Button](https://docs.artisanpackui.dev/documentation/design-system/components/button)       | `/form`       |               |
| [Link](https://docs.artisanpackui.dev/documentation/design-system/components/link)           | `/navigation` |               |
| [Clipboard](https://docs.artisanpackui.dev/documentation/design-system/components/clipboard) | `/utility`    |               |
| [Swap](https://docs.artisanpackui.dev/documentation/design-system/components/swap)           | `/utility`    |               |

## Forms

All in `/form`.

| Component                                                                                                     | Also exported                         |
| ------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| [Form](https://docs.artisanpackui.dev/documentation/design-system/components/form)                            |                                       |
| [Fieldset](https://docs.artisanpackui.dev/documentation/design-system/components/fieldset)                    |                                       |
| [Input](https://docs.artisanpackui.dev/documentation/design-system/components/input)                          |                                       |
| [Password](https://docs.artisanpackui.dev/documentation/design-system/components/password)                    | `passwordStrength`, `PASSWORD_LABELS` |
| [Pin](https://docs.artisanpackui.dev/documentation/design-system/components/pin)                              |                                       |
| [Textarea](https://docs.artisanpackui.dev/documentation/design-system/components/textarea)                    |                                       |
| [Select](https://docs.artisanpackui.dev/documentation/design-system/components/select)                        |                                       |
| [Combobox](https://docs.artisanpackui.dev/documentation/design-system/components/combobox)                    |                                       |
| [Checkbox](https://docs.artisanpackui.dev/documentation/design-system/components/checkbox)                    |                                       |
| [CheckboxGroup](https://docs.artisanpackui.dev/documentation/design-system/components/checkbox-group)         |                                       |
| [RadioGroup](https://docs.artisanpackui.dev/documentation/design-system/components/radio-group)               |                                       |
| [Toggle](https://docs.artisanpackui.dev/documentation/design-system/components/toggle)                        |                                       |
| [Range](https://docs.artisanpackui.dev/documentation/design-system/components/range)                          |                                       |
| [Rating](https://docs.artisanpackui.dev/documentation/design-system/components/rating)                        |                                       |
| [ColorPicker](https://docs.artisanpackui.dev/documentation/design-system/components/color-picker)             |                                       |
| [DatePicker](https://docs.artisanpackui.dev/documentation/design-system/components/date-picker)               |                                       |
| [File](https://docs.artisanpackui.dev/documentation/design-system/components/file)                            | `formatFileSize`                      |
| [Signature](https://docs.artisanpackui.dev/documentation/design-system/components/signature)                  |                                       |
| [ValidationSummary](https://docs.artisanpackui.dev/documentation/design-system/components/validation-summary) |                                       |

## Editors and content

| Component                                                                                                | Subpath    |
| -------------------------------------------------------------------------------------------------------- | ---------- |
| [RichTextEditor](https://docs.artisanpackui.dev/documentation/design-system/components/rich-text-editor) | `/form`    |
| [CodeEditor](https://docs.artisanpackui.dev/documentation/design-system/components/code-editor)          | `/form`    |
| [Markdown](https://docs.artisanpackui.dev/documentation/design-system/components/markdown)               | `/utility` |
| [Code](https://docs.artisanpackui.dev/documentation/design-system/components/code)                       | `/data`    |
| [Kbd](https://docs.artisanpackui.dev/documentation/design-system/components/kbd)                         | `/utility` |
| [Diff](https://docs.artisanpackui.dev/documentation/design-system/components/diff)                       | `/data`    |
| [Heading](https://docs.artisanpackui.dev/documentation/design-system/components/heading)                 | `/layout`  |
| [Text](https://docs.artisanpackui.dev/documentation/design-system/components/text)                       | `/layout`  |
| [Divider](https://docs.artisanpackui.dev/documentation/design-system/components/divider)                 | `/layout`  |
| [Icon](https://docs.artisanpackui.dev/documentation/design-system/components/icon)                       | `/utility` |

## Data display

| Component                                                                                    | Subpath           | Also exported                                  |
| -------------------------------------------------------------------------------------------- | ----------------- | ---------------------------------------------- |
| [Badge](https://docs.artisanpackui.dev/documentation/design-system/components/badge)         | `/data`           |                                                |
| [Avatar](https://docs.artisanpackui.dev/documentation/design-system/components/avatar)       | `/data`           | `AvatarGroup`, `avatarInitials`, `avatarColor` |
| [Stat](https://docs.artisanpackui.dev/documentation/design-system/components/stat)           | `/data`           |                                                |
| [KpiCard](https://docs.artisanpackui.dev/documentation/design-system/components/kpi-card)    | `/data`           |                                                |
| [Sparkline](https://docs.artisanpackui.dev/documentation/design-system/components/sparkline) | `/data`           |                                                |
| [Table](https://docs.artisanpackui.dev/documentation/design-system/components/table)         | `/data`           | `tableValue`                                   |
| [Chart](https://docs.artisanpackui.dev/documentation/design-system/components/chart)         | `/data`, `/chart` |                                                |
| [Timeline](https://docs.artisanpackui.dev/documentation/design-system/components/timeline)   | `/data`           | `TimelineItem`                                 |
| [ListItem](https://docs.artisanpackui.dev/documentation/design-system/components/list-item)  | `/layout`         | `List`                                         |
| [Calendar](https://docs.artisanpackui.dev/documentation/design-system/components/calendar)   | `/data`           |                                                |

## Feedback

| Component                                                                                               | Subpath     | Also exported                       |
| ------------------------------------------------------------------------------------------------------- | ----------- | ----------------------------------- |
| [Alert](https://docs.artisanpackui.dev/documentation/design-system/components/alert)                    | `/feedback` |                                     |
| [Toast](https://docs.artisanpackui.dev/documentation/design-system/components/toast)                    | `/feedback` | `Toaster`, `toast`, `createToaster` |
| [Loading](https://docs.artisanpackui.dev/documentation/design-system/components/loading)                | `/feedback` |                                     |
| [Progress](https://docs.artisanpackui.dev/documentation/design-system/components/progress)              | `/data`     |                                     |
| [ProgressRadial](https://docs.artisanpackui.dev/documentation/design-system/components/progress-radial) | `/data`     |                                     |
| [Skeleton](https://docs.artisanpackui.dev/documentation/design-system/components/skeleton)              | `/feedback` |                                     |
| [EmptyState](https://docs.artisanpackui.dev/documentation/design-system/components/empty-state)         | `/feedback` |                                     |
| [ErrorState](https://docs.artisanpackui.dev/documentation/design-system/components/error-state)         | `/feedback` |                                     |

## Overlays

| Component                                                                                           | Subpath       | Also exported                                                    |
| --------------------------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------- |
| [Dialog](https://docs.artisanpackui.dev/documentation/design-system/components/dialog)              | `/layout`     |                                                                  |
| [Drawer](https://docs.artisanpackui.dev/documentation/design-system/components/drawer)              | `/layout`     |                                                                  |
| [Popover](https://docs.artisanpackui.dev/documentation/design-system/components/popover)            | `/layout`     |                                                                  |
| [Tooltip](https://docs.artisanpackui.dev/documentation/design-system/components/tooltip)            | `/utility`    |                                                                  |
| [DropdownMenu](https://docs.artisanpackui.dev/documentation/design-system/components/dropdown-menu) | `/layout`     | `DropdownMenuItem`, `DropdownMenuGroup`, `DropdownMenuSeparator` |
| [Spotlight](https://docs.artisanpackui.dev/documentation/design-system/components/spotlight)        | `/navigation` |                                                                  |

## Navigation

| Component                                                                                        | Subpath       | Also exported                                       |
| ------------------------------------------------------------------------------------------------ | ------------- | --------------------------------------------------- |
| [Navbar](https://docs.artisanpackui.dev/documentation/design-system/components/navbar)           | `/navigation` | `NavbarItem`                                        |
| [Menu](https://docs.artisanpackui.dev/documentation/design-system/components/menu)               | `/navigation` | `MenuItem`, `MenuSub`, `MenuTitle`, `MenuSeparator` |
| [UserMenu](https://docs.artisanpackui.dev/documentation/design-system/components/user-menu)      | `/layout`     |                                                     |
| [Tabs](https://docs.artisanpackui.dev/documentation/design-system/components/tabs)               | `/layout`     | `Tab`                                               |
| [Steps](https://docs.artisanpackui.dev/documentation/design-system/components/steps)             | `/navigation` | `Step`                                              |
| [Pagination](https://docs.artisanpackui.dev/documentation/design-system/components/pagination)   | `/navigation` | `paginationRange`                                   |
| [Breadcrumbs](https://docs.artisanpackui.dev/documentation/design-system/components/breadcrumbs) | `/navigation` | `BreadcrumbsItem`                                   |

## Disclosure

All in `/layout`.

| Component                                                                                    | Also exported   |
| -------------------------------------------------------------------------------------------- | --------------- |
| [Accordion](https://docs.artisanpackui.dev/documentation/design-system/components/accordion) | `AccordionItem` |
| [Collapse](https://docs.artisanpackui.dev/documentation/design-system/components/collapse)   |                 |

## Layout

All in `/layout`.

| Component                                                                                       |
| ----------------------------------------------------------------------------------------------- |
| [AppShell](https://docs.artisanpackui.dev/documentation/design-system/components/app-shell)     |
| [PageHeader](https://docs.artisanpackui.dev/documentation/design-system/components/page-header) |
| [Card](https://docs.artisanpackui.dev/documentation/design-system/components/card)              |
| [Grid](https://docs.artisanpackui.dev/documentation/design-system/components/grid)              |
| [Stack](https://docs.artisanpackui.dev/documentation/design-system/components/stack)            |

## Media

All in `/data`.

| Component                                                                                           |
| --------------------------------------------------------------------------------------------------- |
| [ImageGallery](https://docs.artisanpackui.dev/documentation/design-system/components/image-gallery) |
| [Carousel](https://docs.artisanpackui.dev/documentation/design-system/components/carousel)          |
| [ImageSlider](https://docs.artisanpackui.dev/documentation/design-system/components/image-slider)   |

## Theme

| Component                                                                                         | Subpath    | Also exported |
| ------------------------------------------------------------------------------------------------- | ---------- | ------------- |
| [ThemeToggle](https://docs.artisanpackui.dev/documentation/design-system/components/theme-toggle) | `/utility` | `ThemeScript` |

## Livewire-only components

[StreamableContent](https://docs.artisanpackui.dev/documentation/design-system/components/streamable-content), [ImageLibrary](https://docs.artisanpackui.dev/documentation/design-system/components/image-library) and [ThemePreview](https://docs.artisanpackui.dev/documentation/design-system/components/theme-preview) are Livewire-only: the design system ships them in Livewire UI Components, not in React or Vue.

## Deprecated components

These 1.x components are still exported so an app keeps building while it migrates. They're marked `@deprecated` and will be removed in a later major release. Except `ErrorDisplay`, which renders an `ErrorState`, they still render their 1.x DaisyUI and Tailwind class names, which `@artisanpack-ui/css` doesn't style.

| Deprecated                                  | Use instead                                                  |
| ------------------------------------------- | ------------------------------------------------------------ |
| `Modal`                                     | `Dialog`                                                     |
| `Dropdown`, `DropdownItem`                  | `DropdownMenu`, `DropdownMenuItem`                           |
| `SpotlightSearch`                           | `Spotlight`                                                  |
| `Sidebar`                                   | `AppShell`                                                   |
| `Radio`                                     | `RadioGroup`                                                 |
| `Editor`                                    | `CodeEditor`                                                 |
| `ErrorDisplay`                              | `ErrorState`                                                 |
| `ToastProvider`, `ToastMessage`, `useToast` | `Toaster` and `toast` (see [Hooks and Utilities](Utilities)) |

The [upgrade codemod](Upgrading) rewrites most of these for you.
