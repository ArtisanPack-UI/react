import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InertiaToastProvider } from '../../feedback/InertiaToastProvider';

const mockUsePage = vi.fn();
const mockToastSuccess = vi.fn();
const mockToastError = vi.fn();
const mockToastWarning = vi.fn();
const mockToastInfo = vi.fn();

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
    warning: mockToastWarning,
    info: mockToastInfo,
    dismiss: vi.fn(),
    dismissAll: vi.fn(),
  }),
}));

describe('InertiaToastProvider', () => {
  beforeEach(() => {
    mockUsePage.mockClear();
    mockToastSuccess.mockClear();
    mockToastError.mockClear();
    mockToastWarning.mockClear();
    mockToastInfo.mockClear();
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
    expect(mockToastWarning).not.toHaveBeenCalled();
    expect(mockToastInfo).not.toHaveBeenCalled();
  });

  it('triggers warning toast from flash message', () => {
    mockUsePage.mockReturnValue({
      props: { flash: { warning: 'Be careful' } },
      url: '/items',
    });

    render(
      <InertiaToastProvider>
        <span>Content</span>
      </InertiaToastProvider>,
    );

    expect(mockToastWarning).toHaveBeenCalledWith('Be careful');
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockToastError).not.toHaveBeenCalled();
    expect(mockToastInfo).not.toHaveBeenCalled();
  });

  it('triggers info toast from flash message', () => {
    mockUsePage.mockReturnValue({
      props: { flash: { info: 'For your info' } },
      url: '/items',
    });

    render(
      <InertiaToastProvider>
        <span>Content</span>
      </InertiaToastProvider>,
    );

    expect(mockToastInfo).toHaveBeenCalledWith('For your info');
    expect(mockToastSuccess).not.toHaveBeenCalled();
    expect(mockToastError).not.toHaveBeenCalled();
    expect(mockToastWarning).not.toHaveBeenCalled();
  });
});
