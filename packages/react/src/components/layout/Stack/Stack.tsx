import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@artisanpack-ui/tokens';

type GapSize = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
type Align = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  /** Stack direction */
  direction?: 'vertical' | 'horizontal';
  /** Gap between items */
  gap?: GapSize;
  /** Align items on the cross axis */
  align?: Align;
  /** Justify items on the main axis */
  justify?: Justify;
  /** Allow items to wrap */
  wrap?: boolean;
}

const gapMap: Record<GapSize, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
};

const alignMap: Record<Align, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyMap: Record<Justify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

/**
 * Flexbox layout component for vertical or horizontal stacking.
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  (
    { direction = 'vertical', gap = 2, align, justify, wrap = false, className, children, ...rest },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          direction === 'vertical' ? 'flex-col' : 'flex-row',
          gapMap[gap],
          align && alignMap[align],
          justify && justifyMap[justify],
          wrap && 'flex-wrap',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

Stack.displayName = 'Stack';
