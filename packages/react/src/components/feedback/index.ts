/**
 * @module feedback
 *
 * Feedback components for communicating status, progress, and errors
 * to users. Includes alerts, loading indicators, skeletons, empty
 * states, error displays, and toasts. Toast and Toaster render the
 * design-system markup contract (styled by `@artisanpack-ui/css`);
 * ToastProvider, ToastMessage and useToast are deprecated in their favor.
 *
 * @packageDocumentation
 */

export { Alert } from './Alert/Alert';
export type { AlertProps } from './Alert/Alert';

export { Loading } from './Loading/Loading';
export type { LoadingProps } from './Loading/Loading';

export { Skeleton } from './Skeleton/Skeleton';
export type { SkeletonProps } from './Skeleton/Skeleton';

export { EmptyState } from './EmptyState/EmptyState';
export type { EmptyStateProps } from './EmptyState/EmptyState';

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
export type { ToastProviderProps, ToastItem, ToastAPI } from './ToastProvider/ToastProvider';
