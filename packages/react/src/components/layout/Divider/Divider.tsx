/**
 * @module Divider
 *
 * The design-system Divider (#58): a muted rule, horizontal, vertical or
 * with a label. Renders the `.apui-divider` markup contract styled by
 * `@artisanpack-ui/css`: an `<hr>` for a plain horizontal rule, a
 * `role="separator"` div for a vertical or labelled one (named by its label,
 * since a separator's children are presentational).
 *
 * @packageDocumentation
 */

import { forwardRef, useId, type HTMLAttributes, type ReactNode, type Ref } from 'react';

import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

/** The rule's direction. */
export type DividerOrientation = 'horizontal' | 'vertical';

/** Where a label sits along the rule. */
export type DividerAlign = 'start' | 'center' | 'end';

/** The rule's weight. */
export type DividerStrength = 'subtle' | 'strong';

/** The parts a {@link Divider} accepts extra classes for. */
export type DividerPart = 'root' | 'label';

/** Props for the {@link Divider} component. Native attributes go to the root. */
export interface DividerProps extends HTMLAttributes<HTMLElement> {
  /** Emitted as `data-orientation`. @defaultValue `'horizontal'` */
  orientation?: DividerOrientation;
  /** Text in the middle of the rule. `children` work too. */
  label?: ReactNode;
  /** Where a label sits. Emitted as `data-align`. @defaultValue `'center'` */
  align?: DividerAlign;
  /** Emitted as `data-strength`. @defaultValue `'subtle'` */
  strength?: DividerStrength;
  /** Hides the divider from assistive technology. Emitted as `data-decorative`. */
  decorative?: boolean;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<DividerPart>;
}

/**
 * Separates content with a rule.
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider label="or continue with" />
 * <Divider orientation="vertical" />
 * ```
 */
export const Divider = forwardRef<HTMLElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      label,
      align = 'center',
      strength = 'subtle',
      decorative = false,
      classes = {},
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const labelId = useId();
    const text = hasContent(label) ? label : children;
    const labelled = hasContent(text);
    const common = {
      ...rest,
      className: cx('apui-divider', classes.root, className),
      'data-orientation': orientation,
      'data-strength': strength,
      'data-align': align,
      'data-decorative': flag(decorative),
    };

    if (!labelled && orientation === 'horizontal') {
      return (
        <hr
          {...common}
          ref={ref as Ref<HTMLHRElement>}
          aria-hidden={decorative ? 'true' : undefined}
        />
      );
    }

    if (!labelled) {
      return (
        <div
          {...common}
          ref={ref as Ref<HTMLDivElement>}
          role="separator"
          aria-orientation="vertical"
          aria-hidden={decorative ? 'true' : undefined}
        />
      );
    }

    return (
      <div
        {...common}
        ref={ref as Ref<HTMLDivElement>}
        role={decorative ? 'none' : 'separator'}
        aria-orientation={decorative ? undefined : orientation}
        aria-labelledby={decorative ? undefined : labelId}
      >
        <span data-scope="divider" data-part="label" id={labelId} className={classes.label}>
          {text}
        </span>
      </div>
    );
  },
);

Divider.displayName = 'Divider';
