/**
 * @module Dropdown
 *
 * Deprecated aliases of {@link DropdownMenu} and {@link DropdownMenuItem},
 * kept for 1.x code. `Dropdown` maps `end` → `align="end"` and a custom
 * `trigger` element → its content as the trigger button's `label` (the menu
 * renders its own trigger button). `top` and `hover` have no DropdownMenu
 * equivalent and are ignored: the menu opens below, on click and from the
 * keyboard. `DropdownItem` renders a DropdownMenuItem with a generated
 * `value` and calls `onClick` when it's chosen by pointer or keyboard.
 *
 * @deprecated Use `DropdownMenu` and `DropdownMenuItem`.
 * @packageDocumentation
 */

import {
  forwardRef,
  isValidElement,
  useId,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react';

import { devWarnOnce } from '../../../internal/parts';
import {
  DropdownMenu,
  DropdownMenuItem,
  type DropdownMenuItemProps,
  type DropdownMenuProps,
} from '../DropdownMenu/DropdownMenu';

/**
 * Props for the deprecated {@link Dropdown}.
 *
 * @deprecated Use `DropdownMenuProps`.
 */
export interface DropdownProps extends Omit<DropdownMenuProps, 'label'> {
  /**
   * A custom trigger element. DropdownMenu renders its own trigger button,
   * so only this element's content (or its `aria-label`) is used, as the
   * label. Use DropdownMenu's `label`.
   */
  trigger?: ReactElement | null;
  /** The trigger button's text. @defaultValue `'Options'` */
  label?: ReactNode;
  /** Aligns the menu with the trigger's end edge. Use DropdownMenu's `align="end"`. */
  end?: boolean;
  /** Ignored: DropdownMenu has no prop to open above the trigger. */
  top?: boolean;
  /** Ignored: the menu opens on click and from the keyboard only. */
  hover?: boolean;
}

/** The content of a 1.x custom trigger element, used as the trigger button's label. */
function triggerLabel(trigger: ReactElement | null | undefined): ReactNode {
  if (!isValidElement(trigger)) return undefined;
  const props = trigger.props as { children?: ReactNode; 'aria-label'?: string };
  return props.children ?? props['aria-label'];
}

/**
 * Deprecated: renders a {@link DropdownMenu}. The ref points at the menu panel.
 *
 * @deprecated Use `DropdownMenu`.
 */
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ trigger, label = 'Options', end = false, top: _top, hover: _hover, align, ...rest }, ref) => {
    devWarnOnce('Dropdown', 'Dropdown is deprecated; use DropdownMenu.');
    return (
      <DropdownMenu
        {...rest}
        ref={ref}
        label={triggerLabel(trigger) ?? label}
        align={end ? 'end' : align}
      />
    );
  },
);

Dropdown.displayName = 'Dropdown';

/**
 * Props for the deprecated {@link DropdownItem}.
 *
 * @deprecated Use `DropdownMenuItemProps`.
 */
export interface DropdownItemProps extends Omit<DropdownMenuItemProps, 'value' | 'onClick'> {
  /** The item's value, reported by the menu's `onSelect`. Generated when omitted. */
  value?: string;
  /**
   * Called when the item is chosen, by pointer or keyboard. The event's
   * target is now the menu item element. Use DropdownMenuItem's `onSelect`.
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Deprecated: renders a {@link DropdownMenuItem}. Use it inside a
 * {@link Dropdown} or {@link DropdownMenu}.
 *
 * @deprecated Use `DropdownMenuItem`.
 */
export const DropdownItem = forwardRef<HTMLDivElement, DropdownItemProps>(
  ({ value, disabled = false, onClick, ...rest }, ref) => {
    devWarnOnce('DropdownItem', 'DropdownItem is deprecated; use DropdownMenuItem.');
    const generated = useId();
    return (
      <DropdownMenuItem
        {...rest}
        ref={ref}
        value={value ?? generated}
        disabled={disabled}
        // The menu clicks the item element for Enter and Space too, so this
        // covers keyboard choices.
        onClick={(event) => {
          if (disabled) return;
          (onClick as MouseEventHandler<HTMLElement> | undefined)?.(event);
        }}
      />
    );
  },
);

DropdownItem.displayName = 'DropdownItem';
