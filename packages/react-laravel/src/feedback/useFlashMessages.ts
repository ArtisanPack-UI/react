import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast, type ToasterInstance } from '@artisanpack-ui/react/feedback';
import type { FlashMessages, SharedPageProps } from '../types';

/** The flash keys shown as toasts, in order, each with the toast color of the same name. */
export const FLASH_TYPES = ['success', 'error', 'warning', 'info'] as const;

/** A flash key shown as a toast. */
export type FlashType = (typeof FLASH_TYPES)[number];

/** Options for {@link useFlashMessages}. */
export interface UseFlashMessagesOptions {
  /**
   * The toaster to create the toasts in, from `createToaster()`. Render it
   * with a `Toaster`. @defaultValue the default `toast`
   */
  toaster?: ToasterInstance;
  /**
   * Milliseconds before each toast dismisses itself; 0 keeps them.
   * @defaultValue the toaster's duration
   */
  duration?: number;
}

/*
 * The messages already shown, per Inertia page. Each visit gives a new page
 * object, so the same message after another visit shows again; within one
 * visit it shows once, however often the effect runs: a re-render with a new
 * `flash` object carrying the same messages, Strict Mode's second effect run,
 * or a remount. Module-level, so a remount doesn't forget; weak, so pages
 * left behind are collected.
 */
const shownByPage = new WeakMap<object, Set<string>>();

/**
 * Shows Laravel's flash messages as design-system toasts, once per visit.
 *
 * Reads `success`, `error`, `warning` and `info` from `page.props.flash`
 * (share them from `HandleInertiaRequests` as `flash`) and creates a toast
 * for each with `toast.create({ title, color })`, in the toaster a
 * `Toaster` on the page renders. {@link InertiaToastProvider} does both.
 *
 * @example
 * ```tsx
 * import { Toaster } from '@artisanpack-ui/react';
 *
 * function FlashToasts() {
 *   useFlashMessages();
 *   return <Toaster />;
 * }
 * ```
 */
export function useFlashMessages({
  toaster = toast,
  duration,
}: UseFlashMessagesOptions = {}): void {
  const page = usePage<SharedPageProps>();
  const flash: FlashMessages | undefined = page.props.flash;

  useEffect(() => {
    if (!flash) return;
    let shown = shownByPage.get(page);
    if (!shown) {
      shown = new Set();
      shownByPage.set(page, shown);
    }
    for (const type of FLASH_TYPES) {
      const message = flash[type];
      if (typeof message !== 'string' || message === '') continue;
      const key = `${type}:${message}`;
      if (shown.has(key)) continue;
      shown.add(key);
      toaster.create(
        duration === undefined
          ? { title: message, color: type }
          : { title: message, color: type, duration },
      );
    }
  }, [page, flash, toaster, duration]);
}
