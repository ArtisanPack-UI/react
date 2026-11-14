/**
 * @module internal/field
 *
 * The field anatomy Input, Select and Checkbox share (D-018): ids, the
 * label with its required mark, help text and the error message.
 *
 * @internal
 */

import { useId, type ReactNode } from 'react';

import { IconSvg } from './icon';
import { hasContent } from './parts';

/** The ids a field renders: the control, and its help and error text. */
export interface FieldIds {
  id: string;
  /** Id of the help part (`hint` or `description`), when it renders. */
  helpId: string | undefined;
  /** Id of the error part, when it renders. */
  errorId: string | undefined;
  /** The control's `aria-describedby`: help then error, then any caller ids. */
  describedBy: string | undefined;
}

/**
 * Works out a field's ids. An explicit `id` wins over `useId()`; help and
 * error ids exist only when their parts render.
 */
export function useFieldIds(
  explicitId: string | undefined,
  help: { suffix: 'hint' | 'description'; content: ReactNode },
  error: string | undefined,
  callerDescribedBy: string | undefined,
): FieldIds {
  const generated = useId();
  const id = explicitId ?? generated;
  const helpId = hasContent(help.content) ? `${id}-${help.suffix}` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [helpId, errorId, callerDescribedBy].filter(Boolean).join(' ') || undefined;
  return { id, helpId, errorId, describedBy };
}

/** The field's label, with the required mark when `required`. */
export function FieldLabel({
  scope,
  htmlFor,
  label,
  required,
  className,
  requiredClassName,
}: {
  scope: string;
  htmlFor: string;
  label: ReactNode;
  required: boolean;
  className?: string;
  requiredClassName?: string;
}) {
  if (!hasContent(label)) return null;
  return (
    <label className={className} data-scope={scope} data-part="label" htmlFor={htmlFor}>
      {label}
      {required ? (
        <span
          className={requiredClassName}
          data-scope={scope}
          data-part="required"
          aria-hidden="true"
        >
          *
        </span>
      ) : null}
    </label>
  );
}

/** A help part (`hint` or `description`), when there is content. */
export function FieldHelp({
  scope,
  part,
  id,
  children,
  className,
}: {
  scope: string;
  part: 'hint' | 'description';
  id: string | undefined;
  children: ReactNode;
  className?: string;
}) {
  if (id === undefined) return null;
  return (
    <p className={className} data-scope={scope} data-part={part} id={id}>
      {children}
    </p>
  );
}

/** The error part, with the `circle-alert` icon before the message. */
export function FieldError({
  scope,
  id,
  message,
  className,
}: {
  scope: string;
  id: string | undefined;
  message: string | undefined;
  className?: string;
}) {
  if (id === undefined || !message) return null;
  return (
    <p className={className} data-scope={scope} data-part="error" id={id}>
      <IconSvg name="circle-alert" />
      {message}
    </p>
  );
}
