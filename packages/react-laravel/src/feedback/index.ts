/**
 * Feedback utilities that show Laravel flash messages as design-system toasts.
 *
 * @packageDocumentation
 */

export { InertiaToastProvider } from './InertiaToastProvider';
export type { InertiaToastProviderProps } from './InertiaToastProvider';

export { useFlashMessages, FLASH_TYPES } from './useFlashMessages';
export type { UseFlashMessagesOptions, FlashType } from './useFlashMessages';
