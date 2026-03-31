/**
 * @module Modal
 *
 * A dialog overlay component built on the native `<dialog>` element and
 * DaisyUI's modal styles. Supports focus management, Escape key dismiss,
 * backdrop click-to-close, glass morphism, and bottom-sheet positioning.
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  useId,
  type HTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Modal} component.
 */
export interface ModalProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title'> {
  /** Whether the modal dialog is visible. */
  open: boolean;
  /** Callback fired when the modal should close (Escape, backdrop click, close button). */
  onClose: () => void;
  /** Title content displayed at the top of the modal. Renders as `<h3>` for strings. */
  title?: ReactNode;
  /** Subtitle text displayed below the title. */
  subtitle?: string;
  /** Actions slot rendered in the modal footer (typically buttons). */
  actions?: ReactNode;
  /** Prevent closing via Escape key, backdrop click, and hide the close button. */
  persistent?: boolean;
  /** Apply a glass morphism (frosted-glass) effect to the modal box. */
  glass?: boolean;
  /** Position the modal at the bottom of the viewport (mobile sheet style). */
  bottom?: boolean;
}

/**
 * Dialog overlay with focus management, keyboard dismiss, and backdrop click.
 *
 * Uses the native `<dialog>` element's `showModal()` / `close()` methods
 * for proper stacking context and focus trapping. Focus is restored to the
 * previously active element when the modal closes.
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 *
 * <Modal
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   title="Confirm"
 *   actions={
 *     <>
 *       <Button onClick={() => setOpen(false)}>Cancel</Button>
 *       <Button color="primary" onClick={handleConfirm}>OK</Button>
 *     </>
 *   }
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </Modal>
 * ```
 */
export const Modal = forwardRef<HTMLDialogElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      subtitle,
      actions,
      persistent = false,
      glass = false,
      bottom = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const previousActiveElement = useRef<Element | null>(null);
    const titleId = useId();

    const setRefs = useCallback(
      (node: HTMLDialogElement | null) => {
        dialogRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLDialogElement | null>).current = node;
        }
      },
      [ref],
    );

    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (open) {
        previousActiveElement.current = document.activeElement;
        if (!dialog.open) {
          dialog.showModal();
        }
      } else {
        if (dialog.open) {
          dialog.close();
        }
        if (previousActiveElement.current instanceof HTMLElement) {
          previousActiveElement.current.focus();
        }
      }
    }, [open]);

    useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      const handleCancel = (e: Event) => {
        e.preventDefault();
        if (!persistent) {
          onClose();
        }
      };

      dialog.addEventListener('cancel', handleCancel);
      return () => dialog.removeEventListener('cancel', handleCancel);
    }, [persistent, onClose]);

    const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
      if (persistent) return;
      if (e.target === dialogRef.current) {
        onClose();
      }
    };

    return (
      <dialog
        ref={setRefs}
        className={cn('modal', bottom && 'modal-bottom', className)}
        onClick={handleBackdropClick}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        {...rest}
      >
        <div className={cn('modal-box', glass && 'glass')}>
          {(title || subtitle) && (
            <div className="mb-4">
              {title &&
                (typeof title === 'string' ? (
                  <h3 id={titleId} className="text-lg font-bold">
                    {title}
                  </h3>
                ) : (
                  <div id={titleId}>{title}</div>
                ))}
              {subtitle && <p className="text-base-content/60 text-sm">{subtitle}</p>}
            </div>
          )}
          {!persistent && (
            <button
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={onClose}
              aria-label="Close"
            >
              &#x2715;
            </button>
          )}
          <div>{children}</div>
          {actions && <div className="modal-action">{actions}</div>}
        </div>
      </dialog>
    );
  },
);

Modal.displayName = 'Modal';
