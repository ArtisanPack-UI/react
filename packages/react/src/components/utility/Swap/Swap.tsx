/**
 * @module Swap
 *
 * The design-system Swap (#65): a two-state toggle that swaps its on and off
 * content, such as a sun and a moon. A native checkbox with an accessible
 * name sits over the content, so the platform handles the keyboard and
 * screen readers. It renders the `.apui-swap` markup contract styled by
 * `@artisanpack-ui/css`; no Claude Design spec, token-driven like Grid.
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

import { IconSvg } from '../../../internal/icon';
import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

/** The target size of a {@link Swap}. */
export type SwapSize = 'sm' | 'md' | 'lg';

/** How a {@link Swap} swaps its content. */
export type SwapTransition = 'fade' | 'rotate' | 'none';

/** The parts a {@link Swap} accepts extra classes for. */
export type SwapPart = 'root' | 'control' | 'on' | 'off';

/**
 * Props for the {@link Swap} component.
 *
 * `className` goes to the root; every other native attribute (`name`,
 * `aria-*`, `data-*`, `id`, …) goes to the native checkbox.
 */
export interface SwapProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size' | 'type' | 'checked' | 'defaultChecked'
> {
  /** Whether it's on (controlled). Emitted as `data-state`. */
  checked?: boolean;
  /** The initial state of an uncontrolled swap. @defaultValue `false` */
  defaultChecked?: boolean;
  /** Called with the new state when it turns on or off. */
  onCheckedChange?: (checked: boolean) => void;
  /** The checkbox's accessible name, such as "Dark mode". Not shown. */
  label: string;
  /** The icon shown when on. `on` overrides it. @defaultValue `'sun'` */
  onIcon?: string;
  /** The icon shown when off. `off` overrides it. @defaultValue `'moon'` */
  offIcon?: string;
  /** Content shown when on, in place of `onIcon`. */
  on?: ReactNode;
  /** Content shown when off, in place of `offIcon`. */
  off?: ReactNode;
  /** `fade`, `rotate` or `none`. Reduced motion always swaps at once. @defaultValue `'fade'` */
  transition?: SwapTransition;
  /** The target and icon size. @defaultValue `'md'` */
  size?: SwapSize;
  /** Disables the checkbox. @defaultValue `false` */
  disabled?: boolean;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<SwapPart>;
}

/**
 * A checkbox that swaps two pieces of content.
 *
 * @example
 * ```tsx
 * <Swap label="Dark mode" checked={dark} onCheckedChange={setDark} />
 * ```
 */
export const Swap = forwardRef<HTMLInputElement, SwapProps>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      label,
      onIcon = 'sun',
      offIcon = 'moon',
      on,
      off,
      transition = 'fade',
      size = 'md',
      disabled = false,
      classes = {},
      className,
      onChange,
      ...rest
    },
    ref,
  ) => {
    const [uncontrolledChecked, setUncontrolledChecked] = useState(defaultChecked);
    const isControlled = checked !== undefined;
    const isChecked = isControlled ? checked : uncontrolledChecked;
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    // A form reset restores the checkbox without a change event: put it (and
    // data-state) back to the initial state, or to `checked` when controlled.
    const restored = useRef({ isControlled, checked, defaultChecked });
    useEffect(() => {
      restored.current = { isControlled, checked, defaultChecked };
    });
    useEffect(() => {
      const form = inputRef.current?.form;
      if (!form) return undefined;
      let timer: ReturnType<typeof setTimeout> | undefined;
      const onReset = () => {
        // The reset event fires before the form resets its controls.
        timer = setTimeout(() => {
          const current = restored.current;
          const next = current.isControlled ? Boolean(current.checked) : current.defaultChecked;
          if (!current.isControlled) setUncontrolledChecked(next);
          if (inputRef.current) inputRef.current.checked = next;
        });
      };
      form.addEventListener('reset', onReset);
      return () => {
        form.removeEventListener('reset', onReset);
        if (timer !== undefined) clearTimeout(timer);
      };
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const next = event.target.checked;
      if (!isControlled) setUncontrolledChecked(next);
      onChange?.(event);
      onCheckedChange?.(next);
    };

    return (
      <label
        className={cx('apui-swap', classes.root, className)}
        data-scope="swap"
        data-part="root"
        data-size={size}
        data-transition={transition}
        data-state={isChecked ? 'checked' : 'unchecked'}
        data-disabled={flag(disabled)}
      >
        <input
          {...rest}
          ref={inputRef}
          type="checkbox"
          className={classes.control}
          data-scope="swap"
          data-part="control"
          aria-label={label || undefined}
          checked={isChecked}
          disabled={disabled || undefined}
          onChange={handleChange}
        />
        <span className={classes.on} data-scope="swap" data-part="on" aria-hidden="true">
          {hasContent(on) ? on : <IconSvg name={onIcon} />}
        </span>
        <span className={classes.off} data-scope="swap" data-part="off" aria-hidden="true">
          {hasContent(off) ? off : <IconSvg name={offIcon} />}
        </span>
      </label>
    );
  },
);

Swap.displayName = 'Swap';
