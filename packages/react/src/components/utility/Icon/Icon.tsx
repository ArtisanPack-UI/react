import { forwardRef, type SVGAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';
import type { DaisyColor, Size } from '@artisanpack-ui/tokens';

export interface IconProps extends SVGAttributes<SVGSVGElement> {
  /** SVG path data or child elements to render inside the <svg> */
  path?: string;
  /** The color variant */
  color?: DaisyColor;
  /** Predefined size */
  size?: Size;
  /** Custom label for accessibility — if omitted the icon is decorative (aria-hidden) */
  label?: string;
  /** SVG viewBox attribute (defaults to "0 0 24 24") */
  viewBox?: string;
}

const colorMap: Record<DaisyColor, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  accent: 'text-accent',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
  neutral: 'text-neutral',
};

const sizeMap: Record<Size, string> = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

/**
 * SVG icon component with size and color props.
 * Accepts either a `path` prop for a single-path icon or children for complex SVGs.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ path, color, size = 'md', label, viewBox = '0 0 24 24', className, children, ...rest }, ref) => {
    const isDecorative = !label;

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        fill="currentColor"
        aria-hidden={isDecorative || undefined}
        aria-label={label}
        role={label ? 'img' : undefined}
        className={cn(sizeMap[size], color && colorMap[color], className)}
        {...rest}
      >
        {path ? <path d={path} /> : children}
      </svg>
    );
  },
);

Icon.displayName = 'Icon';
