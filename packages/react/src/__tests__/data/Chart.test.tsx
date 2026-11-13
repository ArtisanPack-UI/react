import { createRef } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Chart, type ChartProps } from '../../components/data/Chart/Chart';

const declaredProps: (keyof ChartProps)[] = [
  'type',
  'series',
  'labels',
  'title',
  'description',
  'actions',
  'tabular',
  'prefix',
  'suffix',
  'notation',
  'width',
  'height',
  'classes',
];

const weeks = ['W1', 'W2', 'W3', 'W4'];
const revenue = [{ name: 'Revenue', data: [4100, 6000, 8200, 10000] }];
const twoSeries = [
  { name: 'Sales', data: [1, 3] },
  { name: 'Target', data: [2, 2] },
];

const parts = (container: HTMLElement) => [
  ...new Set(
    [...container.querySelectorAll('[data-scope="chart"]')].map((el) =>
      el.getAttribute('data-part'),
    ),
  ),
];

describe('Chart', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Chart, 'Chart', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('renders a bar chart in a card with focusable, named marks', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <Chart
        ref={ref}
        title="Weekly revenue"
        description="Best week labeled"
        labels={weeks}
        series={revenue}
        prefix="$"
        notation="compact"
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(ref.current).toBe(root);
    expect(root.className).toBe('apui-card apui-chart');
    expect(root.getAttribute('data-type')).toBe('bar');
    expect(container.querySelector('h3[data-part="title"]')!.textContent).toBe('Weekly revenue');
    const plot = container.querySelector('svg[data-part="plot"]')!;
    expect(plot.getAttribute('role')).toBe('group');
    expect(plot.getAttribute('aria-label')).toBe('Weekly revenue');
    expect(plot.getAttribute('viewBox')).toBe('0 0 520 220');
    const marks = container.querySelectorAll('[data-part="mark"]');
    expect(marks).toHaveLength(4);
    expect(marks[0]!.getAttribute('tabindex')).toBe('0');
    expect(marks[0]!.getAttribute('role')).toBe('img');
    expect(marks[0]!.getAttribute('aria-label')).toBe('W1: $4.1k');
    expect(container.querySelector('[data-part="value"]')!.textContent).toBe('$10.0k');
    expect(container.querySelector('[data-part="legend"]')).toBeNull();
    const tooltip = container.querySelector('[data-part="tooltip"]') as HTMLElement;
    expect(tooltip.hidden).toBe(true);
    expect(tooltip.getAttribute('aria-hidden')).toBe('true');
  });

  it('draws the shared vector coordinates', () => {
    const { container } = render(
      <Chart
        title="Weekly revenue"
        labels={weeks}
        series={revenue}
        prefix="$"
        notation="compact"
      />,
    );
    expect(
      [...container.querySelectorAll('[data-part="grid"]')].map((line) => line.getAttribute('y1')),
    ).toEqual(['196.0', '159.2', '122.4', '85.6', '48.8', '12.0']);
    expect(container.querySelector('[data-part="axis"]')!.textContent).toBe('$0k');
  });

  it('draws every part for an area chart with two series, actions and the table', () => {
    const { container } = render(
      <Chart
        type="area"
        title="Analytic"
        labels={['Q1', 'Q2']}
        series={twoSeries}
        actions={<button type="button">Export</button>}
        tabular
      />,
    );
    expect(parts(container).sort()).toEqual(
      [
        'header',
        'title',
        'legend',
        'swatch',
        'actions',
        'body',
        'plot',
        'grid',
        'axis',
        'area',
        'line',
        'point',
        'crosshair',
        'dot',
        'value',
        'mark',
        'tooltip',
        'table',
      ].sort(),
    );
    expect(container.querySelector('[data-part="mark"]')!.getAttribute('aria-label')).toBe(
      'Q1: Sales 1, Target 2',
    );
    const table = container.querySelector('table')!;
    expect(table.getAttribute('aria-label')).toBe('Analytic');
    expect(table.querySelectorAll('thead th')[1]!.textContent).toBe('Target');
    expect(table.querySelector('tbody tr:nth-child(2) td')!.textContent).toBe('3');
  });

  it('opens the tooltip on focus and hover, and closes on Escape', () => {
    const { container } = render(
      <Chart type="line" title="Analytic" labels={['Q1', 'Q2']} series={twoSeries} />,
    );
    const marks = container.querySelectorAll('[data-part="mark"]');
    const tooltip = container.querySelector('[data-part="tooltip"]') as HTMLElement;
    fireEvent.focusIn(marks[1]!);
    expect(tooltip.hidden).toBe(false);
    expect(tooltip.innerHTML).toBe('<strong>Q2</strong>Sales 3 · Target 2');
    expect(marks[1]!.getAttribute('data-state')).toBe('active');
    expect(
      container.querySelector('[data-part="point"][data-index="1"]')!.getAttribute('visibility'),
    ).toBe('visible');
    fireEvent.keyDown(marks[1]!, { key: 'Escape' });
    expect(tooltip.hidden).toBe(true);
    fireEvent.mouseOver(marks[0]!);
    expect(tooltip.innerHTML).toBe('<strong>Q1</strong>Sales 1 · Target 2');
    fireEvent.mouseOut(marks[0]!, { relatedTarget: container });
    expect(tooltip.hidden).toBe(true);
  });

  it('draws a donut with its shares in the legend beside it', () => {
    const { container } = render(
      <Chart
        type="donut"
        title="Active listings"
        labels={['United States', 'Mexico', 'Canada', 'Other']}
        series={[1240, 990, 723, 260]}
      />,
    );
    expect(container.querySelectorAll('[data-part="mark"]')).toHaveLength(4);
    expect(container.querySelector('[data-part="plot"]')!.getAttribute('viewBox')).toBe(
      '0 0 160 160',
    );
    expect(
      container.querySelector('[data-part="body"] > [data-part="legend"] [data-part="value"]')!
        .textContent,
    ).toBe('38.6%');
    expect(container.querySelectorAll('[data-part="mark"]')[1]!.getAttribute('aria-label')).toBe(
      'Mexico: 990, 30.8%',
    );
  });

  it('takes a viewBox size and part classes, and falls back to a bar chart', () => {
    const { container } = render(
      <Chart
        type={'pie' as never}
        title="T"
        series={[1, 2]}
        width={300}
        height={150}
        classes={{ plot: 'p', mark: 'm' }}
      />,
    );
    expect(container.firstElementChild!.getAttribute('data-type')).toBe('bar');
    const plot = container.querySelector('[data-part="plot"]')!;
    expect(plot.getAttribute('viewBox')).toBe('0 0 300 150');
    expect(plot.getAttribute('class')).toBe('p');
    expect(container.querySelector('[data-part="mark"]')!.getAttribute('class')).toBe('m');
  });

  it('keys lines, areas and dots by position, so 7+ series sharing a color stay distinct', () => {
    const many = (offset: number) =>
      Array.from({ length: 8 }, (_, index) => ({
        name: `S${index + 1}`,
        data: [index + offset, index + offset + 1],
      }));
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { container, rerender } = render(
      <Chart type="area" title="T" labels={['A', 'B']} series={many(1)} />,
    );
    rerender(<Chart type="area" title="T" labels={['A', 'B']} series={many(2)} />);
    const keyWarnings = error.mock.calls.filter((call) => String(call[0]).includes('same key'));
    error.mockRestore();
    expect(keyWarnings).toEqual([]);
    expect(container.querySelectorAll('[data-part="line"]')).toHaveLength(8);
    expect(container.querySelectorAll('[data-part="area"]')).toHaveLength(8);
    const dots = container.querySelectorAll('[data-part="point"]')[0]!.querySelectorAll('circle');
    expect([...dots].map((dot) => dot.getAttribute('data-series'))).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '1',
      '2',
    ]);
  });
});
