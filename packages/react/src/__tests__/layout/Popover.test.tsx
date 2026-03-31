import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Popover } from '../../components/layout/Popover/Popover';

describe('Popover', () => {
  it('renders trigger', () => {
    render(<Popover trigger={<span>Hover me</span>}>Popover content</Popover>);
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('always renders popover content in DOM', () => {
    render(<Popover trigger={<span>Trigger</span>}>Popover content</Popover>);
    expect(screen.getByText('Popover content')).toBeInTheDocument();
  });

  it('adds dropdown-open class on hover', () => {
    const { container } = render(<Popover trigger={<span>Trigger</span>}>Content</Popover>);
    fireEvent.mouseEnter(container.firstChild as Element);
    expect(container.firstChild).toHaveClass('dropdown-open');
  });

  it('does not add dropdown-open by default without interaction', () => {
    const { container } = render(<Popover trigger={<span>Trigger</span>}>Content</Popover>);
    expect(container.firstChild).not.toHaveClass('dropdown-open');
  });

  it('does not add dropdown-hover class (visibility driven by state)', () => {
    const { container } = render(
      <Popover trigger={<span>Click me</span>} triggerMode="click">
        Content
      </Popover>,
    );
    expect(container.firstChild).not.toHaveClass('dropdown-hover');
  });

  it('adds dropdown-open class on click in click mode', () => {
    const { container } = render(
      <Popover trigger={<button>Click me</button>} triggerMode="click">
        Content
      </Popover>,
    );
    fireEvent.click(screen.getByText('Click me'));
    expect(container.firstChild).toHaveClass('dropdown-open');
  });

  it('opens on Enter key in click mode', () => {
    const { container } = render(
      <Popover trigger={<button>Press me</button>} triggerMode="click">
        Content
      </Popover>,
    );
    fireEvent.keyDown(screen.getByText('Press me'), { key: 'Enter' });
    expect(container.firstChild).toHaveClass('dropdown-open');
  });

  it('opens on Space key in click mode', () => {
    const { container } = render(
      <Popover trigger={<button>Press me</button>} triggerMode="click">
        Content
      </Popover>,
    );
    fireEvent.keyDown(screen.getByText('Press me'), { key: ' ' });
    expect(container.firstChild).toHaveClass('dropdown-open');
  });

  it('calls onOpenChange', () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Popover trigger={<span>Trigger</span>} onOpenChange={onOpenChange}>
        Content
      </Popover>,
    );
    fireEvent.mouseEnter(container.firstChild as Element);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('applies position class', () => {
    const { container } = render(
      <Popover trigger={<span>Trigger</span>} position="top">
        Content
      </Popover>,
    );
    expect(container.firstChild).toHaveClass('dropdown-top');
  });

  it('sets aria-expanded on trigger element', () => {
    render(
      <Popover trigger={<span data-testid="trigger">Trigger</span>} open>
        Content
      </Popover>,
    );
    expect(screen.getByTestId('trigger')).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes on Escape when not persistent', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover
        trigger={<button>Click</button>}
        triggerMode="click"
        open
        onOpenChange={onOpenChange}
      >
        Content
      </Popover>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('closes on outside click when not persistent', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover
        trigger={<button>Click</button>}
        triggerMode="click"
        open
        onOpenChange={onOpenChange}
      >
        Content
      </Popover>,
    );
    fireEvent.mouseDown(document.body);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not close on outside click when persistent', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover
        trigger={<button>Click</button>}
        triggerMode="click"
        open
        persistent
        onOpenChange={onOpenChange}
      >
        Content
      </Popover>,
    );
    fireEvent.mouseDown(document.body);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('does not close on Escape when persistent', () => {
    const onOpenChange = vi.fn();
    render(
      <Popover
        trigger={<button>Click</button>}
        triggerMode="click"
        open
        persistent
        onOpenChange={onOpenChange}
      >
        Content
      </Popover>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <Popover ref={ref} trigger={<span>Trigger</span>}>
        Content
      </Popover>,
    );
    expect(ref).toHaveBeenCalled();
  });
});
