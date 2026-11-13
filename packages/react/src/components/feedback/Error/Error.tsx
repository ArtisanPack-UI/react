/**
 * @module ErrorDisplay
 *
 * Deprecated alias of {@link ErrorState} (#60), kept for 1.x code. It maps
 * the old props onto ErrorState: `message` (then any children) →
 * `description`, and `onRetry` with `retryLabel` → a Try again button in
 * `actions`.
 *
 * @deprecated Use `ErrorState`.
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';

import { devWarnOnce, hasContent } from '../../../internal/parts';
import { Button } from '../../form/Button/Button';
import { ErrorState, type ErrorStateProps } from '../ErrorState/ErrorState';

/**
 * Props for the deprecated {@link ErrorDisplay}.
 *
 * @deprecated Use `ErrorStateProps`.
 */
export interface ErrorDisplayProps extends Omit<ErrorStateProps, 'title' | 'description'> {
  /** The heading. @defaultValue `'Something went wrong'` */
  title?: ReactNode;
  /** The description. Use ErrorState's `description`. */
  message?: ReactNode;
  /** Adds a Try again button that calls this. */
  onRetry?: () => void;
  /** The retry button's text. @defaultValue `'Try again'` */
  retryLabel?: string;
}

/**
 * Deprecated: renders an {@link ErrorState}.
 *
 * @deprecated Use `ErrorState`.
 */
export const ErrorDisplay = forwardRef<HTMLDivElement, ErrorDisplayProps>(
  (
    {
      title = 'Something went wrong',
      message,
      onRetry,
      retryLabel = 'Try again',
      actions,
      children,
      ...rest
    },
    ref,
  ) => {
    devWarnOnce('ErrorDisplay', 'ErrorDisplay is deprecated; use ErrorState.');
    // The message and any children share the description, message first.
    const description =
      hasContent(message) && hasContent(children) ? (
        <>
          {message}
          {children}
        </>
      ) : hasContent(children) ? (
        children
      ) : (
        message
      );
    return (
      <ErrorState
        {...rest}
        ref={ref}
        title={title}
        description={description}
        actions={
          onRetry ? (
            <>
              {actions}
              <Button leadingIcon="refresh-cw" onClick={onRetry}>
                {retryLabel}
              </Button>
            </>
          ) : (
            actions
          )
        }
      />
    );
  },
);

ErrorDisplay.displayName = 'ErrorDisplay';
