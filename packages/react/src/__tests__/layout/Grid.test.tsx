import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Grid } from '../../components/layout/Grid/Grid';

describe('Grid', () => {
  it('renders children in a grid', () => {
    render(
      <Grid cols={3}>
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </Grid>,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('applies grid class', () => {
    const { container } = render(<Grid>Content</Grid>);
    expect(container.firstChild).toHaveClass('grid');
  });

  it('applies column count', () => {
    const { container } = render(<Grid cols={3}>Content</Grid>);
    expect(container.firstChild).toHaveClass('grid-cols-3');
  });

  it('applies responsive column counts', () => {
    const { container } = render(
      <Grid cols={1} colsSm={2} colsMd={3} colsLg={4}>Content</Grid>,
    );
    const el = container.firstChild;
    expect(el).toHaveClass('grid-cols-1');
    expect(el).toHaveClass('sm:grid-cols-2');
    expect(el).toHaveClass('md:grid-cols-3');
    expect(el).toHaveClass('lg:grid-cols-4');
  });

  it('applies default gap', () => {
    const { container } = render(<Grid>Content</Grid>);
    expect(container.firstChild).toHaveClass('gap-4');
  });

  it('applies custom gap', () => {
    const { container } = render(<Grid gap={8}>Content</Grid>);
    expect(container.firstChild).toHaveClass('gap-8');
  });

  it('applies directional gaps', () => {
    const { container } = render(<Grid gapX={2} gapY={4}>Content</Grid>);
    expect(container.firstChild).toHaveClass('gap-x-2');
    expect(container.firstChild).toHaveClass('gap-y-4');
  });

  it('applies gapX only with default gapY fallback', () => {
    const { container } = render(<Grid gapX={2}>Content</Grid>);
    const el = container.firstChild;
    expect(el).toHaveClass('gap-x-2');
    expect(el).toHaveClass('gap-y-4');
    expect(el).not.toHaveClass('gap-4');
  });

  it('applies gapY only with default gapX fallback', () => {
    const { container } = render(<Grid gapY={4}>Content</Grid>);
    const el = container.firstChild;
    expect(el).toHaveClass('gap-y-4');
    expect(el).toHaveClass('gap-x-4');
    expect(el).not.toHaveClass('gap-4');
  });

  it('applies custom className', () => {
    const { container } = render(<Grid className="my-grid">Content</Grid>);
    expect(container.firstChild).toHaveClass('my-grid');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Grid ref={ref}>Content</Grid>);
    expect(ref).toHaveBeenCalled();
  });
});
