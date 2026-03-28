import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Select } from '../../components/form/Select/Select';

const options = [
  { id: '1', name: 'Option 1' },
  { id: '2', name: 'Option 2' },
  { id: '3', name: 'Option 3', disabled: true },
];

describe('Select', () => {
  it('renders with label', () => {
    render(<Select label="Country" options={options} />);
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('renders options', () => {
    render(<Select label="Country" options={options} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('renders placeholder', () => {
    render(<Select label="Country" placeholder="Select a country" options={options} />);
    expect(screen.getByText('Select a country')).toBeInTheDocument();
  });

  it('disables options with disabled flag', () => {
    render(<Select label="Country" options={options} />);
    const disabledOption = screen.getByText('Option 3');
    expect(disabledOption).toBeDisabled();
  });

  it('renders error', () => {
    render(<Select label="Country" error="Required" options={options} />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders hint', () => {
    render(<Select label="Country" hint="Pick one" options={options} />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('supports custom option keys', () => {
    const customOptions = [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom' },
    ];
    render(
      <Select label="Country" options={customOptions} optionValue="value" optionLabel="label" />,
    );
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  });

  it('renders children as additional options', () => {
    render(
      <Select label="Country" options={[]}>
        <option value="custom">Custom Option</option>
      </Select>,
    );
    expect(screen.getByText('Custom Option')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Select ref={ref} label="Test" options={options} />);
    expect(ref).toHaveBeenCalled();
  });
});
