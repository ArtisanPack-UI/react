import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  ProgressRadial,
  type ProgressRadialProps,
} from '../../components/data/ProgressRadial/ProgressRadial';

const declaredProps: (keyof ProgressRadialProps)[] = [
  'value',
  'max',
  'indeterminate',
  'size',
  'thickness',
  'color',
  'label',
  'valueText',
  'hideValue',
  'classes',
];

describe('ProgressRadial', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(ProgressRadial, 'ProgressRadial', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('draws the ring from size, thickness and value', () => {
    const { container } = render(
      <ProgressRadial value={68} size={80} thickness={7} label="complete" />,
    );
    const root = screen.getByRole('progressbar', { name: 'complete' });
    expect(root).toHaveClass('apui-progress-radial');
    expect(root).toHaveAttribute('aria-valuenow', '68');
    expect(root.style.getPropertyValue('--apui-_s')).toBe('80px');
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('viewBox', '0 0 80 80');
    const bar = container.querySelector('[data-part="bar"]')!;
    expect(bar).toHaveAttribute('cx', '40.0');
    expect(bar).toHaveAttribute('r', '36.5');
    expect(bar).toHaveAttribute('stroke-width', '7');
    expect(bar).toHaveAttribute('stroke-dasharray', '229.3');
    expect(bar).toHaveAttribute('stroke-dashoffset', '73.4');
    expect(container.querySelector('[data-part="value"]')).toHaveTextContent('68%complete');
  });

  it('names itself with aria-label when the value is hidden', () => {
    const { container } = render(<ProgressRadial value={10} hideValue label="Profile" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Profile');
    expect(container.querySelector('[data-part="value"]')).toBeNull();
  });

  it('spins a quarter arc and leaves out aria-valuenow while indeterminate', () => {
    const { container } = render(<ProgressRadial indeterminate aria-label="Calculating" />);
    const root = screen.getByRole('progressbar', { name: 'Calculating' });
    expect(root).not.toHaveAttribute('aria-valuenow');
    expect(root).toHaveAttribute('data-indeterminate', '');
    expect(container.querySelector('[data-part="value"]')).toBeNull();
    const bar = container.querySelector('[data-part="bar"]')!;
    const length = Number(bar.getAttribute('stroke-dasharray'));
    expect(Number(bar.getAttribute('stroke-dashoffset'))).toBeCloseTo(length * 0.75, 0);
  });
});
