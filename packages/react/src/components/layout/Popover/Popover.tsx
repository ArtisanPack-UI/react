/**
 * @module Popover
 *
 * Positioned floating content triggered by hover or click. Built on DaisyUI's
 * dropdown positioning with added keyboard support, focus management,
 * configurable show/hide delays, and controlled/uncontrolled state.
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  isValidElement,
  cloneElement,
  Fragment,
  type HTMLAttributes,
  type ReactNode,
  type ReactElement,
  type KeyboardEvent,
  type FocusEvent,
  type MutableRefObject,
  type MouseEvent as ReactMouseEvent,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Popover} component.
 */
export interface PopoverProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onMouseEnter' | 'onMouseLeave' | 'onFocus' | 'onBlur'
> {
  /** The element that activates the popover. Can be any ReactNode; non-focusable elements are automatically wrapped. */
  trigger: ReactNode;
  /** How the popover is activated. @defaultValue `'hover'` */
  triggerMode?: 'hover' | 'click';
  /** Placement of the floating content relative to the trigger. @defaultValue `'bottom'` */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay in milliseconds before showing the popover (hover mode only). @defaultValue `0` */
  showDelay?: number;
  /** Delay in milliseconds before hiding the popover (hover mode only). @defaultValue `300` */
  hideDelay?: number;
  /** Whether the popover is open (controlled mode). */
  open?: boolean;
  /** Callback fired when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Prevent closing via outside click or Escape key. */
  persistent?: boolean;
  /** External mouse-enter handler forwarded to the container. */
  onMouseEnter?: (e: ReactMouseEvent<HTMLDivElement>) => void;
  /** External mouse-leave handler forwarded to the container. */
  onMouseLeave?: (e: ReactMouseEvent<HTMLDivElement>) => void;
  /** External focus handler forwarded to the container. */
  onFocus?: (e: FocusEvent<HTMLDivElement>) => void;
  /** External blur handler forwarded to the container. */
  onBlur?: (e: FocusEvent<HTMLDivElement>) => void;
}

type Position = NonNullable<PopoverProps['position']>;

const positionMap: Record<Position, string> = {
  top: 'dropdown-top',
  bottom: 'dropdown-bottom',
  left: 'dropdown-left',
  right: 'dropdown-right',
};

/**
 * Positioned floating content triggered by hover or click.
 *
 * Wraps a trigger element and a floating content panel. In hover mode,
 * the popover also responds to focus/blur for keyboard accessibility.
 * In click mode, the trigger receives `aria-expanded` and `aria-controls`
 * attributes. The popover dismisses on Escape and outside clicks unless
 * `persistent` is set.
 *
 * @example
 * ```tsx
 * <Popover trigger={<Button>Hover me</Button>}>
 *   <p>Popover content</p>
 * </Popover>
 * ```
 *
 * @example
 * ```tsx
 * // Click-triggered popover on the right
 * <Popover trigger={<Button>Click</Button>} triggerMode="click" position="right">
 *   <p>Side panel content</p>
 * </Popover>
 * ```
 */
export const Popover = forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      trigger,
      triggerMode = 'hover',
      position = 'bottom',
      showDelay = 0,
      hideDelay = 300,
      open,
      onOpenChange,
      persistent = false,
      className,
      children,
      onMouseEnter: externalOnMouseEnter,
      onMouseLeave: externalOnMouseLeave,
      onFocus: externalOnFocus,
      onBlur: externalOnBlur,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId();
    const contentId = `popover-content-${autoId}`;
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;
    const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

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
      },
      [isControlled, open, internalOpen, onOpenChange],
    );

    const clearTimers = () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };

    useEffect(() => {
      return clearTimers;
    }, []);

    // Click-outside for click mode
    useEffect(() => {
      if (triggerMode !== 'click' || !isOpen || persistent) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [triggerMode, isOpen, persistent, setOpen]);

    // Global Escape key to close when open
    useEffect(() => {
      if (!isOpen || persistent) return;

      const handleEscape = (e: globalThis.KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false);
          e.stopPropagation();
          // Restore focus to trigger
          const triggerEl = containerRef.current?.querySelector<HTMLElement>(
            '[aria-controls], [aria-expanded]',
          );
          triggerEl?.focus();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, persistent, setOpen]);

    const handleMouseEnter = (e: ReactMouseEvent<HTMLDivElement>) => {
      externalOnMouseEnter?.(e);
      if (triggerMode !== 'hover') return;
      clearTimers();
      if (showDelay > 0) {
        showTimer.current = setTimeout(() => setOpen(true), showDelay);
      } else {
        setOpen(true);
      }
    };

    const handleMouseLeave = (e: ReactMouseEvent<HTMLDivElement>) => {
      externalOnMouseLeave?.(e);
      if (triggerMode !== 'hover') return;
      if (containerRef.current?.contains(e.relatedTarget as Node)) return;
      clearTimers();
      hideTimer.current = setTimeout(() => setOpen(false), hideDelay);
    };

    const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
      externalOnFocus?.(e);
      if (triggerMode !== 'hover') return;
      clearTimers();
      if (showDelay > 0) {
        showTimer.current = setTimeout(() => setOpen(true), showDelay);
      } else {
        setOpen(true);
      }
    };

    const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
      externalOnBlur?.(e);
      if (triggerMode !== 'hover') return;
      if (containerRef.current?.contains(e.relatedTarget as Node)) return;
      clearTimers();
      hideTimer.current = setTimeout(() => setOpen(false), hideDelay);
    };

    const handleClick = () => {
      if (triggerMode !== 'click') return;
      setOpen(!isOpen);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (triggerMode !== 'click') return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };

    const FOCUSABLE_INTRINSICS = new Set([
      'button',
      'input',
      'select',
      'textarea',
      'a',
      'area',
      'iframe',
      'object',
    ]);

    const isFocusableElement = (el: ReactElement): boolean => {
      if (typeof el.type !== 'string') return true; // components assumed focusable
      if (FOCUSABLE_INTRINSICS.has(el.type)) return true;
      return (el.props as Record<string, unknown>).tabIndex !== undefined;
    };

    const wrapInFocusable = (content: ReactNode): ReactElement => {
      if (triggerMode === 'click') {
        return (
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={contentId}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
          >
            {content}
          </button>
        );
      }
      return (
        <span tabIndex={0} aria-expanded={isOpen} aria-controls={contentId}>
          {content}
        </span>
      );
    };

    const renderTrigger = () => {
      if (isValidElement(trigger)) {
        // Fragments can't receive DOM props — wrap their children
        if (trigger.type === Fragment) {
          return wrapInFocusable((trigger.props as { children?: ReactNode }).children);
        }

        const triggerEl = trigger as ReactElement<Record<string, unknown>>;
        const props: Record<string, unknown> = {
          'aria-expanded': isOpen,
          'aria-controls': contentId,
        };

        // Ensure non-focusable intrinsic elements get tabIndex
        if (!isFocusableElement(triggerEl)) {
          props.tabIndex = 0;
        }

        if (triggerMode === 'click') {
          const origClick = triggerEl.props.onClick as ((...a: unknown[]) => void) | undefined;
          const origKeyDown = triggerEl.props.onKeyDown as ((...a: unknown[]) => void) | undefined;
          props.onClick = (...args: unknown[]) => {
            origClick?.(...args);
            if (!(args[0] as Event)?.defaultPrevented) handleClick();
          };
          props.onKeyDown = (e: KeyboardEvent) => {
            origKeyDown?.(e);
            if (!e.defaultPrevented) handleKeyDown(e);
          };
        }

        return cloneElement(triggerEl, props);
      }

      // Fallback: non-element trigger (string, etc.)
      if (triggerMode === 'click') {
        return (
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={contentId}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
          >
            {trigger}
          </button>
        );
      }

      return (
        <span tabIndex={0} aria-expanded={isOpen} aria-controls={contentId}>
          {trigger}
        </span>
      );
    };

    return (
      <div
        ref={setRefs}
        className={cn('dropdown', positionMap[position], isOpen && 'dropdown-open', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      >
        {renderTrigger()}
        <div
          id={contentId}
          className="dropdown-content z-[1] rounded-box border border-base-300 bg-base-100 p-4 shadow-lg"
          aria-hidden={!isOpen}
          style={!isOpen ? { visibility: 'hidden', opacity: 0 } : undefined}
        >
          {children}
        </div>
      </div>
    );
  },
);

Popover.displayName = 'Popover';
