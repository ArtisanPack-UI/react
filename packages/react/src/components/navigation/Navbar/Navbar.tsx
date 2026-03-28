import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** Content for the left section */
  start?: ReactNode;
  /** Content for the center section */
  center?: ReactNode;
  /** Content for the right section */
  end?: ReactNode;
  /** Glass morphism effect */
  glass?: boolean;
}

/**
 * Top navigation bar with start/center/end layout slots.
 */
export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      start,
      center,
      end,
      glass = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <nav
        ref={ref}
        className={cn('navbar bg-base-100', glass && 'glass', className)}
        {...rest}
      >
        {start && <div className="navbar-start">{start}</div>}
        {center && <div className="navbar-center">{center}</div>}
        {end && <div className="navbar-end">{end}</div>}
        {children}
      </nav>
    );
  },
);

Navbar.displayName = 'Navbar';
