import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { KpiCard, type KpiCardProps } from '../../components/data/KpiCard/KpiCard';

const declaredProps: (keyof KpiCardProps)[] = [
  'stat',
  'sparkline',
  'sparklineLabel',
  'target',
  'targetLabel',
  'period',
  'classes',
];

const stat = {
  label: 'Profit',
  value: '$15,708.98',
  icon: 'trending-up',
  color: 'success' as const,
  change: 8.1,
  description: 'vs last month',
};

describe('KpiCard', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(KpiCard, 'KpiCard', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('renders a card with the stat parts in the kpi-card scope', () => {
    const { container } = render(<KpiCard stat={stat} />);
    const root = container.firstElementChild!;
    expect(root.className).toBe('apui-card apui-kpi-card');
    expect(root.getAttribute('data-color')).toBe('success');
    expect(root.querySelector('[data-scope="kpi-card"][data-part="label"]')).toHaveTextContent(
      'Profit',
    );
    expect(root.querySelector('[data-part="icon"][aria-hidden="true"] > svg')).not.toBeNull();
    expect(
      root.querySelector('[data-part="row"] > [data-part="summary"] > [data-part="value"]'),
    ).toHaveTextContent('$15,708.98');
    expect(root.querySelector('[data-part="delta"]')!.textContent).toBe('Increase 8.1%');
    expect(root.querySelector('svg[data-part="sparkline"]')).toBeNull();
    expect(root.querySelector('[data-part="target"]')).toBeNull();
  });

  it('draws the trend as an area sparkline beside the value', () => {
    const { container } = render(<KpiCard stat={stat} sparkline={[2, 4, 8]} />);
    const svg = container.querySelector('[data-part="row"] > svg')!;
    expect(svg.getAttribute('class')).toBe('apui-sparkline');
    expect(svg.getAttribute('data-scope')).toBe('kpi-card');
    expect(svg.getAttribute('data-part')).toBe('sparkline');
    expect(svg.getAttribute('data-variant')).toBe('area');
    expect(svg.getAttribute('viewBox')).toBe('0 0 96 36');
    expect(svg.getAttribute('aria-label')).toBe('Trend from 2 to 8');
  });

  it('shows progress toward a target, with translated text', () => {
    const { container, getByRole } = render(
      <KpiCard
        stat={stat}
        target={{ value: 15708.98, max: 25000, label: 'Goal $25,000' }}
        targetLabel="{percent} % del objetivo"
      />,
    );
    const spans = container.querySelectorAll('[data-part="targetText"] > span');
    expect(spans).toHaveLength(2);
    expect(spans[0]).toHaveTextContent('Goal $25,000');
    expect(spans[1]).toHaveTextContent('63 % del objetivo');
    expect(getByRole('progressbar', { name: 'Goal $25,000' }).getAttribute('data-size')).toBe('sm');
  });

  it('puts the period control in the label row, and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <KpiCard ref={ref} stat={stat} period={<select aria-label="Period" />} />,
    );
    expect(
      container.querySelector('[data-part="top"] > [data-part="period"] > select'),
    ).not.toBeNull();
    expect(ref.current).toBe(container.firstElementChild);
  });
});
