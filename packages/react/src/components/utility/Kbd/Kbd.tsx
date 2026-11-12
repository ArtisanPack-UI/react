/**
 * @module Kbd
 *
 * The design-system Kbd (#65): a keyboard key or shortcut as `kbd`
 * elements, rendering the `.apui-kbd` markup contract styled by
 * `@artisanpack-ui/css`. `keys` uses the behavior package's `kbdKeys`, the
 * same keys Blade and Vue show: `mod` is ⌘ on Apple platforms and Ctrl
 * elsewhere, and symbol keys carry their name as hidden text.
 *
 * @packageDocumentation
 */

import { kbdKeys, type KbdLabels } from '@artisanpack-ui/behavior';
import { useApplePlatform } from '@artisanpack-ui/behavior/react';
import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from 'react';

import { cx, type PartClasses } from '../../../internal/parts';

/** Key cap sizes. Emitted as `data-size`. */
export type KbdSize = 'sm' | 'md';

/** Whose keys to show: measured after mount, or fixed. */
export type KbdPlatform = 'auto' | 'mac' | 'other';

/** The parts a {@link Kbd} accepts extra classes for. */
export type KbdPart = 'root' | 'combo' | 'key';

/** Props for the {@link Kbd} component. Native attributes go to the outer `<kbd>`. */
export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** A shortcut's keys in order, such as `['mod', 'shift', 'p']`. Renders a combo. */
  keys?: string[];
  /** Key cap size. @defaultValue `'md'` */
  size?: KbdSize;
  /** Whose keys to show. @defaultValue `'auto'` */
  platform?: KbdPlatform;
  /** The hidden names of symbol keys, by name (`command`, `enter`, `up`…). Translate them. */
  labels?: KbdLabels;
  /** Extra classes per part; `classes.root` merges with `className` on the outer element. */
  classes?: PartClasses<KbdPart>;
  /** One key, when `keys` is empty. */
  children?: ReactNode;
}

/**
 * A key or a shortcut. The ref points at the outer `<kbd>`: the combo, or the
 * only key.
 *
 * @example
 * ```tsx
 * <Kbd keys={['mod', 'k']} />
 * <Kbd size="sm">Esc</Kbd>
 * ```
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(
  (
    { keys, size = 'md', platform = 'auto', labels, classes = {}, className, children, ...rest },
    ref,
  ) => {
    const apple = useApplePlatform(platform);
    const shown = useMemo(() => kbdKeys(keys, apple, labels), [keys, apple, labels]);

    if (shown.length === 0) {
      return (
        <kbd
          {...rest}
          ref={ref}
          className={cx('apui-kbd', classes.root, classes.key, className)}
          data-scope="kbd"
          data-part="key"
          data-size={size}
        >
          {children}
        </kbd>
      );
    }

    return (
      <kbd
        {...rest}
        ref={ref}
        className={cx('apui-kbd-combo', classes.root, classes.combo, className)}
        data-scope="kbd"
        data-part="combo"
      >
        {shown.map((key, index) => (
          <kbd
            key={index}
            className={cx('apui-kbd', classes.key)}
            data-scope="kbd"
            data-part="key"
            data-size={size}
          >
            {key.label === undefined ? (
              key.text
            ) : (
              <>
                <span aria-hidden="true">{key.text}</span>
                <span className="apui-sr-only">{key.label}</span>
              </>
            )}
          </kbd>
        ))}
      </kbd>
    );
  },
);

Kbd.displayName = 'Kbd';
