/**
 * @module Stack
 *
 * The design-system Stack (#58), a layout primitive: children in a column
 * or a row, with a gap from the space scale, alignment and optional
 * wrapping. Renders `.apui-stack`, styled by `@artisanpack-ui/css`; no
 * Tailwind needed. A horizontal stack runs in the text direction.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes } from 'react';

import { cx, flag } from '../../../internal/parts';
import type { SpaceStep } from '../Grid/Grid';

/** The stack's axis. */
export type StackOrientation = 'vertical' | 'horizontal';

/** `align-items`. */
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

/** `justify-content`. */
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

/** Props for the {@link Stack} component. Native `<div>` attributes go to the root. */
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** A column or a row. Emitted as `data-orientation`. Replaces 1.x `direction`. @defaultValue `'vertical'` */
  orientation?: StackOrientation;
  /** The gap, a step of the space scale. Emitted as `data-gap`. @defaultValue `'2'` */
  gap?: SpaceStep | number;
  /** Emitted as `data-align`. @defaultValue `'stretch'` */
  align?: StackAlign;
  /** Emitted as `data-justify`. @defaultValue `'start'` */
  justify?: StackJustify;
  /** Lets a row wrap. Emitted as `data-wrap`. */
  wrap?: boolean;
  /**
   * The 1.x name of `orientation`.
   *
   * @deprecated Use `orientation` (vocabulary: one prop for orientation). Removed in a later major release.
   */
  direction?: StackOrientation;
}

/**
 * Lays its children out in a column or a row.
 *
 * @example
 * ```tsx
 * <Stack orientation="horizontal" gap="3" align="center" wrap>…</Stack>
 * ```
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    {
      orientation,
      direction,
      gap = '2',
      align = 'stretch',
      justify = 'start',
      wrap = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => (
    <div
      {...rest}
      ref={ref}
      className={cx('apui-stack', className)}
      data-orientation={orientation ?? direction ?? 'vertical'}
      data-gap={String(gap)}
      data-align={align}
      data-justify={justify}
      data-wrap={flag(wrap)}
    >
      {children}
    </div>
  ),
);

Stack.displayName = 'Stack';
