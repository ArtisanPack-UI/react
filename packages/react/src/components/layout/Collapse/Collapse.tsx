import {
  forwardRef,
  useId,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface CollapseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Heading content for the collapse trigger */
  title: ReactNode;
  /** Icon style for the collapse indicator */
  icon?: 'arrow' | 'plus' | 'none';
  /** Whether the collapse is open (controlled) */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Name attribute for radio-group accordion behavior */
  name?: string;
  /** Add bottom border */
  bordered?: boolean;
  /** Disable interaction */
  disabled?: boolean;
}

/**
 * Expandable/collapsible content section.
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

    const iconClass =
      icon === 'arrow'
        ? 'collapse-arrow'
        : icon === 'plus'
          ? 'collapse-plus'
          : '';

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
        <div id={`collapse-title-${autoId}`} className="collapse-title font-semibold">{title}</div>
        <div className="collapse-content" id={`collapse-content-${autoId}`}>
          {children}
        </div>
      </div>
    );
  },
);

Collapse.displayName = 'Collapse';
