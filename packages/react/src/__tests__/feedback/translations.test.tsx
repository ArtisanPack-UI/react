import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { TranslationProvider } from '../../i18n/translator';
import { Alert } from '../../components/feedback/Alert/Alert';
import { ErrorDisplay } from '../../components/feedback/Error/Error';
import { Loading } from '../../components/feedback/Loading/Loading';
import { Toast } from '../../components/feedback/Toast/Toast';

const messages = {
  Dismiss: 'Descartar',
  'Dismiss notification': 'Descartar notificación',
  Loading: 'Cargando',
  'Something went wrong': 'Algo salió mal',
  'Try again': 'Reintentar',
};

const inSpanish = (ui: ReactNode) =>
  render(
    <TranslationProvider locale="es" messages={messages}>
      {ui}
    </TranslationProvider>,
  );

describe('feedback translations', () => {
  it("translates the Alert's close button, and a closeLabel prop wins", () => {
    const { unmount } = inSpanish(<Alert title="Hola" dismissible />);
    expect(screen.getByRole('button', { name: 'Descartar' })).toBeInTheDocument();
    unmount();
    inSpanish(<Alert title="Hola" dismissible closeLabel="Cerrar" />);
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
  });

  it("translates the Toast's close button, and a closeLabel prop wins", () => {
    const { unmount } = inSpanish(<Toast title="Hola" />);
    expect(screen.getByRole('button', { name: 'Descartar notificación' })).toBeInTheDocument();
    unmount();
    inSpanish(<Toast title="Hola" closeLabel="Cerrar" />);
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeInTheDocument();
  });

  it("translates Loading's screen-reader label, and a label prop wins", () => {
    const { unmount } = inSpanish(<Loading />);
    expect(screen.getByText('Cargando')).toBeInTheDocument();
    unmount();
    inSpanish(<Loading label="Guardando" />);
    expect(screen.getByText('Guardando')).toBeInTheDocument();
  });

  it("translates ErrorDisplay's default title and retry button", () => {
    inSpanish(<ErrorDisplay onRetry={() => {}} />);
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
  });

  it('renders English without a provider', () => {
    render(<Alert title="Hi" dismissible />);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });
});
