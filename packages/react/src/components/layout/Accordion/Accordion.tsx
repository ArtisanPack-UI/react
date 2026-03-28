import {
  forwardRef,
  useState,
  useId,
  Children,
  isValidElement,
  cloneElement,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import { cn } from '@artisanpack-ui/tokens';
import { Collapse } from '../Collapse/Collapse';
import type { CollapseProps } from '../Collapse/Collapse';

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Allow multiple panels open at once (default: false = single open) */
  multiple?: boolean;
  /** Controlled: indices of open panels */
  openIndices?: number[];
  /** Default open panel indices (uncontrolled) */
  defaultOpenIndices?: number[];
  /** Callback when open panels change */
  onOpenChange?: (indices: number[]) => void;
  /** Join items visually (DaisyUI join) */
  join?: boolean;
}

/**
 * Container for Collapse items. Controls single or multiple open panels.
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
    const groupName = useId();
    const [internalOpen, setInternalOpen] = useState<number[]>(defaultOpenIndices);
    const isControlled = openIndices !== undefined;
    const currentOpen = isControlled ? openIndices : internalOpen;

    const handleToggle = (index: number, nextOpen: boolean) => {
      let next: number[];
      if (multiple) {
        next = nextOpen
          ? [...currentOpen, index]
          : currentOpen.filter((i) => i !== index);
      } else {
        next = nextOpen ? [index] : [];
      }
      if (!isControlled) {
        setInternalOpen(next);
      }
      onOpenChange?.(next);
    };

    const items = Children.toArray(children);

    return (
      <div
        ref={ref}
        className={cn(join && 'join join-vertical w-full', className)}
        {...rest}
      >
        {items.map((child, index) => {
          if (!isValidElement(child) || child.type !== Collapse) return child;

          const collapseChild = child as ReactElement<CollapseProps>;
          const isOpen = currentOpen.includes(index);

          return cloneElement(collapseChild, {
            key: collapseChild.key ?? index,
            open: isOpen,
            onOpenChange: (open: boolean) => handleToggle(index, open),
            name: multiple ? undefined : groupName,
            className: cn(
              join && 'join-item',
              collapseChild.props.className,
            ),
          });
        })}
      </div>
    );
  },
);

Accordion.displayName = 'Accordion';
