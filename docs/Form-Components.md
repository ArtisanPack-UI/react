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

Option groups: an `options` entry with a `label` and its own `options` renders a native `<optgroup>` (this replaces Livewire's `select-group`).

```tsx
<Select label="Property type" options={[{ label: 'Apartments', options: ['Studio', 'Loft'] }, { label: 'Houses', options: ['Townhouse'] }]} />
```

---

## Combobox

A text input that filters a listbox (#54), on the behavior engine's combobox machine. It shares the field anatomy with Input and Select (`.apui-combobox`: label, box, hint, error) and renders the design-system markup contract, styled by `@artisanpack-ui/css`. Typing filters the options by label, ignoring case and accents, and marks the matches. `multiple` shows the chosen values as removable chips (Backspace in the empty input removes the last one, announced to screen readers); with `allowCreate` it is the tags input, replacing a separate Tags component. `remote` hands the search to the app: listen to `onSearchChange`, pass the results as `options`, and set `loading` meanwhile. `className` and other native `<div>` attributes go to the root; `classes` adds classes per part.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `ComboboxOption[]` | `[]` | Strings, or `{ value, label, description, icon, color, disabled }`. `color` tints the chip. |
| `value` / `defaultValue` | `string \| string[] \| null` | -- | Controlled or initial value; an array with `multiple`. |
| `multiple` | `boolean` | `false` | Chooses several values, shown as chips. |
| `max` | `number` | -- | With `multiple`, the most values; the other options are disabled once reached. |
| `allowCreate` | `boolean` | `false` | Offers “Create …” for unmatched text; calls `onCreate`. |
| `remote` | `boolean` | `false` | The app filters: options are shown as given. |
| `search` | `string` | -- | The input's text when it renders: filters and marks. |
| `loading` | `boolean` | `false` | Spinner in the box and the loading text in the listbox. |
| `clearable` | `boolean` | `false` | A button that clears the value. |
| `label`, `hint`, `error`, `invalid`, `required`, `disabled`, `placeholder`, `size`, `leadingIcon`, `icon` | | | As in Input. `placeholder` defaults to `Search…`. |
| `name` | `string` | -- | Submits the value with a native form: a hidden input per value (use `tags[]` for an array), none while empty. |
| `open` / `defaultOpen` | `boolean` | -- | Controlled or initial open state of the listbox. |
| `portal` | `boolean` | `true` | Renders the listbox at the end of the body. |
| `empty` | `ReactNode` | -- | Overrides the empty text, such as a link to add a record. |
| `renderItem` | `(option) => ReactNode` | -- | Renders an option's label. |
| `emptyLabel`, `loadingLabel`, `createLabel`, `removeLabel`, `removedLabel`, `clearLabel`, `triggerLabel` | `string` | English | Built-in strings, for translation. `{search}`, `{value}` and `{label}` are filled in. |
| `onValueChange`, `onSearchChange`, `onOpenChange`, `onCreate` | callbacks | -- | Value, typed text, open state, created value. |

```tsx
const [tags, setTags] = useState<ComboboxValue>([]);

<Combobox
  label="Listing tags"
  multiple
  allowCreate
  options={tagOptions}
  value={tags}
  onValueChange={setTags}
  onCreate={(value) => setTagOptions((current) => [...current, value])}
/>
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

A switch for settings that take effect immediately: a native checkbox with `role="switch"` in Checkbox's field anatomy (`.apui-toggle`). Renders the design-system markup contract, styled by `@artisanpack-ui/css`. `className` goes to the root; every other native attribute goes to the native control. `classes` adds classes per part.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | -- | Whether it's on (controlled). Emitted as `data-state`. |
| `defaultChecked` | `boolean` | `false` | The initial state of an uncontrolled toggle. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Track size. |
| `color` | `'primary' \| 'secondary' \| 'accent' \| 'neutral' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'primary'` | The track color when on. |
| `label` | `ReactNode` | -- | The visible label. Name the setting, not the state. |
| `description` | `ReactNode` | -- | Supporting text, linked with `aria-describedby`. |
| `error` | `string` | -- | Validation message; marks it invalid. |
| `invalid`, `disabled`, `required` | `boolean` | `false` | States, set on the native control. |
| `onCheckedChange` | `(checked: boolean) => void` | -- | Called with the new state. |

```tsx
<Toggle label="Dark mode" checked={dark} onCheckedChange={setDark} />
```

---

## Textarea

Multi-line text entry in Input's field anatomy (`.apui-textarea`), with an optional character counter. Renders the design-system markup contract, styled by `@artisanpack-ui/css`. `className` goes to the root; every other native attribute goes to the native control. `classes` adds classes per part.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | `number` | `4` | Visible lines; with `autoResize`, the minimum. |
| `maxLength` | `number` | -- | Sets `maxlength` and shows the counter. A polite live region announces the characters left only near the limit. |
| `autoResize` | `boolean` | `false` | Grows the box with its content (CSS `field-sizing`). |
| `label`, `hint` | `ReactNode` | -- | Visible label and help text. |
| `error` | `string` | -- | Validation message; marks the field invalid. |
| `invalid`, `disabled`, `readonly`, `required` | `boolean` | `false` | States. |
| `placeholder` | `string` | -- | Never a replacement for the label. |
| `value` / `defaultValue` | `string` | -- | Controlled or uncontrolled value. |
| `remainingLabel` | `string` | `'Characters left: {count}'` | The announcement near the limit; translate it here. |
| `onValueChange` | `(value: string) => void` | -- | Called with the new value. |

```tsx
<Textarea label="Description" maxLength={500} value={text} onValueChange={setText} />
```

---

## Radio

> **Deprecated.** Use [RadioGroup](#radiogroup). Radio is removed in a later major release.

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

## RadioGroup

Chooses exactly one option from a small set: native radios in a fieldset (`.apui-radio-group`), so the platform supplies roving focus and arrow keys, which follow the text direction. Replaces the deprecated `Radio`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `RadioGroupOption[]` | `[]` | Strings, or `{ value, label, description, meta, disabled }` objects. |
| `value` | `string \| number` | -- | The selected value (controlled). |
| `defaultValue` | `string \| number` | -- | The initial value of an uncontrolled group. |
| `label` | `ReactNode` | -- | The legend. |
| `hint` | `ReactNode` | -- | Help text, linked to the fieldset. |
| `error` | `string` | -- | Validation message; marks every radio invalid. |
| `invalid` | `boolean` | `false` | Marks the group invalid without a message. |
| `disabled` | `boolean` | `false` | Disables every option. |
| `required` | `boolean` | `false` | Sets `required` and shows the required mark. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Stacks the options or lays them in a row. |
| `variant` | `'default' \| 'cards' \| 'segmented'` | `'default'` | Plain radios, bordered cards, or joined segments. |
| `name` | `string` | generated | The radios' shared name. |
| `classes` | `Partial<Record<RadioGroupPart, string>>` | -- | Extra classes per part. |
| `onValueChange` | `(value) => void` | -- | Called with the chosen option's value, with its original type. |

```tsx
<RadioGroup label="Plan" variant="cards" options={plans} value={plan} onValueChange={setPlan} />
```

---

## CheckboxGroup

A labeled set of related Checkboxes in a fieldset (`.apui-checkbox-group`) whose value is the array of checked values, with select all (mixed state), columns and cards.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `CheckboxGroupOption[]` | `[]` | Strings, or `{ value, label, description, disabled }` objects. |
| `value` | `(string \| number)[]` | -- | The checked values (controlled). |
| `defaultValue` | `(string \| number)[]` | `[]` | The initially checked values. |
| `label`, `hint`, `error`, `invalid`, `disabled` | | | As in RadioGroup. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | |
| `variant` | `'default' \| 'cards'` | `'default'` | Cards are clickable anywhere. |
| `columns` | `number` | `1` | 1, 2 or 3 columns. |
| `selectAll` | `boolean` | `false` | Adds a select-all Checkbox. |
| `selectAllLabel` | `string` | `'Select all'` | Its label; pass a translation. |
| `name` | `string` | -- | Lands on every checkbox (such as `topics[]`). |
| `onValueChange` | `(values) => void` | -- | Called with the checked values in option order. |

```tsx
<CheckboxGroup label="Notify me about" options={topics} selectAll value={selected} onValueChange={setSelected} />
```

---

## Rating

Shows a star score (`readonly`: one image with a text alternative, half stars) or collects one with native radios (`.apui-rating`). The stars mirror under RTL.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number` | -- | The score (controlled). Read-only, it rounds to the nearest half. |
| `defaultValue` | `number` | -- | The initial score of an uncontrolled input. |
| `max` | `number` | `5` | The number of stars. |
| `readonly` | `boolean` | `false` | Shows the score instead of collecting it. |
| `disabled` | `boolean` | `false` | Disables the radios. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Star size. |
| `count` | `number` | -- | The number of reviews. |
| `label` | `string` | -- | The input's accessible name. |
| `valueLabel` | `string` | `':value out of :max'` | The text alternative and each radio's name; pass a translation. |
| `countLabel` | `string` | `'(:count reviews)'` | The count text, with `:count`. |
| `onValueChange` | `(value: number) => void` | -- | Called with the chosen score. |

```tsx
<Rating readonly value={4.2} count={17} />
<Rating label="Rate the viewing" value={score} onValueChange={setScore} />
```

---

## DatePicker

A text field with a calendar popover for a single date or a range, built on the design system (`.apui-date-picker`, styled by `@artisanpack-ui/css`) and the behavior engine's date-picker machine. With `time` it is DateTime: date and time in one field. Typing a date always works; the calendar is an aid. Values are ISO 8601 strings: `2026-11-12`, `2026-11-12T11:00` with `time`, and an array of two with `mode="range"`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| string[] \| null` | — | The ISO value (controlled). Pair it with `onValueChange` |
| `defaultValue` | `string \| string[] \| null` | — | The initial value when uncontrolled |
| `onValueChange` | `(value: DatePickerValue) => void` | — | A day, a time or typed text changed the value |
| `mode` | `'single' \| 'range'` | `'single'` | One date, or two in one box (`data-mode`) |
| `time` | `boolean` | `false` | Adds a time list beside the month; the value carries the time (`data-time`). Single mode only |
| `step` | `number` | `30` | Minutes between times in the time list (24-hour) |
| `timeZone` | `string` | — | IANA zone, shown under the field in time mode |
| `locale` | `string` | `'en-US'` | Month and weekday names from `Intl`, the first day of the week and the default pattern |
| `min` / `max` | `string` | — | Earliest and latest dates, ISO |
| `disabledDates` | `string[]` | — | Dates that can't be chosen, struck through |
| `weekStartsOn` | `number` | locale | First day of the week, 0 (Sunday) to 6 |
| `format` | `string` | locale | Text pattern with `yyyy`, `MM`, `dd` (`dd.MM.yyyy`) |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control height (`data-size`) |
| `label` / `hint` / `error` | `ReactNode` / `ReactNode` / `string` | — | The field anatomy shared with Input. Show the pattern as the hint |
| `invalid` / `disabled` / `readonly` / `required` | `boolean` | `false` | Field states |
| `placeholder` | `string` | the pattern | `MM/DD/YYYY` by default |
| `name` | `string` | — | Submits the ISO value in a hidden input (`name[]` twice in range mode) |
| `open` / `defaultOpen` / `onOpenChange` | `boolean` / `boolean` / `(open: boolean) => void` | — | The popover's state, controlled or not |
| `portal` | `boolean` | `true` | Renders the popover at the end of the body. Off renders it in place |
| `footer` | `ReactNode` | — | A row under the calendar |
| `triggerLabel` | `string` | `'Choose date'` | The calendar button's name (`'Choose date and time'` with `time`); translate it |
| `previousLabel` / `nextLabel` | `string` | `'Previous month'` / `'Next month'` | The month buttons' names |
| `calendarLabel` / `timeLabel` / `endLabel` | `string` | `'Calendar'` / `'Time'` / `'End date'` | The popover's, the time list's and the end input's names |
| `timeZoneLabel` | `string` | `'Time zone: {zone}'` | The time-zone line |
| `classes` | `Partial<Record<DatePickerPart, string>>` | — | Extra classes per part (`root`, `box`, `trigger`, `control`, `content`, `table`, `tableCellTrigger`, `timeList`, `timeOption`, `footer`, …) |

Other attributes and the ref go to the (first) text input. The month is a `role="grid"`: arrow keys move by day and week and follow the text direction (they swap under RTL), PageUp and PageDown change month, and the month buttons' arrows mirror. The time list is a listbox.

```tsx
import { useState } from 'react';
import { DatePicker, type DatePickerValue } from '@artisanpack-ui/react';

export default function DateTimeExample() {
  const [viewingAt, setViewingAt] = useState<DatePickerValue>(null);

  return (
    <DatePicker
      time
      step={30}
      timeZone="Europe/Madrid"
      label="Viewing"
      value={viewingAt}
      onValueChange={setViewingAt}
    />
  );
}
```

**Migrating from 1.x:** `dateType`, `icon`, `iconRight` and `inline` are gone. `dateType="datetime-local"` is `time`; native `time`, `month` and `week` inputs are plain `<Input type="…">`.

## ColorPicker

A color field (`.apui-color-picker`) on the behavior engine's color-picker machine (`useColorPicker`, Zag). The swatch opens a popover with a saturation and brightness area, hue and opacity sliders, a format select (HEX, RGB, HSL, OKLCH), an eyedropper (only where the browser has the EyeDropper API) and preset swatches. The text value stays in the field, always available for typing in any format. Attributes other than `className` land on the text value.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | -- | The color as text (controlled); reported in the current format. |
| `defaultValue` | `string` | -- | The initial color. |
| `format` | `'hex' \| 'rgb' \| 'hsl' \| 'oklch'` | `'hex'` | The text format; the format select switches it. |
| `alpha` | `boolean` | `true` | Offers opacity; off keeps every value opaque. |
| `swatches` | `string[]` | `[]` | Preset colors, shown in the popover. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control height, matching Input. |
| `label`, `hint`, `error`, `invalid`, `disabled`, `required` | | | The shared field anatomy. |
| `open` / `defaultOpen` | `boolean` | -- | The popover's open state (controlled / initial). |
| `portal` | `boolean` | `true` | Renders the popover at the end of the body. |
| `triggerLabel`, `areaLabel`, `hueLabel`, `alphaLabel`, `formatLabel`, `eyeDropperLabel`, `swatchesLabel` | `string` | English | Built-in accessible names; pass translations. |
| `onValueChange` | `(value: string) => void` | -- | Called with the color as text in the current format. |
| `onOpenChange` | `(open: boolean) => void` | -- | Called when the popover opens or closes itself. |
| `onFormatChange` | `(format) => void` | -- | Called when the format select changes the format. |

The DaisyUI props (`icon`, `iconRight`, `clearable`, `random`, …) are gone.

```tsx
<ColorPicker label="Accent color" format="oklch" swatches={brand} value={accent} onValueChange={setAccent} />
```

---

## File

Uploads files by dropping or browsing (`.apui-file`): the native file input is transparent over the drop zone, and the list shows each file's size, progress and errors with a labelled remove button. `File` shadows the browser global, so import it under another name where you need both: `import { File as FileUpload } from '@artisanpack-ui/react'`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `ReactNode` | -- | The visible label. Without it, the title names the input. |
| `title` | `string` | `'Drop files here or browse'` | The drop zone's main line. |
| `hint` | `ReactNode` | -- | The limits, linked with `aria-describedby`. |
| `error`, `invalid`, `disabled`, `required` | | | The shared field anatomy. |
| `accept` | `string` | -- | The accepted types. |
| `multiple` | `boolean` | `false` | Allows several files. |
| `maxSize` | `number` | -- | Bytes, emitted as `data-max-size`; validate in `onValueChange`. |
| `variant` | `'dropzone' \| 'compact'` | `'dropzone'` | A large drop zone or a compact row. |
| `value` | `(File \| FileEntry)[]` | -- | The files to list; entries take `{ name, size, progress, error }`. |
| `removeLabel` | `string` | `'Remove :name'` | The remove buttons' name. |
| `onValueChange` | `(files) => void` | -- | Called with the chosen files, or the list after a removal. |
| `onRemove` | `(file, index) => void` | -- | Called when a remove button is pressed. |

`withDragDrop`, `dragDropText`, `progress`, `hideProgress` and `onFilesSelected` are gone: the drop zone is always on, and progress is per file.

```tsx
<FileUpload label="Photos" multiple accept="image/*" value={photos} onValueChange={setPhotos} />
```

---

## Password

Password entry in Input's field anatomy (`.apui-password`) with a reveal toggle, an optional strength meter and live requirements. The reveal button keeps one name and toggles `aria-pressed`. Renders the design-system markup contract, styled by `@artisanpack-ui/css`. `className` goes to the root; every other native attribute goes to the native control. `classes` adds classes per part.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Control height. |
| `autocomplete` | `'current-password' \| 'new-password'` | `'current-password'` | Use `new-password` on sign-up and reset forms. |
| `label`, `hint` | `ReactNode` | -- | Visible label and help text. |
| `error` | `string` | -- | Validation message; marks the field invalid. |
| `invalid`, `disabled`, `readonly`, `required` | `boolean` | `false` | States. |
| `value` / `defaultValue` | `string` | -- | Controlled or uncontrolled value. |
| `leadingIcon` | `string` | -- | Icon name before the value, such as `lock`. |
| `strengthMeter` | `boolean` | `false` | Shows the four-segment meter and the level name (Weak, Fair, Good, Strong). |
| `requirements` | `{ label, pattern }[]` | -- | Rules checked as people type; `pattern` is a regular expression source. |
| `revealLabel` | `string` | `'Show password'` | The reveal button's name. |
| `labels` | `Partial<PasswordLabels>` | English | Meter and requirement text: `strength`, `weak`, `fair`, `good`, `strong`, `met`, `unmet`. |
| `onValueChange` | `(value: string) => void` | -- | Called with the new value. |

```tsx
<Password
  label="New password"
  autocomplete="new-password"
  strengthMeter
  requirements={[{ label: 'At least 12 characters', pattern: '.{12,}' }]}
/>
```

---

## Pin

A row of cells for one-time codes (`.apui-pin`). One native input with `autocomplete="one-time-code"` lies over the cells, so SMS autofill and paste fill every cell at once. Renders the design-system markup contract, styled by `@artisanpack-ui/css`. `className` goes to the root; every other native attribute goes to the native control. `classes` adds classes per part.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `length` | `number` | `6` | The number of cells. |
| `type` | `'numeric' \| 'alphanumeric'` | `'numeric'` | The characters allowed; others are dropped as people type or paste. |
| `mask` | `boolean` | `false` | Shows a dot for each character. |
| `groupSize` | `number` | -- | Draws a separator after every `groupSize` cells. |
| `size` | `'sm' \| 'md'` | `'md'` | Cell size. |
| `label`, `hint` | `ReactNode` | -- | Visible label and help text. |
| `error` | `string` | -- | Validation message; marks the code invalid. |
| `invalid`, `disabled`, `required` | `boolean` | `false` | States. |
| `value` / `defaultValue` | `string` | -- | Controlled or uncontrolled code. |
| `onValueChange` | `(value: string) => void` | -- | Called with the new code. |
| `onComplete` | `(value: string) => void` | -- | Called once every cell is filled. |

```tsx
<Pin label="Verification code" groupSize={3} onComplete={verify} />
```

---

## Range

A slider for one value, or two thumbs (`dual`) for a from–to range (`.apui-range`). Each thumb is a native `<input type="range">` over the drawn track, and the fill follows text direction. Renders the design-system markup contract, styled by `@artisanpack-ui/css`. `className` goes to the root; every other native attribute goes to the native control. `classes` adds classes per part.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `min`, `max`, `step` | `number` | `0`, `100`, `1` | The scale. |
| `value` / `defaultValue` | `number \| [number, number]` | midpoint / `[min, max]` | Controlled or uncontrolled value; `[from, to]` with `dual`. |
| `dual` | `boolean` | `false` | Two thumbs that can't cross. |
| `showValue` | `'never' \| 'focus' \| 'always'` | `'focus'` | When the value bubble shows. |
| `format` | `string` | -- | Template for the bubble and `aria-valuetext`, such as `'{value} km'`. |
| `marks` | `{ value, label }[]` | -- | Labels under the track. |
| `color` | the eight colors | `'primary'` | Fill and thumb edge. |
| `size` | `'sm' \| 'md'` | `'md'` | Thumb size. |
| `label`, `hint`, `error` | -- | -- | Field anatomy. |
| `invalid`, `disabled` | `boolean` | `false` | States. |
| `thumbLabels` | `{ start, end }` | `{ start: 'Minimum', end: 'Maximum' }` | With `dual`, the names added to the label for each thumb. |
| `onValueChange` | `(value: RangeValue) => void` | -- | Called with a number, or `[from, to]`. |

```tsx
<Range label="Price" dual min={100} max={700} format="${value}k" value={price} onValueChange={setPrice} />
```

---

## Fieldset

Groups related fields under a native `<legend>` (`.apui-fieldset`), so the group's name is announced with each field. Fields side by side go in `<div data-scope="fieldset" data-part="row">`. Native `<fieldset>` attributes go to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'panel' \| 'divided' \| 'plain'` | `'panel'` | A bordered panel, a section with an edge under it, or no chrome. |
| `title`, `description` | `ReactNode` | -- | The legend. |
| `disabled` | `boolean` | `false` | Disables every control inside. |
| `classes` | `PartClasses` | -- | Extra classes for `root`, `legend`, `title`, `description`. |

```tsx
<Fieldset title="Contact" description="Who buyers should reach.">
  <Input label="Email" type="email" />
</Fieldset>
```

---

## Form

A native `<form>` (`.apui-form`): fields stack with the field gap and an actions row ends it, primary action last. Native attributes (`onSubmit`, `action`, `noValidate`, `aria-label`) go to the root.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `actions` | `ReactNode` | -- | The buttons at the end, aligned to the end. |
| `divided` | `boolean` | `false` | Puts an edge above the actions. |
| `classes` | `PartClasses` | -- | Extra classes for `root` and `actions`. |

```tsx
<Form aria-label="Invite member" onSubmit={save} actions={<Button type="submit">Send invite</Button>}>
  <Input label="Email" type="email" />
</Form>
```

---

## ValidationSummary

Lists every error in a form after a failed submit, each linked to its field (`.apui-validation-summary`). With the error color it is an alert and takes focus when it appears; each link moves focus to the field with that id, else that name. It is not ErrorState.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `errors` | `{ field, message }[] \| Record<string, string \| string[]>` | -- | The errors; renders nothing when empty. |
| `color` | `'error' \| 'warning'` | `'error'` | Error is a focused alert; warning a non-blocking status. |
| `title` | `ReactNode` | `Fix N fields` / `N recommendations` | The heading; translate it here. |
| `classes` | `PartClasses` | -- | Extra classes for `root`, `icon`, `title`, `list`, `item`, `link`. |

```tsx
<ValidationSummary errors={{ email: 'Enter a valid email address.' }} />
```

---

## CodeEditor

Editable code in a native textarea (`.apui-code-editor`): file tabs, a language select, line numbers, the active line, diagnostics listed in text and a status bar. Tab indents; Escape, then Tab, leaves the editor. The code stays left to right in RTL. `className` goes to the root; every other native attribute goes to the textarea, which the ref points at.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `language` | `string` | -- | Shown in the status bar and selected in the language select. |
| `languages` | `(string \| { value, label })[]` | -- | Options for the language select. |
| `tabs` | `(string \| { value, label })[]` | -- | File tabs, a tablist over the code. |
| `tab` | `string` | first tab | The selected tab. |
| `diagnostics` | `{ line, column?, message, severity? }[]` | -- | Marked in the gutter and listed in text. |
| `tabSize` | `number` | `2` | Spaces Tab inserts. |
| `rows` | `number` | `12` | The fewest lines shown; the editor grows with its content. |
| `label`, `hint` | `ReactNode` | -- | Visible label and help text. |
| `error` | `string` | -- | Validation message; marks the field invalid. |
| `invalid`, `disabled`, `readonly`, `required` | `boolean` | `false` | States. |
| `value` / `defaultValue` | `string` | -- | Controlled or uncontrolled code. |
| `tabsLabel`, `languageLabel`, `positionLabel`, `spacesLabel`, `errorCountLabel`, `errorsCountLabel`, `warningCountLabel`, `warningsCountLabel`, `problemsLabel`, `lineLabel`, `severityErrorLabel`, `severityWarningLabel`, `severityInfoLabel`, `instructionsLabel` | `string` | English | Built-in strings; pass translations. Count and position labels take `:count`, `:max`, `:line` and `:column`. |
| `onValueChange`, `onTabChange`, `onLanguageChange` | `(value: string) => void` | -- | Called with the new code, tab or language. |

```tsx
<CodeEditor label="Custom CSS" language="CSS" value={css} onValueChange={setCss} />
```

---

## Editor

> **Deprecated.** Use [CodeEditor](#codeeditor), the design-system replacement. `Editor` is removed in a later major release.

A monospace-styled textarea with label, hint, and error support. Accepts all native `<textarea>` attributes.

---

## RichTextEditor

Formatted text with a toolbar over the shared prose styles (`.apui-rich-text-editor`), on a built-in contentEditable engine. Livewire runs TinyMCE behind the same toolbar; the React editor has no uploads, and Link and Image ask for a URL with the browser prompt. The value is sanitized to the editor's formats (safe URLs only) before it's shown. `className` goes to the root, `name` to a hidden input that carries the value.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `toolbar` | `'default' \| 'compact' \| 'minimal' \| RichTextToolbarItem[]` | `'default'` | A preset or a list of `bold`, `italic`, `underline`, `strike`, `heading2`, `heading3`, `bulletList`, `orderedList`, `quote`, `code`, `link`, `image`, `undo`, `redo` and `'|'`. |
| `output` | `'html' \| 'markdown'` | `'html'` | The format `value` is read and written in. Markdown drops underline. |
| `maxLength` | `number` | -- | Typing stops at the limit; the footer counts against it. |
| `counter` | `boolean` | `false` | Shows the word and character count. |
| `label`, `hint` | `ReactNode` | -- | Visible label and help text. |
| `error` | `string` | -- | Validation message; marks the field invalid. |
| `invalid`, `disabled`, `readonly`, `required` | `boolean` | `false` | States. |
| `placeholder` | `string` | -- | Shown while the content is empty. |
| `value` / `defaultValue` | `string` | -- | Controlled or uncontrolled content. |
| `toolbarLabel`, `boldLabel`, `italicLabel`, `underlineLabel`, `strikeLabel`, `heading2Label`, `heading3Label`, `bulletListLabel`, `orderedListLabel`, `quoteLabel`, `codeLabel`, `linkLabel`, `imageLabel`, `undoLabel`, `redoLabel`, `linkPromptLabel`, `imagePromptLabel`, `imageAltPromptLabel`, `shortcutsLabel`, `wordLabel`, `wordsLabel`, `characterLabel`, `charactersLabel`, `limitLabel` | `string` | English | Built-in strings; pass translations. Count and position labels take `:count`, `:max`, `:line` and `:column`. |
| `onValueChange` | `(value: string) => void` | -- | Called with the content in the output format. |

Keyboard: Mod+B/I/U, Mod+Shift+X (strike), Mod+Shift+7/8 (lists), Mod+K (link); `##`, `###`, `-`, `1.` or `>` then Space at the start of a line. The toolbar has one tab stop; arrow keys follow the text direction.

**Breaking in 2.0:** `toolbar` no longer takes a node and `minHeight` is gone; the toolbar is built in.

```tsx
<RichTextEditor label="Description" counter value={html} onValueChange={setHtml} />
```

---

## Signature

Draw, type or upload a signature (`.apui-signature`). Every mode gives the same value, a PNG data URL; Type is always offered as the keyboard path. `className` goes to the root, `name` to a hidden input that carries the value.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'draw' \| 'type' \| 'upload'` | `'draw'` | The mode shown first. |
| `modes` | `SignatureMode[]` | all | The modes offered; `type` is always added. |
| `penColor` | `'default'` or a semantic color | `'default'` | The ink. |
| `label`, `hint` | `ReactNode` | -- | Visible label and help text (who is signing, the date). |
| `error` | `string` | -- | Validation message; marks the field invalid. |
| `invalid`, `disabled`, `required` | `boolean` | `false` | States. |
| `placeholder` | `string` | `'Sign above the line'` | The text under the line. |
| `value` / `defaultValue` | `string` | -- | Controlled or uncontrolled PNG data URL. |
| `modesLabel`, `drawLabel`, `typeLabel`, `uploadLabel`, `padLabel`, `typedLabel`, `uploadTriggerLabel`, `undoLabel`, `clearLabel`, `clearedLabel` | `string` | English | Built-in strings; pass translations. Count and position labels take `:count`, `:max`, `:line` and `:column`. |
| `onValueChange` | `(value: string) => void` | -- | Called with the data URL, or `''` once cleared. |

```tsx
<Signature label="Signature" hint="Olivia Rhye · Nov 7, 2026" value={signature} onValueChange={setSignature} />
```
