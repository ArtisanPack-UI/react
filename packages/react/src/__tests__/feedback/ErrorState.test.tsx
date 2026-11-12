import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { ErrorState, type ErrorStateProps } from '../../components/feedback/ErrorState/ErrorState';

const declaredProps: (keyof ErrorStateProps)[] = [
  'variant',
  'size',
  'align',
  'icon',
  'numeral',
  'title',
  'description',
  'code',
  'actions',
  'headingLevel',
  'focusTitle',
  'classes',
];

const parts = (root: Element) => [...root.children].map((el) => el.getAttribute('data-part'));

describe('ErrorState', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(ErrorState, 'ErrorState', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('is an alert with the contract anatomy', () => {
    const { container } = render(
      <ErrorState
        title="Couldn’t load transactions"
        description="Your data is safe."
        code="Error 503 · req_8f2c91"
        actions="Try again"
      />,
    );
    const root = screen.getByRole('alert');
    expect(root).toHaveClass('apui-error-state');
    expect(root).toHaveAttribute('data-variant', 'request');
    expect(parts(container.firstElementChild!)).toEqual([
      'icon',
      'title',
      'description',
      'code',
      'actions',
    ]);
  });

  it('shows 404 in place of an icon for not-found, and both when the icon is explicit', () => {
    const { container, rerender } = render(<ErrorState variant="not-found" title="Missing" />);
    expect(parts(container.firstElementChild!)).toEqual(['numeral', 'title']);
    expect(container.querySelector('[data-part="numeral"]')).toHaveTextContent('404');
    rerender(<ErrorState numeral="503" icon="server-crash" title="Down" />);
    expect(parts(container.firstElementChild!)).toEqual(['icon', 'numeral', 'title']);
  });

  it('focuses the title with focusTitle', () => {
    render(<ErrorState focusTitle headingLevel={1} title="This page doesn’t exist" />);
    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveAttribute('tabindex', '-1');
    expect(title).toHaveAttribute('data-focus-title', '');
    expect(document.activeElement).toBe(title);
  });

  it('renders no id on the title and focuses it when focusTitle turns on', () => {
    const { rerender } = render(<ErrorState title="Couldn’t load" />);
    const title = screen.getByRole('heading');
    expect(title.hasAttribute('id')).toBe(false);
    expect(document.activeElement).not.toBe(title);
    rerender(<ErrorState focusTitle title="Couldn’t load" />);
    expect(document.activeElement).toBe(title);
  });
});
