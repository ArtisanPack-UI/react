/**
 * @module Grid
 *
 * A CSS Grid layout wrapper with type-safe responsive column counts (1--12)
 * and gap sizing. Maps props to Tailwind CSS `grid-cols-*` and `gap-*`
 * utility classes with breakpoint variants.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/** Allowed column count values (1 through 12, matching Tailwind's grid-cols). */
export type ColCount = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

/** Allowed gap size values corresponding to Tailwind's spacing scale. */
export type GapSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;

/**
 * Props for the {@link Grid} component.
 */
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** Base number of columns (applies at all screen sizes). */
  cols?: ColCount;
  /** Number of columns at the `sm` breakpoint. */
  colsSm?: ColCount;
  /** Number of columns at the `md` breakpoint. */
  colsMd?: ColCount;
  /** Number of columns at the `lg` breakpoint. */
  colsLg?: ColCount;
  /** Number of columns at the `xl` breakpoint. */
  colsXl?: ColCount;
  /** Uniform gap between grid items. Overridden by `gapX`/`gapY` when specified. @defaultValue `4` */
  gap?: GapSize;
  /** Column (horizontal) gap. Overrides `gap` for the x-axis. */
  gapX?: GapSize;
  /** Row (vertical) gap. Overrides `gap` for the y-axis. */
  gapY?: GapSize;
}

const colsMap: Record<ColCount, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
};

const smColsMap: Record<ColCount, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-4',
  5: 'sm:grid-cols-5',
  6: 'sm:grid-cols-6',
  7: 'sm:grid-cols-7',
  8: 'sm:grid-cols-8',
  9: 'sm:grid-cols-9',
  10: 'sm:grid-cols-10',
  11: 'sm:grid-cols-11',
  12: 'sm:grid-cols-12',
};

const mdColsMap: Record<ColCount, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  7: 'md:grid-cols-7',
  8: 'md:grid-cols-8',
  9: 'md:grid-cols-9',
  10: 'md:grid-cols-10',
  11: 'md:grid-cols-11',
  12: 'md:grid-cols-12',
};

const lgColsMap: Record<ColCount, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  8: 'lg:grid-cols-8',
  9: 'lg:grid-cols-9',
  10: 'lg:grid-cols-10',
  11: 'lg:grid-cols-11',
  12: 'lg:grid-cols-12',
};

const xlColsMap: Record<ColCount, string> = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
  7: 'xl:grid-cols-7',
  8: 'xl:grid-cols-8',
  9: 'xl:grid-cols-9',
  10: 'xl:grid-cols-10',
  11: 'xl:grid-cols-11',
  12: 'xl:grid-cols-12',
};

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

const gapXMap: Record<GapSize, string> = {
  0: 'gap-x-0',
  1: 'gap-x-1',
  2: 'gap-x-2',
  3: 'gap-x-3',
  4: 'gap-x-4',
  5: 'gap-x-5',
  6: 'gap-x-6',
  8: 'gap-x-8',
  10: 'gap-x-10',
  12: 'gap-x-12',
  16: 'gap-x-16',
};

const gapYMap: Record<GapSize, string> = {
  0: 'gap-y-0',
  1: 'gap-y-1',
  2: 'gap-y-2',
  3: 'gap-y-3',
  4: 'gap-y-4',
  5: 'gap-y-5',
  6: 'gap-y-6',
  8: 'gap-y-8',
  10: 'gap-y-10',
  12: 'gap-y-12',
  16: 'gap-y-16',
};

/**
 * CSS Grid layout wrapper with responsive column support.
 *
 * Provides a declarative API for Tailwind's CSS Grid utilities. Column
 * counts can be set per breakpoint, and gap sizes support independent
 * x/y overrides.
 *
 * @example
 * ```tsx
 * <Grid cols={1} colsMd={2} colsLg={3} gap={6}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 * ```
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    { cols, colsSm, colsMd, colsLg, colsXl, gap = 4, gapX, gapY, className, children, ...rest },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'grid',
          cols && colsMap[cols],
          colsSm && smColsMap[colsSm],
          colsMd && mdColsMap[colsMd],
          colsLg && lgColsMap[colsLg],
          colsXl && xlColsMap[colsXl],
          gapX !== undefined ? gapXMap[gapX] : undefined,
          gapY !== undefined ? gapYMap[gapY] : undefined,
          gapX === undefined && gapY === undefined ? gapMap[gap] : undefined,
          gapX !== undefined && gapY === undefined ? gapYMap[gap] : undefined,
          gapY !== undefined && gapX === undefined ? gapXMap[gap] : undefined,
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Grid.displayName = 'Grid';
