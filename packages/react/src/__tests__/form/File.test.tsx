import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { File } from '../../components/form/File/File';

describe('File', () => {
  it('renders with label', () => {
    render(<File label="Upload" />);
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('renders file input', () => {
    const { container } = render(<File label="Upload" />);
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeInTheDocument();
  });

  it('renders error', () => {
    render(<File label="Upload" error="File too large" />);
    expect(screen.getByText('File too large')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders hint', () => {
    render(<File label="Upload" hint="Max 5MB" />);
    expect(screen.getByText('Max 5MB')).toBeInTheDocument();
  });

  it('renders drag-drop zone', () => {
    render(<File label="Upload" withDragDrop />);
    expect(screen.getByText('Drop files here or click to browse')).toBeInTheDocument();
  });

  it('renders custom drag-drop text', () => {
    render(<File label="Upload" withDragDrop dragDropText="Drag files here" />);
    expect(screen.getByText('Drag files here')).toBeInTheDocument();
  });

  it('renders progress bar', () => {
    const { container } = render(<File label="Upload" progress={50} />);
    const progress = container.querySelector('progress');
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute('value', '50');
  });

  it('hides progress when hideProgress is true', () => {
    const { container } = render(<File label="Upload" progress={50} hideProgress />);
    const progress = container.querySelector('progress');
    expect(progress).not.toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<File label="Upload" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<File ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });
});
