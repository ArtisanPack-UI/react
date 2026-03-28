import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Editor } from '../../components/form/Editor/Editor';

describe('Editor', () => {
  it('renders with label', () => {
    render(<Editor label="Code" />);
    expect(screen.getByText('Code')).toBeInTheDocument();
  });

  it('renders textarea', () => {
    render(<Editor label="Code" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies monospace font', () => {
    render(<Editor label="Code" />);
    expect(screen.getByRole('textbox')).toHaveClass('font-mono');
  });

  it('renders error', () => {
    render(<Editor label="Code" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders hint', () => {
    render(<Editor label="Code" hint="Enter your code" />);
    expect(screen.getByText('Enter your code')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<Editor label="Code" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Editor ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });
});
