import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sparkline } from '../../components/data/Sparkline/Sparkline';

const sampleData = [5, 10, 8, 15, 12, 20, 18];

describe('Sparkline', () => {
  it('renders an SVG element', () => {
    const { container } = render(<Sparkline data={sampleData} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders nothing with empty data', () => {
    const { container } = render(<Sparkline data={[]} />);
    expect(container.querySelector('svg')).not.toBeInTheDocument();
  });

  it('renders line type by default', () => {
    const { container } = render(<Sparkline data={sampleData} />);
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('renders area type with fill', () => {
    const { container } = render(<Sparkline data={sampleData} type="area" />);
    const paths = container.querySelectorAll('path');
    // Area type has 2 paths: fill + stroke
    expect(paths.length).toBe(2);
  });

  it('renders bar type with rects', () => {
    const { container } = render(<Sparkline data={sampleData} type="bar" />);
    const rects = container.querySelectorAll('rect');
    expect(rects).toHaveLength(sampleData.length);
  });

  it('has accessible aria attributes', () => {
    const { container } = render(<Sparkline data={sampleData} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('role', 'img');
    expect(svg).toHaveAttribute('aria-label');
  });

  it('applies custom height', () => {
    const { container } = render(<Sparkline data={sampleData} height={60} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('height', '60');
  });

  it('applies custom width', () => {
    const { container } = render(<Sparkline data={sampleData} width={200} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '200');
  });

  it('applies custom className', () => {
    const { container } = render(<Sparkline data={sampleData} className="my-sparkline" />);
    expect(container.firstChild).toHaveClass('my-sparkline');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Sparkline ref={ref} data={sampleData} />);
    expect(ref).toHaveBeenCalled();
  });
});
