import {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
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
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );
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
      requestAnimationFrame(() => {
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

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
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
          aria-modal={open || undefined}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
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
