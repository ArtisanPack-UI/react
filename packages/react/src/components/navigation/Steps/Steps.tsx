/**
 * @module Steps
 *
 * Multi-step progress indicator component using DaisyUI's steps pattern.
 * Displays a sequence of labeled steps with visual completion state,
 * configurable colors, and vertical or horizontal orientation.
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

/**
 * Represents a single step in the progress indicator.
 */
export interface StepItem {
  /** Display label rendered next to the step indicator. */
  label: ReactNode;
  /** Optional icon or content rendered inside the step circle. */
  icon?: ReactNode;
  /** DaisyUI color override for this individual step, taking precedence over the group color. */
  color?: DaisyColor;
  /** Custom content for the DaisyUI `data-content` attribute on the step circle. */
  dataContent?: string;
}

/**
 * Props for the {@link Steps} component.
 */
export interface StepsProps extends HTMLAttributes<HTMLUListElement> {
  /** Array of step items to display. */
  steps: StepItem[];
  /**
   * Index of the current step (0-based). All steps up to and including this index
   * are visually marked as complete. @defaultValue -1 (no steps complete)
   */
  currentStep?: number;
  /** Whether to render the steps vertically instead of horizontally. */
  vertical?: boolean;
  /** DaisyUI color applied to all completed steps (can be overridden per step). */
  color?: DaisyColor;
  /** Size variant for the step indicators (xs, sm, md, lg). */
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
 *
 * Renders a `<ul>` with `aria-label="Progress"` containing step items.
 * The current step receives `aria-current="step"` for accessibility.
 *
 * @example
 * ```tsx
 * <Steps
 *   steps={[
 *     { label: 'Register' },
 *     { label: 'Choose Plan' },
 *     { label: 'Payment' },
 *     { label: 'Complete' },
 *   ]}
 *   currentStep={1}
 *   color="primary"
 * />
 * ```
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
