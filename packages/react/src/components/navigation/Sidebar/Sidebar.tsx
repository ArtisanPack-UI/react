/**
 * @module Sidebar
 *
 * Deprecated alias of {@link AppShell}, kept for 1.x code. It maps the old
 * props onto AppShell: `sidebarContent` → `sidebar`, `children` → the main
 * content, `open` → `collapsed={!open}` with the collapse button on
 * (`collapsible`), `onOpenChange` → `onCollapsedChange`, and a Tailwind
 * `width` class (`w-64`, `w-[18rem]`) → `sidebarWidth`. `side` and `overlay`
 * have no AppShell equivalent and are ignored: the sidebar sits at the
 * start edge, beside the content.
 *
 * @deprecated Use `AppShell` with a `Menu` in its `sidebar` slot.
 * @packageDocumentation
 */

import { forwardRef, type ReactNode } from 'react';

import { devWarnOnce } from '../../../internal/parts';
import { AppShell, type AppShellProps } from '../../layout/AppShell/AppShell';

/**
 * Props for the deprecated {@link Sidebar}.
 *
 * @deprecated Use `AppShellProps`.
 */
export interface SidebarProps extends Omit<AppShellProps, 'collapsed' | 'onCollapsedChange'> {
  /** Whether the sidebar is expanded. Use AppShell's `collapsed`. */
  open: boolean;
  /** Called when the collapse button expands or collapses it. Use AppShell's `onCollapsedChange`. */
  onOpenChange: (open: boolean) => void;
  /** The sidebar's navigation. Use AppShell's `sidebar`. */
  sidebarContent: ReactNode;
  /** Ignored: AppShell's sidebar sits at the start edge. */
  side?: 'left' | 'right';
  /** A Tailwind width class, such as `w-64` or `w-[18rem]`. Use AppShell's `sidebarWidth` (a CSS length). */
  width?: string;
  /** Ignored: AppShell lays the sidebar beside the content. */
  overlay?: boolean;
}

/** A Tailwind width class as a CSS length: `w-64` → `16rem`, `w-[18rem]` → `18rem`. */
export function sidebarWidthFromClass(width: string | undefined): string | undefined {
  if (!width) return undefined;
  const scale = /^w-(\d+(?:\.\d+)?)$/.exec(width);
  if (scale) return `${Number(scale[1]) / 4}rem`;
  const arbitrary = /^w-\[(.+)\]$/.exec(width);
  return arbitrary ? arbitrary[1] : undefined;
}

/**
 * Deprecated: renders an {@link AppShell}.
 *
 * @deprecated Use `AppShell`.
 */
export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  (
    {
      open,
      onOpenChange,
      sidebarContent,
      side: _side,
      width,
      overlay: _overlay,
      sidebarWidth,
      collapsible = true,
      ...rest
    },
    ref,
  ) => {
    devWarnOnce('Sidebar', 'Sidebar is deprecated; use AppShell.');
    return (
      <AppShell
        {...rest}
        ref={ref}
        sidebar={sidebarContent}
        collapsed={!open}
        onCollapsedChange={(collapsed) => onOpenChange(!collapsed)}
        collapsible={collapsible}
        sidebarWidth={sidebarWidth ?? sidebarWidthFromClass(width)}
      />
    );
  },
);

Sidebar.displayName = 'Sidebar';
