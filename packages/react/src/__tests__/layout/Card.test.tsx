import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Card } from '../../components/layout/Card/Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<Card title="My Card">Content</Card>);
    expect(screen.getByText('My Card')).toBeInTheDocument();
    expect(screen.getByText('My Card').tagName).toBe('H2');
  });

  it('renders subtitle', () => {
    render(
      <Card title="Title" subtitle="Subtitle">
        Content
      </Card>,
    );
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('renders custom header', () => {
    render(<Card header={<span>Custom Header</span>}>Content</Card>);
    expect(screen.getByText('Custom Header')).toBeInTheDocument();
  });

  it('renders footer/actions', () => {
    render(<Card footer={<button>Save</button>}>Content</Card>);
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('renders menu slot', () => {
    render(
      <Card title="Title" menu={<button>Menu</button>}>
        Content
      </Card>,
    );
    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  it('renders figure', () => {
    render(<Card figure={<img src="test.jpg" alt="Test" />}>Content</Card>);
    expect(screen.getByAltText('Test')).toBeInTheDocument();
  });

  it('applies shadow by default', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toHaveClass('shadow-xl');
  });

  it('removes shadow with noShadow', () => {
    const { container } = render(<Card noShadow>Content</Card>);
    expect(container.firstChild).not.toHaveClass('shadow-xl');
  });

  it('applies bordered class', () => {
    const { container } = render(<Card bordered>Content</Card>);
    expect(container.firstChild).toHaveClass('card-bordered');
  });

  it('applies compact class', () => {
    const { container } = render(<Card compact>Content</Card>);
    expect(container.firstChild).toHaveClass('card-compact');
  });

  it('applies glass effect', () => {
    const { container } = render(<Card glass>Content</Card>);
    expect(container.firstChild).toHaveClass('glass');
  });

  it('applies card-side for horizontal figures', () => {
    const { container } = render(
      <Card figure={<img src="test.jpg" alt="Test" />} figurePosition="left">
        Content
      </Card>,
    );
    expect(container.firstChild).toHaveClass('card-side');
  });

  it('renders as a link when link prop provided', () => {
    const { container } = render(<Card link="/test">Content</Card>);
    expect(container.firstChild?.nodeName).toBe('A');
    expect(container.firstChild).toHaveAttribute('href', '/test');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Card ref={ref}>Content</Card>);
    expect(ref).toHaveBeenCalled();
  });
});
