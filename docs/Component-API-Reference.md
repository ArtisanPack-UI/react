# Component API Reference

Complete API reference for all ArtisanPack UI React components, organized by category.

## Categories

- [[Form Components]] — Button, Input, Select, Checkbox, Toggle, DatePicker, ColorPicker, RichTextEditor, and more
- [[Layout Components]] — Card, Modal, Tabs, Accordion, Drawer, Dropdown, Grid, Stack, Popover
- [[Navigation Components]] — Menu, Breadcrumbs, Pagination, Steps, Navbar, Sidebar, SpotlightSearch
- [[Data Display Components]] — Table, Chart, Calendar, Avatar, Badge, Progress, Stat, Timeline, Carousel, Code, Diff
- [[Feedback Components]] — Alert, Toast, Loading, Skeleton, EmptyState, ErrorDisplay
- [[Utility Components]] — Icon, ThemeToggle, Tooltip, Clipboard, Markdown

## Import Patterns

```tsx
// Import everything from the main entry
import { Button, Card, Alert } from '@artisanpack-ui/react';

// Or import from category entry points for smaller bundles
import { Button, Input } from '@artisanpack-ui/react/form';
import { Card, Modal } from '@artisanpack-ui/react/layout';
import { Menu } from '@artisanpack-ui/react/navigation';
import { Table, Badge } from '@artisanpack-ui/react/data';
import { Alert, Toast } from '@artisanpack-ui/react/feedback';
import { Icon, Tooltip } from '@artisanpack-ui/react/utility';
```

## Common Props

Many components share these common prop patterns:

| Prop | Type | Description |
|------|------|-------------|
| `color` | `DaisyColor \| 'ghost' \| 'outline'` | DaisyUI semantic color |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | Component size |
| `className` | `string` | Additional CSS classes |
| `label` | `string` | Field label (form components) |
| `error` | `string` | Validation error message (form components) |
| `hint` | `string` | Helper text (form components) |
