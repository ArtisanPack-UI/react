# Data Display Components

## Avatar

User avatar with image, initials, or icon and optional info layout.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `image` | `string` | — | Avatar image URL |
| `alt` | `string` | — | Image alt text |
| `placeholder` | `string` | — | Text for initials generation |
| `color` | `DaisyColor` | `'neutral'` | Placeholder/ring color |
| `size` | `Size` | `'md'` | Avatar size |
| `icon` | `ReactNode` | — | Custom icon element |
| `title` | `ReactNode` | — | Title (enables info layout) |
| `subtitle` | `ReactNode` | — | Subtitle text |
| `ring` | `boolean` | — | Show colored ring |
| `online` | `boolean` | — | Online indicator |
| `offline` | `boolean` | — | Offline indicator |

```tsx
<Avatar image="/photo.jpg" alt="Jane" size="lg" ring online />
```

---

## Badge

Small label or tag element.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `ReactNode` | — | Badge content (fallback: children) |
| `color` | `DaisyColor \| 'ghost'` | — | Color variant |
| `size` | `Size` | — | Badge size |
| `outline` | `boolean` | — | Outline style |

```tsx
<Badge color="success" value="Active" />
```

---

## Calendar

Month calendar view with events, date selection, and navigation.

### CalendarEvent

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string \| number` | Unique identifier |
| `title` | `string` | Event title |
| `date` | `string` | Start date (YYYY-MM-DD) |
| `endDate` | `string` | End date for multi-day events |
| `color` | `DaisyColor` | Event dot color |
| `description` | `string` | Event description |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date` | — | Selected date (controlled) |
| `onChange` | `(date: Date) => void` | — | Date selection callback |
| `events` | `CalendarEvent[]` | — | Events to display |
| `onEventClick` | `(event: CalendarEvent) => void` | — | Event click callback |
| `weekStartsOnSunday` | `boolean` | `false` | Start weeks on Sunday |
| `highlightWeekends` | `boolean` | `false` | Highlight weekends |
| `highlightToday` | `boolean` | `true` | Highlight today |
| `minDate` | `Date` | — | Earliest selectable date |
| `maxDate` | `Date` | — | Latest selectable date |
| `color` | `DaisyColor` | `'primary'` | Selected day color |
| `renderDay` | `(date: Date, events: CalendarEvent[]) => ReactNode` | — | Custom day renderer |

```tsx
<Calendar value={selectedDate} onChange={setSelectedDate} events={events} />
```

---

## Carousel

Image/content slideshow with autoplay and navigation controls.

### CarouselSlide

| Property | Type | Description |
|----------|------|-------------|
| `image` | `string` | Slide image URL |
| `alt` | `string` | Image alt text |
| `title` | `ReactNode` | Title overlay |
| `description` | `ReactNode` | Description overlay |
| `content` | `ReactNode` | Custom content (overrides image/title/description) |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `slides` | `CarouselSlide[]` | **required** | Slide data |
| `autoplay` | `boolean` | `false` | Auto-advance slides |
| `interval` | `number` | `3000` | Autoplay interval (ms) |
| `showIndicators` | `boolean` | `true` | Show dot indicators |
| `showArrows` | `boolean` | `true` | Show navigation arrows |
| `renderSlide` | `(slide: CarouselSlide, index: number) => ReactNode` | — | Custom slide renderer |

```tsx
<Carousel slides={[
  { image: '/hero1.jpg', title: 'Welcome' },
  { image: '/hero2.jpg', title: 'Get Started' },
]} autoplay />
```

---

## Chart

ApexCharts wrapper supporting bar, line, area, pie, donut, radar, and more.

### ChartDataPoint

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Data point label |
| `value` | `number` | Numeric value |
| `color` | `DaisyColor \| string` | Color override |

### ChartSeries

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Series name |
| `data` | `number[]` | Data values |
| `color` | `DaisyColor \| string` | Series color |

### ChartType

`'bar' | 'line' | 'area' | 'donut' | 'pie' | 'radialBar' | 'radar' | 'polarArea'`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `ChartType` | **required** | Chart type |
| `labels` | `string[]` | — | Category labels |
| `series` | `ChartSeries[]` | — | Multi-series data |
| `data` | `ChartDataPoint[]` | — | Single-series data |
| `height` | `number \| string` | `350` | Chart height |
| `width` | `number \| string` | — | Chart width |
| `color` | `DaisyColor` | — | Default color |
| `options` | `ApexOptions` | — | ApexCharts options (deep-merged) |
| `showLegend` | `boolean` | `true` | Show legend |
| `animated` | `boolean` | `true` | Enable animations |
| `title` | `string` | — | Chart title |

```tsx
<Chart type="bar" data={[
  { label: 'Jan', value: 30 },
  { label: 'Feb', value: 45 },
]} color="primary" />
```

---

## Code

Code block display with optional line numbers and copy button.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `code` | `string` | **required** | Code to display |
| `language` | `string` | — | Language label |
| `label` | `string` | — | Custom header label |
| `hint` | `string` | — | Description below code |
| `showLineNumbers` | `boolean` | `false` | Show line numbers |
| `copyable` | `boolean` | `true` | Show copy button |
| `maxHeight` | `string` | — | Max height (enables scroll) |

```tsx
<Code code="const x = 42;" language="javascript" showLineNumbers />
```

---

## Diff

Side-by-side or inline text diff viewer.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `oldContent` | `string` | **required** | Original text |
| `newContent` | `string` | **required** | Modified text |
| `oldLabel` | `string` | `'Original'` | Original column label |
| `newLabel` | `string` | `'Modified'` | Modified column label |
| `mode` | `'side-by-side' \| 'inline'` | `'inline'` | Display mode |

```tsx
<Diff oldContent="Hello world" newContent="Hello React" mode="side-by-side" />
```

---

## Progress

Progress bar with optional label and value display.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | `0` | Current value |
| `max` | `number` | `100` | Maximum value |
| `color` | `DaisyColor` | — | Bar color |
| `indeterminate` | `boolean` | `false` | Loading animation |
| `label` | `string` | — | Label above bar |
| `showValue` | `boolean` | `false` | Show percentage |

```tsx
<Progress value={75} color="primary" label="Upload Progress" showValue />
```

---

## Sparkline

Lightweight inline SVG chart (line, area, or bar).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `number[]` | **required** | Data points |
| `type` | `'line' \| 'area' \| 'bar'` | `'line'` | Chart type |
| `height` | `number` | `40` | SVG height (px) |
| `width` | `number` | `data.length * 8` | SVG width (px) |
| `color` | `DaisyColor \| string` | `'primary'` | Chart color |
| `strokeWidth` | `number` | `2` | Line stroke width |
| `curve` | `boolean` | `true` | Smooth curves |
| `fillOpacity` | `number` | `0.3` | Area fill opacity |
| `showTooltip` | `boolean` | `true` | Hover tooltip |

```tsx
<Sparkline data={[10, 25, 15, 40, 30]} color="success" type="area" />
```

---

## Stat

Statistic display with optional change indicator and sparkline.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `ReactNode` | — | Stat label (e.g. "Revenue") |
| `value` | `ReactNode` | **required** | Primary metric value |
| `description` | `ReactNode` | — | Description below value |
| `icon` | `ReactNode` | — | Icon in figure area |
| `color` | `DaisyColor` | — | Value text color |
| `change` | `number` | — | Percentage change (positive = green, negative = red) |
| `changeLabel` | `string` | — | Label after change (e.g. "since last month") |
| `actions` | `ReactNode` | — | Action elements |
| `sparklineData` | `number[]` | — | Inline sparkline data |
| `sparklineType` | `'line' \| 'area' \| 'bar'` | `'line'` | Sparkline chart type |
| `sparklineColor` | `DaisyColor \| string` | — | Sparkline color |

### StatGroup Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `horizontal` | `boolean` | `false` | Side-by-side layout |

```tsx
<StatGroup horizontal>
  <Stat title="Revenue" value="$4.5M" change={12.5} changeLabel="vs last quarter" />
  <Stat title="Users" value="1,234" sparklineData={[10, 25, 15, 40, 30]} />
</StatGroup>
```

---

## Table

Data table with sorting, selection, expansion, and custom renderers.

### TableHeader

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Dot-notation path to row value |
| `label` | `ReactNode` | Column header label |
| `sortable` | `boolean` | Enable sorting |
| `className` | `string` | CSS class for column |
| `render` | `(value: unknown, row: T, index: number) => ReactNode` | Custom cell renderer |

### TableSortConfig

| Property | Type | Description |
|----------|------|-------------|
| `key` | `string` | Sorted column key |
| `direction` | `'asc' \| 'desc'` | Sort direction |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `headers` | `TableHeader[]` | **required** | Column definitions |
| `rows` | `T[]` | **required** | Row data |
| `keyBy` | `string` | `'id'` | Row key path |
| `striped` | `boolean` | — | Zebra striping |
| `hoverable` | `boolean` | `true` | Hover highlight |
| `compact` | `boolean` | — | Compact padding |
| `size` | `Size` | — | Table size |
| `noHeaders` | `boolean` | — | Hide header row |
| `sortBy` | `TableSortConfig` | — | Current sort (controlled) |
| `onSort` | `(sort: TableSortConfig) => void` | — | Sort change callback |
| `selectable` | `boolean` | — | Row selection checkboxes |
| `selectedKeys` | `Set<string \| number>` | — | Selected rows (controlled) |
| `onSelectionChange` | `(keys: Set<string \| number>) => void` | — | Selection callback |
| `expandable` | `boolean` | — | Expandable rows |
| `renderExpansion` | `(row: T, index: number) => ReactNode` | — | Expansion content renderer |
| `renderActions` | `(row: T, index: number) => ReactNode` | — | Actions column renderer |
| `emptyText` | `ReactNode` | `'No data available.'` | Empty state content |
| `footer` | `ReactNode` | — | Table footer |

```tsx
<Table
  headers={[
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email' },
  ]}
  rows={users}
  sortBy={sort}
  onSort={setSort}
/>
```

---

## Timeline

Vertical or horizontal timeline of events.

### TimelineItemData

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string \| number` | Unique identifier |
| `title` | `ReactNode` | Event title |
| `subtitle` | `ReactNode` | Subtitle (e.g. date) |
| `description` | `ReactNode` | Body text |
| `icon` | `ReactNode` | Icon in circle |
| `color` | `DaisyColor` | Item color |
| `pending` | `boolean` | Pending/incomplete state |

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TimelineItemData[]` | **required** | Timeline items |
| `vertical` | `boolean` | `true` | Vertical layout |
| `compact` | `boolean` | `false` | Compact mode |
| `snap` | `boolean` | `false` | Snap icons to line |

```tsx
<Timeline items={[
  { title: 'Order Placed', subtitle: 'Mar 1', color: 'success' },
  { title: 'Shipped', subtitle: 'Mar 3', color: 'info' },
  { title: 'Delivered', subtitle: 'Mar 5', pending: true },
]} />
```
