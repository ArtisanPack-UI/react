import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider, useTheme } from '../hooks/use-theme';

function ThemeConsumer() {
  const { colorScheme, resolvedColorScheme, setColorScheme } = useTheme();
  return (
    <div>
      <span data-testid="color-scheme">{colorScheme}</span>
      <span data-testid="resolved">{resolvedColorScheme}</span>
      <button onClick={() => setColorScheme('dark')}>Set Dark</button>
      <button onClick={() => setColorScheme('light')}>Set Light</button>
      <button onClick={() => setColorScheme('system')}>Set System</button>
    </div>
  );
}

describe('ThemeProvider', () => {
  let matchMediaListeners: Array<(e: MediaQueryListEvent) => void>;

  beforeEach(() => {
    matchMediaListeners = [];
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn((_, handler) => {
          matchMediaListeners.push(handler);
        }),
        removeEventListener: vi.fn((_, handler) => {
          matchMediaListeners = matchMediaListeners.filter((h) => h !== handler);
        }),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('defaults to system color scheme', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('color-scheme')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
  });

  it('detects initial dark system preference', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: vi.fn((_, handler) => {
          matchMediaListeners.push(handler);
        }),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('color-scheme')).toHaveTextContent('system');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });

  it('accepts a default color scheme', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <ThemeConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('color-scheme')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });

  it('allows changing the color scheme', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText('Set Dark').click();
    });

    expect(screen.getByTestId('color-scheme')).toHaveTextContent('dark');
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });

  it('resolves system preference when set to system', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    // Initially light (matchMedia.matches = false)
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');

    // Simulate system dark mode change
    act(() => {
      for (const listener of matchMediaListeners) {
        listener({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });

  it('ignores system preference changes when manually set', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    act(() => {
      screen.getByText('Set Light').click();
    });

    // Simulate system dark mode change
    act(() => {
      for (const listener of matchMediaListeners) {
        listener({ matches: true } as MediaQueryListEvent);
      }
    });

    // Should still be light since it's manually set
    expect(screen.getByTestId('resolved')).toHaveTextContent('light');
  });

  it('respects system preference again after switching back to system', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );

    // Set to dark manually
    act(() => {
      screen.getByText('Set Dark').click();
    });
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');

    // Simulate system going dark
    act(() => {
      for (const listener of matchMediaListeners) {
        listener({ matches: true } as MediaQueryListEvent);
      }
    });

    // Switch back to system
    act(() => {
      screen.getByText('Set System').click();
    });

    // Should resolve to dark (system preference)
    expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
  });
});

describe('useTheme', () => {
  it('throws when used outside ThemeProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<ThemeConsumer />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });
});
