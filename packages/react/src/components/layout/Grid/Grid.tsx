/**
 * @module Grid
 *
 * The design-system Grid (#58), a layout primitive: children in equal
 * columns with a gap from the space scale. With `minItemWidth` the columns
 * drop rather than narrowing past it, down to one. Renders `.apui-grid`,
 * styled by `@artisanpack-ui/css`; no Tailwind needed.
 *
 * @packageDocumentation
 */

import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

import { cx } from '../../../internal/parts';

/** A step of the space scale. */
export type SpaceStep = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '8' | '10' | '12' | '16';

/** How items sit in their cell. */
export type GridAlign = 'start' | 'center' | 'end' | 'stretch';

/** Props for the {@link Grid} component. Native `<div>` attributes go to the root. */
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  /** The number of columns, 1 to 12; the most there are with `minItemWidth`. Emitted as `data-columns`. @defaultValue `1` */
  columns?: number;
  /** The narrowest a column may get, any CSS length (`16rem`). Sets `--apui-grid-min-item-width`. */
  minItemWidth?: string;
  /** The gap, a step of the space scale. Emitted as `data-gap`. @defaultValue `'4'` */
  gap?: SpaceStep | number;
  /** `align-items`. Emitted as `data-align`. @defaultValue `'stretch'` */
  align?: GridAlign;
  /** `justify-items`, following the text direction. Emitted as `data-justify`. @defaultValue `'stretch'` */
  justify?: GridAlign;
}

/** A column count clamped to 1–12. */
const clampColumns = (columns: number) =>
  Math.min(12, Math.max(1, Math.round(Number(columns) || 1)));

/**
 * Lays its children out in equal columns.
 *
 * @example
 * ```tsx
 * <Grid columns={4} minItemWidth="14rem" gap="6">…</Grid>
 * ```
 */
export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      columns = 1,
      minItemWidth,
      gap = '4',
      align = 'stretch',
      justify = 'stretch',
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => (
    <div
      {...rest}
      ref={ref}
      className={cx('apui-grid', className)}
      data-columns={String(clampColumns(columns))}
      data-gap={String(gap)}
      data-align={align}
      data-justify={justify}
      style={
        minItemWidth
          ? ({ ...style, '--apui-grid-min-item-width': minItemWidth } as CSSProperties)
          : style
      }
    >
      {children}
    </div>
  ),
);

Grid.displayName = 'Grid';
