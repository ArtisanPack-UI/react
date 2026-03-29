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
  ({ tip, position = 'top', color, open, id, className, children, ...rest }, ref) => {
    const generatedId = useId();
    const tipId = `${id ?? generatedId}-tip`;
    const [visible, setVisible] = useState(false);

    const isOpen = open ?? visible;

    const childProps = isValidElement(children)
      ? (children as ReactElement<Record<string, unknown>>).props
      : null;

    const mergeDescribedBy = (existing: unknown): string | undefined => {
      if (!isOpen) {
        return existing ? String(existing) : undefined;
      }
      return existing ? `${existing} ${tipId}` : tipId;
    };

    const wrapHandler = <E,>(show: boolean, originalKey: string) => {
      return (e: E) => {
        setVisible(show);
        if (childProps && typeof childProps[originalKey] === 'function') {
          (childProps[originalKey] as (e: E) => void)(e);
        }
      };
    };

    const child = isValidElement(children)
      ? cloneElement(children as ReactElement<Record<string, unknown>>, {
          'aria-describedby': mergeDescribedBy(childProps?.['aria-describedby']),
          onMouseEnter: wrapHandler<React.MouseEvent>(true, 'onMouseEnter'),
          onMouseLeave: wrapHandler<React.MouseEvent>(false, 'onMouseLeave'),
          onFocus: wrapHandler<React.FocusEvent>(true, 'onFocus'),
          onBlur: wrapHandler<React.FocusEvent>(false, 'onBlur'),
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
        id={id}
        {...rest}
      >
        {child}
        <span id={tipId} role="tooltip" className="sr-only" aria-hidden={!isOpen}>
          {tip}
        </span>
      </div>
    );
  },
);

Tooltip.displayName = 'Tooltip';
