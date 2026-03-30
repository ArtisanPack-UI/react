import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

export interface StepItem {
  /** Step label */
  label: ReactNode;
  /** Icon or content inside the step circle */
  icon?: ReactNode;
  /** DaisyUI color override for this step */
  color?: DaisyColor;
  /** Optional data attribute content */
  dataContent?: string;
}

export interface StepsProps extends HTMLAttributes<HTMLUListElement> {
  /** Step items */
  steps: StepItem[];
  /** Index of the current step (0-based). All steps up to and including this index are marked complete. */
  currentStep?: number;
  /** Vertical layout */
  vertical?: boolean;
  /** DaisyUI color for completed steps */
  color?: DaisyColor;
  /** Step size */
  size?: Size;
}

const sizeMap: Record<Size, string> = {
  xs: 'steps-xs',
  sm: 'steps-sm',
  md: 'steps-md',
  lg: 'steps-lg',
};

const colorMap: Record<DaisyColor, string> = {
  primary: 'step-primary',
  secondary: 'step-secondary',
  accent: 'step-accent',
  success: 'step-success',
  warning: 'step-warning',
  error: 'step-error',
  info: 'step-info',
  neutral: 'step-neutral',
};

/**
 * Multi-step progress indicator with DaisyUI styling.
 */
export const Steps = forwardRef<HTMLUListElement, StepsProps>(
  ({ steps, currentStep = -1, vertical = false, color, size, className, ...rest }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn('steps', vertical && 'steps-vertical', size && sizeMap[size], className)}
        aria-label="Progress"
        {...rest}
      >
        {steps.map((step, index) => {
          const isComplete = index <= currentStep;
          const isCurrent = index === currentStep;
          const stepColor = step.color ?? color;

          return (
            <li
              key={index}
              className={cn('step', isComplete && stepColor && colorMap[stepColor])}
              aria-current={isCurrent ? 'step' : undefined}
              data-content={step.dataContent}
            >
              {step.icon && <span aria-hidden="true">{step.icon}</span>}
              {step.label}
            </li>
          );
        })}
      </ul>
    );
  },
);

Steps.displayName = 'Steps';
