/**
 * @module Steps
 *
 * The design-system Steps (#56): progress through a sequence, rendering the
 * `.apui-steps` markup contract styled by `@artisanpack-ui/css`. Compose it
 * from {@link Step} children, or pass the same structure as `steps`.
 *
 * @packageDocumentation
 */

import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type ReactNode,
} from 'react';

import { IconSvg } from '../../../internal/icon';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';

/** A step's state. Emitted as `data-state`. */
export type StepState = 'complete' | 'current' | 'upcoming' | 'error';

/** The orientation of a {@link Steps}. Emitted as `data-orientation`. */
export type StepsOrientation = 'horizontal' | 'vertical';

/** The parts a {@link Steps} accepts extra classes for, its steps' included. */
export type StepsPart = 'root' | 'step' | 'marker' | 'title' | 'connector' | 'description';

/** One step in {@link StepsProps.steps}. */
export interface StepItem {
  /** The step's name. */
  title: ReactNode;
  /** Supporting text under the title. */
  description?: ReactNode;
  /** The step's own state; without it, `value` decides. */
  state?: StepState;
  /** An icon name that replaces the marker's number or check. */
  icon?: string;
}

/** Props for the {@link Steps} component. Native `<ol>` attributes go to the root. */
export interface StepsProps extends Omit<HTMLAttributes<HTMLOListElement>, 'onChange'> {
  /** The steps as data, rendering the same children as composition. Rendered before `children`. */
  steps?: StepItem[];
  /** The current step, from 1. Steps before it are complete, after it upcoming. */
  value?: number;
  /** A row, or a column with room for longer descriptions. @defaultValue `'horizontal'` */
  orientation?: StepsOrientation;
  /** Completed steps' titles become buttons that call `onValueChange`. @defaultValue `false` */
  clickable?: boolean;
  /** The list's accessible name. */
  label?: string;
  /** Hidden text in a complete step's marker; translate it. @defaultValue `'Completed'` */
  completeLabel?: string;
  /** Hidden text in an error step's marker; translate it. @defaultValue `'Error'` */
  errorLabel?: string;
  /** Extra classes per part, its steps' included; `classes.root` merges with `className`. */
  classes?: PartClasses<StepsPart>;
  /** A completed step was chosen while `clickable`. Setting `value` doesn't call it. */
  onValueChange?: (value: number) => void;
}

/** Props for a {@link Step}. Native `<li>` attributes go to the step. */
export interface StepProps extends Omit<LiHTMLAttributes<HTMLLIElement>, 'title'> {
  /** The step's name. */
  title?: ReactNode;
  /** Supporting text under the title. */
  description?: ReactNode;
  /** The step's own state; without it, the parent's `value` decides. */
  state?: StepState;
  /** An icon name that replaces the marker's number or check. */
  icon?: string;
}

interface StepsContextValue {
  value?: number;
  clickable: boolean;
  completeLabel: string;
  errorLabel: string;
  classes: PartClasses<StepsPart>;
  onValueChange?: (value: number) => void;
}

const StepsContext = createContext<StepsContextValue | null>(null);
const StepNumberContext = createContext<number>(1);

const STATES: readonly StepState[] = ['complete', 'current', 'upcoming', 'error'];

/**
 * Shows progress through a sequence. The ref points at the `<ol>`.
 *
 * @example
 * ```tsx
 * <Steps value={2}>
 *   <Step title="Cart" />
 *   <Step title="Shipping" />
 *   <Step title="Payment" />
 * </Steps>
 * ```
 */
export const Steps = forwardRef<HTMLOListElement, StepsProps>(
  (
    {
      steps,
      value,
      orientation = 'horizontal',
      clickable = false,
      label,
      completeLabel = 'Completed',
      errorLabel = 'Error',
      classes = {},
      className,
      onValueChange,
      children,
      ...rest
    },
    ref,
  ) => {
    const fromData = (steps ?? []).map((step, index) => (
      <Step
        key={`apui-step-${index}`}
        title={step.title}
        description={step.description}
        state={step.state}
        icon={step.icon}
      />
    ));
    const composed = [...fromData, ...Children.toArray(children).filter(isValidElement)];

    return (
      <StepsContext.Provider
        value={{ value, clickable, completeLabel, errorLabel, classes, onValueChange }}
      >
        <ol
          {...rest}
          ref={ref}
          className={cx('apui-steps', classes.root, className)}
          data-orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
          aria-label={label}
        >
          {composed.map((child, index) => (
            <StepNumberContext.Provider key={child.key ?? index} value={index + 1}>
              {child}
            </StepNumberContext.Provider>
          ))}
        </ol>
      </StepsContext.Provider>
    );
  },
);

Steps.displayName = 'Steps';

/**
 * One step of a {@link Steps}: a direct child, numbered by its position. The
 * ref points at the `<li>`.
 */
export const Step = forwardRef<HTMLLIElement, StepProps>(
  ({ title, description, state, icon, className, children, ...rest }, ref) => {
    const steps = useContext(StepsContext);
    const number = useContext(StepNumberContext);
    const classes = steps?.classes ?? {};

    let resolved: StepState = 'upcoming';
    if (state !== undefined && STATES.includes(state)) resolved = state;
    else if (steps?.value !== undefined) {
      resolved =
        number < steps.value ? 'complete' : number === steps.value ? 'current' : 'upcoming';
    }

    const markerIcon =
      icon ?? (resolved === 'complete' ? 'check' : resolved === 'error' ? 'x' : undefined);
    const stateLabel =
      resolved === 'complete'
        ? (steps?.completeLabel ?? 'Completed')
        : resolved === 'error'
          ? (steps?.errorLabel ?? 'Error')
          : null;
    const titleContent = hasContent(children) ? children : title;
    const isButton = resolved === 'complete' && steps?.clickable === true;

    return (
      <li
        {...rest}
        ref={ref}
        className={cx(classes.step, className)}
        data-scope="steps"
        data-part="step"
        data-state={resolved}
        aria-current={resolved === 'current' ? 'step' : undefined}
      >
        <span className={classes.marker} data-scope="steps" data-part="marker">
          {markerIcon !== undefined ? (
            <IconSvg name={markerIcon} />
          ) : (
            <span aria-hidden="true">{number}</span>
          )}
          {stateLabel !== null ? <span className="apui-sr-only">{stateLabel}</span> : null}
        </span>
        {isButton ? (
          <button
            type="button"
            className={classes.title}
            data-scope="steps"
            data-part="title"
            onClick={() => steps?.onValueChange?.(number)}
          >
            {titleContent}
          </button>
        ) : (
          <span className={classes.title} data-scope="steps" data-part="title">
            {titleContent}
          </span>
        )}
        <span
          className={classes.connector}
          data-scope="steps"
          data-part="connector"
          aria-hidden="true"
        />
        {hasContent(description) ? (
          <span className={classes.description} data-scope="steps" data-part="description">
            {description}
          </span>
        ) : null}
      </li>
    );
  },
);

Step.displayName = 'Step';
