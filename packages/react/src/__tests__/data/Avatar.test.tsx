import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Avatar } from '../../components/data/Avatar/Avatar';

describe('Avatar', () => {
  it('renders image avatar', () => {
    render(<Avatar image="https://example.com/photo.jpg" alt="User photo" />);
    const img = screen.getByAltText('User photo');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
  });

  it('renders placeholder initials', () => {
    render(<Avatar placeholder="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders single initial for single name', () => {
    render(<Avatar placeholder="Jane" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders icon fallback', () => {
    render(<Avatar icon={<span data-testid="icon">icon</span>} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders children as fallback', () => {
    render(<Avatar>AB</Avatar>);
    expect(screen.getByText('AB')).toBeInTheDocument();
  });

  it('renders title and subtitle', () => {
    render(<Avatar image="photo.jpg" title="John Doe" subtitle="Engineer" />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
  });

  it('applies color class for placeholder', () => {
    const { container } = render(<Avatar placeholder="JD" color="primary" />);
    expect(container.querySelector('.bg-primary')).toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(<Avatar placeholder="JD" size="lg" />);
    expect(container.querySelector('.w-24')).toBeInTheDocument();
  });

  it('applies ring styling', () => {
    const { container } = render(<Avatar placeholder="JD" ring color="primary" />);
    expect(container.querySelector('.ring')).toBeInTheDocument();
    expect(container.querySelector('.ring-primary')).toBeInTheDocument();
  });

  it('shows online status', () => {
    const { container } = render(<Avatar placeholder="JD" online />);
    expect(container.querySelector('.online')).toBeInTheDocument();
  });

  it('shows offline status', () => {
    const { container } = render(<Avatar placeholder="JD" offline />);
    expect(container.querySelector('.offline')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Avatar ref={ref} placeholder="JD" />);
    expect(ref).toHaveBeenCalled();
  });
});
