import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { AppShell, type AppShellProps } from '../../components/layout/AppShell/AppShell';

const declaredProps: (keyof AppShellProps)[] = [
  'collapsed',
  'collapsible',
  'sidebarWidth',
  'gutter',
  'brand',
  'sidebar',
  'header',
  'footer',
  'label',
  'skipLabel',
  'collapseLabel',
  'classes',
];

const interact = (fire: () => void) =>
  act(async () => {
    fire();
  });

describe('AppShell', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(AppShell, 'AppShell', {
      declared: { props: declaredProps, events: ['onCollapsedChange'] },
    });
  });

  it('renders the landmarks and a skip link to main', () => {
    const { container } = render(
      <AppShell brand="Apexify" sidebar={<nav>Nav</nav>} header={<header>Top</header>}>
        Content
      </AppShell>,
    );
    const root = container.querySelector('.apui-app-shell')!;
    const skip = root.firstElementChild as HTMLAnchorElement;
    expect(skip.getAttribute('data-part')).toBe('skip-link');
    expect(skip.textContent).toBe('Skip to main content');
    const main = screen.getByRole('main');
    expect(skip.getAttribute('href')).toBe(`#${main.id}`);
    expect(main.getAttribute('tabindex')).toBe('-1');
    expect(screen.getByRole('complementary', { name: 'Sidebar' }).getAttribute('data-part')).toBe(
      'sidebar',
    );
    expect(root.querySelector('[data-part="brand"]')?.textContent).toBe('Apexify');
    expect(main.querySelector('[data-part="content"]')?.textContent).toBe('Content');
    expect(root.querySelector('[data-part="footer"]')).toBeNull();
  });

  it('toggles collapsed from the collapse button', async () => {
    const onCollapsedChange = vi.fn();
    const { container } = render(
      <AppShell collapsible footer="Olivia" onCollapsedChange={onCollapsedChange}>
        C
      </AppShell>,
    );
    const button = screen.getByRole('button', { name: 'Collapse sidebar' });
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.getAttribute('aria-controls')).toBe(screen.getByRole('complementary').id);
    await interact(() => fireEvent.click(button));
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(container.querySelector('.apui-app-shell')?.hasAttribute('data-collapsed')).toBe(true);
  });

  it('follows the collapsed prop and sets the width and gutter tokens', () => {
    const { container, rerender } = render(<AppShell sidebarWidth="280px" gutter="8px" />);
    const root = container.querySelector('.apui-app-shell') as HTMLElement;
    expect(root.style.getPropertyValue('--apui-sidebar-width')).toBe('280px');
    expect(root.style.getPropertyValue('--apui-shell-gutter')).toBe('8px');
    rerender(<AppShell collapsed />);
    expect(root.hasAttribute('data-collapsed')).toBe(true);
  });

  it('takes translated labels and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AppShell
        ref={ref}
        collapsible
        label="Barre latérale"
        skipLabel="Aller au contenu"
        collapseLabel="Réduire"
        classes={{ root: 'r' }}
      />,
    );
    expect(ref.current?.className).toBe('apui-app-shell r');
    expect(screen.getByRole('complementary', { name: 'Barre latérale' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Réduire' })).toBeTruthy();
    expect(screen.getByText('Aller au contenu')).toBeTruthy();
  });
});
