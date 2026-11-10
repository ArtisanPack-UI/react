/**
 * @module form
 *
 * Form components for the ArtisanPack UI React component library.
 * Button, Input, Select and Checkbox render the design-system markup contract
 * (styled by `@artisanpack-ui/css`); the other controls are still built on DaisyUI.
 *
 * @example
 * ```tsx
 * import { Button, Input, Select, Toggle } from '@artisanpack-ui/react';
 * ```
 */

// Form components
export { Button } from './Button/Button';
export type {
  ButtonProps,
  ButtonVariant,
  ButtonColor,
  ButtonSize,
  ButtonPart,
} from './Button/Button';

export { Checkbox } from './Checkbox/Checkbox';
export type { CheckboxProps, CheckboxPart } from './Checkbox/Checkbox';

export { ColorPicker } from './ColorPicker/ColorPicker';
export type { ColorPickerProps } from './ColorPicker/ColorPicker';

export { DatePicker } from './DatePicker/DatePicker';
export type { DatePickerProps } from './DatePicker/DatePicker';

export { Editor } from './Editor/Editor';
export type { EditorProps } from './Editor/Editor';

export { File } from './File/File';
export type { FileProps } from './File/File';

export { Input } from './Input/Input';
export type { InputProps, InputSize, InputPart } from './Input/Input';

export { Password } from './Password/Password';
export type { PasswordProps } from './Password/Password';

export { Pin } from './Pin/Pin';
export type { PinProps } from './Pin/Pin';

export { Radio } from './Radio/Radio';
export type { RadioProps, RadioOption } from './Radio/Radio';

export { Range } from './Range/Range';
export type { RangeProps } from './Range/Range';

export { RichTextEditor } from './RichTextEditor/RichTextEditor';
export type { RichTextEditorProps } from './RichTextEditor/RichTextEditor';

export { Select, SELECT_DEFAULT_PLACEHOLDER } from './Select/Select';
export type {
  SelectProps,
  SelectOption,
  SelectSize,
  SelectPart,
  SelectValue,
} from './Select/Select';

export { Textarea } from './Textarea/Textarea';
export type { TextareaProps } from './Textarea/Textarea';

export { Toggle } from './Toggle/Toggle';
export type { ToggleProps } from './Toggle/Toggle';

// Icon registry: Button, Input and Select resolve icon names through it.
export { isSafeIconBody, registerIcons, UnsafeIconError } from '@artisanpack-ui/behavior/icons';
export type { IconSet } from '@artisanpack-ui/behavior/icons';
