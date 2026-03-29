import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor } from '@artisanpack-ui/tokens';

type AlertColor = Extract<DaisyColor, 'info' | 'success' | 'warning' | 'error'>;

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'> {
  /** The color variant of the alert */
  color?: AlertColor;
  /** Optional icon to display before the alert content */
  icon?: ReactNode;
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
  /** Controlled visibility — when provided, the parent manages show/hide */
  visible?: boolean;
  /** Callback fired when the alert is dismissed */
  onDismiss?: () => void;
}

const colorMap: Record<AlertColor, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
};

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
