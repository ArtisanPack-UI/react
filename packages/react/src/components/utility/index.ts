/**
 * @module utility
 *
 * Utility components that provide common UI helpers such as icons,
 * theme toggling, tooltips, clipboard copying, and markdown rendering.
 *
 * @packageDocumentation
 */

export { Icon } from './Icon/Icon';
export type { IconProps, IconVariant, IconSize, IconColor, IconPart } from './Icon/Icon';

export { Swap } from './Swap/Swap';
export type { SwapProps, SwapSize, SwapTransition, SwapPart } from './Swap/Swap';

export { ThemeToggle } from './ThemeToggle/ThemeToggle';
export type {
  Theme,
  ThemeChoice,
  ThemeToggleProps,
  ThemeTogglePart,
  ThemeToggleSize,
  ThemeToggleVariant,
} from './ThemeToggle/ThemeToggle';
export { ThemeScript } from './ThemeToggle/ThemeScript';
export type { ThemeScriptProps } from './ThemeToggle/ThemeScript';

export { Tooltip } from './Tooltip/Tooltip';
export type { TooltipProps, TooltipPlacement, TooltipSize, TooltipPart } from './Tooltip/Tooltip';

export { Clipboard } from './Clipboard/Clipboard';
export type {
  ClipboardProps,
  ClipboardPart,
  ClipboardSize,
  ClipboardVariant,
} from './Clipboard/Clipboard';

export { Kbd } from './Kbd/Kbd';
export type { KbdProps, KbdPart, KbdPlatform, KbdSize } from './Kbd/Kbd';

export { Markdown } from './Markdown/Markdown';
export type { MarkdownProps, MarkdownPart, MarkdownMode } from './Markdown/Markdown';
