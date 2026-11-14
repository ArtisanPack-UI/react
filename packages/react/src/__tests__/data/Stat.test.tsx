import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Stat, type StatProps } from '../../components/data/Stat/Stat';

const declaredProps: (keyof StatProps)[] = [
  'label',
  'value',
  'unit',
  'icon',
  'delta',
  'change',
  'trend',
  'description',
  'size',
  'color',
  'emphasis',
  'bare',
  'upLabel',
  'downLabel',
  'flatLabel',
  'classes',
];

describe('Stat', () => {
  it('matches the design-system manifest', async () => {
    // Only the down label shows: the fixture's change is negative.
    await expectReactParity(Stat, 'Stat', {
      declared: { props: declaredProps, events: [] },
      ignoreEffects: ['upLabel', 'flatLabel'],
    });
  });

  it('renders the root with its defaults', () => {
    const { container } = render(<Stat label="Profit" value="$15,708.98" />);
    const root = container.firstElementChild!;
    expect(root.className).toBe('apui-stat');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.getAttribute('data-color')).toBe('neutral');
    expect(root.hasAttribute('data-emphasis')).toBe(false);
    expect(root.querySelector('[data-part="top"] > [data-part="label"]')).toHaveTextContent(
      'Profit',
    );
  });

  it.each([
    [10.94, 'up', 'Increase 10.9%'],
    [-5.4, 'down', 'Decrease 5.4%'],
    [0, 'flat', 'No change 0.0%'],
  ])('formats change %s as the delta, with hidden text and an arrow', (change, trend, text) => {
    const { container } = render(<Stat value="1" change={change} description="vs last month" />);
    const delta = container.querySelector('[data-part="foot"] > [data-part="delta"]')!;
    expect(delta.getAttribute('data-trend')).toBe(trend);
    expect(delta.querySelector('svg')).not.toBeNull();
    expect(delta.textContent).toBe(text);
    expect(container.querySelector('[data-part="description"]')).toHaveTextContent('vs last month');
  });

  it('prefers delta and trend over change, and translates labels', () => {
    const { container } = render(
      <Stat value="34.6" delta="6.2 hrs" trend="up" change={-1} upLabel="Sube" />,
    );
    const delta = container.querySelector('[data-part="delta"]')!;
    expect(delta.getAttribute('data-trend')).toBe('up');
    expect(delta.textContent).toBe('Sube 6.2 hrs');
  });

  it('renders the unit, an icon node and children as the value', () => {
    const { container } = render(
      <Stat label="Latency" unit="ms" icon={<svg data-custom="" />}>
        <strong>182</strong>
      </Stat>,
    );
    expect(container.querySelector('[data-part="value"] > strong')).toHaveTextContent('182');
    expect(container.querySelector('[data-part="value"] > [data-part="unit"]')).toHaveTextContent(
      'ms',
    );
    expect(
      container.querySelector('[data-part="icon"][aria-hidden="true"] > svg[data-custom]'),
    ).not.toBeNull();
  });

  it('a delta without a trend has no arrow or hidden text', () => {
    const { container } = render(<Stat value="7" delta="days in a row" />);
    const delta = container.querySelector('[data-part="delta"]')!;
    expect(delta.hasAttribute('data-trend')).toBe(false);
    expect(delta.querySelector('svg')).toBeNull();
    expect(delta.textContent).toBe('days in a row');
  });

  it('emphasis, bare, size, color, classes and the ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Stat
        ref={ref}
        value="1"
        emphasis
        bare
        size="lg"
        color="primary"
        className="extra"
        classes={{ root: 'r', value: 'v' }}
      />,
    );
    const root = container.firstElementChild!;
    expect(ref.current).toBe(root);
    expect(root.className).toBe('apui-stat r extra');
    expect(root.hasAttribute('data-emphasis')).toBe(true);
    expect(root.hasAttribute('data-bare')).toBe(true);
    expect(root.getAttribute('data-size')).toBe('lg');
    expect(root.getAttribute('data-color')).toBe('primary');
    expect(container.querySelector('[data-part="value"]')!.className).toBe('v');
  });
});
