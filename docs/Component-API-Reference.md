# Component API Reference

Complete API reference for all ArtisanPack UI React components, organized by category.

## Categories

- [[Form Components]] — Button, Input, Select, Combobox (with tags), Checkbox, CheckboxGroup, RadioGroup (Radio is deprecated), Rating, Toggle, DatePicker, ColorPicker, RichTextEditor, CodeEditor (Editor is deprecated), Signature, and more
- [[Layout Components]] — Card, Dialog, DropdownMenu, Tabs, Accordion, Drawer, Grid, Stack, Popover (Modal and Dropdown are deprecated)
- [[Navigation Components]] — Menu, Breadcrumbs, Link, Pagination, Steps, Navbar, Sidebar, Spotlight (SpotlightSearch is deprecated)
- [[Data Display Components]] — Table, Chart, Calendar, Avatar, Badge, Progress, Stat, Timeline, Carousel, Code, Diff
- [[Feedback Components]] — Alert, Toast and Toaster, Loading, Skeleton, EmptyState, ErrorDisplay
- [[Utility Components]] — Icon, ThemeToggle, Tooltip, Clipboard, Markdown

## Import Patterns

```tsx
// Import everything from the main entry
import { Button, Card, Alert } from '@artisanpack-ui/react';

// Or import from category entry points for smaller bundles
import { Button, Input } from '@artisanpack-ui/react/form';
import { Card, Dialog } from '@artisanpack-ui/react/layout';
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
