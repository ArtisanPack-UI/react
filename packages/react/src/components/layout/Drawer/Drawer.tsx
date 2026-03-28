import {
  forwardRef,
  useEffect,
  useCallback,
  useId,
  type HTMLAttributes,
  type ReactNode,
  type KeyboardEvent,
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

/**
 * Side panel overlay with open/close state and keyboard dismiss.
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
      ...rest
    },
    ref,
  ) => {
    const drawerId = useId();
    const toggleId = `drawer-toggle-${drawerId}`;

    useEffect(() => {
      if (!open || persistent) return;

      const handleKeyDown = (e: globalThis.KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
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
        <div className="drawer-side" role="dialog" aria-modal={open || undefined}>
          <label
            htmlFor={toggleId}
            className="drawer-overlay"
            aria-label="Close drawer"
            onClick={handleOverlayClick}
          />
          <div className="bg-base-100 text-base-content min-h-full w-80 p-4">
            {side}
          </div>
        </div>
      </div>
    );
  },
);

Drawer.displayName = 'Drawer';
