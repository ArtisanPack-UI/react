/**
 * @module Skeleton
 *
 * A placeholder loading animation used to indicate that content is being
 * loaded. Renders a pulsing rectangle (or circle) at the specified
 * dimensions, replacing actual content until it is ready.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Skeleton} component.
 */
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Width of the skeleton as a CSS value (e.g. `"200px"`, `"100%"`). */
  width?: string;
  /** Height of the skeleton as a CSS value (e.g. `"1rem"`, `"40px"`). */
  height?: string;
  /** When `true`, renders the skeleton as a circle. If only one of `width`/`height` is set, it is used for both dimensions. When both are set, each is applied independently. */
  circle?: boolean;
}

/**
 * Skeleton placeholder for content that is still loading.
 *
 * The element is hidden from assistive technologies via `aria-hidden` by default.
 * This can be overridden by passing `aria-hidden={false}` through props.
 *
 * @example
 * ```tsx
 * // Rectangular skeleton for a text block
 * <Skeleton width="100%" height="1rem" />
 *
 * // Circular skeleton for an avatar
 * <Skeleton circle width="48px" />
 * ```
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ width, height, circle = false, className, style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn('skeleton', circle && 'rounded-full', className)}
        style={{
          width: circle ? (width ?? height) : width,
          height: circle ? (height ?? width) : height,
          ...style,
        }}
        {...rest}
      />
    );
  },
);

Skeleton.displayName = 'Skeleton';
