/**
 * @module Avatar
 *
 * The design-system Avatar (#61): a person or organization as an image,
 * initials or an icon, rendering the `.apui-avatar` markup contract styled by
 * `@artisanpack-ui/css`. {@link AvatarGroup} overlaps a row of them.
 *
 * @packageDocumentation
 */

import { forwardRef, type HTMLAttributes } from 'react';

import { IconSvg } from '../../../internal/icon';
import { cx, type PartClasses } from '../../../internal/parts';
import { isSafeMediaSrc } from '../../../internal/url';

/** An {@link Avatar}'s semantic color, the initials' tone. Emitted as `data-color`. */
export type AvatarColor =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'error'
  | 'info';

/** An {@link Avatar}'s size, the control heights. Emitted as `data-size`. */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** An {@link Avatar}'s shape. Emitted as `data-shape`. */
export type AvatarShape = 'circle' | 'square';

/** A presence state, shown as a dot and announced in words. */
export type AvatarStatus = 'online' | 'away' | 'offline';

/** The parts an {@link Avatar} accepts extra classes for. */
export type AvatarPart = 'root' | 'image' | 'initials' | 'status';

/** The colors a name hashes to, in order (the same list in every stack). */
export const AVATAR_HASH_COLORS: readonly AvatarColor[] = [
  'primary',
  'secondary',
  'accent',
  'success',
  'warning',
  'error',
  'info',
];

const STATUS_WORDS: Record<AvatarStatus, string> = {
  online: 'Online',
  away: 'Away',
  offline: 'Offline',
};

/** Up to two letters from a name: the first letters of its first and last words, uppercased. */
export function avatarInitials(name: string | undefined): string {
  const words = (name ?? '').trim().split(/\s+/u).filter(Boolean);
  if (words.length === 0) return '';
  const first = Array.from(words[0]!)[0] ?? '';
  const last = words.length > 1 ? (Array.from(words[words.length - 1]!)[0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

/**
 * The color a name hashes to: the sum of its code points over
 * {@link AVATAR_HASH_COLORS}, the same in every stack. Neutral without a name.
 */
export function avatarColor(name: string | undefined): AvatarColor {
  const trimmed = (name ?? '').trim();
  if (trimmed === '') return 'neutral';
  let sum = 0;
  for (const character of trimmed) sum += character.codePointAt(0) ?? 0;
  return AVATAR_HASH_COLORS[sum % AVATAR_HASH_COLORS.length]!;
}

/** Props for the {@link Avatar} component. Native `<span>` attributes go to the root. */
export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** The full name: initials, accessible name and hashed color. */
  name?: string;
  /** The image URL (relative, http, https or `data:image`). It covers the initials. */
  src?: string;
  /** The accessible name, when it should differ from `name`. */
  alt?: string;
  /** Overrides the initials taken from `name`, such as `+4`. */
  initials?: string;
  /** Icon name shown instead of initials. Without a name or initials, `user` shows. */
  icon?: string;
  /** Size. @defaultValue `'md'` */
  size?: AvatarSize;
  /** Shape. @defaultValue `'circle'` */
  shape?: AvatarShape;
  /** The initials' tone. Defaults to a color hashed from `name`. */
  color?: AvatarColor;
  /** A presence dot, announced in words too. */
  status?: AvatarStatus;
  /** The status in words, added to the accessible name; translate it. Defaults to Online, Away or Offline. */
  statusLabel?: string;
  /** Extra classes per part; `classes.root` merges with `className`. */
  classes?: PartClasses<AvatarPart>;
}

/**
 * A person or organization: role=img named after them, showing an image over
 * their initials, or an icon. Without a name or `alt` it's decorative. The ref
 * points at the root.
 *
 * @example
 * ```tsx
 * <Avatar name="Olivia Rhye" src={url} status="online" />
 * ```
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  (
    {
      name,
      src,
      alt,
      initials,
      icon,
      size = 'md',
      shape = 'circle',
      color,
      status,
      statusLabel,
      classes = {},
      className,
      ...rest
    },
    ref,
  ) => {
    const letters = initials?.trim() ? initials.trim() : avatarInitials(name);
    const iconName = icon ? icon : letters === '' ? 'user' : undefined;
    const image = src && isSafeMediaSrc(src) ? src : undefined;
    const base = alt?.trim() ? alt.trim() : (name ?? '').trim();
    const words = status ? (statusLabel ? statusLabel : STATUS_WORDS[status]) : undefined;
    const label = base === '' ? '' : words ? `${base} (${words})` : base;

    return (
      <span
        {...rest}
        ref={ref}
        className={cx('apui-avatar', classes.root, className)}
        data-size={size}
        data-shape={shape === 'square' ? 'square' : 'circle'}
        data-color={color ?? avatarColor(name)}
        role={label ? 'img' : undefined}
        aria-label={label || undefined}
        aria-hidden={label ? undefined : 'true'}
      >
        {iconName ? (
          <IconSvg name={iconName} />
        ) : (
          <span
            className={classes.initials}
            data-scope="avatar"
            data-part="initials"
            aria-hidden="true"
          >
            {letters}
          </span>
        )}
        {image ? (
          <img
            className={classes.image}
            data-scope="avatar"
            data-part="image"
            src={image}
            alt=""
            aria-hidden="true"
          />
        ) : null}
        {status ? (
          <span
            className={classes.status}
            data-scope="avatar"
            data-part="status"
            data-status={status}
            aria-hidden="true"
          />
        ) : null}
      </span>
    );
  },
);

Avatar.displayName = 'Avatar';

/** One avatar in {@link AvatarGroupProps.avatars}. */
export type AvatarGroupItem = Pick<
  AvatarProps,
  'name' | 'src' | 'alt' | 'initials' | 'icon' | 'color' | 'status' | 'statusLabel'
>;

/** Props for the {@link AvatarGroup} component. Native `<span>` attributes go to the root. */
export interface AvatarGroupProps extends HTMLAttributes<HTMLSpanElement> {
  /** Avatars as data, rendered before `children`. */
  avatars?: AvatarGroupItem[];
  /** How many of `avatars` show before a +N avatar. Unset shows them all. */
  max?: number;
  /** The data avatars' size. @defaultValue `'md'` */
  size?: AvatarSize;
  /** The group's accessible name, such as "Project members". */
  label?: string;
  /** The +N avatar's accessible name; `{count}` is the number hidden. @defaultValue `'{count} more'` */
  moreLabel?: string;
}

/**
 * A row of overlapping avatars, each ringed in the surface color. The ref
 * points at the root.
 *
 * @example
 * ```tsx
 * <AvatarGroup avatars={members} max={4} size="sm" label="Project members" />
 * ```
 */
export const AvatarGroup = forwardRef<HTMLSpanElement, AvatarGroupProps>(
  (
    {
      avatars = [],
      max,
      size = 'md',
      label,
      moreLabel = '{count} more',
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const shown = max !== undefined && max >= 0 ? avatars.slice(0, max) : avatars;
    const hidden = avatars.length - shown.length;
    return (
      <span
        {...rest}
        ref={ref}
        className={cx('apui-avatar-group', className)}
        role="group"
        aria-label={label || undefined}
      >
        {shown.map((avatar, index) => (
          <Avatar key={index} {...avatar} size={size} />
        ))}
        {hidden > 0 ? (
          <Avatar
            initials={`+${hidden}`}
            alt={moreLabel.replace('{count}', String(hidden))}
            color="neutral"
            size={size}
          />
        ) : null}
        {children}
      </span>
    );
  },
);

AvatarGroup.displayName = 'AvatarGroup';
