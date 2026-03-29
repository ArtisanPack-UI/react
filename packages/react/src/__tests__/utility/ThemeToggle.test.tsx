import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import { ThemeToggle } from '../../components/utility/ThemeToggle/ThemeToggle';
import { ThemeProvider } from '../../hooks/use-theme';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

function renderWithTheme(ui: React.ReactElement, defaultColorScheme?: 'light' | 'dark' | 'system') {
  return render(
    <ThemeProvider defaultColorScheme={defaultColorScheme ?? 'light'}>{ui}</ThemeProvider>,
  );
}

describe('ThemeToggle', () => {
  it('renders a button', () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has an action-oriented accessible label', () => {
    renderWithTheme(<ThemeToggle />);
    // On light mode, next is dark
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  it('cycles through modes on click', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');

    // light → dark: next will be system
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Switch to system theme');

    // dark → system: next will be light
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');

    // system → light: next will be dark
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('supports custom mode list', () => {
    renderWithTheme(<ThemeToggle modes={['light', 'dark']} />);
    const button = screen.getByRole('button');

    // On light, next is dark
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');

    fireEvent.click(button);
    // On dark, next is light
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');

    fireEvent.click(button);
    // Back on light, next is dark
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('applies size class', () => {
    renderWithTheme(<ThemeToggle size="lg" />);
    expect(screen.getByRole('button')).toHaveClass('btn-lg');
  });

  it('applies custom className', () => {
    renderWithTheme(<ThemeToggle className="custom" />);
    expect(screen.getByRole('button')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    renderWithTheme(<ThemeToggle ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders an svg icon inside the button', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('shows next mode label when starting on dark', () => {
    renderWithTheme(<ThemeToggle />, 'dark');
    // On dark, next is system
    expect(screen.getByLabelText('Switch to system theme')).toBeInTheDocument();
  });
});
