/**
 * @module ValidationSummary
 *
 * The design-system ValidationSummary (#53): lists every error in a form
 * after a failed submit, each linked to its field, rendering the
 * `.apui-validation-summary` markup contract styled by `@artisanpack-ui/css`.
 * It is not ErrorState.
 */

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { IconSvg } from '../../../internal/icon';
import { cx, hasContent, type PartClasses } from '../../../internal/parts';

/** The color of a {@link ValidationSummary}. */
export type ValidationSummaryColor = 'error' | 'warning';

/** The parts a {@link ValidationSummary} accepts extra classes for. */
export type ValidationSummaryPart = 'root' | 'icon' | 'title' | 'list' | 'item' | 'link';

/** One error: `field` is the control's id or name. */
export interface ValidationSummaryError {
  field: string;
  message: string;
}

/** Errors as a list, or a map of field to message(s). */
export type ValidationSummaryErrors =
  | ValidationSummaryError[]
  | Record<string, string | string[] | undefined>;

/** Normalizes errors to a list, taking the first message of each field in a map. */
export function normalizeValidationErrors(
  errors: ValidationSummaryErrors | undefined,
): ValidationSummaryError[] {
  if (!errors) return [];
  if (Array.isArray(errors)) return errors.filter((error) => Boolean(error?.message));
  return Object.entries(errors).flatMap(([field, messages]) => {
    const message = Array.isArray(messages) ? messages[0] : messages;
    return message ? [{ field, message }] : [];
  });
}

/** The field an error links to: by id, then name, then any `wire:model*` attribute. */
export function findValidationTarget(field: string, doc: Document = document): HTMLElement | null {
  const byId = doc.getElementById(field);
  if (byId) return byId;
  const byName = [...doc.querySelectorAll<HTMLElement>('[name]')].find(
    (element) => element.getAttribute('name') === field,
  );
  if (byName) return byName;
  return (
    [...doc.querySelectorAll<HTMLElement>('*')].find((element) =>
      [...element.attributes].some(
        (attribute) => attribute.name.startsWith('wire:model') && attribute.value === field,
      ),
    ) ?? null
  );
}

/** Props for the {@link ValidationSummary} component. Native `<div>` attributes go to the root. */
export interface ValidationSummaryProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title' | 'color'
> {
  /** The errors: `[{ field, message }]`, or a map of field to message(s). Renders nothing when empty. */
  errors?: ValidationSummaryErrors;
  /** Error blocks the submit (alert, focused); warning is a non-blocking status. @defaultValue `'error'` */
  color?: ValidationSummaryColor;
  /** The heading. Defaults to "Fix N fields" or "N recommendations". */
  title?: ReactNode;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<ValidationSummaryPart>;
}

const defaultTitle = (count: number, color: ValidationSummaryColor) =>
  color === 'warning'
    ? count === 1
      ? '1 recommendation'
      : `${count} recommendations`
    : count === 1
      ? 'Fix 1 field'
      : `Fix ${count} fields`;

/**
 * Lists a form's errors after a failed submit. With the error color it
 * takes focus when it appears; each link moves focus to its field. The ref
 * points at the root `<div>`.
 *
 * @example
 * ```tsx
 * <ValidationSummary errors={{ email: 'Enter a valid email address.' }} />
 * ```
 */
export const ValidationSummary = forwardRef<HTMLDivElement, ValidationSummaryProps>(
  ({ errors, color = 'error', title, classes = {}, className, ...rest }, forwardedRef) => {
    const list = normalizeValidationErrors(errors);
    const count = list.length;
    const rootRef = useRef<HTMLDivElement | null>(null);
    const setRefs = useCallback(
      (element: HTMLDivElement | null) => {
        rootRef.current = element;
        if (typeof forwardedRef === 'function') forwardedRef(element);
        else if (forwardedRef) forwardedRef.current = element;
      },
      [forwardedRef],
    );

    // Focus when errors appear (mount with errors, or none → some).
    const shown = count > 0;
    useEffect(() => {
      if (shown && color === 'error') rootRef.current?.focus();
    }, [shown, color]);

    if (!shown) return null;

    const handleClick = (field: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      const target = findValidationTarget(field, event.currentTarget.ownerDocument);
      if (!target) return;
      event.preventDefault();
      target.focus();
      target.scrollIntoView?.({ block: 'center' });
    };

    return (
      <div
        {...rest}
        ref={setRefs}
        className={cx('apui-validation-summary', classes.root, className)}
        data-color={color}
        role={color === 'error' ? 'alert' : 'status'}
        tabIndex={color === 'error' ? -1 : undefined}
      >
        <span
          className={classes.icon}
          data-scope="validation-summary"
          data-part="icon"
          aria-hidden="true"
        >
          <IconSvg name={color === 'error' ? 'circle-alert' : 'triangle-alert'} />
        </span>
        <p className={classes.title} data-scope="validation-summary" data-part="title">
          {hasContent(title) ? title : defaultTitle(count, color)}
        </p>
        <ul className={classes.list} data-scope="validation-summary" data-part="list">
          {list.map((error, index) => (
            <li
              key={`${error.field}-${index}`}
              className={classes.item}
              data-scope="validation-summary"
              data-part="item"
            >
              <a
                className={classes.link}
                data-scope="validation-summary"
                data-part="link"
                href={`#${error.field}`}
                onClick={handleClick(error.field)}
              >
                {error.message}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  },
);

ValidationSummary.displayName = 'ValidationSummary';
