import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EmptyState } from '../../components/feedback/EmptyState/EmptyState';

describe('EmptyState', () => {
  it('renders heading', () => {
    render(<EmptyState heading="No items found" />);
    expect(screen.getByText('No items found')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<EmptyState description="Try adjusting your filters" />);
    expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<EmptyState icon={<span data-testid="icon">📭</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders action element', () => {
    render(<EmptyState action={<button>Add item</button>} />);
    expect(screen.getByText('Add item')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<EmptyState>Custom content</EmptyState>);
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });

  it('renders all parts together', () => {
    render(
      <EmptyState
        icon={<span data-testid="icon">📭</span>}
        heading="No results"
        description="Nothing here yet"
        action={<button>Create</button>}
      />,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('renders correct element via headingAs prop', () => {
    render(<EmptyState heading="Custom Heading" headingAs="h2" />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Custom Heading');
  });

  it('applies custom className', () => {
    const { container } = render(<EmptyState className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<EmptyState ref={ref} heading="Empty" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
