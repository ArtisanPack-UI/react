import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Progress, type ProgressProps } from '../../components/data/Progress/Progress';

const declaredProps: (keyof ProgressProps)[] = [
  'value',
  'max',
  'indeterminate',
  'segmented',
  'size',
  'color',
  'label',
  'valueText',
  'classes',
];

describe('Progress', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Progress, 'Progress', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('is a labelled progressbar with its value', () => {
    const { container } = render(
      <Progress value={64} label="Uploading 12 photos" valueText="8 of 12" />,
    );
    const bar = screen.getByRole('progressbar', { name: 'Uploading 12 photos' });
    expect(bar).toHaveClass('apui-progress');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuenow', '64');
    expect(bar).toHaveAttribute('aria-valuetext', '8 of 12');
    expect(bar).toHaveAttribute('data-size', 'md');
    expect(bar).toHaveAttribute('data-color', 'primary');
    expect(container.querySelector('[data-part="value"]')).toHaveTextContent('8 of 12');
    const fill = container.querySelector<HTMLElement>('[data-part="bar"]')!;
    expect(fill.style.getPropertyValue('--apui-_v')).toBe('64%');
  });

  it('clamps the value and shows the percentage for a labelled bar', () => {
    const { container } = render(<Progress value={30} max={20} label="Done" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '20');
    expect(container.querySelector('[data-part="value"]')).toHaveTextContent('100%');
  });

  it('leaves out aria-valuenow and the width while indeterminate', () => {
    const { container } = render(<Progress indeterminate aria-label="Preparing" value={40} />);
    const bar = screen.getByRole('progressbar', { name: 'Preparing' });
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('data-indeterminate', '');
    expect(container.querySelector('[data-part="head"]')).toBeNull();
    expect(container.querySelector('[data-part="bar"]')).not.toHaveAttribute('style');
  });

  it('renders one bar per segment, the done ones marked', () => {
    const { container } = render(<Progress segmented value={3} max={5} aria-label="Setup" />);
    const bars = container.querySelectorAll('[data-part="bar"]');
    expect(bars).toHaveLength(5);
    expect(container.querySelectorAll('[data-part="bar"][data-done]')).toHaveLength(3);
    expect(container.firstElementChild).toHaveAttribute('data-segmented', '');
  });
});
