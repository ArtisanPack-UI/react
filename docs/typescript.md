---
title: TypeScript
menu_order: 9
---

# TypeScript

Both packages are written in TypeScript and ship their own declarations. There's nothing extra to install.

## Where the types come from

Each entry point has its own declarations, listed in the package's `exports`:

| Import path                                                                                                | Types for                                            |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `@artisanpack-ui/react`                                                                                    | Every component, `ThemeProvider` and `useTheme`      |
| `@artisanpack-ui/react/form`, `/layout`, `/navigation`, `/data`, `/feedback`, `/utility`                   | That category's components                           |
| `@artisanpack-ui/react/chart`                                                                              | `Chart` and its types                                |
| `@artisanpack-ui/react/ai`                                                                                 | The [AI Components](Ai-Components) and the API types |
| `@artisanpack-ui/react-laravel` and its subpaths (`/navigation`, `/form`, `/layout`, `/auth`, `/feedback`) | The [Laravel and Inertia](Laravel-Inertia) helpers   |

To resolve the subpaths, TypeScript needs a `moduleResolution` that reads `exports`: `bundler`, `node16` or `nodenext`.

## Naming

Each component exports its props type as `<Component>Props`, and the types its props use alongside it:

```ts
import type {
  ButtonProps,
  ButtonColor,
  ButtonVariant,
  ButtonPart,
  SelectOption,
  TableColumn,
} from '@artisanpack-ui/react';
```

- `<Component>Part` is the union of part names that `classes` accepts.
- Value types are named after the component: `ButtonSize`, `DialogSize`, `DatePickerValue`, `ComboboxValue`, `RangeValue`.
- Item data types end in `Data` or `Item`: `TabData`, `MenuItemData`, `AccordionItemData`, `StepItem`, `BreadcrumbItem`.

## Extending a component

The props types extend the native attributes of the element they spread onto, so a wrapper can pass everything through:

```tsx
import { forwardRef } from 'react';
import { Button, type ButtonProps } from '@artisanpack-ui/react';

export const SaveButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => <Button ref={ref} color="primary" {...props} />,
);
```

## Generic components

`Select` is generic over its option values, and `Table` over its rows. `TableColumn<Row>` types the row its `render` function receives; `key` is a dot path into the row, such as `'author.name'`:

```tsx
import { Table, type TableColumn } from '@artisanpack-ui/react';

interface User {
  id: number;
  name: string;
  email: string;
}

const columns: TableColumn<User>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
];

<Table headers={columns} rows={users} keyBy="id" />;
```

## Shared Inertia props

`SharedPageProps` in `@artisanpack-ui/react-laravel` types Inertia's shared props. Add your own with module augmentation; see [Laravel and Inertia](Laravel-Inertia).
