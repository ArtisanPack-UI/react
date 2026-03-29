import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar } from '../../components/navigation/Navbar/Navbar';

describe('Navbar', () => {
  it('renders with navbar class', () => {
    render(<Navbar data-testid="navbar" />);
    expect(screen.getByTestId('navbar')).toHaveClass('navbar');
  });

  it('renders start section', () => {
    render(<Navbar start={<span data-testid="start">Logo</span>} />);
    expect(screen.getByTestId('start')).toBeInTheDocument();
    expect(screen.getByTestId('start').parentElement).toHaveClass('navbar-start');
  });

  it('renders center section', () => {
    render(<Navbar center={<span data-testid="center">Title</span>} />);
    expect(screen.getByTestId('center')).toBeInTheDocument();
    expect(screen.getByTestId('center').parentElement).toHaveClass('navbar-center');
  });

  it('renders end section', () => {
    render(<Navbar end={<span data-testid="end">Actions</span>} />);
    expect(screen.getByTestId('end')).toBeInTheDocument();
    expect(screen.getByTestId('end').parentElement).toHaveClass('navbar-end');
  });

  it('renders all three sections', () => {
    render(
      <Navbar
        start={<span>Start</span>}
        center={<span>Center</span>}
        end={<span>End</span>}
      />,
    );
    expect(screen.getByText('Start')).toBeInTheDocument();
    expect(screen.getByText('Center')).toBeInTheDocument();
    expect(screen.getByText('End')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Navbar>
        <span data-testid="child">Custom content</span>
      </Navbar>,
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies glass class', () => {
    render(<Navbar glass data-testid="navbar" />);
    expect(screen.getByTestId('navbar')).toHaveClass('glass');
  });

  it('does not render empty sections', () => {
    const { container } = render(<Navbar data-testid="navbar" />);
    expect(container.querySelector('.navbar-start')).toBeNull();
    expect(container.querySelector('.navbar-center')).toBeNull();
    expect(container.querySelector('.navbar-end')).toBeNull();
  });

  it('applies custom className', () => {
    render(<Navbar data-testid="navbar" className="custom-class" />);
    expect(screen.getByTestId('navbar')).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Navbar ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('renders as nav element', () => {
    render(<Navbar data-testid="navbar" />);
    expect(screen.getByTestId('navbar').tagName).toBe('NAV');
  });
});
