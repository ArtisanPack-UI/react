/**
 * @module Accordion
 *
 * An accordion container that manages the open/close state of child {@link Collapse}
 * panels. Supports single-open and multiple-open modes, controlled and uncontrolled
 * usage, and DaisyUI's `join` visual grouping.
 *
 * @packageDocumentation
 */

import {
  forwardRef,
  useState,
  Children,
  isValidElement,
  cloneElement,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';
import { Collapse } from '../Collapse/Collapse';
import type { CollapseProps } from '../Collapse/Collapse';

/**
 * Type predicate that matches Collapse elements or wrapped variants by displayName.
 *
 * @param child - A React element to test.
 * @returns `true` if the element is a Collapse component.
 */
function isCollapseElement(
  child: ReactElement,
): child is ReactElement<CollapseProps, typeof Collapse> {
  return (
    child.type === Collapse ||
    (child.type as { displayName?: string })?.displayName === Collapse.displayName
  );
}

/**
 * Props for the {@link Accordion} component.
 *
 * Indices in `openIndices`, `defaultOpenIndices`, and the `onOpenChange`
 * callback refer to the position among Collapse children only -- non-Collapse
 * children are skipped when counting.
 */
export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow multiple panels to be open simultaneously. When `false` (default), opening a panel closes any other open panel. */
  multiple?: boolean;
  /** Controlled: indices of the currently open Collapse panels (relative to Collapse children only). */
  openIndices?: number[];
  /** Indices of panels that should be open on first render (uncontrolled mode, relative to Collapse children only). */
  defaultOpenIndices?: number[];
  /** Callback fired when the set of open panels changes. Receives an array of open Collapse indices. */
  onOpenChange?: (indices: number[]) => void;
  /** Apply DaisyUI `join` styling to visually connect the child panels. @defaultValue `true` */
  join?: boolean;
}

/**
 * Accordion container that manages the open/close state of child Collapse panels.
 *
 * Supports both controlled (`openIndices` + `onOpenChange`) and uncontrolled
 * (`defaultOpenIndices`) usage. Non-Collapse children are rendered as-is and
 * do not affect index counting.
 *
 * @example
 * ```tsx
 * <Accordion defaultOpenIndices={[0]}>
 *   <Collapse title="Section 1">Content 1</Collapse>
 *   <Collapse title="Section 2">Content 2</Collapse>
 *   <Collapse title="Section 3">Content 3</Collapse>
 * </Accordion>
 * ```
 *
 * @example
 * ```tsx
 * // Multiple panels open at once
 * <Accordion multiple defaultOpenIndices={[0, 2]}>
 *   <Collapse title="A">Alpha</Collapse>
 *   <Collapse title="B">Beta</Collapse>
 *   <Collapse title="C">Gamma</Collapse>
 * </Accordion>
 * ```
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      multiple = false,
      openIndices,
      defaultOpenIndices = [],
      onOpenChange,
      join = true,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState<number[]>(defaultOpenIndices);
    const isControlled = openIndices !== undefined;
    const currentOpen = isControlled ? openIndices : internalOpen;

    const allChildren = Children.toArray(children);

    // Normalize: dedupe, bounds-check, and enforce single-open invariant
    const collapseCount = allChildren.filter(
      (c) => isValidElement(c) && isCollapseElement(c),
    ).length;
    const deduped = Array.from(new Set(currentOpen)).filter((i) => i >= 0 && i < collapseCount);
    const cleanOpen = multiple ? deduped : deduped.slice(0, 1);

    const handleToggle = (idx: number, nextOpen: boolean) => {
      let next: number[];
      if (multiple) {
        next = nextOpen ? [...cleanOpen, idx] : cleanOpen.filter((i) => i !== idx);
      } else {
        next = nextOpen ? [idx] : [];
      }
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    };

    let collapseIndex = 0;

    return (
      <div
        ref={ref}
        role="group"
        className={cn(join && 'join join-vertical w-full', className)}
        {...rest}
      >
        {allChildren.map((child) => {
          if (!isValidElement(child) || !isCollapseElement(child)) return child;

          const idx = collapseIndex++;
          const isOpen = cleanOpen.includes(idx);

          const originalOnOpenChange = child.props.onOpenChange;

          return cloneElement(child, {
            key: child.key ?? idx,
            open: isOpen,
            onOpenChange: (open: boolean) => {
              originalOnOpenChange?.(open);
              handleToggle(idx, open);
            },
            className: cn(join && 'join-item', child.props.className),
          });
        })}
      </div>
    );
  },
);

Accordion.displayName = 'Accordion';
