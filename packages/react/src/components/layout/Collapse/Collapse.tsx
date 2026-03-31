/**
 * @module Collapse
 *
 * An expandable/collapsible content section built on DaisyUI's collapse
 * component. Supports controlled and uncontrolled open state, arrow or
 * plus indicator icons, and radio-input accordion behaviour via the
 * `name` prop. When used inside an {@link Accordion}, state is managed
 * by the parent via the controlled `open` prop.
 *
 * @packageDocumentation
 */

import { forwardRef, useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Collapse} component.
 */
export interface CollapseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Heading content displayed as the clickable trigger. */
  title: ReactNode;
  /** Style of the open/close indicator icon. @defaultValue `'arrow'` */
  icon?: 'arrow' | 'plus' | 'none';
  /** Whether the panel is open (controlled mode). */
  open?: boolean;
  /** Initial open state when used in uncontrolled mode. @defaultValue `false` */
  defaultOpen?: boolean;
  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** HTML `name` attribute — switches to a radio input for one-open-at-a-time grouping. When used inside an Accordion, state is coordinated by the parent via `open` + `onOpenChange`. */
  name?: string;
  /** Add a border around the collapse section. */
  bordered?: boolean;
  /** Disable interaction, preventing the user from toggling the panel. */
  disabled?: boolean;
}

/**
 * Expandable/collapsible content section.
 *
 * Uses a hidden checkbox (or radio input when `name` is set) to drive the
 * DaisyUI collapse behaviour. Provides proper ARIA attributes for
 * accessibility (`aria-expanded`, `aria-controls`, `aria-labelledby`).
 *
 * @example
 * ```tsx
 * <Collapse title="Click to expand">
 *   <p>Hidden content revealed on toggle.</p>
 * </Collapse>
 * ```
 *
 * @example
 * ```tsx
 * // Controlled usage
 * const [open, setOpen] = useState(false);
 * <Collapse title="Details" open={open} onOpenChange={setOpen}>
 *   <p>Controlled panel content.</p>
 * </Collapse>
 * ```
 */
export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(
  (
    {
      title,
      icon = 'arrow',
      open,
      defaultOpen = false,
      onOpenChange,
      name,
      bordered = false,
      disabled = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const iconClass = icon === 'arrow' ? 'collapse-arrow' : icon === 'plus' ? 'collapse-plus' : '';

    const handleToggle = () => {
      if (disabled) return;
      const next = !isOpen;
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'collapse',
          iconClass,
          bordered && 'border-base-300 border',
          isOpen && 'collapse-open',
          !isOpen && 'collapse-close',
          disabled && 'opacity-50',
          className,
        )}
        {...rest}
      >
        {name ? (
          <input
            type="radio"
            name={name}
            checked={isOpen}
            onChange={handleToggle}
            aria-expanded={isOpen}
            aria-controls={`collapse-content-${autoId}`}
            aria-labelledby={`collapse-title-${autoId}`}
            disabled={disabled}
          />
        ) : (
          <input
            type="checkbox"
            checked={isOpen}
            onChange={handleToggle}
            aria-expanded={isOpen}
            aria-controls={`collapse-content-${autoId}`}
            aria-labelledby={`collapse-title-${autoId}`}
            disabled={disabled}
          />
        )}
        <div id={`collapse-title-${autoId}`} className="collapse-title font-semibold">
          {title}
        </div>
        <div className="collapse-content" id={`collapse-content-${autoId}`}>
          {children}
        </div>
      </div>
    );
  },
);

Collapse.displayName = 'Collapse';
