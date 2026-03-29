import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Radio } from '../../components/form/Radio/Radio';

const options = [
  { id: '1', name: 'Option A' },
  { id: '2', name: 'Option B' },
  { id: '3', name: 'Option C', disabled: true },
];

describe('Radio', () => {
  it('renders group label', () => {
    render(<Radio label="Select one" options={options} />);
    expect(screen.getByText('Select one')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Radio label="Select" options={options} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('renders radio inputs', () => {
    render(<Radio label="Select" options={options} />);
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(3);
  });

  it('disables options with disabled flag', () => {
    render(<Radio label="Select" options={options} />);
    const radios = screen.getAllByRole('radio');
    expect(radios[2]).toBeDisabled();
  });

  it('applies color class', () => {
    render(<Radio label="Select" options={options} color="primary" />);
    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio).toHaveClass('radio-primary');
    });
  });

  it('renders hint', () => {
    render(<Radio label="Select" options={options} hint="Choose wisely" />);
    expect(screen.getByText('Choose wisely')).toBeInTheDocument();
  });

  it('renders error', () => {
    render(<Radio label="Select" options={options} error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders card variant', () => {
    render(<Radio label="Select" options={options} card />);
    const labels = screen.getByText('Option A').closest('label');
    expect(labels).toHaveClass('border', 'rounded-lg');
  });

  it('renders option hints', () => {
    const optionsWithHints = [
      { id: '1', name: 'Basic', hint: 'Free tier' },
      { id: '2', name: 'Pro', hint: 'Paid tier' },
    ];
    render(<Radio label="Plan" options={optionsWithHints} />);
    expect(screen.getByText('Free tier')).toBeInTheDocument();
    expect(screen.getByText('Paid tier')).toBeInTheDocument();
  });

  it('uses radiogroup role', () => {
    render(<Radio label="Select" options={options} />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('forwards ref to first radio', () => {
    const ref = vi.fn();
    render(<Radio ref={ref} label="Test" options={options} />);
    expect(ref).toHaveBeenCalled();
  });
});
