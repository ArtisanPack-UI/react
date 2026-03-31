/**
 * @module Toast
 *
 * A toast notification system consisting of a context provider
 * ({@link ToastProvider}), an imperative hook ({@link useToast}), and
 * individual toast messages ({@link ToastMessage}). Toasts are
 * auto-dismissed after a configurable duration and announced to
 * assistive technologies via an ARIA live region.
 *
 * @packageDocumentation
 */

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

/**
 * Color variants available for toast notifications.
 */
type ToastColor = 'info' | 'success' | 'warning' | 'error';

/**
 * DaisyUI position classes for the toast container.
 */
type ToastPosition =
  | 'toast-start'
  | 'toast-center'
  | 'toast-end'
  | 'toast-top'
  | 'toast-middle'
  | 'toast-bottom';

/**
 * Represents a single toast notification in the queue.
 */
export interface ToastItem {
  /** Unique identifier for this toast instance. */
  id: string;
  /** The content to display inside the toast. */
  message: ReactNode;
  /** Color variant that determines the visual style. */
  color?: ToastColor;
  /** Auto-dismiss duration in milliseconds. Set to `0` to disable auto-dismiss. */
  duration?: number;
}

/**
 * Imperative API returned by {@link useToast} for showing and dismissing toasts.
 */
export interface ToastAPI {
  /** Show a toast with full options. Returns the generated toast ID. */
  show: (options: Omit<ToastItem, 'id'>) => string;
  /** Show a success toast. Returns the generated toast ID. */
  success: (message: ReactNode, duration?: number) => string;
  /** Show an error toast. Returns the generated toast ID. */
  error: (message: ReactNode, duration?: number) => string;
  /** Show a warning toast. Returns the generated toast ID. */
  warning: (message: ReactNode, duration?: number) => string;
  /** Show an info toast. Returns the generated toast ID. */
  info: (message: ReactNode, duration?: number) => string;
  /** Dismiss a specific toast by its ID. */
  dismiss: (id: string) => void;
  /** Dismiss all currently visible toasts. */
  dismissAll: () => void;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const ToastContext = createContext<ToastAPI | null>(null);

/**
 * Hook that provides the imperative toast API for showing and dismissing
 * notifications. Must be called within a {@link ToastProvider}.
 *
 * @returns The {@link ToastAPI} object with `show`, `success`, `error`,
 *   `warning`, `info`, `dismiss`, and `dismissAll` methods.
 *
 * @throws Error if called outside a `ToastProvider`.
 *
 * @example
 * ```tsx
 * function SaveButton() {
 *   const toast = useToast();
 *   return (
 *     <button onClick={() => toast.success('Saved!')}>Save</button>
 *   );
 * }
 * ```
 */
export function useToast(): ToastAPI {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

/**
 * Props for the {@link ToastProvider} component.
 */
export interface ToastProviderProps {
  /** Child elements that will have access to the toast context. */
  children: ReactNode;
  /** Default auto-dismiss duration in milliseconds. Defaults to `5000`. Set to `0` to disable auto-dismiss. */
  defaultDuration?: number;
  /** Maximum number of simultaneously visible toasts. Oldest toasts are evicted when exceeded. Defaults to `5`. */
  max?: number;
  /** DaisyUI position classes applied to the toast container. Defaults to `['toast-end', 'toast-bottom']`. */
  position?: ToastPosition[];
}

/**
 * Context provider that manages the toast notification queue and renders
 * the toast container. Wrap your application (or a subtree) with this
 * provider to enable the {@link useToast} hook.
 *
 * @example
 * ```tsx
 * <ToastProvider defaultDuration={3000} max={3} position={['toast-center', 'toast-top']}>
 *   <App />
 * </ToastProvider>
 * ```
 */
export function ToastProvider({
  children,
  defaultDuration = 5000,
  max = 5,
  position = ['toast-end', 'toast-bottom'],
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const counterRef = useRef(0);

  const clearTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const dismiss = useCallback(
    (id: string) => {
      clearTimer(id);
      setToasts((prev) => prev.filter((t) => t.id !== id));
    },
    [clearTimer],
  );

  const dismissAll = useCallback(() => {
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current.clear();
    setToasts([]);
  }, []);

  const evictedIdsRef = useRef<string[]>([]);

  const show = useCallback(
    (options: Omit<ToastItem, 'id'>): string => {
      const id = `toast-${++counterRef.current}`;
      const duration = options.duration ?? defaultDuration;

      evictedIdsRef.current = [];

      setToasts((prev) => {
        const next = [...prev, { ...options, id }];
        if (next.length > max) {
          const evictCount = next.length - max;
          evictedIdsRef.current = next.slice(0, evictCount).map((t) => t.id);
          return next.slice(evictCount);
        }
        return next;
      });

      evictedIdsRef.current.forEach((evictedId) => clearTimer(evictedId));

      if (duration > 0) {
        const timer = setTimeout(() => dismiss(id), duration);
        timersRef.current.set(id, timer);
      }

      return id;
    },
    [defaultDuration, max, dismiss, clearTimer],
  );

  const success = useCallback(
    (message: ReactNode, duration?: number) => show({ message, color: 'success', duration }),
    [show],
  );

  const error = useCallback(
    (message: ReactNode, duration?: number) => show({ message, color: 'error', duration }),
    [show],
  );

  const warning = useCallback(
    (message: ReactNode, duration?: number) => show({ message, color: 'warning', duration }),
    [show],
  );

  const info = useCallback(
    (message: ReactNode, duration?: number) => show({ message, color: 'info', duration }),
    [show],
  );

  const api = useMemo<ToastAPI>(
    () => ({ show, success, error, warning, info, dismiss, dismissAll }),
    [show, success, error, warning, info, dismiss, dismissAll],
  );

  // Clean up all timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      {toasts.length > 0 && (
        <div
          className={cn('toast z-50', ...position)}
          aria-live="polite"
          aria-label="Notifications"
          role="log"
        >
          {toasts.map((toast) => (
            <ToastMessage key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Individual toast message                                           */
/* ------------------------------------------------------------------ */

const toastColorMap: Record<ToastColor, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
};

/**
 * Props for the {@link ToastMessage} component.
 */
interface ToastMessageProps extends HTMLAttributes<HTMLDivElement> {
  /** The toast data object to render. */
  toast: ToastItem;
  /** Callback to dismiss this toast by its ID. */
  onDismiss: (id: string) => void;
}

/**
 * Individual toast notification message rendered inside the toast container.
 *
 * Uses `role="alert"` for error/warning toasts and `role="status"` for
 * info/success toasts to provide appropriate urgency to screen readers.
 *
 * @example
 * ```tsx
 * <ToastMessage
 *   toast={{ id: '1', message: 'Hello!', color: 'info' }}
 *   onDismiss={(id) => console.log('Dismissed', id)}
 * />
 * ```
 */
export const ToastMessage = forwardRef<HTMLDivElement, ToastMessageProps>(
  ({ toast, onDismiss, className, ...rest }, ref) => {
    const isUrgent = toast.color === 'error' || toast.color === 'warning';

    return (
      <div
        ref={ref}
        role={isUrgent ? 'alert' : 'status'}
        className={cn('alert', toast.color && toastColorMap[toast.color], className)}
        {...rest}
      >
        <span>{toast.message}</span>
        <button
          type="button"
          aria-label="Dismiss notification"
          className="btn btn-sm btn-ghost"
          onClick={() => onDismiss(toast.id)}
        >
          &#x2715;
        </button>
      </div>
    );
  },
);

ToastMessage.displayName = 'ToastMessage';
