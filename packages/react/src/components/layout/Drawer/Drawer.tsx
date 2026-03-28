import {
  forwardRef,
  useEffect,
  useRef,
  useId,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface DrawerProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether the drawer is open */
  open: boolean;
  /** Callback to close the drawer */
  onClose: () => void;
  /** Side panel content */
  side: ReactNode;
  /** Open from the right side */
  end?: boolean;
  /** Prevent closing via overlay click or escape */
  persistent?: boolean;
}

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
        if (e.key === 'Escape' && !persistent) {
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
