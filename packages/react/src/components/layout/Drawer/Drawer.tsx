/**
 * @module Drawer
 *
 * A side-panel overlay built on DaisyUI's drawer component. Includes focus
 * trapping, keyboard dismiss (Escape), overlay click-to-close, and proper
 * ARIA dialog semantics.
 *
 * @packageDocumentation
 */

import { forwardRef, useEffect, useRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Drawer} component.
 */
export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the drawer panel is visible. */
  open: boolean;
  /** Callback fired when the drawer should close (overlay click, Escape key, etc.). */
  onClose: () => void;
  /** Content rendered inside the sliding side panel. */
  side: ReactNode;
  /** Open the panel from the right (end) side instead of the left. */
  end?: boolean;
  /** Prevent closing via overlay click or Escape key. */
  persistent?: boolean;
}

/**
 * Returns all focusable elements within a container, filtering out hidden,
 * inert, or negative-tabindex elements.
 *
 * @param container - The DOM element to search within.
 * @returns An array of focusable HTMLElements.
 */
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const candidates = Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex], [contenteditable]:not([contenteditable="false"])',
    ),
  );
  return candidates.filter((el) => {
    if (el.tabIndex < 0) return false;
    if (el.getAttribute('aria-hidden') === 'true') return false;
    if (el.closest('[inert]')) return false;
    if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return false;
    return true;
  });
}

/**
 * Side panel overlay with focus trapping, keyboard dismiss, and accessible labeling.
 *
 * When open, focus is trapped inside the side panel and restored to the
 * previously focused element on close. The panel can be dismissed via
 * the overlay click or the Escape key unless `persistent` is set.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Drawer
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   side={<nav>Sidebar navigation</nav>}
 * >
 *   <main>Main content</main>
 * </Drawer>
 * ```
 *
 * @example
 * ```tsx
 * // Right-side drawer
 * <Drawer open={open} onClose={close} side={<aside>Panel</aside>} end>
 *   <div>Page content</div>
 * </Drawer>
 * ```
 */
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onClose,
      side,
      end = false,
      persistent = false,
      className,
      children,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const drawerId = useId();
    const toggleId = `drawer-toggle-${drawerId}`;
    const panelRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<Element | null>(null);

    useEffect(() => {
      if (!open) return;

      previousActiveElement.current = document.activeElement;

      // Focus first focusable element in panel
      const rafId = requestAnimationFrame(() => {
        if (panelRef.current) {
          const focusable = getFocusableElements(panelRef.current);
          if (focusable.length > 0) {
            focusable[0].focus();
          } else {
            panelRef.current.focus();
          }
        }
      });

      return () => {
        cancelAnimationFrame(rafId);
        if (previousActiveElement.current instanceof HTMLElement) {
          previousActiveElement.current.focus();
        }
      };
    }, [open]);

    useEffect(() => {
      if (!open) return;

      const handleKeyDown = (e: globalThis.KeyboardEvent) => {
        if (e.defaultPrevented) return;

        if (e.key === 'Escape' && !persistent && panelRef.current?.contains(document.activeElement)) {
          onClose();
          return;
        }

        if (e.key === 'Tab' && panelRef.current) {
          const focusable = getFocusableElements(panelRef.current);
          if (focusable.length === 0) {
            e.preventDefault();
            return;
          }

          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          const activeInPanel = panelRef.current.contains(document.activeElement);
          const activeIndex = focusable.indexOf(document.activeElement as HTMLElement);

          if (e.shiftKey) {
            if (!activeInPanel || activeIndex <= 0) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (!activeInPanel || activeIndex === -1 || activeIndex >= focusable.length - 1) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [open, persistent, onClose]);

    const handleOverlayClick = () => {
      if (!persistent) {
        onClose();
      }
    };

    return (
      <div ref={ref} className={cn('drawer', end && 'drawer-end', className)} {...rest}>
        <input
          id={toggleId}
          type="checkbox"
          className="drawer-toggle"
          checked={open}
          readOnly
          aria-hidden="true"
          tabIndex={-1}
        />
        <div className="drawer-content">{children}</div>
        <div
          className="drawer-side"
          role="dialog"
          aria-hidden={!open || undefined}
          aria-modal={open || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
        >
          <label
            htmlFor={toggleId}
            className="drawer-overlay"
            aria-label="Close drawer"
            onClick={handleOverlayClick}
          />
          <div
            ref={panelRef}
            tabIndex={-1}
            className="bg-base-100 text-base-content min-h-full w-80 p-4"
          >
            {side}
          </div>
        </div>
      </div>
    );
  },
);

Drawer.displayName = 'Drawer';
