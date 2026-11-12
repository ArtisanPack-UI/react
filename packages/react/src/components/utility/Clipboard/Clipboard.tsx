/**
 * @module Clipboard
 *
 * The design-system Clipboard (#65): copies a value with clear confirmation,
 * rendering the `.apui-clipboard` markup contract styled by
 * `@artisanpack-ui/css`. The copy runs on the behavior package's
 * `useClipboard`, as Code's copy button and the Blade and Vue components do:
 * `navigator.clipboard` with a fallback, "Copied" for the timeout, and the
 * result (or the failure) announced in a live region.
 *
 * @packageDocumentation
 */

import {
  CLIPBOARD_LABELS,
  CLIPBOARD_TIMEOUT,
  clipboardLabel,
  clipboardMessage,
} from '@artisanpack-ui/behavior';
import { useClipboard } from '@artisanpack-ui/behavior/react';
import { forwardRef, type HTMLAttributes } from 'react';

import { IconPart, IconSvg } from '../../../internal/icon';
import { cx, flag, type PartClasses } from '../../../internal/parts';

/** A copy button, an icon button with a tooltip, or a copy field. Emitted as `data-variant`. */
export type ClipboardVariant = 'button' | 'icon' | 'field';

/** The button's size and the field's height. Emitted as `data-size`. */
export type ClipboardSize = 'xs' | 'sm' | 'md';

/** The parts a {@link Clipboard} accepts extra classes for. */
export type ClipboardPart = 'root' | 'button' | 'field' | 'value' | 'tooltip';

/** Props for the {@link Clipboard} component. Native attributes go to the root. */
export interface ClipboardProps extends Omit<HTMLAttributes<HTMLElement>, 'onCopy' | 'onError'> {
  /** What to copy. The field variant shows it. Always give it: it is optional only so the deprecated `text` still type-checks. */
  value?: string;
  /**
   * The 2.x name of `value`; `value` wins.
   *
   * @deprecated Use `value`. Removed in a later major release.
   */
  text?: string;
  /** How long "Copied" shows, in ms. @defaultValue `2000` */
  timeout?: number;
  /** @defaultValue `'button'` */
  variant?: ClipboardVariant;
  /** @defaultValue `'sm'` */
  size?: ClipboardSize;
  /** The button's label; the icon button's accessible name. Translate it. @defaultValue `'Copy'` */
  label?: string;
  /** The label after a copy; translate it. @defaultValue `'Copied'` */
  copiedLabel?: string;
  /** Announced after a copy; translate it. @defaultValue `'Copied to clipboard'` */
  copiedMessage?: string;
  /** Announced when the copy fails; translate it. */
  errorMessage?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<ClipboardPart>;
  /** The value reached the clipboard. */
  onCopy?: (value: string) => void;
  /** The copy failed. */
  onError?: (error: unknown) => void;
}

/**
 * A copy button with a live-region confirmation. The ref points at the root.
 *
 * @example
 * ```tsx
 * <Clipboard value={shareUrl} />
 * <Clipboard value={apiKey} variant="field" size="md" label="Copy API key" />
 * ```
 */
export const Clipboard = forwardRef<HTMLElement, ClipboardProps>(
  (
    {
      value: valueProp,
      text,
      timeout = CLIPBOARD_TIMEOUT,
      variant = 'button',
      size = 'sm',
      label = CLIPBOARD_LABELS.copy,
      copiedLabel = CLIPBOARD_LABELS.copied,
      copiedMessage = CLIPBOARD_LABELS.copiedMessage,
      errorMessage = CLIPBOARD_LABELS.errorMessage,
      classes = {},
      className,
      onCopy,
      onError,
      ...rest
    },
    ref,
  ) => {
    const value = valueProp ?? text ?? '';
    const clipboard = useClipboard({ timeout });
    const shown: ClipboardVariant = variant === 'icon' || variant === 'field' ? variant : 'button';
    const labels = { copy: label, copied: copiedLabel, copiedMessage, errorMessage };
    const buttonLabel = clipboardLabel(clipboard.status, labels);
    const iconOnly = shown === 'icon';
    const Root = shown === 'field' ? 'div' : 'span';

    const copy = async () => {
      const copied = await clipboard.copy(value);
      if (copied) onCopy?.(value);
      else onError?.(new Error('The value could not be copied to the clipboard.'));
    };

    return (
      <Root
        {...rest}
        ref={ref as never}
        className={cx('apui-clipboard', classes.root, className)}
        data-scope="clipboard"
        data-part="root"
        data-variant={shown}
        data-size={size}
        data-state={clipboard.status}
      >
        {shown === 'field' ? (
          <span className={classes.field} data-scope="clipboard" data-part="field">
            <span className={classes.value} data-scope="clipboard" data-part="value">
              {value}
            </span>
          </span>
        ) : null}
        <button
          type="button"
          className={cx('apui-button', classes.button)}
          data-scope="clipboard"
          data-part="button"
          data-variant={iconOnly ? 'ghost' : 'outline'}
          data-color="neutral"
          data-size={size}
          data-state={clipboard.status}
          data-icon-only={flag(iconOnly)}
          aria-label={iconOnly ? buttonLabel : undefined}
          onClick={copy}
        >
          <IconPart
            scope="button"
            part="icon"
            name={clipboard.status === 'copied' ? 'check' : 'copy'}
          />
          {iconOnly ? null : (
            <span data-scope="button" data-part="label">
              {buttonLabel}
            </span>
          )}
        </button>
        <span className={classes.tooltip} data-scope="clipboard" data-part="tooltip" role="status">
          {clipboard.status === 'copied' ? (
            <span aria-hidden="true">
              <IconSvg name="check" />
            </span>
          ) : null}
          {clipboardMessage(clipboard.status, labels)}
        </span>
      </Root>
    );
  },
);

Clipboard.displayName = 'Clipboard';
