# Layout Components

## Accordion

Collapsible panel group that allows one or multiple panels to be open simultaneously.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `multiple` | `boolean` | `false` | Allow multiple panels open at once |
| `openIndices` | `number[]` | — | Controlled: indices of open panels |
| `defaultOpenIndices` | `number[]` | — | Initially open panels (uncontrolled) |
| `onOpenChange` | `(indices: number[]) => void` | — | Callback when open panels change |
| `join` | `boolean` | `true` | Visually connect child panels |

```tsx
<Accordion defaultOpenIndices={[0]}>
  <Collapse title="Section 1">Content 1</Collapse>
  <Collapse title="Section 2">Content 2</Collapse>
</Accordion>
```

---

## Card

Content container with optional title, figure, header, footer, and glass effect.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Card title rendered as `<h2>` |
| `subtitle` | `string` | — | Subtitle below the title |
| `figure` | `ReactNode` | — | Image or figure content |
| `figurePosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Figure placement |
| `header` | `ReactNode` | — | Custom header (overrides title/subtitle) |
| `footer` | `ReactNode` | — | Footer/actions slot |
| `menu` | `ReactNode` | — | Menu content in header area |
| `noShadow` | `boolean` | `false` | Remove default shadow |
| `bordered` | `boolean` | `false` | Show border |
| `compact` | `boolean` | `false` | Reduced padding |
| `glass` | `boolean` | `false` | Frosted-glass effect |
| `link` | `string` | — | When provided, renders as `<a>` |

```tsx
<Card title="Dashboard" subtitle="Overview" footer={<Button>View All</Button>}>
  <p>Card content here.</p>
</Card>
```

---

## Collapse

A single collapsible content panel. Used standalone or as children of `Accordion`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | **required** | Clickable trigger heading |
| `icon` | `'arrow' \| 'plus' \| 'none'` | `'arrow'` | Open/close indicator style |
| `open` | `boolean` | — | Controlled open state |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when toggled |
| `name` | `string` | — | Radio-group accordion name |
| `bordered` | `boolean` | `false` | Show border |
| `disabled` | `boolean` | `false` | Disable interaction |

```tsx
<Collapse title="Details" defaultOpen>
  <p>Expandable content here.</p>
</Collapse>
```

---

## Divider

Visual separator with optional label text.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `vertical` | `boolean` | `false` | Render vertically |
| `color` | `DaisyColor` | — | Color variant |
| `label` | `string` | — | Inline label text |
| `labelPosition` | `'start' \| 'center' \| 'end'` | `'center'` | Label placement |

```tsx
<Divider label="OR" color="primary" />
```

---

## Drawer

Sliding side panel overlay with focus trapping.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | **required** | Whether the drawer is visible |
| `onClose` | `() => void` | **required** | Close callback |
| `side` | `ReactNode` | **required** | Side panel content |
| `end` | `boolean` | `false` | Open from right side |
| `persistent` | `boolean` | `false` | Prevent closing via overlay/Escape |

```tsx
<Drawer open={isOpen} onClose={() => setIsOpen(false)} side={<nav>Menu</nav>}>
  <main>Page content</main>
</Drawer>
```

---

## Dropdown

Dropdown menu triggered by click or hover.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `ReactElement \| null` | — | Custom trigger element |
| `label` | `string` | `'Options'` | Default trigger button text |
| `end` | `boolean` | `false` | Align menu to right |
| `top` | `boolean` | `false` | Open menu above trigger |
| `hover` | `boolean` | `false` | Open on hover |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Open state callback |

### DropdownItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Disable this item |
| `onClick` | `MouseEventHandler` | — | Click handler |

```tsx
<Dropdown label="Actions">
  <DropdownItem onClick={handleEdit}>Edit</DropdownItem>
  <DropdownItem onClick={handleDelete}>Delete</DropdownItem>
</Dropdown>
```

---

## Grid

Responsive CSS grid layout.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | `1-12` | — | Base column count |
| `colsSm` | `1-12` | — | Columns at `sm` breakpoint |
| `colsMd` | `1-12` | — | Columns at `md` breakpoint |
| `colsLg` | `1-12` | — | Columns at `lg` breakpoint |
| `colsXl` | `1-12` | — | Columns at `xl` breakpoint |
| `gap` | `0-16` | `4` | Uniform gap |
| `gapX` | `0-16` | — | Column gap (overrides `gap`) |
| `gapY` | `0-16` | — | Row gap (overrides `gap`) |

```tsx
<Grid cols={1} colsMd={2} colsLg={3} gap={6}>
  <Card title="A">...</Card>
  <Card title="B">...</Card>
  <Card title="C">...</Card>
</Grid>
```

---

## Modal

Dialog overlay with title, actions, and optional glass effect.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | **required** | Whether the modal is visible |
| `onClose` | `() => void` | **required** | Close callback |
| `title` | `ReactNode` | — | Modal title |
| `subtitle` | `string` | — | Subtitle below title |
| `actions` | `ReactNode` | — | Footer actions slot |
| `persistent` | `boolean` | `false` | Prevent closing |
| `glass` | `boolean` | `false` | Frosted-glass effect |
| `bottom` | `boolean` | `false` | Bottom sheet position |

```tsx
<Modal open={showModal} onClose={() => setShowModal(false)} title="Confirm" actions={
  <Button color="primary" onClick={handleConfirm}>Yes</Button>
}>
  <p>Are you sure?</p>
</Modal>
```

---

## Popover

Floating content container triggered by hover or click.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `ReactNode` | **required** | Activating element |
| `triggerMode` | `'hover' \| 'click'` | `'hover'` | Activation method |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Placement |
| `showDelay` | `number` | `0` | Show delay in ms (hover only) |
| `hideDelay` | `number` | `300` | Hide delay in ms (hover only) |
| `open` | `boolean` | — | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | — | Open state callback |
| `persistent` | `boolean` | `false` | Prevent closing via outside click |

```tsx
<Popover trigger={<Button>Info</Button>} triggerMode="click" position="top">
  <p>Popover content here.</p>
</Popover>
```

---

## Stack

Flexbox layout container for vertical or horizontal stacking.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | Stack direction |
| `gap` | `0-16` | `2` | Gap between items |
| `align` | `'start' \| 'center' \| 'end' \| 'stretch' \| 'baseline'` | — | Cross-axis alignment |
| `justify` | `'start' \| 'center' \| 'end' \| 'between' \| 'around' \| 'evenly'` | — | Main-axis justification |
| `wrap` | `boolean` | `false` | Allow wrapping |

```tsx
<Stack direction="horizontal" gap={4} align="center">
  <Avatar src="/avatar.jpg" />
  <span>Jane Doe</span>
</Stack>
```

---

## Tabs

Tabbed interface with keyboard navigation.

### TabItem

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Unique tab identifier |
| `label` | `ReactNode` | Tab button label |
| `content` | `ReactNode` | Tab panel content |
| `disabled` | `boolean` | Disable this tab |
| `icon` | `ReactNode` | Icon before label |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabs` | `TabItem[]` | **required** | Tab definitions |
| `activeTab` | `string` | — | Active tab name (controlled) |
| `defaultTab` | `string` | — | Initial active tab (uncontrolled) |
| `onChange` | `(tabName: string) => void` | — | Tab change callback |
| `variant` | `'bordered' \| 'lifted' \| 'boxed'` | `'bordered'` | Visual style |
| `size` | `Size` | — | Tab button size |
| `vertical` | `boolean` | `false` | Vertical layout (tabs left) |
| `verticalRight` | `boolean` | `false` | Vertical layout (tabs right) |
| `color` | `DaisyColor` | — | Active tab color |
| `tabListClassName` | `string` | — | Tab list CSS class |
| `panelClassName` | `string` | — | Tab panel CSS class |
| `activeTabClassName` | `string` | — | Active tab button CSS class |

```tsx
<Tabs
  variant="lifted"
  tabs={[
    { name: 'overview', label: 'Overview', content: <p>Overview content</p> },
    { name: 'details', label: 'Details', content: <p>Details content</p> },
  ]}
/>
```
