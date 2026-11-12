/**
 * @module Loading
 *
 * The design-system Loading (#60): a spinner or three dots in a status
 * region, rendering the `.apui-loading` markup contract styled by
 * `@artisanpack-ui/css`. It waits `delay` milliseconds before showing, so
 * fast loads don't flash.
 *
 * @packageDocumentation
 */

import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

import { cx, flag, hasContent, type PartClasses } from '../../../internal/parts';

/** The indicator a {@link Loading} draws. */
export type LoadingVariant = 'spinner' | 'dots';

/** The size of a {@link Loading} indicator. */
export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** The color of a {@link Loading} indicator. */
export type LoadingColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** The parts a {@link Loading} accepts extra classes for. */
export type LoadingPart = 'root' | 'indicator' | 'label';

/** The default screen-reader label. */
export const LOADING_LABEL = 'Loading';

/** Props for the {@link Loading} component. Native `<span>` attributes go to the root. */
export interface LoadingProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** A spinning ring or three pulsing dots. @defaultValue `'spinner'` */
  variant?: LoadingVariant;
  /** The indicator's size. @defaultValue `'md'` */
  size?: LoadingSize;
  /** Tints the indicator. @defaultValue `'primary'` */
  color?: LoadingColor;
  /**
   * What's loading, for screen readers: rendered visually hidden when there
   * are no `children`. Translate it. @defaultValue `'Loading'`
   */
  label?: string;
  /** Covers the nearest positioned ancestor. Set `aria-busy` on that region. @defaultValue `false` */
  overlay?: boolean;
  /** Milliseconds to wait before showing. @defaultValue `300` */
  delay?: number;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<LoadingPart>;
}

/**
 * Shows that work is in progress. `children` show as visible text beside the
 * indicator. The ref points at the root.
 *
 * @example
 * ```tsx
 * <Loading size="sm">Saving changes…</Loading>
 * ```
 */
export const Loading = forwardRef<HTMLSpanElement, LoadingProps>(
  (
    {
      variant = 'spinner',
      size = 'md',
      color = 'primary',
      label = LOADING_LABEL,
      overlay = false,
      delay = 300,
      classes = {},
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const visible = hasContent(children);
    return (
      <span
        {...rest}
        ref={ref}
        className={cx('apui-loading', classes.root, className)}
        data-scope="loading"
        data-part="root"
        role="status"
        data-variant={variant}
        data-size={size}
        data-color={color}
        data-overlay={flag(overlay)}
        style={{ '--apui-_delay': `${delay}ms`, ...style } as CSSProperties}
      >
        <span
          data-scope="loading"
          data-part="indicator"
          aria-hidden="true"
          className={classes.indicator}
        >
          {variant === 'dots' ? (
            <>
              <span />
              <span />
              <span />
            </>
          ) : null}
        </span>
        <span
          data-scope="loading"
          data-part="label"
          className={cx(visible ? undefined : 'apui-sr-only', classes.label)}
        >
          {visible ? children : label}
        </span>
      </span>
    );
  },
);

Loading.displayName = 'Loading';
