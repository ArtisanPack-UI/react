import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Icon } from '../../components/utility/Icon/Icon';

describe('Icon', () => {
  const samplePath = 'M12 2L2 22h20L12 2z';

  it('renders an svg element', () => {
    const { container } = render(<Icon path={samplePath} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders a path from the path prop', () => {
    const { container } = render(<Icon path={samplePath} />);
    const path = container.querySelector('path');
    expect(path).toHaveAttribute('d', samplePath);
  });

  it('renders children instead of path prop', () => {
    const { container } = render(
      <Icon>
        <circle data-testid="circle" cx="12" cy="12" r="10" />
      </Icon>,
    );
    expect(container.querySelector('circle')).toBeInTheDocument();
  });

  it('is decorative (aria-hidden) by default', () => {
    const { container } = render(<Icon path={samplePath} />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('is accessible with a label', () => {
    const { container } = render(<Icon path={samplePath} label="Warning" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toHaveAttribute('aria-hidden');
    expect(svg).toHaveAttribute('aria-label', 'Warning');
    expect(svg).toHaveAttribute('role', 'img');
  });

  it('applies size classes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg'] as const;
    const expected = ['w-3 h-3', 'w-4 h-4', 'w-6 h-6', 'w-8 h-8'];
    sizes.forEach((size, i) => {
      const { container, unmount } = render(<Icon path={samplePath} size={size} />);
      const svg = container.querySelector('svg')!;
      expected[i].split(' ').forEach((cls) => {
        expect(svg).toHaveClass(cls);
      });
      unmount();
    });
  });

  it('applies color class', () => {
    const { container } = render(<Icon path={samplePath} color="primary" />);
    expect(container.querySelector('svg')).toHaveClass('text-primary');
  });

  it('applies custom className', () => {
    const { container } = render(<Icon path={samplePath} className="custom" />);
    expect(container.querySelector('svg')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<SVGSVGElement>();
    render(<Icon ref={ref} path={samplePath} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it('defaults to md size', () => {
    const { container } = render(<Icon path={samplePath} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveClass('w-6');
    expect(svg).toHaveClass('h-6');
  });

  it('uses default viewBox of 0 0 24 24', () => {
    const { container } = render(<Icon path={samplePath} />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('accepts a custom viewBox', () => {
    const { container } = render(<Icon path={samplePath} viewBox="0 0 20 20" />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 20 20');
  });
});
