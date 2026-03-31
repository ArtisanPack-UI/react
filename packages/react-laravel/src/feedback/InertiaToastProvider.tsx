import type { ReactNode } from 'react';
import { ToastProvider, type ToastProviderProps } from '@artisanpack-ui/react';
import { useFlashMessages } from './useFlashMessages';

/**
 * Internal component that calls useFlashMessages within the ToastProvider context.
 */
function FlashListener() {
  useFlashMessages();
  return null;
}

/**
 * Props for the {@link InertiaToastProvider} component.
 * Extends all `ToastProviderProps` from `@artisanpack-ui/react`.
 */
export interface InertiaToastProviderProps extends ToastProviderProps {
  /** Application content that may trigger or display toasts */
  children: ReactNode;
}

/**
 * Toast provider that automatically displays Inertia flash messages.
 * Wraps `<ToastProvider>` from `@artisanpack-ui/react` and adds flash message
 * listener that converts Laravel's `redirect()->with('success', '...')` into toasts.
 *
 * @example
 * ```tsx
 * // In your app layout:
 * function AppLayout({ children }) {
 *   return (
 *     <InertiaToastProvider position={['toast-end', 'toast-top']}>
 *       <Navbar />
 *       <main>{children}</main>
 *     </InertiaToastProvider>
 *   );
 * }
 *
 * // In your Laravel controller:
 * // return redirect()->route('dashboard')->with('success', 'Profile updated!');
 * // → automatically shows a success toast
 * ```
 */
export function InertiaToastProvider({ children, ...toastProps }: InertiaToastProviderProps) {
  return (
    <ToastProvider {...toastProps}>
      <FlashListener />
      {children}
    </ToastProvider>
  );
}
