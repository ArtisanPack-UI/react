/**
 * @module Navbar
 *
 * Top navigation bar component built on the DaisyUI navbar pattern.
 * Provides three layout slots (start, center, end) for flexible content placement,
 * with an optional glass morphism visual effect.
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@artisanpack-ui/tokens';

/**
 * Props for the {@link Navbar} component.
 */
export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  /** Content rendered in the left (start) section of the navbar. */
  start?: ReactNode;
  /** Content rendered in the center section of the navbar. */
  center?: ReactNode;
  /** Content rendered in the right (end) section of the navbar. */
  end?: ReactNode;
  /** Whether to apply the DaisyUI glass morphism visual effect. */
  glass?: boolean;
}

/**
 * Top navigation bar with start/center/end layout slots.
 *
 * Renders a `<nav>` element with DaisyUI's `navbar` class. Each slot (start, center, end)
 * is only rendered if content is provided. Additional children are rendered after the slots.
 *
 * @example
 * ```tsx
 * <Navbar
 *   start={<a className="text-xl font-bold">MyApp</a>}
 *   center={<input type="text" placeholder="Search..." className="input input-bordered" />}
 *   end={<button className="btn btn-primary">Login</button>}
 *   glass
 * />
 * ```
 */
export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  ({ start, center, end, glass = false, className, children, ...rest }, ref) => {
    return (
      <nav ref={ref} className={cn('navbar bg-base-100', glass && 'glass', className)} {...rest}>
        {start && <div className="navbar-start">{start}</div>}
        {center && <div className="navbar-center">{center}</div>}
        {end && <div className="navbar-end">{end}</div>}
        {children}
      </nav>
    );
  },
);

Navbar.displayName = 'Navbar';
