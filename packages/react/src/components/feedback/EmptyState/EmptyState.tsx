/**
 * @module EmptyState
 *
 * A placeholder component shown when a list, table, or section has no
 * content to display. Provides a structured layout for an icon, heading,
 * description, and optional call-to-action.
 *
 * @packageDocumentation
 */

import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link EmptyState} component.
 */
export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Illustration or icon to display above the heading. */
  icon?: ReactNode;
  /** Heading text rendered inside the heading element. */
  heading?: string;
  /** HTML element to render the heading as. Defaults to `"h3"`. */
  headingAs?: ElementType;
  /** Descriptive message displayed below the heading. */
  description?: string;
  /** Action element (e.g. a button) rendered below the description. */
  action?: ReactNode;
}

/**
 * Empty state placeholder for sections with no content.
 *
 * Renders a vertically centered layout with optional icon, heading,
 * description, children, and action. Useful for empty lists, search
 * results, or initial onboarding states.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<InboxIcon />}
 *   heading="No messages"
 *   description="You don't have any messages yet."
 *   action={<Button color="primary">Compose</Button>}
 * />
 * ```
 */
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
