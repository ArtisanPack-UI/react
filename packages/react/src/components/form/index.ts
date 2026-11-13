/**
 * @module form
 *
 * Form components for the ArtisanPack UI React component library.
 * Button, Input, Select, Checkbox, Textarea, Password, Pin, Range, Toggle,
 * Fieldset, Form and ValidationSummary render the design-system markup contract
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

export {
  CheckboxGroup,
  CHECKBOX_GROUP_DEFAULT_SELECT_ALL_LABEL,
} from './CheckboxGroup/CheckboxGroup';
export type {
  CheckboxGroupProps,
  CheckboxGroupOption,
  CheckboxGroupPart,
} from './CheckboxGroup/CheckboxGroup';

export {
  ColorPicker,
  COLOR_PICKER_DEFAULT_PICKER_LABEL,
  COLOR_PICKER_DEFAULT_SWATCHES_LABEL,
} from './ColorPicker/ColorPicker';
export type {
  ColorPickerProps,
  ColorPickerPart,
  ColorPickerSize,
  ColorTextFormat,
} from './ColorPicker/ColorPicker';

export { DatePicker } from './DatePicker/DatePicker';
export type {
  DatePickerProps,
  DatePickerMode,
  DatePickerPart,
  DatePickerSize,
  DatePickerValue,
} from './DatePicker/DatePicker';

export { CodeEditor } from './CodeEditor/CodeEditor';
export type {
  CodeEditorProps,
  CodeEditorOption,
  CodeEditorPart,
  CodeDiagnostic,
  CodeEditorTranslations,
} from './CodeEditor/CodeEditor';

/** @deprecated Use {@link CodeEditor}. Editor is removed in a later major release. */
export { Editor } from './Editor/Editor';
export type { EditorProps } from './Editor/Editor';

export { File, FILE_DEFAULT_REMOVE_LABEL, FILE_DEFAULT_TITLE, formatFileSize } from './File/File';
export type { FileProps, FileEntry, FileItem, FilePart } from './File/File';

export { Input } from './Input/Input';
export type { InputProps, InputSize, InputPart } from './Input/Input';

export { Password, PASSWORD_LABELS, passwordStrength } from './Password/Password';
export type {
  PasswordProps,
  PasswordSize,
  PasswordPart,
  PasswordRequirement,
  PasswordLabels,
} from './Password/Password';

export { Pin } from './Pin/Pin';
export type { PinProps, PinSize, PinType, PinPart } from './Pin/Pin';

/** @deprecated Use {@link RadioGroup}. Radio is removed in a later major release. */
export { Radio } from './Radio/Radio';
export type { RadioProps, RadioOption } from './Radio/Radio';

export { RadioGroup } from './RadioGroup/RadioGroup';
export type {
  RadioGroupProps,
  RadioGroupOption,
  RadioGroupOrientation,
  RadioGroupPart,
  RadioGroupVariant,
} from './RadioGroup/RadioGroup';

export { Range } from './Range/Range';
export type {
  RangeProps,
  RangeSize,
  RangeColor,
  RangeShowValue,
  RangeValue,
  RangeMark,
  RangePart,
  RangeThumbLabels,
} from './Range/Range';

export { Rating, RATING_DEFAULT_VALUE_LABEL } from './Rating/Rating';
export type { RatingProps, RatingPart, RatingSize } from './Rating/Rating';

export { RichTextEditor } from './RichTextEditor/RichTextEditor';
export type {
  RichTextEditorProps,
  RichTextEditorPart,
  RichTextCommand,
  RichTextOutput,
  RichTextToolbarItem,
  RichTextTranslations,
} from './RichTextEditor/RichTextEditor';

export { Select, SELECT_DEFAULT_PLACEHOLDER } from './Select/Select';
export type {
  SelectProps,
  SelectOption,
  SelectOptionGroup,
  SelectSize,
  SelectPart,
  SelectValue,
} from './Select/Select';

export { Combobox } from './Combobox/Combobox';
export type {
  ComboboxProps,
  ComboboxOption,
  ComboboxValue,
  ComboboxSize,
  ComboboxColor,
  ComboboxPart,
} from './Combobox/Combobox';

export { Signature } from './Signature/Signature';
export type {
  SignatureProps,
  SignatureMode,
  SignaturePart,
  SignaturePenColor,
  SignatureTranslations,
} from './Signature/Signature';

export { Textarea } from './Textarea/Textarea';
export type { TextareaProps, TextareaPart } from './Textarea/Textarea';

export { Toggle } from './Toggle/Toggle';
export type { ToggleProps, ToggleSize, ToggleColor, TogglePart } from './Toggle/Toggle';

export { Fieldset } from './Fieldset/Fieldset';
export type { FieldsetProps, FieldsetVariant, FieldsetPart } from './Fieldset/Fieldset';

export { Form } from './Form/Form';
export type { FormProps, FormPart } from './Form/Form';

export { ValidationSummary } from './ValidationSummary/ValidationSummary';
export type {
  ValidationSummaryProps,
  ValidationSummaryColor,
  ValidationSummaryPart,
  ValidationSummaryError,
  ValidationSummaryErrors,
} from './ValidationSummary/ValidationSummary';

// Icon registry: Button, Input and Select resolve icon names through it.
export {
  isSafeIconBody,
  registerDirectionalIcons,
  registerIcons,
  UnsafeIconError,
} from '@artisanpack-ui/behavior/icons';
export type { IconSet } from '@artisanpack-ui/behavior/icons';
