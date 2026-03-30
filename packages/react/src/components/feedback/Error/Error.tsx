import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface ErrorDisplayProps extends HTMLAttributes<HTMLDivElement> {
  /** Error title */
  title?: string;
  /** Error message to display */
  message?: string;
  /** Optional icon or illustration */
  icon?: ReactNode;
  /** Callback fired when the retry button is clicked */
  onRetry?: () => void;
  /** Custom label for the retry button */
  retryLabel?: string;
}

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
