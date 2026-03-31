# Utility Components

## Clipboard

Copy-to-clipboard button with success feedback.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | **required** | Text to copy |
| `label` | `string` | `'Copy'` | Button label |
| `successLabel` | `string` | `'Copied!'` | Label after copy |
| `successDuration` | `number` | `2000` | Success state duration (ms) |
| `color` | `DaisyColor \| 'ghost'` | `'ghost'` | Button color |
| `size` | `Size` | `'sm'` | Button size |
| `onCopy` | `() => void` | — | Callback after copy |

```tsx
<Clipboard text="npm install @artisanpack-ui/react" />
```

---

## Icon

SVG icon renderer with size presets and accessibility support.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `path` | `string` | — | SVG `d` attribute for single-path icons |
| `color` | `DaisyColor` | — | Color as text class |
| `size` | `Size` | `'md'` | Size preset |
| `label` | `string` | — | Accessible label (sets `role="img"`) |
| `viewBox` | `string` | `'0 0 24 24'` | SVG viewBox |

Accepts `children` for multi-path SVGs.

```tsx
<Icon path="M12 2L2 22h20L12 2z" color="warning" label="Warning" />
```

---

## Markdown

Renders markdown source as HTML.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `source` | `string` | **required** | Raw markdown text |
| `renderMarkdown` | `(source: string) => string` | — | Custom markdown-to-HTML function |

When `renderMarkdown` is omitted, a minimal built-in parser is used. The returned HTML is injected via `dangerouslySetInnerHTML` — ensure the source is trusted or sanitized.

```tsx
<Markdown source="# Hello\n\nThis is **bold** text." />
```

---

## ThemeToggle

Button that cycles through light, dark, and system color schemes.

Requires a `ThemeProvider` ancestor.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `Size` | `'md'` | Button size |
| `modes` | `ColorScheme[]` | `['light', 'dark', 'system']` | Modes to cycle through |

```tsx
<ThemeToggle size="sm" />
```

---

## Tooltip

Hover/focus tooltip overlay.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tip` | `string` | **required** | Tooltip text |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Tooltip placement |
| `color` | `DaisyColor` | — | Background color |
| `open` | `boolean` | — | Force always visible |

```tsx
<Tooltip tip="Save your changes" position="bottom">
  <Button>Save</Button>
</Tooltip>
```
