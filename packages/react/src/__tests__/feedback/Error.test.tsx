import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorDisplay } from '../../components/feedback/Error/Error';

describe('ErrorDisplay (deprecated alias of ErrorState)', () => {
  it('renders an ErrorState with the old defaults', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<ErrorDisplay message="The server didn't respond." />);
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-error-state');
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeTruthy();
    expect(root.querySelector('[data-part="description"]')).toHaveTextContent(
      "The server didn't respond.",
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('ErrorDisplay is deprecated'));
    warn.mockRestore();
  });

  it('maps onRetry and retryLabel to a button in the actions', () => {
    const onRetry = vi.fn();
    render(<ErrorDisplay title="Failed" onRetry={onRetry} retryLabel="Retry" />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders the message and children together in the description', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <ErrorDisplay message="Try later.">
        <a href="/status">Status</a>
      </ErrorDisplay>,
    );
    expect(container.querySelector('[data-part="description"]')!.innerHTML).toBe(
      'Try later.<a href="/status">Status</a>',
    );
    warn.mockRestore();
  });
});
