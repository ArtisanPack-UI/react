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

/** Type predicate that matches Collapse or wrapped variants by displayName */
function isCollapseElement(
  child: ReactElement,
): child is ReactElement<CollapseProps, typeof Collapse> {
  return (
    child.type === Collapse ||
    (child.type as { displayName?: string })?.displayName === Collapse.displayName
  );
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow multiple panels open at once (default: false = single open) */
  multiple?: boolean;
  /** Controlled: indices of open Collapse panels (relative to Collapse children only) */
  openIndices?: number[];
  /** Default open Collapse panel indices (relative to Collapse children only) */
  defaultOpenIndices?: number[];
  /** Callback when open panels change (indices relative to Collapse children only) */
  onOpenChange?: (indices: number[]) => void;
  /** Join items visually (DaisyUI join) */
  join?: boolean;
}

/**
 * Container for Collapse items. Controls single or multiple open panels.
 * Indices in openIndices/defaultOpenIndices/onOpenChange refer to the
 * position among Collapse children only (non-Collapse children are skipped).
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

    const handleToggle = (idx: number, nextOpen: boolean) => {
      let next: number[];
      if (multiple) {
        next = nextOpen
          ? [...cleanOpen, idx]
          : cleanOpen.filter((i) => i !== idx);
      } else {
        next = nextOpen ? [idx] : [];
      }
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    };

    const allChildren = Children.toArray(children);

    // Count Collapse children for bounds checking
    const collapseCount = allChildren.filter(
      (c) => isValidElement(c) && isCollapseElement(c),
    ).length;
    const deduped = Array.from(new Set(currentOpen)).filter(
      (i) => i >= 0 && i < collapseCount,
    );
    const cleanOpen = multiple ? deduped : deduped.slice(0, 1);

    let collapseIndex = 0;

    return (
      <div
        ref={ref}
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
            className: cn(
              join && 'join-item',
              child.props.className,
            ),
          });
        })}
      </div>
    );
  },
);

Accordion.displayName = 'Accordion';
