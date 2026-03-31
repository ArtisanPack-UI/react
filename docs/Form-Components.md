# Form Components

## Button

A versatile button with DaisyUI color variants, icons, loading state, tooltip, badge, and optional link rendering.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label displayed inside the button. Hidden on small screens when `responsive` is true. |
| `color` | `DaisyColor \| 'ghost' \| 'outline'` | -- | DaisyUI color variant applied to the button. |
| `size` | `Size` | -- | Controls the button size (`'xs'`, `'sm'`, `'md'`, `'lg'`). |
| `icon` | `ReactNode` | -- | Icon element rendered before the label text. |
| `iconRight` | `ReactNode` | -- | Icon element rendered after the label text and children. |
| `loading` | `boolean` | `false` | When true, disables the button and shows a loading spinner in place of the left icon. |
| `link` | `string` | -- | When provided, renders the button as an `<a>` element pointing to this URL. |
| `external` | `boolean` | -- | When true and `link` is set, opens the link in a new tab with `rel="noopener noreferrer"`. |
| `badge` | `string` | -- | Text content for an inline badge rendered after the button label. |
| `badgeClasses` | `string` | -- | Additional CSS classes applied to the badge element. |
| `responsive` | `boolean` | `false` | When true, hides the label on small screens and only shows it on `sm` breakpoint and above. |
| `tooltip` | `string` | -- | Tooltip text displayed on hover. Wraps the button in a DaisyUI tooltip container. |
| `tooltipPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | Position of the tooltip relative to the button. |

Also accepts all native `<button>` HTML attributes. The `type` attribute defaults to `'button'`.

```tsx
<Button color="primary" icon={<PlusIcon />} loading={isSaving}>
  Add Item
</Button>
```

---

## Input

A text input with label, hint/error text, icons, prefix/suffix adornments, clearable action, and inline label mode.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label displayed above the input. Hidden when `inline` is true. |
| `hint` | `string` | -- | Helper text displayed below the input. Hidden when `error` is present. |
| `error` | `string` | -- | Error message displayed below the input. Replaces `hint` and adds `aria-invalid`. |
| `icon` | `ReactNode` | -- | Icon element rendered to the left of the input text. |
| `iconRight` | `ReactNode` | -- | Icon element rendered to the right of the input text. |
| `prefix` | `ReactNode` | -- | Text or element rendered as a prefix inside the input, before the text area. |
| `suffix` | `ReactNode` | -- | Text or element rendered as a suffix inside the input, after the text area. |
| `clearable` | `boolean` | `false` | When true, shows a clear (X) button inside the input. |
| `onClear` | `() => void` | -- | Callback fired when the clear button is clicked. |
| `inline` | `boolean` | `false` | When true, renders the label as a floating/inline label inside the input wrapper. |

Also accepts all native `<input>` HTML attributes (excluding `prefix` and `size`).

```tsx
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  icon={<MailIcon />}
  error={errors.email}
  required
/>
```

---

## Select

A dropdown select that maps options from a data array, with placeholder, icons, and inline label mode.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label displayed above the select. Hidden when `inline` is true. |
| `hint` | `string` | -- | Helper text displayed below the select. Hidden when `error` is present. |
| `error` | `string` | -- | Error message displayed below the select. Replaces `hint` and adds `aria-invalid`. |
| `icon` | `ReactNode` | -- | Icon element rendered to the left of the select. |
| `iconRight` | `ReactNode` | -- | Icon element rendered to the right of the select. |
| `placeholder` | `string` | -- | Text for a disabled placeholder `<option>` rendered as the first option. |
| `placeholderValue` | `string` | `''` | Value attribute for the placeholder option. |
| `inline` | `boolean` | `false` | When true, renders the label as an inline fieldset label below the select. |
| `optionValue` | `string` | `'id'` | Property key on each option object to use as the `<option>` value attribute. |
| `optionLabel` | `string` | `'name'` | Property key on each option object to use as the displayed option text. |
| `options` | `SelectOption[] \| Record<string, string>[]` | `[]` | Array of option objects to render. Can also pass `<option>` elements as children. |

Also accepts all native `<select>` HTML attributes (excluding `size`).

```tsx
const countries = [
  { id: 'us', name: 'United States' },
  { id: 'ca', name: 'Canada' },
];

<Select label="Country" options={countries} placeholder="Select a country" required />
```

---

## Checkbox

A single checkbox input with label, hint/error, DaisyUI color variants, and an optional card layout.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label displayed next to the checkbox. |
| `right` | `boolean` | `false` | When true, positions the label to the right of the checkbox. |
| `hint` | `string` | -- | Helper text displayed below the checkbox. Hidden when `error` is present. |
| `error` | `string` | -- | Error message displayed below the checkbox. Replaces `hint` and adds `aria-invalid`. |
| `color` | `DaisyColor` | -- | DaisyUI color variant for the checkbox indicator. |
| `card` | `boolean` | `false` | When true, renders the checkbox inside a bordered card layout with checked-state highlighting. |
| `cardClass` | `string` | -- | Additional CSS classes applied to the card container when `card` is true. |

Also accepts all native `<input>` HTML attributes (excluding `size` and `type`).

```tsx
<Checkbox label="Accept terms and conditions" color="primary" required />
```

---

## Toggle

A switch/toggle component rendered as a styled checkbox with `role="switch"` for accessibility.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label displayed next to the toggle switch. |
| `right` | `boolean` | `false` | When true, positions the label to the right of the toggle. |
| `hint` | `string` | -- | Helper text displayed below the toggle. Hidden when `error` is present. |
| `error` | `string` | -- | Error message displayed below the toggle. Replaces `hint` and adds `aria-invalid`. |
| `color` | `DaisyColor` | -- | DaisyUI color variant for the toggle track and thumb. |

Also accepts all native `<input>` HTML attributes (excluding `size` and `type`).

```tsx
<Toggle label="Enable notifications" color="success" />
```

---

## Textarea

A multi-line text input with label, hint/error text, inline label mode, and read-only styling.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label displayed above the textarea. Hidden when `inline` is true. |
| `hint` | `string` | -- | Helper text displayed below the textarea. Hidden when `error` is present. |
| `error` | `string` | -- | Error message displayed below the textarea. Replaces `hint` and adds `aria-invalid`. |
| `inline` | `boolean` | `false` | When true, renders the label as an inline fieldset label below the textarea. |

Also accepts all native `<textarea>` HTML attributes.

```tsx
<Textarea label="Comments" placeholder="Enter your comments..." rows={5} required />
```

---

## Radio

A radio button group that renders options from an array with standard and card layouts, per-option hints, and DaisyUI color variants.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Group label rendered as a `<legend>` element for the radio group fieldset. |
| `hint` | `string` | -- | Helper text displayed below the radio group. Hidden when `error` is present. |
| `error` | `string` | -- | Error message displayed below the group. Replaces `hint` and adds `aria-invalid`. |
| `color` | `DaisyColor` | -- | DaisyUI color variant applied to each radio input and card highlight. |
| `optionValue` | `string` | `'id'` | Property key on each option object to use as the radio input value. |
| `optionLabel` | `string` | `'name'` | Property key on each option object to use as the displayed label text. |
| `optionHint` | `string` | `'hint'` | Property key on each option object to use as optional hint text below the label. |
| `options` | `RadioOption[]` | `[]` | Array of option objects to render as radio buttons. |
| `inline` | `boolean` | `false` | When true, displays the options horizontally in a row. Only applies when `card` is false. |
| `card` | `boolean` | `false` | When true, renders each option inside a bordered card with checked-state highlighting. |
| `cardClass` | `string` | -- | Additional CSS classes applied to each card container when `card` is true. |

Also accepts all native `<input>` HTML attributes (excluding `size` and `type`).

```tsx
const sizes = [
  { id: 'sm', name: 'Small' },
  { id: 'md', name: 'Medium' },
  { id: 'lg', name: 'Large' },
];

<Radio label="Size" options={sizes} color="primary" inline />
```

---

## DatePicker

A date/time selection component using native HTML date inputs with DaisyUI styling.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label displayed above the date picker. Hidden when `inline` is true. |
| `hint` | `string` | -- | Helper text displayed below the date picker. Hidden when `error` is present. |
| `error` | `string` | -- | Error message displayed below the picker. Replaces `hint` and adds `aria-invalid`. |
| `icon` | `ReactNode` | -- | Icon element rendered to the left of the input. |
| `iconRight` | `ReactNode` | -- | Icon element rendered to the right of the input. |
| `inline` | `boolean` | `false` | When true, renders the label as a floating/inline label inside the input wrapper. |
| `dateType` | `'date' \| 'datetime-local' \| 'time' \| 'month' \| 'week'` | `'date'` | The native HTML input type for date/time selection. |

Also accepts all native `<input>` HTML attributes (excluding `size`, `type`, and `prefix`).

```tsx
<DatePicker label="Start Date" dateType="date" required />
```

---

## ColorPicker

A color picker combining a native color swatch with a hex value display, optional clear and random color buttons.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label displayed above the color picker. |
| `hint` | `string` | -- | Helper text displayed below the color picker. Hidden when `error` is present. |
| `error` | `string` | -- | Error message displayed below the picker. Replaces `hint` and adds `aria-invalid`. |
| `icon` | `ReactNode` | -- | Icon element rendered to the left of the hex value display. |
| `iconRight` | `ReactNode` | -- | Icon element rendered to the right of the action buttons. |
| `clearable` | `boolean` | `false` | When true, shows a clear button that resets the color to `defaultValue` or `#000000`. |
| `onClear` | `() => void` | -- | Callback fired when the clear button is clicked. |
| `random` | `boolean` | `false` | When true, shows a button to generate a random hex color. |
| `onRandomColor` | `(color: string) => void` | -- | Callback fired when a random color is generated, receiving the new hex string. |
| `randomIcon` | `ReactNode` | -- | Custom icon element for the random color button. Defaults to a refresh SVG. |

Also accepts all native `<input>` HTML attributes (excluding `size`, `type`, and `prefix`).

```tsx
<ColorPicker label="Brand Color" value="#3b82f6" onChange={handleChange} clearable random />
```

---

## File

A file upload component with standard file input and drag-and-drop zone modes, upload progress display, and a unified callback.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label displayed above the file input. |
| `hint` | `string` | -- | Helper text displayed below the file input. Hidden when `error` is present. |
| `error` | `string` | -- | Error message displayed below the input. Replaces `hint` and adds `aria-invalid`. |
| `withDragDrop` | `boolean` | `false` | When true, renders a drag-and-drop zone instead of the standard file input. |
| `dragDropText` | `string` | `'Drop files here or click to browse'` | Custom text displayed inside the drag-and-drop zone. |
| `dragDropClass` | `string` | -- | Additional CSS classes applied to the drag-and-drop zone container. |
| `progress` | `number` | -- | Upload progress percentage (0-100). When greater than 0, a progress bar is displayed. |
| `hideProgress` | `boolean` | `false` | When true, hides the upload progress bar even when `progress` is set. |
| `onFilesSelected` | `(files: FileList \| null) => void` | -- | Callback fired when files are selected via input change or drag-and-drop. |

Also accepts all native `<input>` HTML attributes (excluding `size`, `type`, `value`, and `defaultValue`).

```tsx
<File
  label="Upload Images"
  withDragDrop
  multiple
  accept="image/*"
  progress={uploadProgress}
  onFilesSelected={handleFiles}
/>
```

---

## Password

A password input with a built-in visibility toggle, optional clear button, and customizable toggle icons.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label displayed above the password input. Hidden when `inline` is true. |
| `hint` | `string` | -- | Helper text displayed below the input. Hidden when `error` is present. |
| `error` | `string` | -- | Error message displayed below the input. Replaces `hint` and adds `aria-invalid`. |
| `icon` | `ReactNode` | -- | Icon element rendered to the left of the input text. |
| `inline` | `boolean` | `false` | When true, renders the label as a floating/inline label inside the input wrapper. |
| `clearable` | `boolean` | `false` | When true, shows a clear (X) button inside the input. |
| `onClear` | `() => void` | -- | Callback fired when the clear button is clicked. |
| `hideToggle` | `boolean` | `false` | When true, hides the password visibility toggle button. |
| `hiddenIcon` | `ReactNode` | -- | Custom icon shown when the password is hidden (masked). Defaults to an eye-slash SVG. |
| `visibleIcon` | `ReactNode` | -- | Custom icon shown when the password is visible (unmasked). Defaults to an eye SVG. |

Also accepts all native `<input>` HTML attributes (excluding `type`, `size`, and `prefix`).

```tsx
<Password label="Password" placeholder="Enter password" required />
```

---

## Pin

A multi-field PIN/OTP entry component with auto-focus navigation, clipboard paste support, and completion callbacks.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `length` | `number` | **(required)** | Number of individual PIN input fields to render. |
| `numeric` | `boolean` | `false` | When true, restricts input to digits only (0-9) and sets `inputMode="numeric"`. |
| `hide` | `boolean` | `false` | When true, masks the input characters using `type="password"`. |
| `error` | `string` | -- | Error message displayed below the PIN inputs. Adds `aria-invalid` to each field. |
| `color` | `DaisyColor` | -- | DaisyUI color variant applied to each individual PIN input field. |
| `onComplete` | `(value: string) => void` | -- | Callback fired when all PIN fields are filled. Receives the complete PIN string. |
| `onIncomplete` | `(value: string) => void` | -- | Callback fired when the PIN becomes incomplete. Receives the current partial value. |
| `value` | `string` | -- | The current PIN value for controlled usage. Each character maps to one input field. |
| `onValueChange` | `(value: string) => void` | -- | Callback fired on every input change with the current concatenated PIN value. |

Also accepts all native `<input>` HTML attributes (excluding `size` and `type`).

```tsx
<Pin length={6} numeric onComplete={(pin) => verifyOTP(pin)} color="primary" />
```

---

## Range

A range slider input with DaisyUI styling, label, hint/error text, and color variants.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label displayed above the range slider. |
| `hint` | `string` | -- | Helper text displayed below the slider. Hidden when `error` is present. |
| `error` | `string` | -- | Error message displayed below the slider. Replaces `hint` and adds `aria-invalid`. |
| `color` | `DaisyColor` | -- | DaisyUI color variant for the range track and thumb. |

Also accepts all native `<input>` HTML attributes (excluding `size` and `type`). The `min` and `max` attributes default to `0` and `100` respectively.

```tsx
<Range label="Volume" min={0} max={100} value={volume} onChange={handleChange} color="primary" />
```

---

## Editor

A monospace-styled textarea for code or structured text editing with label, hint, and error support.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label displayed above the editor. |
| `hint` | `string` | -- | Helper text displayed below the editor. Hidden when `error` is present. |
| `error` | `string` | -- | Error message displayed below the editor. Replaces `hint` and adds `aria-invalid`. |

Also accepts all native `<textarea>` HTML attributes. Defaults to 12 rows.

```tsx
<Editor label="HTML Source" placeholder="Enter HTML..." rows={20} />
```

---

## RichTextEditor

A rich text editor using `contentEditable` with an optional toolbar, controlled HTML value management, and DaisyUI form field styling.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Text label displayed above the editor. |
| `hint` | `string` | -- | Helper text displayed below the editor. Hidden when `error` is present. |
| `error` | `string` | -- | Error message displayed below the editor. Replaces `hint` and adds `aria-invalid`. |
| `value` | `string` | -- | The current HTML content for the editable area. **Always sanitize user-generated content to prevent XSS.** |
| `onValueChange` | `(value: string) => void` | -- | Callback fired on every input event with the current `innerHTML` of the editable area. |
| `toolbar` | `ReactNode` | -- | Custom toolbar content rendered above the editable area inside a styled toolbar bar. |
| `minHeight` | `string` | `'200px'` | CSS min-height for the editable content area. |
| `required` | `boolean` | -- | Whether the field is required. Shows a required indicator on the label. |

Also accepts all native `<div>` HTML attributes.

```tsx
<RichTextEditor
  label="Description"
  value={html}
  onValueChange={setHtml}
  toolbar={
    <>
      <button onClick={() => document.execCommand('bold')}>B</button>
      <button onClick={() => document.execCommand('italic')}>I</button>
    </>
  }
/>
```
