import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Illustration or icon to display */
  icon?: ReactNode;
  /** Heading text */
  title?: string;
  /** HTML element to render the title as (default "h3") */
  titleAs?: ElementType;
  /** Descriptive message */
  description?: string;
  /** Action element (e.g. a button) */
  action?: ReactNode;
}

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, titleAs: TitleTag = 'h3', description, action, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center gap-4 py-12 text-center', className)}
        {...rest}
      >
        {icon && <div className="text-base-content/40 text-6xl">{icon}</div>}
        {title && <TitleTag className="text-lg font-semibold">{title}</TitleTag>}
        {description && <p className="text-base-content/60 max-w-sm">{description}</p>}
        {children}
        {action && <div className="mt-2">{action}</div>}
      </div>
    );
  },
);

EmptyState.displayName = 'EmptyState';
