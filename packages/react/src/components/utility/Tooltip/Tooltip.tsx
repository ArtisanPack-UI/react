/**
 * @module Tooltip
 *
 * Wraps a trigger element with a DaisyUI tooltip that appears on
 * hover and focus. Supports configurable position, color, and forced
 * open state. Proper ARIA attributes (`aria-describedby`, `role="tooltip"`)
 * are applied automatically.
 *
 * @packageDocumentation
 */

import {
  cloneElement,
  createElement,
  forwardRef,
  Fragment,
  isValidElement,
  useId,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Position of the tooltip relative to the trigger element.
 */
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Props for the {@link Tooltip} component.
 */
export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** The text content displayed in the tooltip. */
  tip: string;
  /** Position of the tooltip relative to the trigger. Defaults to `"top"`. */
  position?: TooltipPosition;
  /** DaisyUI color variant for the tooltip background. */
  color?: DaisyColor;
  /** When `true`, the tooltip is always visible regardless of hover/focus state. */
  open?: boolean;
  /** The trigger element. Accepts a single child, a Fragment, or plain text. */
  children: ReactNode;
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
 * Tooltip wrapper that shows contextual information on hover and focus.
 *
 * Wraps the trigger child with a DaisyUI `.tooltip` container and
 * injects `aria-describedby` on the trigger pointing to a hidden
 * `role="tooltip"` element for accessibility.
 *
 * @example
 * ```tsx
 * <Tooltip tip="Delete this item" position="bottom" color="error">
 *   <button>Delete</button>
 * </Tooltip>
 * ```
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ tip, position = 'top', color, open, id, className, children, ...rest }, ref) => {
    const generatedId = useId();
    const tipId = `${id ?? generatedId}-tip`;
    const [visible, setVisible] = useState(false);

    const isOpen = open ?? visible;

    // Wrap Fragments in a focusable span so we can attach event handlers and ARIA
    const trigger: ReactElement<Record<string, unknown>> =
      isValidElement(children) && children.type === Fragment
        ? createElement(
            'span',
            { tabIndex: 0 },
            (children.props as { children?: ReactNode }).children,
          )
        : isValidElement(children)
          ? (children as ReactElement<Record<string, unknown>>)
          : createElement('span', { tabIndex: 0 }, children);

    const triggerProps = trigger.props as Record<string, unknown>;

    const mergeDescribedBy = (existing: unknown): string | undefined => {
      if (!isOpen) {
        return existing ? String(existing) : undefined;
      }
      return existing ? `${existing} ${tipId}` : tipId;
    };

    const wrapHandler = <E,>(show: boolean, originalKey: string) => {
      return (e: E) => {
        setVisible(show);
        if (typeof triggerProps[originalKey] === 'function') {
          (triggerProps[originalKey] as (e: E) => void)(e);
        }
      };
    };

    const child = cloneElement(
      trigger as ReactElement<Record<string, unknown>>,
      {
        'aria-describedby': mergeDescribedBy(triggerProps['aria-describedby']),
        onMouseEnter: wrapHandler<React.MouseEvent>(true, 'onMouseEnter'),
        onMouseLeave: wrapHandler<React.MouseEvent>(false, 'onMouseLeave'),
        onFocus: wrapHandler<React.FocusEvent>(true, 'onFocus'),
        onBlur: wrapHandler<React.FocusEvent>(false, 'onBlur'),
      } as Record<string, unknown>,
    );

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
        {...rest}
        data-tip={tip}
        id={id}
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
