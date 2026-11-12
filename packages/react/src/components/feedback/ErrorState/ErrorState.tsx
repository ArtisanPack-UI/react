/**
 * @module ErrorState
 *
 * The design-system ErrorState (#60): explains what failed, what's safe and
 * how to recover, in place of content that couldn't load. Renders the
 * `.apui-error-state` markup contract styled by `@artisanpack-ui/css`.
 * Pairs with EmptyState; it isn't ValidationSummary, which lists form errors.
 *
 * @packageDocumentation
 */

import { forwardRef, useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';

import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';
import {
  headingTag,
  iconContent,
  type EmptyStateAlign,
  type EmptyStateSize,
} from '../EmptyState/EmptyState';

/** What failed, for an {@link ErrorState}. */
export type ErrorStateVariant = 'request' | 'offline' | 'not-found' | 'forbidden';

/** The parts an {@link ErrorState} accepts extra classes for. */
export type ErrorStatePart =
  | 'root'
  | 'icon'
  | 'numeral'
  | 'title'
  | 'description'
  | 'code'
  | 'actions';

const VARIANT_ICONS: Partial<Record<ErrorStateVariant, string>> = {
  request: 'server-crash',
  offline: 'wifi-off',
  forbidden: 'lock',
};

/** Props for the {@link ErrorState} component. Native `<div>` attributes go to the root. */
export interface ErrorStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** What failed; picks the tint and default icon (not-found shows 404). @defaultValue `'request'` */
  variant?: ErrorStateVariant;
  /** `md` for a page or card, `sm` for a panel. @defaultValue `'md'` */
  size?: EmptyStateSize;
  /** Centered, or aligned to the start. @defaultValue `'center'` */
  align?: EmptyStateAlign;
  /** An icon name from the registry, or a node. Set explicitly, it shows beside a numeral too. */
  icon?: ReactNode;
  /** A large status number, such as `404`, in place of the default icon. */
  numeral?: string;
  /** What failed, as a heading. */
  title?: ReactNode;
  /** What's safe and what to do. `children` override it. */
  description?: ReactNode;
  /** A reference people can quote to support. */
  code?: string;
  /** Recovery buttons, such as Try again. */
  actions?: ReactNode;
  /** The title's heading level, 1 to 6. @defaultValue `3` */
  headingLevel?: number;
  /** Moves focus to the title when it renders, for a full-page error. @defaultValue `false` */
  focusTitle?: boolean;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<ErrorStatePart>;
}

/**
 * Explains what failed and how to recover. The ref points at the root.
 *
 * @example
 * ```tsx
 * <ErrorState title="Couldn’t load transactions" code="Error 503" actions={<Button>Try again</Button>} />
 * ```
 */
export const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      variant = 'request',
      size = 'md',
      align = 'center',
      icon,
      numeral,
      title,
      description,
      code,
      actions,
      headingLevel = 3,
      focusTitle = false,
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    useEffect(() => {
      if (focusTitle) titleRef.current?.focus();
    }, [focusTitle]);

    const Heading = headingTag(headingLevel, 1) as 'h3';
    const body = hasContent(children) ? children : description;
    const shownNumeral = hasContent(numeral)
      ? numeral
      : variant === 'not-found'
        ? '404'
        : undefined;
    const iconNode = hasContent(icon)
      ? iconContent(icon, undefined)
      : shownNumeral === undefined
        ? iconContent(undefined, VARIANT_ICONS[variant])
        : null;

    return (
      <div
        {...rest}
        ref={ref}
        className={cx('apui-error-state', classes.root, className)}
        data-scope="error-state"
        data-part="root"
        role="alert"
        data-variant={variant}
        data-size={size}
        data-align={align}
      >
        {iconNode ? (
          <span
            data-scope="error-state"
            data-part="icon"
            aria-hidden="true"
            className={classes.icon}
          >
            {iconNode}
          </span>
        ) : null}
        {shownNumeral !== undefined ? (
          <span data-scope="error-state" data-part="numeral" className={classes.numeral}>
            {shownNumeral}
          </span>
        ) : null}
        {hasContent(title) ? (
          <Heading
            ref={titleRef}
            data-scope="error-state"
            data-part="title"
            tabIndex={focusTitle ? -1 : undefined}
            data-focus-title={flag(focusTitle)}
            className={classes.title}
          >
            {title}
          </Heading>
        ) : null}
        {hasContent(body) ? (
          <div data-scope="error-state" data-part="description" className={classes.description}>
            {body}
          </div>
        ) : null}
        {hasContent(code) ? (
          <span data-scope="error-state" data-part="code" className={classes.code}>
            {code}
          </span>
        ) : null}
        {hasContent(actions) ? (
          <div data-scope="error-state" data-part="actions" className={classes.actions}>
            {actions}
          </div>
        ) : null}
      </div>
    );
  },
);

ErrorState.displayName = 'ErrorState';
