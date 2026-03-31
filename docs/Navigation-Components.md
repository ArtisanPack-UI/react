# Navigation Components

## Breadcrumbs

Breadcrumb trail showing the current page location within a hierarchy.

### BreadcrumbItem

| Property | Type | Description |
|----------|------|-------------|
| `label` | `ReactNode` | Display label |
| `href` | `string` | URL (omit for current page) |
| `icon` | `ReactNode` | Icon before label |
| `renderLink` | `(props) => ReactElement` | Custom link renderer for routing libraries |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BreadcrumbItem[]` | **required** | Breadcrumb items (last = current page) |
| `maxItems` | `number` | — | Max items before collapsing with ellipsis |

```tsx
<Breadcrumbs items={[
  { label: 'Home', href: '/' },
  { label: 'Users', href: '/users' },
  { label: 'Jane Doe' },
]} />
```

---

## Menu

Vertical or horizontal navigation menu with nested sub-items.

### MenuItemType

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Unique identifier |
| `label` | `ReactNode` | Display label |
| `icon` | `ReactNode` | Icon before label |
| `disabled` | `boolean` | Disable this item |
| `children` | `MenuItemType[]` | Nested sub-items |
| `renderLink` | `(props) => ReactElement` | Custom link renderer |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `MenuItemType[]` | **required** | Menu items |
| `activeKey` | `string` | — | Currently active item key |
| `onChange` | `(key: string) => void` | — | Selection callback |
| `horizontal` | `boolean` | `false` | Horizontal layout |
| `color` | `DaisyColor` | — | Active item color |
| `size` | `Size` | — | Menu size |
| `compact` | `boolean` | `false` | Compact spacing |
| `title` | `string` | — | Menu heading |

```tsx
<Menu
  items={[
    { key: 'home', label: 'Home', icon: <HomeIcon /> },
    { key: 'users', label: 'Users' },
  ]}
  activeKey="home"
  onChange={setActive}
/>
```

---

## Navbar

Top navigation bar with start, center, and end sections.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `start` | `ReactNode` | — | Left section content |
| `center` | `ReactNode` | — | Center section content |
| `end` | `ReactNode` | — | Right section content |
| `glass` | `boolean` | `false` | Glass morphism effect |

```tsx
<Navbar
  start={<a className="text-xl font-bold">MyApp</a>}
  end={<Button>Login</Button>}
/>
```

---

## Pagination

Page navigation controls with configurable siblings and labels.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | `number` | **required** | Active page (1-indexed) |
| `totalPages` | `number` | **required** | Total pages |
| `onChange` | `(page: number) => void` | — | Page change callback |
| `siblings` | `number` | `1` | Sibling buttons on each side |
| `size` | `Size` | — | Button size |
| `previousLabel` | `ReactNode` | `'«'` | Previous button label |
| `nextLabel` | `ReactNode` | `'»'` | Next button label |
| `disabled` | `boolean` | `false` | Disable all buttons |

```tsx
<Pagination currentPage={3} totalPages={10} onChange={setPage} />
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

## SpotlightSearch

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

Step indicator / stepper for multi-step workflows.

### StepItem

| Property | Type | Description |
|----------|------|-------------|
| `label` | `ReactNode` | Step label |
| `icon` | `ReactNode` | Icon inside step circle |
| `color` | `DaisyColor` | Per-step color override |
| `dataContent` | `string` | Custom `data-content` value |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `steps` | `StepItem[]` | **required** | Step definitions |
| `currentStep` | `number` | `-1` | Current step index (0-based) |
| `vertical` | `boolean` | `false` | Vertical layout |
| `color` | `DaisyColor` | — | Completed steps color |
| `size` | `Size` | — | Step indicator size |

```tsx
<Steps
  currentStep={1}
  color="primary"
  steps={[
    { label: 'Register' },
    { label: 'Verify Email' },
    { label: 'Complete Profile' },
  ]}
/>
```
