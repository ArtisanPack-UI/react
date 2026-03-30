import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InertiaToastProvider } from '../../feedback/InertiaToastProvider';

const mockUsePage = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();

vi.mock('@inertiajs/react', () => ({
  usePage: () => mockUsePage(),
}));

vi.mock('@artisanpack-ui/react', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="toast-provider">{children}</div>
  ),
  useToast: () => ({
    show: vi.fn(),
    success: mockToastSuccess,
    error: mockToastError,
    warning: vi.fn(),
    info: vi.fn(),
    dismiss: vi.fn(),
    dismissAll: vi.fn(),
  }),
}));

describe('InertiaToastProvider', () => {
  beforeEach(() => {
    mockUsePage.mockClear();
    mockToastSuccess.mockClear();
    mockToastError.mockClear();
  });

  it('renders children inside ToastProvider', () => {
    mockUsePage.mockReturnValue({
      props: { flash: {} },
      url: '/',
    });

    render(
      <InertiaToastProvider>
        <span>App content</span>
      </InertiaToastProvider>,
    );

    expect(screen.getByTestId('toast-provider')).toBeInTheDocument();
    expect(screen.getByText('App content')).toBeInTheDocument();
  });

  it('triggers success toast from flash message', () => {
    mockUsePage.mockReturnValue({
      props: { flash: { success: 'Item saved!' } },
      url: '/items',
    });

    render(
      <InertiaToastProvider>
        <span>Content</span>
      </InertiaToastProvider>,
    );

    expect(mockToastSuccess).toHaveBeenCalledWith('Item saved!');
  });

  it('triggers error toast from flash message', () => {
    mockUsePage.mockReturnValue({
      props: { flash: { error: 'Something went wrong' } },
      url: '/items',
    });

    render(
      <InertiaToastProvider>
        <span>Content</span>
      </InertiaToastProvider>,
    );

    expect(mockToastError).toHaveBeenCalledWith('Something went wrong');
  });

  it('does not trigger toast when flash is empty', () => {
    mockUsePage.mockReturnValue({
      props: { flash: {} },
      url: '/items',
    });

    render(
      <InertiaToastProvider>
        <span>Content</span>
      </InertiaToastProvider>,
    );

    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockToastError).not.toHaveBeenCalled();
  });
});
