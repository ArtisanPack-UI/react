import { createRef } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Grid, type GridProps } from '../../components/layout/Grid/Grid';

const declaredProps: (keyof GridProps)[] = ['columns', 'minItemWidth', 'gap', 'align', 'justify'];

describe('Grid', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Grid, 'Grid', { declared: { props: declaredProps, events: [] } });
  });

  it('emits its defaults as data attributes', () => {
    const { container } = render(<Grid>a</Grid>);
    const grid = container.firstElementChild!;
    expect(grid.className).toBe('apui-grid');
    expect(grid.getAttribute('data-columns')).toBe('1');
    expect(grid.getAttribute('data-gap')).toBe('4');
    expect(grid.getAttribute('data-align')).toBe('stretch');
    expect(grid.getAttribute('data-justify')).toBe('stretch');
    expect(grid.getAttribute('style')).toBeNull();
  });

  it('clamps columns, takes numeric gaps and sets the min item width', () => {
    const { container } = render(
      <Grid columns={20} gap={6} minItemWidth="16rem" style={{ color: 'red' }}>
        a
      </Grid>,
    );
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.getAttribute('data-columns')).toBe('12');
    expect(grid.getAttribute('data-gap')).toBe('6');
    expect(grid.style.getPropertyValue('--apui-grid-min-item-width')).toBe('16rem');
    expect(grid.style.color).toBe('red');
  });

  it('forwards the ref and attributes', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Grid ref={ref} className="x" data-testid="g" align="center" justify="end">
        a
      </Grid>,
    );
    expect(ref.current?.className).toBe('apui-grid x');
    expect(ref.current?.getAttribute('data-align')).toBe('center');
    expect(ref.current?.getAttribute('data-justify')).toBe('end');
  });
});
