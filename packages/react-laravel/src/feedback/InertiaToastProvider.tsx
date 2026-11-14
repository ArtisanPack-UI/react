import type { ReactNode } from 'react';
import { Toaster, type ToasterProps, type ToastPlacement } from '@artisanpack-ui/react/feedback';
import { useFlashMessages } from './useFlashMessages';

/** The 1.x DaisyUI position classes. */
type ToastPosition =
  | 'toast-start'
  | 'toast-center'
  | 'toast-end'
  | 'toast-top'
  | 'toast-middle'
  | 'toast-bottom';

/**
 * Props for the {@link InertiaToastProvider} component: the design-system
 * `Toaster`'s props, and the content to render beside it.
 */
export interface InertiaToastProviderProps extends ToasterProps {
  /** The application content. */
  children?: ReactNode;
  /** @deprecated 1.x: use `duration`. */
  defaultDuration?: number;
  /** @deprecated 1.x DaisyUI position classes: use `placement`. */
  position?: ToastPosition[];
}

/** The 1.x position classes as a placement. */
function placementFrom(position: ToastPosition[]): ToastPlacement {
  const vertical = position.includes('toast-top') ? 'top' : 'bottom';
  if (position.includes('toast-start')) return `${vertical}-start`;
  if (position.includes('toast-center')) return vertical;
  return `${vertical}-end`;
}

/** Shows the flash messages in the provider's toaster. */
function FlashListener({ toaster, duration }: Pick<ToasterProps, 'toaster' | 'duration'>) {
  // The duration goes to each toast: on the first page the flash toasts are
  // created before the Toaster has applied its options.
  useFlashMessages({ toaster, duration });
  return null;
}

/**
 * Renders its children and a design-system `Toaster`, and shows Laravel's
 * `success`, `error`, `warning` and `info` flash messages in it as toasts,
 * once per visit (see {@link useFlashMessages}). Takes the `Toaster`'s
 * props (`placement`, `duration`, `max`, `toaster`, …). Toasts you create
 * with `toast.create()` show in the same region.
 *
 * @example
 * ```tsx
 * // In your app layout:
 * function AppLayout({ children }) {
 *   return (
 *     <InertiaToastProvider placement="top-end">
 *       <main>{children}</main>
 *     </InertiaToastProvider>
 *   );
 * }
 *
 * // In your Laravel controller:
 * // return redirect()->route('dashboard')->with('success', 'Profile updated!');
 * // → shows a success toast
 * ```
 */
export function InertiaToastProvider({
  children,
  defaultDuration,
  position,
  duration,
  placement,
  ...toasterProps
}: InertiaToastProviderProps) {
  const toastDuration = duration ?? defaultDuration;
  return (
    <>
      {children}
      <FlashListener toaster={toasterProps.toaster} duration={toastDuration} />
      <Toaster
        {...toasterProps}
        duration={toastDuration}
        placement={placement ?? (position ? placementFrom(position) : undefined)}
      />
    </>
  );
}
