import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { InertiaLink } from '../../navigation/InertiaLink';

// Mock Inertia's Link component
vi.mock('@inertiajs/react', () => ({
  Link: vi.fn(({ children, href, className, ...rest }: Record<string, unknown>) => (
    <a href={href as string} className={className as string} data-testid="inertia-link" {...rest}>
      {children as React.ReactNode}
    </a>
  )),
}));

const part = (root: Element, name: string) =>
  root.querySelector(`[data-scope="button"][data-part="${name}"]`);

describe('InertiaLink', () => {
  it('renders as a plain link by default, with no button markup', () => {
    render(
      <InertiaLink href="/dashboard" className="nav">
        Dashboard
      </InertiaLink>,
    );
    const link = screen.getByTestId('inertia-link');
    expect(link).toHaveTextContent('Dashboard');
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(link).toHaveAttribute('class', 'nav');
    expect(link).not.toHaveAttribute('data-variant');
  });

  it('renders the design-system Button markup with asButton', () => {
    render(
      <InertiaLink href="/settings" asButton className="extra">
        Settings
      </InertiaLink>,
    );
    const link = screen.getByTestId('inertia-link');
    expect(link).toHaveClass('apui-button', 'extra');
    expect(link).not.toHaveClass('btn');
    expect(link).toHaveAttribute('data-variant', 'solid');
    expect(link).toHaveAttribute('data-color', 'primary');
    expect(link).toHaveAttribute('data-size', 'md');
    expect(part(link, 'label')).toHaveTextContent('Settings');
  });

  it('maps color and size', () => {
    render(
      <InertiaLink href="/save" asButton color="success" size="sm">
        Save
      </InertiaLink>,
    );
    const link = screen.getByTestId('inertia-link');
    expect(link).toHaveAttribute('data-color', 'success');
    expect(link).toHaveAttribute('data-size', 'sm');
    expect(link.className).not.toMatch(/btn-/);
  });

  it.each([
    ['ghost', 'ghost'],
    ['outline', 'outline'],
  ] as const)('maps the 1.x color %s to a neutral %s button', (color, variant) => {
    render(
      <InertiaLink href="/x" asButton color={color}>
        X
      </InertiaLink>,
    );
    const link = screen.getByTestId('inertia-link');
    expect(link).toHaveAttribute('data-variant', variant);
    expect(link).toHaveAttribute('data-color', 'neutral');
  });

  it('takes a design-system variant', () => {
    render(
      <InertiaLink href="/x" asButton variant="soft" color="error">
        X
      </InertiaLink>,
    );
    const link = screen.getByTestId('inertia-link');
    expect(link).toHaveAttribute('data-variant', 'soft');
    expect(link).toHaveAttribute('data-color', 'error');
  });

  it('renders icons in the icon and iconEnd parts around the label', () => {
    render(
      <InertiaLink
        href="/icon"
        asButton
        icon={<span data-testid="icon">+</span>}
        iconRight={<span data-testid="icon-right">→</span>}
      >
        Add
      </InertiaLink>,
    );
    const link = screen.getByTestId('inertia-link');
    expect([...link.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'label',
      'iconEnd',
    ]);
    expect(part(link, 'icon')).toContainElement(screen.getByTestId('icon'));
    expect(part(link, 'iconEnd')).toContainElement(screen.getByTestId('icon-right'));
  });

  it('renders icons before and after the children of a plain link', () => {
    render(
      <InertiaLink
        href="/icon"
        icon={<span data-testid="icon">+</span>}
        iconRight={<span data-testid="icon-right">→</span>}
      >
        <span data-testid="label">Add</span>
      </InertiaLink>,
    );
    const icon = screen.getByTestId('icon');
    const label = screen.getByTestId('label');
    const iconRight = screen.getByTestId('icon-right');
    expect(icon.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(
      label.compareDocumentPosition(iconRight) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("adds the Button's spinner part while loading", () => {
    render(
      <InertiaLink href="/loading" asButton loading>
        Saving
      </InertiaLink>,
    );
    const link = screen.getByTestId('inertia-link');
    expect(link).toHaveAttribute('aria-busy', 'true');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(part(link, 'spinner')).toBeInTheDocument();
    expect(link.querySelector('.loading, .loading-spinner')).toBeNull();
  });

  it('shows a design-system Loading in place of the icon on a plain link', () => {
    render(
      <InertiaLink href="/loading" loading icon={<span data-testid="icon">+</span>}>
        Loading
      </InertiaLink>,
    );
    const link = screen.getByTestId('inertia-link');
    expect(link.querySelector('.apui-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('prevents navigation and the click handler when loading', () => {
    const onClick = vi.fn();
    render(
      <InertiaLink href="/loading" loading onClick={onClick}>
        Loading
      </InertiaLink>,
    );
    const link = screen.getByTestId('inertia-link');
    expect(link).toHaveAttribute('tabindex', '-1');

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(clickEvent);
    expect(clickEvent.defaultPrevented).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('calls the click handler when not loading', () => {
    const onClick = vi.fn();
    render(
      <InertiaLink href="/x" onClick={onClick}>
        X
      </InertiaLink>,
    );
    fireEvent.click(screen.getByTestId('inertia-link'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
