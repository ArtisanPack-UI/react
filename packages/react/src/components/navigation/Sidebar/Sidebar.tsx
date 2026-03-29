import {
  forwardRef,
  useId,
  useRef,
  useEffect,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the sidebar is open */
  open: boolean;
  /** Callback to toggle the sidebar */
  onOpenChange: (open: boolean) => void;
  /** Sidebar content (the navigation) */
  sidebarContent: ReactNode;
  /** Side to display (left or right) */
  side?: 'left' | 'right';
  /** Sidebar width class */
  width?: string;
  /** Overlay the content instead of pushing */
  overlay?: boolean;
}

/**
 * Collapsible side navigation using DaisyUI drawer pattern.
 */
export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      open,
      onOpenChange,
      sidebarContent,
      side = 'left',
      width = 'w-80',
      overlay = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const drawerId = useId();
    const inputId = `sidebar-toggle-${drawerId}`;
    const drawerRef = useRef<HTMLDivElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        drawerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [ref],
    );

    useEffect(() => {
      if (!open) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          if (e.defaultPrevented) return;
          // Only close if focus is within the drawer-side panel (not main content)
          const active = document.activeElement;
          const drawerSide = drawerRef.current?.querySelector('.drawer-side');
          const inDrawerSide = drawerSide?.contains(active);
          const inBody = document.body === active || active === null;
          if (inDrawerSide || inBody) {
            onOpenChange(false);
          }
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, onOpenChange]);

    return (
      <div
        ref={setRefs}
        className={cn(
          'drawer',
          side === 'right' && 'drawer-end',
          open && 'drawer-open',
          className,
        )}
        {...rest}
      >
        <input
          id={inputId}
          type="checkbox"
          className="drawer-toggle"
          checked={open}
          onChange={(e) => onOpenChange(e.target.checked)}
          aria-label="Toggle sidebar"
        />
        <div className="drawer-content">
          {children}
        </div>
        <div className="drawer-side" style={overlay ? { position: 'fixed', zIndex: 50 } : undefined}>
          <label
            htmlFor={inputId}
            className="drawer-overlay"
            aria-label="Close sidebar"
          />
          <nav
            className={cn('menu bg-base-200 min-h-full p-4', width)}
            aria-label="Sidebar"
          >
            {sidebarContent}
          </nav>
        </div>
      </div>
    );
  },
);

Sidebar.displayName = 'Sidebar';
