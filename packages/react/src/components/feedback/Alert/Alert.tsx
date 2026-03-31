/**
 * @module Alert
 *
 * Displays contextual feedback messages such as success confirmations,
 * warnings, informational notices, or error messages. Supports both
 * controlled and uncontrolled visibility, optional dismiss behavior,
 * and automatic ARIA live region announcements.
 *
 * @packageDocumentation
 */

import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

/**
 * Subset of DaisyUI colors applicable to alerts.
 */
type AlertColor = Extract<DaisyColor, 'info' | 'success' | 'warning' | 'error'>;

/**
 * Props for the {@link Alert} component.
 */
export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** The color variant of the alert. Determines background and text styling. */
  color?: AlertColor;
  /** Optional icon to display before the alert content. */
  icon?: ReactNode;
  /** Whether the alert can be dismissed by the user via a close button. */
  dismissible?: boolean;
  /**
   * Controlled visibility -- when provided, the parent manages show/hide.
   * When omitted the component manages its own internal visibility state.
   */
  visible?: boolean;
  /** Callback fired when the alert is dismissed (via the close button). */
  onDismiss?: () => void;
}

const colorMap: Record<AlertColor, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
};

/**
 * Alert component for contextual feedback messages.
 *
 * Uses `aria-live` to announce messages to assistive technologies --
 * `assertive` for errors and warnings, `polite` for info and success.
 *
 * @example
 * ```tsx
 * // Simple informational alert
 * <Alert color="info">Your profile has been updated.</Alert>
 *
 * // Dismissible error alert
 * <Alert color="error" dismissible onDismiss={() => console.log('dismissed')}>
 *   Something went wrong.
 * </Alert>
 *
 * // Controlled visibility
 * <Alert color="success" visible={showAlert} onDismiss={() => setShowAlert(false)} dismissible>
 *   Saved successfully!
 * </Alert>
 * ```
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      color,
      icon,
      dismissible = false,
      visible: controlledVisible,
      onDismiss,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [internalVisible, setInternalVisible] = useState(true);
    const isControlled = controlledVisible !== undefined;
    const isVisible = isControlled ? controlledVisible : internalVisible;

    if (!isVisible) {
      return null;
    }

    const handleDismiss = () => {
      if (!isControlled) {
        setInternalVisible(false);
      }
      onDismiss?.();
    };

    return (
      <div
        ref={ref}
        role="alert"
        aria-live={color === 'error' || color === 'warning' ? 'assertive' : 'polite'}
        className={cn('alert', color && colorMap[color], className)}
        {...rest}
      >
        {icon && <span className="alert-icon">{icon}</span>}
        <div className="flex-1">{children}</div>
        {dismissible && (
          <button
            type="button"
            aria-label="Dismiss alert"
            className="btn btn-sm btn-ghost"
            onClick={handleDismiss}
          >
            &#x2715;
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = 'Alert';
