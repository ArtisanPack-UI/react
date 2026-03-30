import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Illustration or icon to display */
  icon?: ReactNode;
  /** Heading text */
  heading?: string;
  /** HTML element to render the heading as (default "h3") */
  headingAs?: ElementType;
  /** Descriptive message */
  description?: string;
  /** Action element (e.g. a button) */
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      icon,
      heading,
      headingAs: HeadingTag = 'h3',
      description,
      action,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center gap-4 py-12 text-center',
          className,
        )}
        {...rest}
      >
        {icon && <div className="text-base-content/40 text-6xl">{icon}</div>}
        {heading && <HeadingTag className="text-lg font-semibold">{heading}</HeadingTag>}
        {description && <p className="text-base-content/60 max-w-sm">{description}</p>}
        {children}
        {action && <div className="mt-2">{action}</div>}
      </div>
    );
  },
);

EmptyState.displayName = 'EmptyState';
