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

## Dialog

A modal window for a focused task or a confirmation, built on the design system (`.apui-dialog`, styled by `@artisanpack-ui/css`). It traps focus, locks scroll and hides the page behind it from assistive technology; Escape, the close button and the backdrop close it, and focus returns to the trigger. Replaces [Modal](#modal).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | — | Whether it's open (controlled). Pair it with `onOpenChange` |
| `defaultOpen` | `boolean` | `false` | The initial state of an uncontrolled dialog |
| `onOpenChange` | `(open: boolean) => void` | — | The dialog opened or closed itself (trigger, Escape, backdrop, close button). Setting `open` doesn't call it |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | The panel's width (`data-size`) |
| `role` | `'dialog' \| 'alertdialog'` | `'dialog'` | `alertdialog` for interrupting confirmations: the backdrop doesn't close it and focus starts on the close button |
| `surface` | `'overlay' \| 'glass'` | `'overlay'` | The panel's surface (`data-surface`) |
| `color` | semantic color | — | Tints the header icon (`data-color`) |
| `icon` | `string \| ReactNode` | — | Icon name from the registry, or a node, in a tinted circle before the title |
| `title` | `ReactNode` | — | The heading, the dialog's accessible name. Every dialog needs one |
| `description` | `ReactNode` | — | Supporting text, linked with `aria-describedby` |
| `footer` | `ReactNode` | — | The actions row. Name the confirm action, not "OK" |
| `trigger` | `ReactNode` | — | Content for an outline trigger button that opens the dialog |
| `modal` | `boolean` | `true` | Traps focus, locks scroll and sets `aria-modal` |
| `portal` | `boolean` | `true` | Renders the backdrop and panel at the end of the body. Off renders them in place |
| `hideClose` | `boolean` | `false` | Hides the close button. Escape still closes |
| `closeLabel` | `string` | `'Close'` | The close button's accessible name; translate it |
| `classes` | `Partial<Record<DialogPart, string>>` | — | Extra classes per part: `root` (the panel), `trigger`, `backdrop`, `positioner`, `header`, `icon`, `title`, `description`, `closeTrigger`, `body`, `footer` |

For an icon-only `trigger`, put the name in visually hidden text inside it, so the button keeps an accessible name (here `UserPlusIcon` is any icon component of yours): `trigger={<><UserPlusIcon aria-hidden="true" /><span className="apui-sr-only">Invite member</span></>}`. A dialog without a `title` takes its name from `aria-label`.

Children render in the body. Other attributes (handlers and `style` included, merged with the machine's) and the ref go to the panel, which renders (hidden) while the dialog is closed. With `portal` on, the backdrop and panel render on the client only.

```tsx
import { Button, Dialog, Input } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function BasicExample() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger="Invite member"
      title="Invite member"
      description="They'll get an email with a link to join the project."
      footer={
        <>
          <Button variant="outline" color="neutral" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Send invite</Button>
        </>
      }
    >
      <Input type="email" label="Email" />
    </Dialog>
  );
}
```

```tsx
import { Button, Dialog } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function ConfirmExample() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button color="error" variant="soft" onClick={() => setOpen(true)}>
        Delete listing
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        role="alertdialog"
        size="sm"
        color="error"
        icon="trash"
        title="Delete Cedarwood Estates?"
        description="The listing and its 3 open offers will be removed. This can't be undone."
        footer={
          <>
            <Button variant="outline" color="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button color="error" onClick={() => setOpen(false)}>
              Delete listing
            </Button>
          </>
        }
      />
    </>
  );
}
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

> **Deprecated.** Use [DropdownMenu](#dropdownmenu). Dropdown will be removed in a later major release.

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

## DropdownMenu

A list of actions or options anchored to a trigger button, built on the design system (`.apui-dropdown-menu`). Action, checkbox and radio items, in groups with labels; arrow keys move, typeahead jumps, Escape closes and focus returns to the trigger. Compose it from `DropdownMenuItem`, `DropdownMenuGroup` and `DropdownMenuSeparator`, or pass the same structure as `items`. Replaces [Dropdown](#dropdown).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | — | The trigger button's content (an outline, neutral Button with a chevron) |
| `items` | `DropdownMenuItemData[]` | — | The items as data: `{ value, label, icon, shortcut, color: 'error', disabled }`, `{ type: 'checkbox' \| 'radio', value, label, checked }`, `{ type: 'separator' }` and `{ type: 'group', label, items }` |
| `open` | `boolean` | — | Whether it's open (controlled). Pair it with `onOpenChange` |
| `defaultOpen` | `boolean` | `false` | The initial state of an uncontrolled menu |
| `onOpenChange` | `(open: boolean) => void` | — | The menu opened or closed itself (trigger, Escape, outside click, a choice) |
| `onSelect` | `(value: string) => void` | — | An action item was chosen |
| `onCheckedChange` | `({ value, checked }) => void` | — | A checkbox or radio item was chosen. Its `checked` stays yours to set |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | Which of the menu's edges lines up with the trigger's (`data-align`); follows the text direction |
| `surface` | `'overlay' \| 'glass'` | `'overlay'` | The menu's surface (`data-surface`) |
| `portal` | `boolean` | `true` | Renders the menu at the end of the body. Off renders it in place |
| `classes` | `Partial<Record<DropdownMenuPart, string>>` | — | Extra classes per part: `root` (the panel), `trigger`, `positioner`, `itemGroup`, `itemGroupLabel`, `item`, `icon`, `itemText`, `shortcut`, `itemIndicator`, `separator` |

### DropdownMenuItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | **required** | Unique in the menu; reported by `onSelect` and `onCheckedChange` |
| `type` | `'item' \| 'checkbox' \| 'radio'` | `'item'` | Checkbox and radio items show a check while `checked` |
| `checked` | `boolean` | `false` | A checkbox or radio item's state |
| `icon` | `string \| ReactNode` | — | Icon name or node before the label |
| `shortcut` | `ReactNode` | — | A shortcut shown at the end, in a `<kbd>` |
| `color` | `'error'` | — | A destructive action. Put it last, after a separator |
| `disabled` | `boolean` | `false` | Skipped by the arrow keys |
| `onSelect` | `(value: string) => void` | — | This action item was chosen |
| `onCheckedChange` | `(checked: boolean) => void` | — | This checkbox or radio item was chosen |

`DropdownMenuGroup` takes a `label`; `DropdownMenuSeparator` takes no props. Native attributes on the menu, items, groups and separators (handlers and `style` included) are merged with the machine's props, so an item's `onClick` still runs.

For an icon-only trigger, put the name in visually hidden text inside `label`; the trigger is the menu's accessible name too:

```tsx
<DropdownMenu
  label={
    <>
      <EllipsisIcon aria-hidden="true" />
      <span className="apui-sr-only">Listing actions</span>
    </>
  }
  items={items}
/>
```

```tsx
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@artisanpack-ui/react';

export default function BasicExample() {
  return (
    <DropdownMenu label="Options" onSelect={(value) => console.log(value)}>
      <DropdownMenuGroup label="Listing">
        <DropdownMenuItem value="edit" icon="pencil" shortcut="E">
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem value="duplicate" icon="copy">
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem value="archive" disabled>
          Archive
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem value="delete" icon="trash" color="error">
        Delete
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
```

```tsx
import { DropdownMenu } from '@artisanpack-ui/react';
import { useState } from 'react';

export default function OptionsExample() {
  const [showGrid, setShowGrid] = useState(true);
  const [sort, setSort] = useState('newest');

  return (
    <DropdownMenu
      label="View"
      align="end"
      items={[
        { type: 'checkbox', value: 'grid', label: 'Show grid', checked: showGrid },
        { type: 'separator' },
        {
          type: 'group',
          label: 'Sort by',
          items: [
            { type: 'radio', value: 'newest', label: 'Newest', checked: sort === 'newest' },
            { type: 'radio', value: 'price', label: 'Price', checked: sort === 'price' },
          ],
        },
      ]}
      onCheckedChange={({ value, checked }) => {
        if (value === 'grid') setShowGrid(checked);
        else if (checked) setSort(value);
      }}
    />
  );
}
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

> **Deprecated.** Use [Dialog](#dialog). Modal will be removed in a later major release.

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
