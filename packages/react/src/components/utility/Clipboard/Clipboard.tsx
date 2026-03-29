import { forwardRef, useEffect, useRef, useState, type ButtonHTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

export interface ClipboardProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  /** The text to copy to clipboard */
  text: string;
  /** Button label when idle */
  label?: string;
  /** Button label after a successful copy */
  successLabel?: string;
  /** Duration in ms to show the success state */
  successDuration?: number;
  /** Button color */
  color?: DaisyColor | 'ghost';
  /** Button size */
  size?: Size;
  /** Callback fired after a successful copy */
  onCopy?: () => void;
}

const colorMap: Record<string, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
  info: 'btn-info',
  neutral: 'btn-neutral',
  ghost: 'btn-ghost',
};

const sizeMap: Record<Size, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

const copyIconPath =
  'M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z';
const copyIconPath2 =
  'M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z';
const checkIconPath =
  'M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z';

/**
 * Copy-to-clipboard button with success feedback.
 */
export const Clipboard = forwardRef<HTMLButtonElement, ClipboardProps>(
  (
    {
      text,
      label = 'Copy',
      successLabel = 'Copied!',
      successDuration = 2000,
      color = 'ghost',
      size = 'sm',
      onCopy,
      onClick: userOnClick,
      className,
      ...rest
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
      userOnClick?.(e);
      if (e.defaultPrevented) {
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        onCopy?.();
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => setCopied(false), successDuration);
      } catch {
        // Clipboard API may not be available
      }
    };

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    return (
      <button
        ref={ref}
        type="button"
        className={cn('btn', colorMap[color], sizeMap[size], className)}
        onClick={handleCopy}
        aria-label={copied ? successLabel : label}
        {...rest}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={cn('w-4 h-4', copied && 'text-success')}
          aria-hidden="true"
        >
          {copied ? (
            <path fillRule="evenodd" d={checkIconPath} clipRule="evenodd" />
          ) : (
            <>
              <path d={copyIconPath} />
              <path d={copyIconPath2} />
            </>
          )}
        </svg>
        <span>{copied ? successLabel : label}</span>
      </button>
    );
  },
);

Clipboard.displayName = 'Clipboard';
