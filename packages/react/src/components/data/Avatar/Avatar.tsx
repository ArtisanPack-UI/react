import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  image?: string;
  alt?: string;
  placeholder?: string;
  color?: DaisyColor;
  size?: Size;
  icon?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  ring?: boolean;
  online?: boolean;
  offline?: boolean;
}

const sizeMap: Record<Size, string> = {
  xs: 'w-8',
  sm: 'w-12',
  md: 'w-16',
  lg: 'w-24',
};

const placeholderTextSizeMap: Record<Size, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
};

const colorMap: Record<string, string> = {
  primary: 'bg-primary text-primary-content',
  secondary: 'bg-secondary text-secondary-content',
  accent: 'bg-accent text-accent-content',
  success: 'bg-success text-success-content',
  warning: 'bg-warning text-warning-content',
  error: 'bg-error text-error-content',
  info: 'bg-info text-info-content',
  neutral: 'bg-neutral text-neutral-content',
};

const ringColorMap: Record<string, string> = {
  primary: 'ring-primary',
  secondary: 'ring-secondary',
  accent: 'ring-accent',
  success: 'ring-success',
  warning: 'ring-warning',
  error: 'ring-error',
  info: 'ring-info',
  neutral: 'ring-neutral',
};

function getInitials(text: string): string {
  return text
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      image,
      alt = '',
      placeholder,
      color = 'neutral',
      size = 'md',
      icon,
      title,
      subtitle,
      ring = false,
      online,
      offline,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const hasStatus = online !== undefined || offline !== undefined;
    const statusClass = online ? 'online' : offline ? 'offline' : undefined;

    const ringClasses = ring
      ? cn('ring ring-offset-2 ring-offset-base-100 rounded-full', color && ringColorMap[color])
      : undefined;

    const avatarContent = image ? (
      <div
        className={cn(
          'avatar',
          hasStatus && statusClass,
          ringClasses,
        )}
      >
        <div className={cn('rounded-full', sizeMap[size])}>
          <img src={image} alt={alt} />
        </div>
      </div>
    ) : (
      <div
        className={cn(
          'avatar avatar-placeholder',
          hasStatus && statusClass,
          ringClasses,
        )}
      >
        <div
          className={cn(
            'rounded-full',
            sizeMap[size],
            colorMap[color],
          )}
        >
          {icon ? (
            <span aria-hidden="true">{icon}</span>
          ) : (
            <span className={placeholderTextSizeMap[size]}>
              {placeholder ? getInitials(placeholder) : children}
            </span>
          )}
        </div>
      </div>
    );

    if (title || subtitle) {
      return (
        <div ref={ref} className={cn('flex items-center gap-3', className)} {...rest}>
          {avatarContent}
          <div>
            {title && <div className="font-bold">{title}</div>}
            {subtitle && <div className="text-sm opacity-50">{subtitle}</div>}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={className} {...rest}>
        {avatarContent}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';
