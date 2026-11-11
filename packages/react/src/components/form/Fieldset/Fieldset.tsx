/**
 * @module Fieldset
 *
 * The design-system Fieldset (#53): a native `<fieldset>` and `<legend>`
 * grouping related fields, rendering the `.apui-fieldset` markup contract
 * styled by `@artisanpack-ui/css`. Fields side by side go in a row:
 * `<div data-scope="fieldset" data-part="row">`.
 */

import { forwardRef, type FieldsetHTMLAttributes, type ReactNode } from 'react';

import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

/** The chrome of a {@link Fieldset}. */
export type FieldsetVariant = 'panel' | 'divided' | 'plain';

/** The parts a {@link Fieldset} accepts extra classes for. */
export type FieldsetPart = 'root' | 'legend' | 'title' | 'description';

/** Props for the {@link Fieldset} component. Native `<fieldset>` attributes go to the root. */
export interface FieldsetProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'title'> {
  /** A bordered panel, a section with an edge under it, or no chrome. @defaultValue `'panel'` */
  variant?: FieldsetVariant;
  /** The group's name, in the legend. */
  title?: ReactNode;
  /** Supporting text in the legend, under the title. */
  description?: ReactNode;
  /** Disables every control inside. @defaultValue `false` */
  disabled?: boolean;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<FieldsetPart>;
}

/**
 * Groups related fields under a legend. The ref points at the `<fieldset>`.
 *
 * @example
 * ```tsx
 * <Fieldset title="Contact" description="Who buyers should reach.">
 *   <Input label="Email" />
 * </Fieldset>
 * ```
 */
export const Fieldset = forwardRef<HTMLFieldSetElement, FieldsetProps>(
  (
    {
      variant = 'panel',
      title,
      description,
      disabled = false,
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const hasTitle = hasContent(title);
    const hasDescription = hasContent(description);
    return (
      <fieldset
        {...rest}
        ref={ref}
        className={cx('apui-fieldset', classes.root, className)}
        data-variant={variant}
        disabled={disabled || undefined}
        data-disabled={flag(disabled)}
      >
        {hasTitle || hasDescription ? (
          <legend className={classes.legend} data-scope="fieldset" data-part="legend">
            {hasTitle ? (
              <span className={classes.title} data-scope="fieldset" data-part="title">
                {title}
              </span>
            ) : null}
            {hasDescription ? (
              <span className={classes.description} data-scope="fieldset" data-part="description">
                {description}
              </span>
            ) : null}
          </legend>
        ) : null}
        {children}
      </fieldset>
    );
  },
);

Fieldset.displayName = 'Fieldset';
