import {
  forwardRef,
  useEffect,
  useRef,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDialogElement>, 'title'> {
  /** Whether the modal is open */
  open: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Modal title */
  title?: ReactNode;
  /** Modal subtitle */
  subtitle?: string;
  /** Actions slot (buttons in footer) */
  actions?: ReactNode;
  /** Prevent closing via escape key or backdrop click */
  persistent?: boolean;
  /** Glass morphism effect */
  glass?: boolean;
  /** Position modal at bottom (mobile sheet style) */
  bottom?: boolean;
}

/**
 * Dialog overlay with focus trapping, keyboard dismiss, and backdrop click.
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
        if (persistent) {
          e.preventDefault();
        } else {
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
        className={cn(
          'modal',
          bottom && 'modal-bottom',
          className,
        )}
        onClick={handleBackdropClick}
        aria-modal="true"
        {...rest}
      >
        <div className={cn('modal-box', glass && 'glass')}>
          {(title || subtitle) && (
            <div className="mb-4">
              {title && (
                typeof title === 'string' ? (
                  <h3 className="text-lg font-bold">{title}</h3>
                ) : (
                  title
                )
              )}
              {subtitle && (
                <p className="text-base-content/60 text-sm">{subtitle}</p>
              )}
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
          {actions && (
            <div className="modal-action">{actions}</div>
          )}
        </div>
      </dialog>
    );
  },
);

Modal.displayName = 'Modal';
