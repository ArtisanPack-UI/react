import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Skeleton, type SkeletonProps } from '../../components/feedback/Skeleton/Skeleton';

const declaredProps: (keyof SkeletonProps)[] = ['shape', 'width', 'height'];

describe('Skeleton', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Skeleton, 'Skeleton', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('is a hidden block by default', () => {
    const { container } = render(<Skeleton />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('SPAN');
    expect(root).toHaveClass('apui-skeleton');
    expect(root).toHaveAttribute('data-shape', 'block');
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).not.toHaveAttribute('style');
  });

  it('writes width and height inline, numbers as px', () => {
    const { container } = render(<Skeleton shape="circle" width={40} height="2rem" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-shape', 'circle');
    expect(root.style.width).toBe('40px');
    expect(root.style.height).toBe('2rem');
  });
});
