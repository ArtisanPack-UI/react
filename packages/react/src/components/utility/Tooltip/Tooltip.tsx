import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  useState,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** Tooltip text */
  tip: string;
  /** Position of the tooltip */
  position?: TooltipPosition;
  /** Color variant */
  color?: DaisyColor;
  /** Whether the tooltip is always open */
  open?: boolean;
  /** The trigger element (single child) */
  children: ReactElement;
}

const colorMap: Record<DaisyColor, string> = {
  primary: 'tooltip-primary',
  secondary: 'tooltip-secondary',
  accent: 'tooltip-accent',
  success: 'tooltip-success',
  warning: 'tooltip-warning',
  error: 'tooltip-error',
  info: 'tooltip-info',
  neutral: 'tooltip-neutral',
};

const positionMap: Record<TooltipPosition, string> = {
  top: 'tooltip-top',
  bottom: 'tooltip-bottom',
  left: 'tooltip-left',
  right: 'tooltip-right',
};

/**
 * Tooltip wrapper that shows contextual information on hover/focus.
 * Uses DaisyUI's tooltip component with proper ARIA attributes.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ tip, position = 'top', color, open, className, children, ...rest }, ref) => {
    const tooltipId = useId();
    const [visible, setVisible] = useState(false);

    const isOpen = open ?? visible;

    const child = isValidElement(children)
      ? cloneElement(children as ReactElement<Record<string, unknown>>, {
          'aria-describedby': isOpen ? tooltipId : undefined,
          onMouseEnter: (e: React.MouseEvent) => {
            setVisible(true);
            const childProps = (children as ReactElement<Record<string, unknown>>).props;
            if (typeof childProps.onMouseEnter === 'function') {
              (childProps.onMouseEnter as (e: React.MouseEvent) => void)(e);
            }
          },
          onMouseLeave: (e: React.MouseEvent) => {
            setVisible(false);
            const childProps = (children as ReactElement<Record<string, unknown>>).props;
            if (typeof childProps.onMouseLeave === 'function') {
              (childProps.onMouseLeave as (e: React.MouseEvent) => void)(e);
            }
          },
          onFocus: (e: React.FocusEvent) => {
            setVisible(true);
            const childProps = (children as ReactElement<Record<string, unknown>>).props;
            if (typeof childProps.onFocus === 'function') {
              (childProps.onFocus as (e: React.FocusEvent) => void)(e);
            }
          },
          onBlur: (e: React.FocusEvent) => {
            setVisible(false);
            const childProps = (children as ReactElement<Record<string, unknown>>).props;
            if (typeof childProps.onBlur === 'function') {
              (childProps.onBlur as (e: React.FocusEvent) => void)(e);
            }
          },
        })
      : children;

    return (
      <div
        ref={ref}
        className={cn(
          'tooltip',
          positionMap[position],
          color && colorMap[color],
          isOpen && 'tooltip-open',
          className,
        )}
        data-tip={tip}
        role="tooltip"
        id={tooltipId}
        {...rest}
      >
        {child}
      </div>
    );
  },
);

Tooltip.displayName = 'Tooltip';
