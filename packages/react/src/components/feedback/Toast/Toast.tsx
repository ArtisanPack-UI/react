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

type ToastColor = 'info' | 'success' | 'warning' | 'error';
type ToastPosition =
  | 'toast-start'
  | 'toast-center'
  | 'toast-end'
  | 'toast-top'
  | 'toast-middle'
  | 'toast-bottom';

export interface ToastItem {
  /** Unique identifier */
  id: string;
  /** Message content */
  message: ReactNode;
  /** Color variant */
  color?: ToastColor;
  /** Auto-dismiss duration in ms (0 to disable) */
  duration?: number;
}

export interface ToastAPI {
  /** Show a toast with full options */
  show: (options: Omit<ToastItem, 'id'>) => string;
  /** Show a success toast */
  success: (message: ReactNode, duration?: number) => string;
  /** Show an error toast */
  error: (message: ReactNode, duration?: number) => string;
  /** Show a warning toast */
  warning: (message: ReactNode, duration?: number) => string;
  /** Show an info toast */
  info: (message: ReactNode, duration?: number) => string;
  /** Dismiss a toast by id */
  dismiss: (id: string) => void;
  /** Dismiss all toasts */
  dismissAll: () => void;
}

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

const ToastContext = createContext<ToastAPI | null>(null);

/**
 * Access the toast API for showing notifications imperatively.
 * Must be used within a ToastProvider.
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

export interface ToastProviderProps {
  children: ReactNode;
  /** Default auto-dismiss duration in ms (default 5000, 0 to disable) */
  defaultDuration?: number;
  /** Maximum number of visible toasts (default 5) */
  max?: number;
  /** Position classes applied to the toast container */
  position?: ToastPosition[];
}

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

interface ToastMessageProps extends HTMLAttributes<HTMLDivElement> {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

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
