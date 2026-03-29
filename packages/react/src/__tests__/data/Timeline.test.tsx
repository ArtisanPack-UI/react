import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Timeline } from '../../components/data/Timeline/Timeline';
import type { TimelineItemData } from '../../components/data/Timeline/Timeline';

const items: TimelineItemData[] = [
  { title: 'Step 1', subtitle: 'Started', description: 'Initial setup' },
  { title: 'Step 2', color: 'success' },
  { title: 'Step 3', pending: true },
];

describe('Timeline', () => {
  it('renders all items', () => {
    render(<Timeline items={items} />);
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Step 3')).toBeInTheDocument();
  });

  it('renders subtitle and description', () => {
    render(<Timeline items={items} />);
    expect(screen.getByText('Started')).toBeInTheDocument();
    expect(screen.getByText('Initial setup')).toBeInTheDocument();
  });

  it('applies vertical class by default', () => {
    const { container } = render(<Timeline items={items} />);
    expect(container.querySelector('.timeline-vertical')).toBeInTheDocument();
  });

  it('applies horizontal class', () => {
    const { container } = render(<Timeline items={items} vertical={false} />);
    expect(container.querySelector('.timeline-horizontal')).toBeInTheDocument();
  });

  it('applies compact class', () => {
    const { container } = render(<Timeline items={items} compact />);
    expect(container.querySelector('.timeline-compact')).toBeInTheDocument();
  });

  it('applies snap class', () => {
    const { container } = render(<Timeline items={items} snap />);
    expect(container.querySelector('.timeline-snap-icon')).toBeInTheDocument();
  });

  it('renders pending items with reduced opacity', () => {
    const { container } = render(<Timeline items={[{ title: 'Pending', pending: true }]} />);
    expect(container.querySelector('.opacity-50')).toBeInTheDocument();
  });

  it('renders custom icons', () => {
    const itemsWithIcon: TimelineItemData[] = [
      { title: 'Custom', icon: <span data-testid="custom-icon">*</span> },
    ];
    render(<Timeline items={itemsWithIcon} />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Timeline ref={ref} items={items} />);
    expect(ref).toHaveBeenCalled();
  });
});
