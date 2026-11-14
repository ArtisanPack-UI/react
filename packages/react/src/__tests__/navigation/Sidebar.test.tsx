import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar, sidebarWidthFromClass } from '../../components/navigation/Sidebar/Sidebar';

describe('Sidebar (deprecated alias of AppShell)', () => {
  it('renders an AppShell with the sidebar content and the page, and warns once', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <Sidebar open onOpenChange={vi.fn()} sidebarContent={<a href="/dashboard">Dashboard</a>}>
        <p>Page</p>
      </Sidebar>,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-app-shell');
    expect(root).not.toHaveAttribute('data-collapsed');
    expect(container.querySelector('.drawer, .drawer-side, .menu')).toBeNull();
    expect(screen.getByRole('complementary', { name: 'Sidebar' })).toContainElement(
      screen.getByRole('link', { name: 'Dashboard' }),
    );
    expect(screen.getByRole('main')).toHaveTextContent('Page');
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Sidebar is deprecated; use AppShell.'),
    );
    warn.mockRestore();
  });

  it('maps open={false} to a collapsed sidebar', () => {
    const { container } = render(
      <Sidebar open={false} onOpenChange={vi.fn()} sidebarContent="Nav" />,
    );
    expect(container.firstElementChild).toHaveAttribute('data-collapsed');
  });

  it('reports the collapse button through onOpenChange', () => {
    const onOpenChange = vi.fn();
    render(<Sidebar open onOpenChange={onOpenChange} sidebarContent="Nav" />);
    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('maps a Tailwind width class to sidebarWidth and ignores side and overlay', () => {
    const { container } = render(
      <Sidebar
        open
        onOpenChange={vi.fn()}
        sidebarContent="Nav"
        width="w-64"
        side="right"
        overlay
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.getPropertyValue('--apui-sidebar-width')).toBe('16rem');
    expect(root).not.toHaveAttribute('side');
    expect(root).not.toHaveAttribute('overlay');
  });

  it('converts width classes', () => {
    expect(sidebarWidthFromClass('w-80')).toBe('20rem');
    expect(sidebarWidthFromClass('w-[18rem]')).toBe('18rem');
    expect(sidebarWidthFromClass('max-w-sm')).toBeUndefined();
    expect(sidebarWidthFromClass(undefined)).toBeUndefined();
  });
});
