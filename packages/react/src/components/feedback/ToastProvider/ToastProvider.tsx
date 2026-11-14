/**
 * @module ToastProvider
 *
 * Deprecated aliases kept for 1.x code, on the design-system toasts:
 *
 * - {@link ToastProvider} renders its children and a {@link Toaster} for the
 *   default `toast`, mapping `defaultDuration` → `duration`, `max` and the
 *   DaisyUI `position` classes → `placement`.
 * - {@link useToast} returns the 1.x imperative API, each call a
 *   `toast.create({ title, color, duration })`. A message that isn't text is
 *   flattened to its text, because toast titles are strings.
 * - {@link ToastMessage} renders a static {@link Toast}.
 *
 * Toasts beyond `max` now queue instead of evicting the oldest.
 *
 * @deprecated Render one `Toaster` and call `toast.create()`.
 * @packageDocumentation
 */

import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

import { devWarnOnce } from '../../../internal/parts';
import { Toast, type ToastProps } from '../Toast/Toast';
import { Toaster, toast, type ToastPlacement } from '../Toast/Toaster';

/** The colors a 1.x toast takes. */
type ToastItemColor = 'info' | 'success' | 'warning' | 'error';

/** The 1.x DaisyUI position classes. */
type ToastPosition =
  | 'toast-start'
  | 'toast-center'
  | 'toast-end'
  | 'toast-top'
  | 'toast-middle'
  | 'toast-bottom';

/**
 * A 1.x toast.
 *
 * @deprecated Use `ToastOptions` with `toast.create()`.
 */
export interface ToastItem {
  /** Identifies the toast. */
  id: string;
  /** The message, shown as the toast's title. */
  message: ReactNode;
  /** Tints the icon; `error` makes the toast an alert. */
  color?: ToastItemColor;
  /** Milliseconds before it dismisses itself. `0` keeps it. */
  duration?: number;
}

/**
 * The imperative API {@link useToast} returns.
 *
 * @deprecated Use `toast` (`toast.create`, `toast.dismiss`).
 */
export interface ToastAPI {
  /** Shows a toast. Returns its id. */
  show: (options: Omit<ToastItem, 'id'>) => string;
  /** Shows a success toast. Returns its id. */
  success: (message: ReactNode, duration?: number) => string;
  /** Shows an error toast. Returns its id. */
  error: (message: ReactNode, duration?: number) => string;
  /** Shows a warning toast. Returns its id. */
  warning: (message: ReactNode, duration?: number) => string;
  /** Shows an info toast. Returns its id. */
  info: (message: ReactNode, duration?: number) => string;
  /** Dismisses one toast. */
  dismiss: (id: string) => void;
  /** Dismisses every toast. */
  dismissAll: () => void;
}

const ToastContext = createContext<ToastAPI | null>(null);

/** The text of a node, for a toast title. */
export function toastText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(toastText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return Children.toArray(node.props.children).map(toastText).join('');
  }
  return '';
}

/** The 1.x position classes as a placement. */
export function toastPlacement(position: ToastPosition[]): ToastPlacement {
  const vertical = position.includes('toast-top') ? 'top' : 'bottom';
  if (position.includes('toast-start')) return `${vertical}-start`;
  if (position.includes('toast-center')) return vertical;
  return `${vertical}-end`;
}

/**
 * The 1.x imperative toast API. Must be called inside a {@link ToastProvider}.
 *
 * @deprecated Use `toast.create({ title, color })` with a `Toaster`.
 */
export function useToast(): ToastAPI {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

/**
 * Props for the deprecated {@link ToastProvider}.
 *
 * @deprecated Use `ToasterProps`.
 */
export interface ToastProviderProps {
  /** The app, or the part of it that calls {@link useToast}. */
  children: ReactNode;
  /** Milliseconds before a toast dismisses itself. `0` keeps toasts. Use Toaster's `duration`. @defaultValue `5000` */
  defaultDuration?: number;
  /** At most this many show at once; the rest queue. Use Toaster's `max`. @defaultValue `5` */
  max?: number;
  /** DaisyUI position classes. Use Toaster's `placement`. @defaultValue `['toast-end', 'toast-bottom']` */
  position?: ToastPosition[];
}

/**
 * Deprecated: renders its children and a {@link Toaster}, and gives them
 * {@link useToast}.
 *
 * @deprecated Render one `Toaster` and call `toast.create()`.
 */
export function ToastProvider({
  children,
  defaultDuration = 5000,
  max = 5,
  position = ['toast-end', 'toast-bottom'],
}: ToastProviderProps) {
  devWarnOnce(
    'ToastProvider',
    'ToastProvider is deprecated; render a Toaster and use toast.create().',
  );

  const api = useMemo<ToastAPI>(() => {
    const show = ({ message, color, duration }: Omit<ToastItem, 'id'>) =>
      toast.create({ title: toastText(message), color, duration: duration ?? defaultDuration });
    return {
      show,
      success: (message, duration) => show({ message, color: 'success', duration }),
      error: (message, duration) => show({ message, color: 'error', duration }),
      warning: (message, duration) => show({ message, color: 'warning', duration }),
      info: (message, duration) => show({ message, color: 'info', duration }),
      dismiss: (id) => toast.dismiss(id),
      dismissAll: () => toast.dismiss(),
    };
  }, [defaultDuration]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <Toaster duration={defaultDuration} max={max} placement={toastPlacement(position)} />
    </ToastContext.Provider>
  );
}

/**
 * Props for the deprecated {@link ToastMessage}.
 *
 * @deprecated Use `ToastProps`.
 */
export interface ToastMessageProps extends Omit<ToastProps, 'title' | 'color' | 'onOpenChange'> {
  /** The toast to show. Use Toast's `title` and `color`. */
  toast: ToastItem;
  /** Called with the toast's id when its close button is pressed. */
  onDismiss: (id: string) => void;
}

/**
 * Deprecated: renders a static {@link Toast}.
 *
 * @deprecated Use `Toast`.
 */
export const ToastMessage = forwardRef<HTMLDivElement, ToastMessageProps>(
  ({ toast: item, onDismiss, ...rest }, ref) => {
    devWarnOnce('ToastMessage', 'ToastMessage is deprecated; use Toast.');
    return (
      <Toast
        {...rest}
        ref={ref}
        title={item.message}
        color={item.color ?? 'neutral'}
        onOpenChange={() => onDismiss(item.id)}
      />
    );
  },
);

ToastMessage.displayName = 'ToastMessage';
