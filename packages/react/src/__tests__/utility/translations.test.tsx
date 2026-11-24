import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { TranslationProvider } from '../../i18n/translator';
import { Clipboard } from '../../components/utility/Clipboard/Clipboard';
import { Kbd } from '../../components/utility/Kbd/Kbd';
import { Markdown } from '../../components/utility/Markdown/Markdown';
import { ThemeToggle } from '../../components/utility/ThemeToggle/ThemeToggle';

const messages = {
  Copy: 'Copiar',
  Shift: 'Mayúsculas',
  'Markdown mode': 'Modo Markdown',
  Write: 'Escribir',
  Preview: 'Vista previa',
  Theme: 'Tema',
  Light: 'Claro',
  Dark: 'Oscuro',
};

const inSpanish = (ui: ReactNode) =>
  render(
    <TranslationProvider locale="es" messages={messages}>
      {ui}
    </TranslationProvider>,
  );

describe('utility translations', () => {
  it('translates the Clipboard button, and a label prop wins', () => {
    const { unmount } = inSpanish(<Clipboard value="x" />);
    expect(screen.getByRole('button', { name: 'Copiar' })).toBeInTheDocument();
    unmount();
    inSpanish(<Clipboard value="x" label="Duplicar" />);
    expect(screen.getByRole('button', { name: 'Duplicar' })).toBeInTheDocument();
  });

  it("translates a symbol key's text alternative, and labels win", () => {
    const { unmount } = inSpanish(<Kbd keys={['shift', 'k']} platform="mac" />);
    expect(screen.getByText('Mayúsculas')).toBeInTheDocument();
    unmount();
    inSpanish(<Kbd keys={['shift', 'k']} platform="mac" labels={{ shift: 'Mayús' }} />);
    expect(screen.getByText('Mayús')).toBeInTheDocument();
  });

  it('translates the Markdown mode tabs, and a prop wins', () => {
    inSpanish(<Markdown source="# Hola" mode="write" writeLabel="Redactar" />);
    expect(screen.getByRole('tablist', { name: 'Modo Markdown' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Redactar' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Vista previa' })).toBeInTheDocument();
  });

  it('translates the ThemeToggle choices, and a prop wins', () => {
    inSpanish(<ThemeToggle darkLabel="Noche" />);
    expect(screen.getByRole('radiogroup', { name: 'Tema' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Claro' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Noche' })).toBeInTheDocument();
  });
});
