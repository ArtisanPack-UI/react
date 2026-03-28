import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Stack } from '../../components/layout/Stack/Stack';

describe('Stack', () => {
  it('renders children', () => {
    render(
      <Stack>
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('defaults to vertical flex-col layout', () => {
    const { container } = render(<Stack>Content</Stack>);
    expect(container.firstChild).toHaveClass('flex', 'flex-col');
  });

  it('renders horizontal layout', () => {
    const { container } = render(<Stack direction="horizontal">Content</Stack>);
    expect(container.firstChild).toHaveClass('flex', 'flex-row');
  });

  it('applies gap class', () => {
    const { container } = render(<Stack gap={6}>Content</Stack>);
    expect(container.firstChild).toHaveClass('gap-6');
  });

  it('applies alignment', () => {
    const { container } = render(<Stack align="center">Content</Stack>);
    expect(container.firstChild).toHaveClass('items-center');
  });

  it('applies justification', () => {
    const { container } = render(<Stack justify="between">Content</Stack>);
    expect(container.firstChild).toHaveClass('justify-between');
  });

  it('applies wrap', () => {
    const { container } = render(<Stack wrap>Content</Stack>);
    expect(container.firstChild).toHaveClass('flex-wrap');
  });

  it('applies custom className', () => {
    const { container } = render(<Stack className="custom">Content</Stack>);
    expect(container.firstChild).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Stack ref={ref}>Content</Stack>);
    expect(ref).toHaveBeenCalled();
  });
});
