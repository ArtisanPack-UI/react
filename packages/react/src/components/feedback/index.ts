/**
 * @module feedback
 *
 * Feedback components for communicating status, progress, and errors
 * to users. Includes alerts, loading indicators, skeletons, empty
 * states, error displays, and toasts. Toast and Toaster render the
 * design-system markup contract (styled by `@artisanpack-ui/css`);
 * ToastProvider, ToastMessage and useToast are deprecated aliases built on them.
 *
 * @packageDocumentation
 */

export { Alert } from './Alert/Alert';
export type { AlertProps, AlertColor, AlertVariant, AlertSurface, AlertPart } from './Alert/Alert';

export { Loading } from './Loading/Loading';
export type {
  LoadingProps,
  LoadingVariant,
  LoadingSize,
  LoadingColor,
  LoadingPart,
} from './Loading/Loading';

export { Skeleton } from './Skeleton/Skeleton';
export type { SkeletonProps, SkeletonShape } from './Skeleton/Skeleton';

export { EmptyState } from './EmptyState/EmptyState';
export type {
  EmptyStateProps,
  EmptyStateVariant,
  EmptyStateSize,
  EmptyStateAlign,
  EmptyStatePart,
} from './EmptyState/EmptyState';

export { ErrorState } from './ErrorState/ErrorState';
export type { ErrorStateProps, ErrorStateVariant, ErrorStatePart } from './ErrorState/ErrorState';

/** @deprecated Use ErrorState. */
export { ErrorDisplay } from './Error/Error';
export type { ErrorDisplayProps } from './Error/Error';

export { Toast } from './Toast/Toast';
export type { ToastProps, ToastColor, ToastVariant, ToastSurface, ToastPart } from './Toast/Toast';

export { Toaster, toast, createToaster } from './Toast/Toaster';
export type {
  ToasterProps,
  ToastPlacement,
  ToastOptions,
  ToasterOptions,
  ToasterInstance,
} from './Toast/Toaster';

export { ToastProvider, ToastMessage, useToast } from './ToastProvider/ToastProvider';
export type {
  ToastProviderProps,
  ToastItem,
  ToastAPI,
  ToastMessageProps,
} from './ToastProvider/ToastProvider';
