/**
 * @module ColorPicker
 *
 * The design-system ColorPicker (#53): a color field whose swatch opens a
 * popover with a saturation and brightness area, hue and opacity sliders, a
 * format select (HEX, RGB, HSL, OKLCH), an eyedropper and preset swatches.
 * The text value stays in the field, always available for typing. It runs
 * on the behavior engine's color-picker machine (`useColorPicker`) and
 * renders the `.apui-color-picker` markup contract styled by
 * `@artisanpack-ui/css`.
 *
 * @packageDocumentation
 */

import {
  COLOR_FORMATS,
  type ColorTextFormat,
  useColorPicker,
} from '@artisanpack-ui/behavior/react';
import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

import { FieldError, FieldHelp, FieldLabel, useFieldIds } from '../../../internal/field';
import { IconSvg } from '../../../internal/icon';
import { mergePartProps } from '../../../internal/merge';
import { cx, flag, type PartClasses } from '../../../internal/parts';
import { Portal } from '../../../internal/portal';

export type { ColorTextFormat };

/** The parts a {@link ColorPicker} accepts extra classes for. */
export type ColorPickerPart =
  | 'root'
  | 'label'
  | 'required'
  | 'box'
  | 'trigger'
  | 'swatch'
  | 'control'
  | 'hint'
  | 'error'
  | 'positioner'
  | 'content'
  | 'area'
  | 'areaBackground'
  | 'areaThumb'
  | 'channelSlider'
  | 'channelSliderTrack'
  | 'channelSliderThumb'
  | 'transparencyGrid'
  | 'row'
  | 'formatSelect'
  | 'eyeDropperTrigger'
  | 'swatchGroup'
  | 'swatchTrigger';

/** Control height of a {@link ColorPicker}. */
export type ColorPickerSize = 'sm' | 'md' | 'lg';

/** The default picker label. Pass `triggerLabel` to translate it. */
export const COLOR_PICKER_DEFAULT_PICKER_LABEL = 'Choose a color';

/** The default swatch group label. Pass `swatchesLabel` to translate it. */
export const COLOR_PICKER_DEFAULT_SWATCHES_LABEL = 'Swatches';

/** What the format select shows for each format. */
const FORMAT_NAMES: Record<ColorTextFormat, string> = {
  hex: 'HEX',
  rgb: 'RGB',
  hsl: 'HSL',
  oklch: 'OKLCH',
};

/**
 * Props for the {@link ColorPicker} component.
 *
 * `className` goes to the root; every other native attribute (`name`,
 * `aria-*`, `autoComplete`, …) goes to the text input.
 */
export interface ColorPickerProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'value' | 'defaultValue' | 'onChange'
> {
  /** The color as text in any format (controlled); reported in the current format. */
  value?: string;
  /** The initial color of an uncontrolled picker. */
  defaultValue?: string;
  /** The text format. The format select switches it. @defaultValue `'hex'` */
  format?: ColorTextFormat;
  /** Offers opacity. Off keeps every value opaque. @defaultValue `true` */
  alpha?: boolean;
  /** Preset colors as text, shown in the popover. */
  swatches?: string[];
  /** Control height. @defaultValue `'md'` */
  size?: ColorPickerSize;
  /** The visible label, linked to the text value. */
  label?: ReactNode;
  /** Help text under the field, linked with `aria-describedby`. */
  hint?: ReactNode;
  /** Validation message. Marks the field invalid and is linked with `aria-describedby`. */
  error?: string;
  /** Marks the field invalid without a message. @defaultValue `false` */
  invalid?: boolean;
  /** Disables the field and the popover's controls. @defaultValue `false` */
  disabled?: boolean;
  /** Marks the field required and shows the required mark. @defaultValue `false` */
  required?: boolean;
  /** Whether the popover is open (controlled). */
  open?: boolean;
  /** The initial state of an uncontrolled popover. */
  defaultOpen?: boolean;
  /** Renders the popover at the end of the body. @defaultValue `true` */
  portal?: boolean;
  /** The swatch button's and the popover's name. @defaultValue `'Choose a color'` */
  triggerLabel?: string;
  /** The area's name. @defaultValue `'Saturation and brightness'` */
  areaLabel?: string;
  /** The hue slider's name. @defaultValue `'Hue'` */
  hueLabel?: string;
  /** The opacity slider's name. @defaultValue `'Opacity'` */
  alphaLabel?: string;
  /** The format select's name. @defaultValue `'Format'` */
  formatLabel?: string;
  /** The eyedropper's name. @defaultValue `'Pick a color from the screen'` */
  eyeDropperLabel?: string;
  /** The preset group's name. @defaultValue `'Swatches'` */
  swatchesLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<ColorPickerPart>;
  /** Called with the color as text in the current format. */
  onValueChange?: (value: string) => void;
  /** Called when the popover opens or closes itself. */
  onOpenChange?: (open: boolean) => void;
  /** Called when the format select changes the format. */
  onFormatChange?: (format: ColorTextFormat) => void;
}

/**
 * A color field with a picker popover. Controlled (`value` +
 * `onValueChange`) or uncontrolled (`defaultValue`). The ref points at the
 * text input.
 *
 * @example
 * ```tsx
 * <ColorPicker label="Accent color" swatches={brand} value={accent} onValueChange={setAccent} />
 * ```
 */
export const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>(
  (
    {
      value,
      defaultValue,
      format = 'hex',
      alpha = true,
      swatches = [],
      size = 'md',
      label,
      hint,
      error,
      invalid = false,
      disabled = false,
      required = false,
      open,
      defaultOpen,
      portal = true,
      triggerLabel = COLOR_PICKER_DEFAULT_PICKER_LABEL,
      areaLabel = 'Saturation and brightness',
      hueLabel = 'Hue',
      alphaLabel = 'Opacity',
      formatLabel = 'Format',
      eyeDropperLabel = 'Pick a color from the screen',
      swatchesLabel = COLOR_PICKER_DEFAULT_SWATCHES_LABEL,
      classes = {},
      className,
      id: explicitId,
      onValueChange,
      onOpenChange,
      onFormatChange,
      'aria-describedby': callerDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const isInvalid = invalid || Boolean(error);
    const { id, helpId, errorId, describedBy } = useFieldIds(
      explicitId,
      { suffix: 'hint', content: hint },
      error,
      callerDescribedBy,
    );

    const api = useColorPicker({
      id,
      ids: {
        root: `${id}-root`,
        label: `${id}-label`,
        control: `${id}-box`,
        trigger: `${id}-trigger`,
        positioner: `${id}-positioner`,
        content: `${id}-content`,
        area: `${id}-area`,
        areaThumb: `${id}-area-thumb`,
        channelSliderTrack: (channel) => `${id}-${channel}-track`,
        channelSliderThumb: (channel) => `${id}-${channel}-thumb`,
      },
      value,
      defaultValue,
      onValueChange: (details) => onValueChange?.(details.value),
      open,
      defaultOpen,
      onOpenChange: (details) => onOpenChange?.(details.open),
      format,
      onFormatChange: (details) => onFormatChange?.(details.format),
      alpha,
      disabled,
      required,
      invalid: isInvalid,
      labels: {
        trigger: triggerLabel,
        area: areaLabel,
        hue: hueLabel,
        alpha: alphaLabel,
        format: formatLabel,
        eyeDropper: eyeDropperLabel,
        swatches: swatchesLabel,
      },
    });

    return (
      <div
        {...api.getRootProps()}
        className={cx('apui-color-picker', classes.root, className)}
        data-size={size}
        data-format={api.textFormat}
        data-invalid={flag(isInvalid)}
        data-disabled={flag(disabled)}
      >
        <FieldLabel
          scope="color-picker"
          htmlFor={id}
          label={label}
          required={required}
          className={classes.label}
          requiredClassName={classes.required}
        />
        <div {...api.getControlProps()} className={classes.box}>
          <button {...api.getTriggerProps()} className={classes.trigger}>
            <span {...api.getSwatchProps({ value: api.value })} className={classes.swatch} />
          </button>
          <input
            {...mergePartProps(rest, api.getValueInputProps({ id }))}
            ref={ref}
            className={classes.control}
            aria-describedby={describedBy}
          />
        </div>
        <FieldHelp scope="color-picker" part="hint" id={helpId} className={classes.hint}>
          {hint}
        </FieldHelp>
        <FieldError scope="color-picker" id={errorId} message={error} className={classes.error} />
        <Portal enabled={portal}>
          <div {...api.getPositionerProps()} className={classes.positioner}>
            <div {...api.getContentProps()} className={classes.content}>
              <div {...api.getAreaProps()} className={classes.area}>
                <div {...api.getAreaBackgroundProps()} className={classes.areaBackground} />
                <div {...api.getAreaThumbProps()} className={classes.areaThumb} />
              </div>
              <div
                {...api.getChannelSliderProps({ channel: 'hue' })}
                className={classes.channelSlider}
              >
                <div
                  {...api.getChannelSliderTrackProps({ channel: 'hue' })}
                  className={classes.channelSliderTrack}
                >
                  <div
                    {...api.getChannelSliderThumbProps({ channel: 'hue' })}
                    className={classes.channelSliderThumb}
                  />
                </div>
              </div>
              {alpha ? (
                <div
                  {...api.getChannelSliderProps({ channel: 'alpha' })}
                  className={classes.channelSlider}
                >
                  <div {...api.getTransparencyGridProps()} className={classes.transparencyGrid} />
                  <div
                    {...api.getChannelSliderTrackProps({ channel: 'alpha' })}
                    className={classes.channelSliderTrack}
                  >
                    <div
                      {...api.getChannelSliderThumbProps({ channel: 'alpha' })}
                      className={classes.channelSliderThumb}
                    />
                  </div>
                </div>
              ) : null}
              <div {...api.getRowProps()} className={classes.row}>
                <select
                  {...api.getFormatSelectProps({ id: `${id}-format` })}
                  className={classes.formatSelect}
                >
                  {COLOR_FORMATS.map((option) => (
                    <option key={option} value={option}>
                      {FORMAT_NAMES[option]}
                    </option>
                  ))}
                </select>
                <button {...api.getEyeDropperTriggerProps()} className={classes.eyeDropperTrigger}>
                  <IconSvg name="pipette" />
                </button>
              </div>
              {swatches.length > 0 ? (
                <div {...api.getSwatchGroupProps()} className={classes.swatchGroup}>
                  {swatches.map((swatch) => (
                    <button
                      key={swatch}
                      {...api.getSwatchTriggerProps({ value: swatch })}
                      className={classes.swatchTrigger}
                    >
                      <span {...api.getSwatchProps({ value: swatch })} className={classes.swatch} />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </Portal>
      </div>
    );
  },
);

ColorPicker.displayName = 'ColorPicker';
