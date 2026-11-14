/**
 * @module Text
 *
 * The design-system Text (#58): body copy with a size, tone and weight,
 * truncated to a line or clamped to a number of lines, rendering the
 * `.apui-text` markup contract styled by `@artisanpack-ui/css`.
 *
 * @packageDocumentation
 */

import { Children, forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

import { cx, flag, type PartClasses } from '../../../internal/parts';

/** The element a {@link Text} renders. */
export type TextElement = 'p' | 'span' | 'div';

/** A {@link Text}'s size. Emitted as `data-size`. */
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'lead';

/** A {@link Text}'s color. Emitted as `data-tone`. */
export type TextTone = 'default' | 'muted' | 'success' | 'warning' | 'error';

/** A {@link Text}'s weight. Emitted as `data-weight`. */
export type TextWeight = 'regular' | 'medium' | 'semibold';

/** Props for the {@link Text} component. Native attributes go to the root. */
export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** The element. @defaultValue `'p'` */
  as?: TextElement;
  /** Size; lead is muted unless a tone is set. @defaultValue `'md'` */
  size?: TextSize;
  /** Color; status tones are never the only signal. @defaultValue `'default'` */
  tone?: TextTone;
  /** Weight. @defaultValue `'regular'` */
  weight?: TextWeight;
  /** Cuts to one line; string content is copied to `title`. @defaultValue `false` */
  truncate?: boolean;
  /** Cuts after this many lines; string content is copied to `title`. */
  clamp?: number;
  /** Extra classes: `classes.root` merges with `className`. */
  classes?: PartClasses<'root'>;
}

/**
 * Body text. The ref points at the root.
 *
 * @example
 * ```tsx
 * <Text size="sm" tone="muted" truncate>{description}</Text>
 * ```
 */
export const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      as = 'p',
      size = 'md',
      tone = 'default',
      weight = 'regular',
      truncate = false,
      clamp,
      classes = {},
      className,
      style,
      title,
      children,
      ...rest
    },
    ref,
  ) => {
    const Tag = (['p', 'span', 'div'].includes(as) ? as : 'p') as 'p';
    const lines = clamp !== undefined && clamp >= 1 ? Math.floor(clamp) : undefined;
    const cut = truncate || lines !== undefined;
    // Only text (strings and numbers, such as `{count} items`) becomes the title.
    const parts = Children.toArray(children);
    const plain = parts.every((child) => typeof child === 'string' || typeof child === 'number');
    const text = plain ? parts.join('').trim() : '';
    return (
      <Tag
        {...rest}
        ref={ref as never}
        className={cx('apui-text', classes.root, className)}
        style={
          lines !== undefined ? ({ ...style, '--apui-text-clamp': lines } as CSSProperties) : style
        }
        title={title ?? (cut && text !== '' ? text : undefined)}
        data-size={size}
        data-tone={tone}
        data-weight={weight}
        data-truncate={flag(truncate)}
        data-clamp={lines}
      >
        {children}
      </Tag>
    );
  },
);

Text.displayName = 'Text';
