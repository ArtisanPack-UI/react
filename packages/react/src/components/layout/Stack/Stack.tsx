/**
 * @module Stack
 *
 * A flexbox layout component for vertical or horizontal stacking with
 * type-safe gap, alignment, and justification props. Maps to Tailwind
 * CSS flex utilities.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/** Allowed gap size values corresponding to Tailwind's spacing scale. */
type GapSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

/** Cross-axis alignment options (maps to Tailwind `items-*`). */
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

/** Main-axis justification options (maps to Tailwind `justify-*`). */
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

/**
 * Props for the {@link Stack} component.
 */
export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Stack direction. @defaultValue `'vertical'` */
  direction?: 'vertical' | 'horizontal';
  /** Gap between items using Tailwind's spacing scale. @defaultValue `2` */
  gap?: GapSize;
  /** Cross-axis alignment of child items (`items-*`). */
  align?: Align;
  /** Main-axis justification of child items (`justify-*`). */
  justify?: Justify;
  /** Allow child items to wrap to the next line. */
  wrap?: boolean;
}

const gapMap: Record<GapSize, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
};

const alignMap: Record<Align, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyMap: Record<Justify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

/**
 * Flexbox layout component for vertical or horizontal stacking.
 *
 * A convenience wrapper around `display: flex` with declarative props
 * for direction, gap, alignment, justification, and wrapping.
 *
 * @example
 * ```tsx
 * <Stack gap={4}>
 *   <div>First</div>
 *   <div>Second</div>
 *   <div>Third</div>
 * </Stack>
 * ```
 *
 * @example
 * ```tsx
 * <Stack direction="horizontal" align="center" justify="between" gap={6}>
 *   <span>Left</span>
 *   <span>Right</span>
 * </Stack>
 * ```
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    { direction = 'vertical', gap = 2, align, justify, wrap = false, className, children, ...rest },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          direction === 'vertical' ? 'flex-col' : 'flex-row',
          gapMap[gap],
          align && alignMap[align],
          justify && justifyMap[justify],
          wrap && 'flex-wrap',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Stack.displayName = 'Stack';
