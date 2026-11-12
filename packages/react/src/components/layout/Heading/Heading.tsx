/**
 * @module Heading
 *
 * The design-system Heading (#58): a title from the type scale, with the
 * semantic level and the visual size set apart, rendering the `.apui-heading`
 * markup contract styled by `@artisanpack-ui/css`.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cx, hasContent, type PartClasses } from '../../../internal/parts';

/** A heading level or visual size, 1 (largest) to 6. */
export type HeadingStep = 1 | 2 | 3 | 4 | 5 | 6 | '1' | '2' | '3' | '4' | '5' | '6';

/** The parts a {@link Heading} accepts extra classes for. */
export type HeadingPart = 'root' | 'eyebrow';

/** Props for the {@link Heading} component. Native heading attributes go to the h1–h6. */
export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** The semantic level: renders h1–h6. Emitted as `data-level`. @defaultValue `2` */
  level?: HeadingStep;
  /** The visual size, 1–6. Defaults to `level`. Emitted as `data-size`. */
  size?: HeadingStep;
  /** A short uppercase section label, rendered just before the heading. */
  eyebrow?: ReactNode;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<HeadingPart>;
}

/** A level or size as 1–6, or `undefined` when it's out of range. */
function step(value: HeadingStep | undefined): number | undefined {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= 6 ? number : undefined;
}

/**
 * A title from the type scale. The ref points at the heading.
 *
 * @example
 * ```tsx
 * <Heading level={3} size={5} eyebrow="Portfolio">Recent activity</Heading>
 * ```
 */
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level, size, eyebrow, classes = {}, className, children, ...rest }, ref) => {
    const levelValue = step(level) ?? 2;
    const sizeValue = step(size) ?? levelValue;
    const Tag = `h${levelValue}` as 'h2';
    return (
      <>
        {hasContent(eyebrow) ? (
          <p className={classes.eyebrow} data-scope="heading" data-part="eyebrow">
            {eyebrow}
          </p>
        ) : null}
        <Tag
          {...rest}
          ref={ref}
          className={cx('apui-heading', classes.root, className)}
          data-level={levelValue}
          data-size={sizeValue}
        >
          {children}
        </Tag>
      </>
    );
  },
);

Heading.displayName = 'Heading';
