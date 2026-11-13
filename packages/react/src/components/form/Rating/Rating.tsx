/**
 * @module Rating
 *
 * The design-system Rating (#53): a star score, read-only (one image with a
 * text alternative, half stars) or as an input (native radios), rendering
 * the `.apui-rating` markup contract styled by `@artisanpack-ui/css`.
 */

import { forwardRef, useId, useState, type ChangeEvent, type HTMLAttributes } from 'react';

import { fillTemplate } from '../../../internal/choice';
import { IconSvg } from '../../../internal/icon';
import { cx, flag, type PartClasses } from '../../../internal/parts';

/** The parts a {@link Rating} accepts extra classes for. */
export type RatingPart = 'root' | 'item' | 'control' | 'star' | 'half' | 'value' | 'count';

/** The star size of a {@link Rating}. */
export type RatingSize = 'sm' | 'md' | 'lg';

/** The default value label. Pass `valueLabel` to translate it. */
export const RATING_DEFAULT_VALUE_LABEL = ':value out of :max';

/** Props for the {@link Rating} component. `className` goes to the root. */
export interface RatingProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'defaultValue' | 'onChange'
> {
  /** The score (controlled). Read-only, it rounds to the nearest half star. */
  value?: number | null;
  /** The initial score of an uncontrolled input. */
  defaultValue?: number;
  /** The number of stars. @defaultValue `5` */
  max?: number;
  /** Shows the score instead of collecting it. @defaultValue `false` */
  readonly?: boolean;
  /** Disables the radios. @defaultValue `false` */
  disabled?: boolean;
  /** Star size. @defaultValue `'md'` */
  size?: RatingSize;
  /** The number of reviews, shown after the value. */
  count?: number;
  /** The input's accessible name, such as "Rate the viewing". */
  label?: string;
  /** The text alternative and each radio's name, with `:value` and `:max`. @defaultValue `':value out of :max'` */
  valueLabel?: string;
  /** The count text, with `:count`. Defaults to "(:count reviews)", singular for one. */
  countLabel?: string;
  /** The radios' shared name. Defaults to a generated one. */
  name?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<RatingPart>;
  /** Called with the chosen score. */
  onValueChange?: (value: number) => void;
}

const format = (score: number) => String(Math.round(score * 10) / 10);

/**
 * Shows or collects a star score. As an input it is controlled (`value` +
 * `onValueChange`) or uncontrolled (`defaultValue`); the radios share one
 * name, so arrow keys change the score and follow the text direction.
 *
 * @example
 * ```tsx
 * <Rating readonly value={4.2} count={17} />
 * <Rating label="Rate the viewing" value={score} onValueChange={setScore} />
 * ```
 */
export const Rating = forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value,
      defaultValue,
      max = 5,
      readonly = false,
      disabled = false,
      size = 'md',
      count,
      label,
      valueLabel = RATING_DEFAULT_VALUE_LABEL,
      countLabel,
      name,
      classes = {},
      className,
      id: explicitId,
      onValueChange,
      ...attributes
    },
    ref,
  ) => {
    const generated = useId();
    const id = explicitId ?? generated;
    const [uncontrolled, setUncontrolled] = useState<number | undefined>(defaultValue);
    const score = value !== undefined ? value : uncontrolled;
    const stars = Array.from({ length: Math.max(0, max) }, (_, index) => index + 1);
    const text = (n: number) => fillTemplate(valueLabel, { value: format(n), max });
    const countText =
      count === undefined
        ? undefined
        : countLabel !== undefined
          ? fillTemplate(countLabel, { count })
          : count === 1
            ? `(${count} review)`
            : `(${count} reviews)`;

    const starIcon = (key: number, fill?: 'filled' | 'half') => (
      <span
        key={key}
        className={classes.star}
        data-scope="rating"
        data-part="star"
        aria-hidden="true"
        data-filled={flag(fill === 'filled')}
        data-half={flag(fill === 'half')}
      >
        <IconSvg name="star" />
        <span className={classes.half} data-scope="rating" data-part="half">
          <IconSvg name="star" />
        </span>
      </span>
    );

    const valuePart =
      score !== undefined && score !== null ? (
        <span className={classes.value} data-scope="rating" data-part="value" aria-hidden="true">
          {format(score)}
        </span>
      ) : null;

    if (readonly) {
      const rounded = Math.round((score ?? 0) * 2) / 2;
      return (
        <div
          {...attributes}
          ref={ref}
          id={id}
          className={cx('apui-rating', classes.root, className)}
          role="img"
          aria-label={text(score ?? 0)}
          data-size={size}
          data-readonly=""
          data-disabled={flag(disabled)}
        >
          {stars.map((star) =>
            starIcon(star, rounded >= star ? 'filled' : rounded >= star - 0.5 ? 'half' : undefined),
          )}
          {valuePart}
          {countText !== undefined ? (
            <span
              className={classes.count}
              data-scope="rating"
              data-part="count"
              aria-hidden="true"
            >
              {countText}
            </span>
          ) : null}
        </div>
      );
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const next = Number(event.target.value);
      if (value === undefined) setUncontrolled(next);
      onValueChange?.(next);
    };

    return (
      <div
        {...attributes}
        ref={ref}
        id={id}
        className={cx('apui-rating', classes.root, className)}
        role="radiogroup"
        aria-label={label}
        aria-disabled={disabled || undefined}
        data-size={size}
        data-interactive=""
        data-disabled={flag(disabled)}
      >
        {stars.map((star) => (
          <label key={star} className={classes.item} data-scope="rating" data-part="item">
            <input
              type="radio"
              className={classes.control}
              data-scope="rating"
              data-part="control"
              id={`${id}-${star}`}
              name={name ?? id}
              value={star}
              aria-label={text(star)}
              checked={score === star}
              disabled={disabled || undefined}
              onChange={handleChange}
            />
            {starIcon(star)}
          </label>
        ))}
        {valuePart}
        {countText !== undefined ? (
          <span className={classes.count} data-scope="rating" data-part="count">
            {countText}
          </span>
        ) : null}
      </div>
    );
  },
);

Rating.displayName = 'Rating';
