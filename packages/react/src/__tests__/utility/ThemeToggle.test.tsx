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

  it('has an accessible label', () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByLabelText('Light mode')).toBeInTheDocument();
  });

  it('cycles through modes on click', () => {
    renderWithTheme(<ThemeToggle />);
    const button = screen.getByRole('button');

    // light → dark
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Dark mode');

    // dark → system
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'System theme');

    // system → light
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Light mode');
  });

  it('supports custom mode list', () => {
    renderWithTheme(<ThemeToggle modes={['light', 'dark']} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Dark mode');

    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Light mode');
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

  it('starts with dark mode label when defaultColorScheme is dark', () => {
    renderWithTheme(<ThemeToggle />, 'dark');
    expect(screen.getByLabelText('Dark mode')).toBeInTheDocument();
  });
});
