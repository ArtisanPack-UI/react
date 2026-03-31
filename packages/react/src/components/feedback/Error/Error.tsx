/**
 * @module ErrorDisplay
 *
 * Displays a user-friendly error state with an optional icon, title,
 * message, and retry action. Intended for use in error boundaries,
 * failed data fetches, or any recoverable failure scenario.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link ErrorDisplay} component.
 */
export interface ErrorDisplayProps extends HTMLAttributes<HTMLDivElement> {
  /** Error title displayed as a heading. Defaults to `"Something went wrong"`. */
  title?: string;
  /** Descriptive error message displayed below the title. */
  message?: string;
  /** Optional icon or illustration rendered above the title. */
  icon?: ReactNode;
  /** Callback fired when the retry button is clicked. When provided, a retry button is rendered. */
  onRetry?: () => void;
  /** Custom label for the retry button. Defaults to `"Try again"`. */
  retryLabel?: string;
}

/**
 * Error display component for recoverable failure states.
 *
 * Renders an `alert` role container with a title, optional message,
 * and a retry button when an `onRetry` callback is provided.
 *
 * @example
 * ```tsx
 * <ErrorDisplay
 *   title="Failed to load data"
 *   message="Please check your connection and try again."
 *   onRetry={() => refetch()}
 * />
 * ```
 */
export const ErrorDisplay = forwardRef<HTMLDivElement, ErrorDisplayProps>(
  (
    {
      title = 'Something went wrong',
      message,
      icon,
      onRetry,
      retryLabel = 'Try again',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'flex flex-col items-center justify-center gap-4 py-12 text-center',
          className,
        )}
        {...rest}
      >
        {icon && <div className="text-error text-6xl">{icon}</div>}
        <h3 className="text-lg font-semibold text-error">{title}</h3>
        {message && <p className="text-base-content/60 max-w-sm">{message}</p>}
        {children}
        {onRetry && (
          <button type="button" className="btn btn-error btn-sm mt-2" onClick={onRetry}>
            {retryLabel}
          </button>
        )}
      </div>
    );
  },
);

ErrorDisplay.displayName = 'ErrorDisplay';
