import { useEffect, useMemo, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { useToast, type ToastAPI } from '@artisanpack-ui/react';
import type { FlashMessages, SharedPageProps } from '../types';

/**
 * Hook that automatically displays Inertia flash messages as toasts.
 * Must be used within a `<ToastProvider>` from `@artisanpack-ui/react`.
 *
 * Reads from `page.props.flash` and triggers toasts for `success`, `error`,
 * `warning`, and `info` keys.
 *
 * @example
 * ```tsx
 * function App({ children }) {
 *   return (
 *     <ToastProvider>
 *       <FlashListener />
 *       {children}
 *     </ToastProvider>
 *   );
 * }
 *
 * function FlashListener() {
 *   useFlashMessages();
 *   return null;
 * }
 * ```
 */
export function useFlashMessages(): void {
  const page = usePage<SharedPageProps>();
  const flash: FlashMessages = useMemo(() => page.props.flash ?? {}, [page.props.flash]);
  const toast: ToastAPI = useToast();
  const shownRef = useRef<string | null>(null);

  // Use the page URL + flash content as a dedup key so we only show each flash once
  const flashKey = JSON.stringify(flash) + page.url;

  useEffect(() => {
    if (shownRef.current === flashKey) return;
    shownRef.current = flashKey;

    if (flash.success) toast.success(flash.success);
    if (flash.error) toast.error(flash.error);
    if (flash.warning) toast.warning(flash.warning);
    if (flash.info) toast.info(flash.info);
  }, [flashKey, flash, toast]);
}
