import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  cloneElement,
  type HTMLAttributes,
  type ReactElement,
  type KeyboardEvent,
  type MutableRefObject,
  type MouseEventHandler,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  /** Trigger element (defaults to a button with label) */
  trigger?: ReactElement | null;
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
      onMouseEnter: externalOnMouseEnter,
      onMouseLeave: externalOnMouseLeave,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLElement | null>(null);
    const menuRef = useRef<HTMLUListElement>(null);
    const focusedIndex = useRef(-1);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    const setOpen = useCallback(
      (next: boolean) => {
        const current = isControlled ? open : internalOpen;
        if (next === current) return;
        if (!isControlled) {
          setInternalOpen(next);
        }
        onOpenChange?.(next);
        if (!next) {
          focusedIndex.current = -1;
        }
      },
      [isControlled, open, internalOpen, onOpenChange],
    );

    const closeFocusTrigger = useCallback(() => {
      setOpen(false);
      const el = triggerRef.current
        ?? containerRef.current?.querySelector<HTMLElement>('[aria-haspopup]');
      el?.focus();
    }, [setOpen]);

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

    const getMenuItemButtons = (): HTMLElement[] => {
      if (!menuRef.current) return [];
      return Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'button[role="menuitem"]:not([disabled])',
        ),
      );
    };

    const focusItem = (index: number) => {
      const items = getMenuItemButtons();
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
        e.preventDefault();
        e.stopPropagation();
        closeFocusTrigger();
      }
    };

    const syncFocusedIndex = (items: HTMLElement[]) => {
      if (focusedIndex.current === -1 && document.activeElement) {
        const idx = items.indexOf(document.activeElement as HTMLElement);
        if (idx >= 0) focusedIndex.current = idx;
      }
    };

    const handleMenuKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        closeFocusTrigger();
        return;
      }

      if (e.key === 'Tab') {
        setOpen(false);
        return;
      }

      const items = getMenuItemButtons();
      if (items.length === 0) return;

      syncFocusedIndex(items);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (focusedIndex.current + 1) % items.length;
        focusItem(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const next =
          (focusedIndex.current - 1 + items.length) % items.length;
        focusItem(next);
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

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hover) setOpen(true);
      (externalOnMouseEnter as React.MouseEventHandler<HTMLDivElement> | undefined)?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      if (hover) setOpen(false);
      (externalOnMouseLeave as React.MouseEventHandler<HTMLDivElement> | undefined)?.(e);
    };

    const menuId = `dropdown-menu-${autoId}`;

    const renderTrigger = () => {
      if (trigger) {
        const triggerEl = trigger as ReactElement<Record<string, unknown>>;
        const originalOnClick = triggerEl.props.onClick as ((...args: unknown[]) => void) | undefined;
        const originalOnKeyDown = triggerEl.props.onKeyDown as ((...args: unknown[]) => void) | undefined;

        return cloneElement(triggerEl, {
          'aria-haspopup': 'true' as const,
          'aria-expanded': isOpen,
          'aria-controls': menuId,
          onClick: (e: React.MouseEvent) => {
            triggerRef.current = e.currentTarget as HTMLElement;
            (originalOnClick as ((e: React.MouseEvent) => void) | undefined)?.(e);
            if (!e.defaultPrevented) {
              handleTriggerClick();
            }
          },
          onKeyDown: (e: KeyboardEvent) => {
            triggerRef.current = e.currentTarget as HTMLElement;
            originalOnKeyDown?.(e);
            if (!e.defaultPrevented) {
              handleTriggerKeyDown(e);
            }
          },
        });
      }

      return (
        <button
          ref={(node) => { triggerRef.current = node; }}
          type="button"
          className="btn btn-ghost btn-sm"
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-controls={menuId}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
        >
          {label}
        </button>
      );
    };

    return (
      <div
        ref={setRefs}
        className={cn(
          'dropdown',
          end && 'dropdown-end',
          top && 'dropdown-top',
          hover && !isControlled && 'dropdown-hover',
          isOpen && 'dropdown-open',
          className,
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        {renderTrigger()}
        <ul
          ref={menuRef}
          id={menuId}
          role="menu"
          tabIndex={-1}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
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
        role="none"
        className={cn(disabled && 'disabled', className)}
        {...rest}
      >
        <button
          type="button"
          role="menuitem"
          disabled={disabled}
          aria-disabled={disabled || undefined}
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
