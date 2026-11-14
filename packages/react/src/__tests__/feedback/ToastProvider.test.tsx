import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { toast } from '../../components/feedback/Toast/Toaster';
import {
  ToastMessage,
  ToastProvider,
  toastPlacement,
  toastText,
  useToast,
} from '../../components/feedback/ToastProvider/ToastProvider';

function TestConsumer() {
  const api = useToast();
  return (
    <div>
      <button onClick={() => api.success('Saved!')}>Success</button>
      <button onClick={() => api.error('Failed!')}>Error</button>
      <button onClick={() => api.warning('Careful!')}>Warning</button>
      <button onClick={() => api.info('FYI!')}>Info</button>
      <button onClick={() => api.show({ message: <strong>Rich text</strong>, duration: 0 })}>
        Rich
      </button>
      <button onClick={() => api.dismissAll()}>Dismiss All</button>
    </div>
  );
}

// Zag appends the placement and the hotkey to the label: "Notifications, bottom-end (alt+T)".
const region = () => screen.getByRole('region', { name: /^Notifications/ });

describe('ToastProvider (deprecated alias of Toaster and toast)', () => {
  // See Toast.test.tsx: the toaster keeps scheduling work, so these tests leave
  // the act environment and wait for the DOM instead.
  const actEnvironment = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
  let previousActEnvironment: boolean | undefined;
  beforeAll(() => {
    previousActEnvironment = actEnvironment.IS_REACT_ACT_ENVIRONMENT;
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = false;
  });
  afterAll(() => {
    actEnvironment.IS_REACT_ACT_ENVIRONMENT = previousActEnvironment;
  });
  afterEach(() => {
    toast.remove();
  });

  it('throws when useToast is used outside the provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    function Bad() {
      useToast();
      return null;
    }
    expect(() => render(<Bad />)).toThrow('useToast must be used within a ToastProvider');
    spy.mockRestore();
  });

  it('renders a Toaster region and warns once', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <ToastProvider position={['toast-top', 'toast-start']}>
        <TestConsumer />
      </ToastProvider>,
    );
    await waitFor(() => expect(region()).toHaveAttribute('data-part', 'group'));
    expect(region()).toHaveAttribute('data-placement', 'top-start');
    expect(document.querySelector('.toast, .alert')).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('ToastProvider is deprecated'));
    warn.mockRestore();
  });

  it('shows each 1.x color as a design-system toast', async () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );
    for (const [button, text, color] of [
      ['Success', 'Saved!', 'success'],
      ['Error', 'Failed!', 'error'],
      ['Warning', 'Careful!', 'warning'],
      ['Info', 'FYI!', 'info'],
    ]) {
      fireEvent.click(screen.getByText(button));
      const item = await within(region()).findByText(text);
      expect(item.closest('.apui-toast')).toHaveAttribute('data-color', color);
    }
    expect(within(region()).getByRole('alert')).toHaveTextContent('Failed!');
  });

  it('passes defaultDuration and per-call durations to the toast', async () => {
    render(
      <ToastProvider defaultDuration={1234}>
        <TestConsumer />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('Success'));
    fireEvent.click(screen.getByText('Rich'));
    await within(region()).findByText('Saved!');
    const durations = Object.fromEntries(
      toast.store.getVisibleToasts().map((entry) => [entry.title, entry.duration]),
    );
    expect(durations['Saved!']).toBe(1234);
    // Zag stores a duration of 0 (keep the toast) as Infinity.
    expect(durations['Rich text']).toBe(Infinity);
  });

  it('flattens a node message to its text', async () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('Rich'));
    expect(await within(region()).findByText('Rich text')).toBeInTheDocument();
  });

  it('dismisses every toast with dismissAll', async () => {
    render(
      <ToastProvider defaultDuration={0}>
        <TestConsumer />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByText('Success'));
    await within(region()).findByText('Saved!');
    fireEvent.click(screen.getByText('Dismiss All'));
    await waitFor(() => expect(within(region()).queryByText('Saved!')).toBeNull(), {
      timeout: 5000,
    });
  });
});

describe('toast helpers', () => {
  it('maps the DaisyUI position classes to a placement', () => {
    expect(toastPlacement(['toast-end', 'toast-bottom'])).toBe('bottom-end');
    expect(toastPlacement(['toast-center', 'toast-top'])).toBe('top');
    expect(toastPlacement(['toast-start'])).toBe('bottom-start');
    expect(toastPlacement(['toast-middle', 'toast-end'])).toBe('bottom-end');
  });

  it('flattens nodes to text', () => {
    expect(toastText('a')).toBe('a');
    expect(toastText(3)).toBe('3');
    expect(
      toastText(
        <span>
          Saved <em>now</em>
        </span>,
      ),
    ).toBe('Saved now');
    expect(toastText(null)).toBe('');
  });
});

describe('ToastMessage (deprecated alias of Toast)', () => {
  it('renders a static Toast and dismisses by id', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const onDismiss = vi.fn();
    const { container } = render(
      <ToastMessage toast={{ id: 't1', message: 'Hello', color: 'error' }} onDismiss={onDismiss} />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-toast');
    expect(root).toHaveAttribute('data-color', 'error');
    expect(root).toHaveAttribute('role', 'alert');
    expect(root).not.toHaveClass('alert');
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss notification' }));
    expect(onDismiss).toHaveBeenCalledWith('t1');
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('ToastMessage is deprecated'));
    warn.mockRestore();
  });

  it('defaults to the neutral color', () => {
    const { container } = render(
      <ToastMessage toast={{ id: 't2', message: 'Hi' }} onDismiss={vi.fn()} />,
    );
    expect(container.firstElementChild).toHaveAttribute('data-color', 'neutral');
  });
});
