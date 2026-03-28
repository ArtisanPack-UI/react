import {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
  type KeyboardEvent,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface PopoverProps extends HTMLAttributes<HTMLDivElement> {
  /** Trigger element */
  trigger: ReactNode;
  /** Trigger mode */
  triggerMode?: 'hover' | 'click';
  /** Popover position */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay in ms before showing (hover mode) */
  showDelay?: number;
  /** Delay in ms before hiding (hover mode) */
  hideDelay?: number;
  /** Whether the popover is open (controlled) */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

const positionMap: Record<string, string> = {
  top: 'dropdown-top',
  bottom: 'dropdown-bottom',
  left: 'dropdown-left',
  right: 'dropdown-right',
};

/**
 * Positioned floating content triggered by hover or click.
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
      className,
      children,
      ...rest
    },
    ref,
  ) => {
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
      },
      [isControlled, onOpenChange],
    );

    const clearTimers = () => {
      if (showTimer.current) clearTimeout(showTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };

    useEffect(() => {
      return clearTimers;
    }, []);

    useEffect(() => {
      if (triggerMode !== 'click' || !isOpen) return;

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
    }, [triggerMode, isOpen, setOpen]);

    const handleMouseEnter = () => {
      if (triggerMode !== 'hover') return;
      clearTimers();
      if (showDelay > 0) {
        showTimer.current = setTimeout(() => setOpen(true), showDelay);
      } else {
        setOpen(true);
      }
    };

    const handleMouseLeave = () => {
      if (triggerMode !== 'hover') return;
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
      } else if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setOpen(false);
      }
    };

    return (
      <div
        ref={setRefs}
        className={cn(
          'dropdown',
          positionMap[position],
          triggerMode === 'hover' && 'dropdown-hover',
          isOpen && 'dropdown-open',
          className,
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...rest}
      >
        <div
          tabIndex={0}
          role="button"
          aria-expanded={isOpen}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          {trigger}
        </div>
        <div
          className="dropdown-content z-1 rounded-box border border-base-300 bg-base-100 p-4 shadow-lg"
          aria-hidden={!isOpen}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>
      </div>
    );
  },
);

Popover.displayName = 'Popover';
