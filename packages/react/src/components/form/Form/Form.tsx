/**
 * @module Form
 *
 * The design-system Form (#53): a native `<form>` whose fields stack with
 * the field gap, ending with an actions row, rendering the `.apui-form`
 * markup contract styled by `@artisanpack-ui/css`.
 */

import { forwardRef, type FormHTMLAttributes, type ReactNode } from 'react';

import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

/** The parts a {@link Form} accepts extra classes for. */
export type FormPart = 'root' | 'actions';

/** Props for the {@link Form} component. Native `<form>` attributes (`onSubmit`, `action`, …) go to the root. */
export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  /** The buttons at the end of the form, primary action last. */
  actions?: ReactNode;
  /** Separates the actions row with an edge above it. @defaultValue `false` */
  divided?: boolean;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<FormPart>;
}

/**
 * A native form with an actions row. The ref points at the `<form>`.
 *
 * @example
 * ```tsx
 * <Form onSubmit={save} aria-label="Invite member" actions={<Button type="submit">Send invite</Button>}>
 *   <Input label="Email" type="email" />
 * </Form>
 * ```
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ actions, divided = false, classes = {}, className, children, ...rest }, ref) => (
    <form
      {...rest}
      ref={ref}
      className={cx('apui-form', classes.root, className)}
      data-divided={flag(divided)}
    >
      {children}
      {hasContent(actions) ? (
        <div className={classes.actions} data-scope="form" data-part="actions">
          {actions}
        </div>
      ) : null}
    </form>
  ),
);

Form.displayName = 'Form';
