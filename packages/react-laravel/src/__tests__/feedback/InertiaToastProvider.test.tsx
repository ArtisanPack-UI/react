import { render, screen, waitFor, within } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, describe, it, expect, vi } from 'vitest';
import { toast } from '@artisanpack-ui/react/feedback';
import { InertiaToastProvider } from '../../feedback/InertiaToastProvider';

const mockUsePage = vi.fn();

vi.mock('@inertiajs/react', () => ({
  usePage: () => mockUsePage(),
}));

// Zag appends the placement and the hotkey to the label: "Notifications, bottom-end (alt+T)".
const region = () => screen.getByRole('region', { name: /^Notifications/ });

describe('InertiaToastProvider', () => {
  // The toaster keeps scheduling work after each update, so these tests leave
  // the act environment and wait for the DOM instead (as the react package's
  // Toaster tests do).
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

  it('renders its children and a design-system Toaster region', async () => {
    mockUsePage.mockReturnValue({ props: { flash: {} }, url: '/' });
    render(
      <InertiaToastProvider placement="top-end">
        <span>App content</span>
      </InertiaToastProvider>,
    );
    expect(screen.getByText('App content')).toBeInTheDocument();
    await waitFor(() => expect(region()).toHaveAttribute('data-placement', 'top-end'));
    expect(region()).toHaveAttribute('data-scope', 'toast');
  });

  it('shows the flash messages as design-system toasts', async () => {
    mockUsePage.mockReturnValue({
      props: { flash: { success: 'Item saved!', error: 'Something went wrong' } },
      url: '/items',
    });
    render(
      <InertiaToastProvider duration={0}>
        <span>Content</span>
      </InertiaToastProvider>,
    );
    const saved = await within(region()).findByText('Item saved!');
    expect(saved.closest('.apui-toast')).toHaveAttribute('data-color', 'success');
    expect(saved.closest('.alert')).toBeNull();
    expect(await within(region()).findByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('maps the 1.x position and defaultDuration', async () => {
    mockUsePage.mockReturnValue({ props: { flash: { info: 'Hi' } }, url: '/' });
    render(
      <InertiaToastProvider position={['toast-start', 'toast-top']} defaultDuration={1234}>
        <span>Content</span>
      </InertiaToastProvider>,
    );
    await waitFor(() => expect(region()).toHaveAttribute('data-placement', 'top-start'));
    await within(region()).findByText('Hi');
    expect(toast.store.getVisibleToasts().find((entry) => entry.title === 'Hi')?.duration).toBe(
      1234,
    );
  });
});
