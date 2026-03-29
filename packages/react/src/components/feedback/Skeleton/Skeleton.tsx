import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Width of the skeleton (CSS value) */
  width?: string;
  /** Height of the skeleton (CSS value) */
  height?: string;
  /** Whether the skeleton is circular */
  circle?: boolean;
}

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
