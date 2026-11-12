import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Sparkline, type SparklineProps } from '../../components/data/Sparkline/Sparkline';

const declaredProps: (keyof SparklineProps)[] = [
  'data',
  'variant',
  'width',
  'height',
  'label',
  'classes',
];

const parts = (container: HTMLElement) => [
  ...new Set(
    [...container.querySelectorAll('[data-scope="sparkline"]')].map((el) =>
      el.getAttribute('data-part'),
    ),
  ),
];

describe('Sparkline', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Sparkline, 'Sparkline', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('renders an image labeled with its first and latest values', () => {
    const ref = createRef<SVGSVGElement>();
    const { container } = render(<Sparkline ref={ref} data={[3, 5, 9]} />);
    const svg = container.querySelector('svg')!;
    expect(ref.current).toBe(svg);
    expect(svg.getAttribute('class')).toBe('apui-sparkline');
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Trend from 3 to 9');
    expect(svg.getAttribute('data-variant')).toBe('line');
    expect(svg.getAttribute('viewBox')).toBe('0 0 96 28');
  });

  it('draws the spec coordinates', () => {
    const { container } = render(<Sparkline data={[2, 4, 3, 7, 6, 9, 12, 11, 14]} />);
    expect(container.querySelector('[data-part="line"]')!.getAttribute('d')).toBe(
      'M2.0,25.0 L13.5,21.3 L25.0,23.2 L36.5,15.8 L48.0,17.7 L59.5,12.2 L71.0,6.7 L82.5,8.5 L94.0,3.0',
    );
    const dot = container.querySelector('[data-part="dot"]')!;
    expect([dot.getAttribute('cx'), dot.getAttribute('cy'), dot.getAttribute('r')]).toEqual([
      '94.0',
      '3.0',
      '2.5',
    ]);
  });

  it.each([
    ['line', ['baseline', 'line', 'dot']],
    ['area', ['baseline', 'area', 'line', 'dot']],
    ['bar', ['baseline', 'bar']],
  ] as const)('draws the %s parts', (variant, expected) => {
    const { container } = render(<Sparkline data={[-2, 4, 3, 9]} variant={variant} />);
    expect(parts(container)).toEqual(expected);
  });

  it('takes a translated label, a size and part classes', () => {
    const { container } = render(
      <Sparkline
        data={[1, 2]}
        width={140}
        height={48}
        label="Tendencia: {latest}"
        classes={{ line: 'l' }}
      />,
    );
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('aria-label')).toBe('Tendencia: 2');
    expect(svg.getAttribute('viewBox')).toBe('0 0 140 48');
    expect(container.querySelector('[data-part="line"]')!.getAttribute('class')).toBe('l');
  });
});
