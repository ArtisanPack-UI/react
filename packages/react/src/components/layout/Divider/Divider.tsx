/**
 * @module Divider
 *
 * A visual separator for content sections, supporting horizontal and vertical
 * orientations, DaisyUI color variants, and an optional inline label.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

/** Allowed positions for the divider label text. */
export type LabelPosition = 'start' | 'center' | 'end';

/**
 * Props for the {@link Divider} component.
 */
export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Render as a vertical divider instead of horizontal. */
  vertical?: boolean;
  /** DaisyUI color variant applied to the divider line. */
  color?: DaisyColor;
  /** Text to display inline within the divider. */
  label?: string;
  /** Position of the label along the divider. @defaultValue `'center'` */
  labelPosition?: LabelPosition;
}

const colorMap: Record<DaisyColor, string> = {
  primary: 'divider-primary',
  secondary: 'divider-secondary',
  accent: 'divider-accent',
  success: 'divider-success',
  warning: 'divider-warning',
  error: 'divider-error',
  info: 'divider-info',
  neutral: 'divider-neutral',
};

const positionMap: Record<LabelPosition, string> = {
  start: 'divider-start',
  center: '',
  end: 'divider-end',
};

/**
 * Visual separator for content sections with optional label.
 *
 * Renders a DaisyUI `divider` element with `role="separator"` and proper
 * `aria-orientation`. Pass `label` or `children` to display inline text.
 *
 * @example
 * ```tsx
 * <Divider />
 * ```
 *
 * @example
 * ```tsx
 * <Divider label="OR" color="primary" />
 * ```
 *
 * @example
 * ```tsx
 * <Divider vertical />
 * ```
 */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    { vertical = false, color, label, labelPosition = 'center', className, children, ...rest },
    ref,
  ) => {
    const hasContent =
      (label !== undefined && label !== '') ||
      (children != null && children !== false && children !== '');

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
        className={cn(
          'divider',
          vertical && 'divider-vertical',
          color && colorMap[color],
          hasContent && positionMap[labelPosition],
          className,
        )}
        {...rest}
      >
        {label ?? children}
      </div>
    );
  },
);

Divider.displayName = 'Divider';
