import { forwardRef, type ButtonHTMLAttributes, type MouseEvent } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { Size } from '@artisanpack-ui/tokens';
import { useTheme, type ColorScheme } from '../../../hooks/use-theme';

export interface ThemeToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  /** Button size */
  size?: Size;
  /** Which modes to cycle through (defaults to all three) */
  modes?: ColorScheme[];
}

const sizeMap: Record<Size, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

const sunPath =
  'M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z';

const moonPath =
  'M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z';

const systemPath =
  'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z';

const iconMap: Record<ColorScheme, { path: string; fill: string }> = {
  light: { path: sunPath, fill: 'currentColor' },
  dark: { path: moonPath, fill: 'currentColor' },
  system: { path: systemPath, fill: 'none' },
};

const labelMap: Record<ColorScheme, string> = {
  light: 'Light mode',
  dark: 'Dark mode',
  system: 'System theme',
};

/**
 * Theme toggle button that cycles through light/dark/system modes.
 * Must be used within a ThemeProvider.
 */
export const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ size = 'md', modes = ['light', 'dark', 'system'], onClick: onClickProp, className, ...rest }, ref) => {
    const { colorScheme, setColorScheme } = useTheme();

    const handleToggle = (e: MouseEvent<HTMLButtonElement>) => {
      onClickProp?.(e);
      if (e.defaultPrevented || modes.length === 0) {
        return;
      }
      const currentIndex = modes.indexOf(colorScheme);
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % modes.length;
      setColorScheme(modes[nextIndex]);
    };

    const icon = iconMap[colorScheme];

    return (
      <button
        ref={ref}
        type="button"
        className={cn('btn btn-ghost btn-square', sizeMap[size], className)}
        onClick={handleToggle}
        aria-label={labelMap[colorScheme]}
        {...rest}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={icon.fill}
          stroke={icon.fill === 'none' ? 'currentColor' : 'none'}
          strokeWidth={icon.fill === 'none' ? 1.5 : undefined}
          className="w-5 h-5"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d={icon.path}
            clipRule="evenodd"
          />
        </svg>
      </button>
    );
  },
);

ThemeToggle.displayName = 'ThemeToggle';
