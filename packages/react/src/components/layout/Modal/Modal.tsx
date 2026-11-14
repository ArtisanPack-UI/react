/**
 * @module Modal
 *
 * Deprecated alias of {@link Dialog}, kept for 1.x code. It maps the old
 * props onto Dialog: `onClose` → `onOpenChange(false)`, `subtitle` →
 * `description`, `actions` → `footer`, `glass` → `surface="glass"` and
 * `persistent` → `role="alertdialog"` with `hideClose`, ignoring the closes
 * the dialog asks for. `bottom` has no Dialog equivalent and is ignored (use
 * a `Drawer` with `side="bottom"`).
 *
 * @deprecated Use `Dialog`.
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';

import { devWarnOnce } from '../../../internal/parts';
import { Dialog, type DialogProps } from '../Dialog/Dialog';

/**
 * Props for the deprecated {@link Modal}.
 *
 * @deprecated Use `DialogProps`.
 */
export interface ModalProps extends Omit<
  DialogProps,
  'open' | 'defaultOpen' | 'onOpenChange' | 'description' | 'footer'
> {
  /** Whether the modal is visible. */
  open: boolean;
  /** Called when the modal asks to close (Escape, backdrop, close button). Use Dialog's `onOpenChange`. */
  onClose: () => void;
  /** Supporting text under the title. Use Dialog's `description`. */
  subtitle?: ReactNode;
  /** The footer actions. Use Dialog's `footer`. */
  actions?: ReactNode;
  /**
   * Stops Escape, the backdrop and the close button from closing it. Use
   * Dialog's `role="alertdialog"` with `hideClose`.
   */
  persistent?: boolean;
  /** A frosted-glass panel. Use Dialog's `surface="glass"`. */
  glass?: boolean;
  /** Ignored: Dialog has no bottom-sheet mode. Use a `Drawer` with `side="bottom"`. */
  bottom?: boolean;
}

/**
 * Deprecated: renders a {@link Dialog}. The ref points at the dialog panel.
 *
 * @deprecated Use `Dialog`.
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      subtitle,
      actions,
      persistent = false,
      glass = false,
      bottom: _bottom,
      role,
      surface,
      hideClose,
      ...rest
    },
    ref,
  ) => {
    devWarnOnce('Modal', 'Modal is deprecated; use Dialog.');
    return (
      <Dialog
        {...rest}
        ref={ref}
        open={open}
        onOpenChange={(next) => {
          // A persistent modal stays open: `open` is controlled, so ignoring
          // the close keeps the machine open.
          if (!next && !persistent) onClose();
        }}
        description={subtitle}
        footer={actions}
        role={persistent ? 'alertdialog' : role}
        hideClose={persistent || hideClose}
        surface={glass ? 'glass' : surface}
      />
    );
  },
);

Modal.displayName = 'Modal';
