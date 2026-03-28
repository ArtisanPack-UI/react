import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactNode,
  type ReactElement,
  type KeyboardEvent,
  type MouseEventHandler,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  /** Trigger element (defaults to a button with label) */
  trigger?: ReactNode;
  /** Label text for default trigger button */
  label?: string;
  /** Open from the right side */
  end?: boolean;
  /** Open upwards */
  top?: boolean;
  /** Open on hover instead of click */
  hover?: boolean;
  /** Whether the dropdown is open (controlled) */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Trigger + popover menu with keyboard navigation.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      trigger,
      label = 'Options',
      end = false,
      top = false,
      hover = false,
      open,
      onOpenChange,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const menuRef = useRef<HTMLUListElement>(null);
    const focusedIndex = useRef(-1);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    const setOpen = useCallback(
      (next: boolean) => {
        if (!isControlled) {
          setInternalOpen(next);
        }
        onOpenChange?.(next);
        if (!next) {
          focusedIndex.current = -1;
        }
      },
      [isControlled, onOpenChange],
    );

    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, setOpen]);

    const getMenuItems = (): HTMLElement[] => {
      if (!menuRef.current) return [];
      return Array.from(
        menuRef.current.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled])'),
      );
    };

    const focusItem = (index: number) => {
      const items = getMenuItems();
      if (items[index]) {
        items[index].focus();
        focusedIndex.current = index;
      }
    };

    const handleTriggerKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => focusItem(0));
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    const handleMenuKeyDown = (e: KeyboardEvent) => {
      const items = getMenuItems();

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (focusedIndex.current + 1) % items.length;
        focusItem(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const next =
          (focusedIndex.current - 1 + items.length) % items.length;
        focusItem(next);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === 'Home') {
        e.preventDefault();
        focusItem(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        focusItem(items.length - 1);
      }
    };

    const handleTriggerClick = () => {
      setOpen(!isOpen);
    };

    const menuId = `dropdown-menu-${autoId}`;

    const triggerProps = {
      'aria-haspopup': 'true' as const,
      'aria-expanded': isOpen,
      'aria-controls': menuId,
      onClick: handleTriggerClick,
      onKeyDown: handleTriggerKeyDown,
    };

    const renderTrigger = () => {
      if (trigger && isValidElement(trigger)) {
        return cloneElement(trigger as ReactElement, triggerProps);
      }

      return (
        <div tabIndex={0} role="button" {...triggerProps}>
          <span className="btn btn-ghost btn-sm">{label}</span>
        </div>
      );
    };

    return (
      <div
        ref={setRefs}
        className={cn(
          'dropdown',
          end && 'dropdown-end',
          top && 'dropdown-top',
          hover && 'dropdown-hover',
          isOpen && 'dropdown-open',
          className,
        )}
        {...rest}
      >
        {renderTrigger()}
        <ul
          ref={menuRef}
          id={menuId}
          role="menu"
          tabIndex={-1}
          className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow"
          onKeyDown={handleMenuKeyDown}
        >
          {children}
        </ul>
      </div>
    );
  },
);

Dropdown.displayName = 'Dropdown';

export interface DropdownItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'onClick'> {
  /** Disable this menu item */
  disabled?: boolean;
  /** Click handler */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Individual item within a Dropdown menu.
 */
export const DropdownItem = forwardRef<HTMLLIElement, DropdownItemProps>(
  ({ disabled = false, className, children, onClick, ...rest }, ref) => {
    return (
      <li
        ref={ref}
        role="menuitem"
        aria-disabled={disabled || undefined}
        className={cn(disabled && 'disabled', className)}
        {...rest}
      >
        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          tabIndex={disabled ? -1 : 0}
        >
          {children}
        </button>
      </li>
    );
  },
);

DropdownItem.displayName = 'DropdownItem';
