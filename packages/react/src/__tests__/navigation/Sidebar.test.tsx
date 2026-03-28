import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from '../../components/navigation/Sidebar/Sidebar';

describe('Sidebar', () => {
  it('renders children content', () => {
    render(
      <Sidebar
        open={false}
        onOpenChange={vi.fn()}
        sidebarContent={<span>Nav</span>}
      >
        <span data-testid="content">Main</span>
      </Sidebar>,
    );
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders sidebar content', () => {
    render(
      <Sidebar
        open={true}
        onOpenChange={vi.fn()}
        sidebarContent={<span data-testid="sidebar-nav">Nav links</span>}
      >
        Main
      </Sidebar>,
    );
    expect(screen.getByTestId('sidebar-nav')).toBeInTheDocument();
  });

  it('applies drawer-open class when open', () => {
    const { container } = render(
      <Sidebar
        open={true}
        onOpenChange={vi.fn()}
        sidebarContent={<span>Nav</span>}
      >
        Main
      </Sidebar>,
    );
    expect(container.firstChild).toHaveClass('drawer-open');
  });

  it('does not apply drawer-open when closed', () => {
    const { container } = render(
      <Sidebar
        open={false}
        onOpenChange={vi.fn()}
        sidebarContent={<span>Nav</span>}
      >
        Main
      </Sidebar>,
    );
    expect(container.firstChild).not.toHaveClass('drawer-open');
  });

  it('applies drawer-end for right side', () => {
    const { container } = render(
      <Sidebar
        open={false}
        onOpenChange={vi.fn()}
        sidebarContent={<span>Nav</span>}
        side="right"
      >
        Main
      </Sidebar>,
    );
    expect(container.firstChild).toHaveClass('drawer-end');
  });

  it('renders sidebar with navigation role', () => {
    render(
      <Sidebar
        open={true}
        onOpenChange={vi.fn()}
        sidebarContent={<span>Nav</span>}
      >
        Main
      </Sidebar>,
    );
    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toBeInTheDocument();
  });

  it('calls onOpenChange when toggle changes', () => {
    const onOpenChange = vi.fn();
    render(
      <Sidebar
        open={false}
        onOpenChange={onOpenChange}
        sidebarContent={<span>Nav</span>}
      >
        Main
      </Sidebar>,
    );
    const toggle = screen.getByLabelText('Toggle sidebar');
    fireEvent.click(toggle);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('closes on Escape key', () => {
    const onOpenChange = vi.fn();
    render(
      <Sidebar
        open={true}
        onOpenChange={onOpenChange}
        sidebarContent={<span>Nav</span>}
      >
        Main
      </Sidebar>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not close on Escape when already closed', () => {
    const onOpenChange = vi.fn();
    render(
      <Sidebar
        open={false}
        onOpenChange={onOpenChange}
        sidebarContent={<span>Nav</span>}
      >
        Main
      </Sidebar>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('applies custom width class', () => {
    render(
      <Sidebar
        open={true}
        onOpenChange={vi.fn()}
        sidebarContent={<span>Nav</span>}
        width="w-64"
      >
        Main
      </Sidebar>,
    );
    expect(screen.getByRole('navigation', { name: 'Sidebar' })).toHaveClass('w-64');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Sidebar
        open={false}
        onOpenChange={vi.fn()}
        sidebarContent={<span>Nav</span>}
        className="custom-class"
      >
        Main
      </Sidebar>,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <Sidebar
        ref={ref}
        open={false}
        onOpenChange={vi.fn()}
        sidebarContent={<span>Nav</span>}
      >
        Main
      </Sidebar>,
    );
    expect(ref).toHaveBeenCalled();
  });
});
