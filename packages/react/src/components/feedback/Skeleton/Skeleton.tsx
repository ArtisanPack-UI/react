/**
 * @module Skeleton
 *
 * The design-system Skeleton (#60): a placeholder shape (`.apui-skeleton`)
 * that matches the layout while content loads. Skeletons are hidden from
 * assistive technology; the container that is loading sets `aria-busy`.
 *
 * @packageDocumentation
 */

import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

import { cx } from '../../../internal/parts';

/** The shape of a {@link Skeleton}. */
export type SkeletonShape = 'block' | 'text' | 'circle';

/** Props for the {@link Skeleton} component. Native `<span>` attributes go to the root. */
export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  /** A block, a line of text or a circle. @defaultValue `'block'` */
  shape?: SkeletonShape;
  /** A CSS length, or a number of px. */
  width?: string | number;
  /** A CSS length, or a number of px. A text line keeps its own height unless set. */
  height?: string | number;
}

const length = (value: string | number | undefined) =>
  typeof value === 'number' ? `${value}px` : value;

/**
 * A placeholder shape. The ref points at the root.
 *
 * @example
 * ```tsx
 * <Skeleton shape="text" width="80%" />
 * ```
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(
  ({ shape = 'block', width, height, className, style, ...rest }, ref) => {
    const size: CSSProperties = {};
    if (width !== undefined && width !== '') size.width = length(width);
    if (height !== undefined && height !== '') size.height = length(height);
    return (
      <span
        {...rest}
        ref={ref}
        className={cx('apui-skeleton', className)}
        data-scope="skeleton"
        data-part="root"
        data-shape={shape}
        aria-hidden="true"
        style={{ ...size, ...style }}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';
