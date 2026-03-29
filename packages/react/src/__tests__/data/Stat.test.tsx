import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Stat, StatGroup } from '../../components/data/Stat/Stat';

describe('Stat', () => {
  it('renders value', () => {
    render(<Stat value="1,234" />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<Stat value="100" title="Total Users" />);
    expect(screen.getByText('Total Users')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<Stat value="100" description="Since last month" />);
    expect(screen.getByText('Since last month')).toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<Stat value="100" icon={<span data-testid="stat-icon">icon</span>} />);
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
  });

  it('applies color class to value', () => {
    const { container } = render(<Stat value="100" color="primary" />);
    expect(container.querySelector('.text-primary')).toBeInTheDocument();
  });

  it('shows positive change indicator', () => {
    render(<Stat value="100" change={5.2} />);
    expect(screen.getByText(/\+5.2%/)).toBeInTheDocument();
    expect(screen.getByLabelText('Increased')).toBeInTheDocument();
  });

  it('shows negative change indicator', () => {
    render(<Stat value="100" change={-3.1} />);
    expect(screen.getByText(/-3.1%/)).toBeInTheDocument();
    expect(screen.getByLabelText('Decreased')).toBeInTheDocument();
  });

  it('renders change label', () => {
    render(<Stat value="100" change={5} changeLabel="vs last week" />);
    expect(screen.getByText(/vs last week/)).toBeInTheDocument();
  });

  it('renders actions', () => {
    render(<Stat value="100" actions={<button>View</button>} />);
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Stat ref={ref} value="100" />);
    expect(ref).toHaveBeenCalled();
  });
});

describe('StatGroup', () => {
  it('renders children in stats container', () => {
    const { container } = render(
      <StatGroup>
        <Stat value="100" />
        <Stat value="200" />
      </StatGroup>,
    );
    expect(container.querySelector('.stats')).toBeInTheDocument();
  });

  it('applies horizontal class', () => {
    const { container } = render(
      <StatGroup horizontal>
        <Stat value="100" />
      </StatGroup>,
    );
    expect(container.querySelector('.stats-horizontal')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <StatGroup ref={ref}>
        <Stat value="100" />
      </StatGroup>,
    );
    expect(ref).toHaveBeenCalled();
  });
});
