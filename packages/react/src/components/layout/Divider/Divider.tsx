import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

export type LabelPosition = 'start' | 'center' | 'end';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /** Render as vertical divider */
  vertical?: boolean;
  /** DaisyUI color variant */
  color?: DaisyColor;
  /** Text or content to display in the divider */
  label?: string;
  /** Position of the label */
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
 */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      vertical = false,
      color,
      label,
      labelPosition = 'center',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const hasContent = (label !== undefined && label !== '') || (children != null && children !== false && children !== '');

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
