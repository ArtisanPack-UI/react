/**
 * @module Sidebar
 *
 * Collapsible side navigation component built on the DaisyUI drawer pattern.
 * Supports left/right placement, overlay or push mode, configurable width,
 * and keyboard dismissal via the Escape key.
 */

import {
  forwardRef,
  useId,
  useRef,
  useEffect,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

/**
 * Stable callback ref hook. Always calls the latest version of the provided
 * function without re-triggering effects that depend on it.
 *
 * @param fn - The callback function to stabilize.
 * @returns A stable reference that always invokes the latest `fn`.
 */
function useStableCallback<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  const fnRef = useRef(fn);
  /* eslint-disable react-hooks/refs -- standard stable-callback pattern */
  fnRef.current = fn;
  return useCallback((...args: A) => fnRef.current(...args), []);
  /* eslint-enable react-hooks/refs */
}
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Sidebar} component.
 */
export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the sidebar is currently open (controlled). */
  open: boolean;
  /** Callback fired when the sidebar open state should change. */
  onOpenChange: (open: boolean) => void;
  /** The navigation content rendered inside the sidebar panel. */
  sidebarContent: ReactNode;
  /** Which side of the viewport the sidebar appears on. @defaultValue 'left' */
  side?: 'left' | 'right';
  /** Tailwind CSS width class for the sidebar panel. @defaultValue 'w-80' */
  width?: string;
  /** Whether to overlay the main content (fixed position) instead of pushing it aside. */
  overlay?: boolean;
}

/**
 * Collapsible side navigation using the DaisyUI drawer pattern.
 *
 * Renders a drawer with a toggle checkbox, overlay backdrop, and a `<nav>` panel.
 * Pressing Escape while focus is within the sidebar panel closes it.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Sidebar
 *   open={open}
 *   onOpenChange={setOpen}
 *   sidebarContent={<ul><li>Dashboard</li><li>Settings</li></ul>}
 *   side="left"
 *   width="w-64"
 * >
 *   <main>Page content here</main>
 * </Sidebar>
 * ```
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
    const stableOnOpenChange = useStableCallback(onOpenChange);
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
            stableOnOpenChange(false);
          }
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [open, stableOnOpenChange]);

    return (
      <div
        ref={setRefs}
        className={cn('drawer', side === 'right' && 'drawer-end', open && 'drawer-open', className)}
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
        <div className="drawer-content">{children}</div>
        <div
          className="drawer-side"
          style={overlay ? { position: 'fixed', zIndex: 50 } : undefined}
        >
          <label htmlFor={inputId} className="drawer-overlay" aria-label="Close sidebar" />
          <nav className={cn('menu bg-base-200 min-h-full p-4', width)} aria-label="Sidebar">
            {sidebarContent}
          </nav>
        </div>
      </div>
    );
  },
);

Sidebar.displayName = 'Sidebar';
