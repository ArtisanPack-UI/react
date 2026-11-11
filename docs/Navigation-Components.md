# Navigation Components

## Breadcrumbs

Shows where the current page sits in the hierarchy, built on the design system (`.apui-breadcrumbs`, styled by `@artisanpack-ui/css`): a `nav` landmark holding an ordered list. The last item is the current page; it has `aria-current="page"` and is never a link. Separators are `aria-hidden` and mirror in RTL. Past `maxItems` the middle levels collapse behind an overflow button that reveals them in place and moves focus to the first one.

### BreadcrumbItem

| Property | Type | Description |
|----------|------|-------------|
| `label` | `ReactNode` | The level's name |
| `href` | `string` | Where it links; ignored on the last item |
| `icon` | `string` | An icon name from the registry, before the label |
| `hideLabel` | `boolean` | Keeps the label for screen readers only (a home icon) |
| `renderLink` | `(props) => ReactElement` | Renders a router link (Inertia, React Router); spread `props` on it |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | `[]` | The trail as data; `BreadcrumbsItem` children follow it, and the last level is the current page |
| `maxItems` | `number` | `4` | Entries shown before the middle collapses: the first, the overflow button and the last `maxItems - 2`. `0` never collapses |
| `label` | `string` | `'Breadcrumb'` | The landmark's accessible name; translate it |
| `overflowLabel` | `string` | `'Show {count} more levels'` | The overflow button's name; translate it |
| `classes` | `Partial<Record<BreadcrumbsPart, string>>` | — | Extra classes per part: `root`, `list`, `item`, `link`, `separator`, `current`, `overflow` |

```tsx
<Breadcrumbs
  items={[
    { label: 'Home', href: '/', icon: 'house', hideLabel: true },
    { label: 'Properties', href: '/properties' },
    { label: 'Lakeview Lofts' },
  ]}
/>
```

`BreadcrumbsItem` children render the same levels after `items`; other anchor props (`onClick`) go to the link:

```tsx
<Breadcrumbs>
  <BreadcrumbsItem label="All media" href="#" onClick={goToRoot} />
  <BreadcrumbsItem label={folder.name} />
</Breadcrumbs>
```

---

## Link

Navigates somewhere, built on the design system (`.apui-link`). Inline links stay underlined, so color isn't the only cue; `standalone` links drop the underline until hover and take icons. Without an `href`, Link renders a `<button type="button">` with the same styles.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | — | The destination. Only relative, http, https, mailto, tel and sms URLs are used |
| `tone` | `'primary' \| 'muted'` | `'primary'` | `muted` for secondary links (`data-tone`) |
| `standalone` | `boolean` | `false` | A link on its own line (`data-standalone`) |
| `external` | `boolean` | `false` | Opens a new tab, adds the external-link icon and announces it |
| `externalLabel` | `string` | `'(opens in a new tab)'` | The visually hidden text an external link announces; translate it |
| `leadingIcon` / `trailingIcon` | `string` | — | Icon names before and after the text; arrows mirror in RTL |
| `icon` / `iconEnd` | `ReactNode` | — | Icon nodes that override the names |
| `classes` | `Partial<Record<LinkPart, string>>` | — | Extra classes per part: `root`, `icon`, `iconEnd` |

```tsx
<Link href="/properties" standalone trailingIcon="arrow-right">View all properties</Link>
<Link href="https://docs.artisanpackui.dev" external>Documentation</Link>
<Link onClick={logOut}>Log out</Link>
```

---

## Menu

A navigation list in a nav landmark, built on the design system (`.apui-menu`): links with icons and badges, section titles, separators and collapsible sub-menus, with the current page marked `aria-current="page"`. It isn't an ARIA menu (for actions use DropdownMenu): a sub-menu's item is a button with `aria-expanded` (the disclosure pattern), and a sub-menu holding the current page renders open. Compose it from `MenuItem`, `MenuSub`, `MenuTitle` and `MenuSeparator`, or pass the same structure as `items`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `MenuItemData[]` | — | The menu as data: `{ label, href, icon, badge, current, disabled }`, `{ label, icon, open, items }` for a sub-menu, `{ type: 'title', label }` and `{ type: 'separator' }`. Rendered before `children` |
| `collapsible` | `boolean` | `true` | Sub-menus open and close from their item. Off shows every sub-menu with its item as a heading (`data-collapsible`) |
| `label` | `string` | — | Names the nav landmark. Name every Menu when a page has several navs |
| `classes` | `Partial<Record<MenuPart, string>>` | — | Extra classes per part: `root`, `list`, `item`, `icon`, `itemText`, `badge`, `chevron`, `sub`, `title`, `separator` |

### MenuItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | `string` | — | The link. Without one the item is a button (for `onClick`) |
| `icon` | `string \| ReactNode` | — | Icon name or node before the label |
| `badge` | `ReactNode` | — | A count or status at the end |
| `current` | `boolean` | `false` | The current page: `aria-current="page"` |
| `disabled` | `boolean` | `false` | No href, `aria-disabled`, out of the Tab order |

`MenuSub` takes `label`, `icon`, `open` (controlled), `defaultOpen` and `onOpenChange(open)`; `MenuTitle` takes its text as children; `MenuSeparator` takes no props.

```tsx
import { Menu, MenuItem, MenuSeparator, MenuSub, MenuTitle } from '@artisanpack-ui/react';

<Menu label="Main">
  <MenuItem href="/dashboard" icon="list">Dashboard</MenuItem>
  <MenuSub label="Properties" icon="settings">
    <MenuItem href="/properties">All properties</MenuItem>
    <MenuItem href="/properties/lakeview" current>Lakeview Lofts</MenuItem>
  </MenuSub>
  <MenuTitle>Settings</MenuTitle>
  <MenuItem href="/team" icon="user">Team</MenuItem>
  <MenuSeparator />
  <MenuItem href="/billing" disabled>Billing</MenuItem>
</Menu>
```

---

## Navbar

The top bar, built on the design system (`.apui-navbar`): a brand, the primary links or a search, and actions at the end, as a full-width bar or a rounded island. Glass is a surface. The links sit in a nav landmark and scroll along the inline axis on a narrow bar, so none is hidden. Compose the links from `NavbarItem` children, or pass them as `links`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `'bar' \| 'island'` | `'bar'` | Full-width bar or rounded island (`data-layout`) |
| `surface` | `'default' \| 'glass'` | `'default'` | The surface (`data-surface`); glass falls back to an opaque surface under reduced transparency and in high contrast |
| `sticky` | `boolean` | `true` | Sticks to the top of the scrolling container (`data-sticky`) |
| `brand` | `ReactNode` | — | The brand at the start |
| `links` | `NavbarLinkData[]` | — | The links as data: `{ label, href, current }`. Rendered before `children` |
| `search` | `ReactNode` | — | A search field; it takes the free space |
| `actions` | `ReactNode` | — | Controls at the end |
| `label` | `string` | `'Main'` | Names the links' nav landmark |
| `classes` | `Partial<Record<NavbarPart, string>>` | — | Extra classes per part: `root`, `brand`, `links`, `link`, `search`, `actions` |

`NavbarItem` takes `href` and `current` (`aria-current="page"`); native `<a>` attributes go to the link.

```tsx
import { Button, Navbar, NavbarItem } from '@artisanpack-ui/react';

<Navbar brand={<a href="/">Horizon</a>} actions={<Button size="sm">Sign in</Button>}>
  <NavbarItem href="/properties" current>Properties</NavbarItem>
  <NavbarItem href="/analytics">Analytics</NavbarItem>
</Navbar>
```

---

## Pagination

Moves between the pages of a long list, built on the design system (`.apui-pagination`): previous, the first and last pages, `siblings` pages around the current one, next, and an optional summary, in a `nav` landmark. The control keeps one width as the page changes. On the first or last page, previous or next stays focusable with `aria-disabled="true"`. Their chevrons mirror in RTL.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `page` | `number` | `1` | The current page, from 1 |
| `pageCount` | `number` | — | How many pages there are. Without it, `total / perPage` |
| `total` | `number` | — | How many items the list has |
| `perPage` | `number` | `10` | How many items a page holds |
| `siblings` | `number` | `1` | Pages on each side of the current one |
| `summary` | `boolean` | `false` | Shows the summary before the pages |
| `onPageChange` | `(page: number) => void` | — | A page, previous or next was chosen |
| `label` | `string` | `'Pagination'` | The landmark's accessible name; translate it |
| `previousLabel` / `nextLabel` | `string` | `'Previous page'` / `'Next page'` | The icon-only buttons' names; translate them |
| `pageLabel` | `string` | `'Page {page}'` | Each page's name; translate it |
| `summaryLabel` | `string` | `'Showing {from}–{to} of {total}'` | The summary, with `{from}`, `{to}`, `{total}`, `{page}` and `{pageCount}`; `'Page {page} of {pageCount}'` without a total |
| `classes` | `Partial<Record<PaginationPart, string>>` | — | Extra classes per part: `root`, `summary`, `previous`, `page`, `ellipsis`, `next` |

`currentPage`, `totalPages`, `onChange`, `size`, `disabled` and the node labels of 1.x are gone: use `page`, `pageCount` and `onPageChange`.

```tsx
const [page, setPage] = useState(3);

<Pagination page={page} total={318} perPage={10} onPageChange={setPage} summary />
```

---

## Sidebar

Collapsible sidebar panel that can overlay or push content.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | **required** | Whether sidebar is open |
| `onOpenChange` | `(open: boolean) => void` | **required** | Open state callback |
| `sidebarContent` | `ReactNode` | **required** | Sidebar panel content |
| `side` | `'left' \| 'right'` | `'left'` | Panel side |
| `width` | `string` | `'w-80'` | Tailwind width class |
| `overlay` | `boolean` | `false` | Overlay instead of push |

```tsx
<Sidebar open={isOpen} onOpenChange={setIsOpen} sidebarContent={<nav>...</nav>}>
  <main>Page content</main>
</Sidebar>
```

---

## Spotlight

A command palette for searching across pages, records and actions, built on the design system (`.apui-spotlight`, styled by `@artisanpack-ui/css`). It's a modal dialog holding a search combobox whose listbox of grouped results is always open. ⌘K (Ctrl+K elsewhere) toggles it from anywhere on the page; the arrow keys move through the results, Enter opens one and Escape closes it. Replaces [SpotlightSearch](#spotlightsearch).

### SpotlightGroup and SpotlightResult

| Property | Type | Description |
|----------|------|-------------|
| `id` (group) | `string` | A stable id for the group. Defaults to its position |
| `label` (group) | `string` | The group's heading |
| `items` (group) | `SpotlightResult[]` | Its results |
| `label` | `string` | The text shown and searched |
| `value` | `string` | Identifies the item in `onSelect`. Defaults to `href`, then `label` |
| `description` | `string` | Secondary text under the label, searched too |
| `href` | `string` | Makes the item a link: choosing it follows the link |
| `icon` | `string` | An icon name from the registry, drawn in a tile |
| `color` | semantic color | Tints the tile |
| `shortcut` | `string \| string[]` | A keyboard hint such as `'⌘ N'` (display only) |
| `keywords` | `string[]` | More words the search matches |
| `disabled` | `boolean` | Skipped by the arrow keys |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Whether it's open (controlled). Pair it with `onOpenChange` |
| `defaultOpen` | `boolean` | `false` | The initial state of an uncontrolled palette |
| `onOpenChange` | `(open: boolean) => void` | — | It opened or closed itself (trigger, shortcut, Escape, backdrop, Esc button, a choice). Setting `open` doesn't call it |
| `groups` | `SpotlightGroup[]` | `[]` | The results. Unless `remote`, filtered as the user types by every word against label, description and keywords |
| `search` | `string` | — | The query (controlled). Pair it with `onSearchChange` |
| `onSearchChange` | `(search: string) => void` | — | Called as the user types, and with `''` when the palette closes |
| `onSelect` | `(item) => void` | — | An item was chosen (click or Enter); a link item is followed too |
| `remote` | `boolean` | `false` | The page searches: `groups` are the results and aren't filtered here |
| `loading` | `boolean` | `false` | Shows the loading row and sets `aria-busy` on the results |
| `shortcut` | `string` | `'mod+k'` | Modifiers and a key joined with `+`; `mod` is ⌘ on Apple platforms and Ctrl elsewhere. Empty turns it off |
| `recent` | `boolean` | `false` | Recent choices first, in a Recent group, while the query is empty. Opt-in: they're kept in `localStorage` per `id` |
| `label` | `string` | `'Search'` | The palette's accessible name; translate it |
| `placeholder` | `string` | `'Search…'` | The query's placeholder; translate it |
| `emptyLabel` | `ReactNode` | `'No results.'` | Shown when nothing matches; translate it |
| `loadingLabel` | `string` | `'Searching…'` | Shown while loading; translate it |
| `recentLabel` | `string` | `'Recent'` | The Recent group's label; translate it |
| `closeLabel` | `string` | `'Close'` | The Esc button's accessible name, after its visible key ("Esc, Close"); translate it |
| `navigateLabel` | `string` | `'Navigate'` | The footer hint beside the arrow keys; translate it |
| `selectLabel` | `string` | `'Open'` | The footer hint beside the Enter key; translate it |
| `trigger` | `ReactNode` | — | Content for an outline trigger button, shown with the shortcut's keys |
| `footer` | `ReactNode` | — | Replaces the footer's key hints |
| `modal` | `boolean` | `true` | Traps focus, locks scroll and sets `aria-modal` |
| `portal` | `boolean` | `true` | Renders the palette at the end of the body. Off renders it in place |
| `classes` | `Partial<Record<SpotlightPart, string>>` | — | Extra classes per part: `root` (the panel), `trigger`, `backdrop`, `positioner`, `search`, `icon`, `query`, `closeTrigger`, `results`, `itemGroup`, `itemGroupLabel`, `item`, `tile`, `itemText`, `itemDescription`, `shortcut`, `itemIndicator`, `empty`, `loading`, `footer` |

Unless `remote`, the matched words are marked in each label with `<mark>`, and the active result ends with an Enter glyph (mirrored in RTL). Other attributes and the ref go to the panel, which renders (hidden) while the palette is closed. Pass an `id` to keep recent choices apart between palettes.

```tsx
<Spotlight
  trigger="Search"
  groups={[
    { label: 'Pages', items: [{ label: 'Reports', href: '/reports', icon: 'file-text' }] },
    { label: 'Actions', items: [{ value: 'add', label: 'Add property', icon: 'plus', shortcut: '⌘ N' }] },
  ]}
  onSelect={(item) => item.href || run(item.value)}
/>
```

For server search, fetch from `onSearchChange` and pass the results back with `remote` and `loading`:

```tsx
<Spotlight groups={results} search={search} onSearchChange={setSearch} remote loading={loading} />
```

The behavior hook is `useSpotlight` from `@artisanpack-ui/behavior/react`, if you need your own markup.

---

## SpotlightSearch

> **Deprecated.** Use [Spotlight](#spotlight). SpotlightSearch will be removed in a later major release. Its item type keeps the name `SpotlightItem`; Spotlight's item type is `SpotlightResult`.

Command palette / spotlight search overlay with keyboard navigation.

### SpotlightItem

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Unique identifier |
| `label` | `string` | Display label (used for matching) |
| `description` | `string` | Secondary text |
| `icon` | `ReactNode` | Icon element |
| `group` | `string` | Group heading |
| `keywords` | `string[]` | Additional search terms |
| `renderLink` | `(props) => ReactElement` | Custom link renderer |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | **required** | Whether overlay is open |
| `onClose` | `() => void` | **required** | Close callback |
| `items` | `SpotlightItem[]` | **required** | Searchable items |
| `onSelect` | `(item: SpotlightItem) => void` | — | Selection callback |
| `placeholder` | `string` | `'Search…'` | Input placeholder |
| `filterFn` | `(item, query) => boolean` | — | Custom filter function |
| `emptyMessage` | `ReactNode` | `'No results found.'` | Empty state message |
| `shortcut` | `boolean` | `true` | Enable Cmd+K / Ctrl+K |
| `maxResults` | `number` | `20` | Max displayed results |

```tsx
<SpotlightSearch
  open={isOpen}
  onClose={() => setIsOpen(false)}
  items={commands}
  onSelect={(item) => router.push(item.key)}
/>
```

---

## Steps

Shows progress through a sequence, built on the design system (`.apui-steps`): an ordered list of steps, each complete, current, upcoming or in error. Compose it from `Step` children (direct children, numbered by position), or pass the same structure as `steps`. The current step has `aria-current="step"`; complete and error steps carry visually hidden text.

### StepItem / Step props

| Property | Type | Description |
|----------|------|-------------|
| `title` | `ReactNode` | The step's name (a `Step`'s children override it) |
| `description` | `ReactNode` | Supporting text under the title |
| `state` | `'complete' \| 'current' \| 'upcoming' \| 'error'` | The step's own state; without it, `value` decides |
| `icon` | `string` | An icon name that replaces the marker's number or check |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepItem[]` | — | The steps as data, rendered before `children` |
| `value` | `number` | — | The current step, from 1 |
| `onValueChange` | `(value: number) => void` | — | A completed step was chosen while `clickable` |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | `data-orientation` |
| `clickable` | `boolean` | `false` | Completed steps' titles become buttons |
| `label` | `string` | — | The list's accessible name |
| `completeLabel` / `errorLabel` | `string` | `'Completed'` / `'Error'` | Hidden state text; translate it |
| `classes` | `Partial<Record<StepsPart, string>>` | — | Extra classes per part, steps included: `root`, `step`, `marker`, `title`, `connector`, `description` |

`currentStep` (0-based), `vertical`, `color` and `size` of 1.x are gone: use `value` (from 1) and `orientation`.

```tsx
<Steps value={2} label="Checkout progress">
  <Step title="Cart" />
  <Step title="Shipping" />
  <Step title="Payment" />
</Steps>

<Steps value={step} onValueChange={setStep} clickable steps={[{ title: 'Cart' }, { title: 'Shipping' }]} />
```
