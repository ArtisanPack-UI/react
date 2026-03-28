import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dropdown, DropdownItem } from '../../components/layout/Dropdown/Dropdown';

/** Helper to find the dropdown trigger (the element with aria-haspopup) */
const getTrigger = () => screen.getByRole('button', { name: 'Options' });

describe('Dropdown', () => {
  it('renders trigger with default label', () => {
    render(
      <Dropdown>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>,
    );
    expect(screen.getByText('Options')).toBeInTheDocument();
  });

  it('renders custom trigger', () => {
    render(
      <Dropdown trigger={<span>Click me</span>}>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>,
    );
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('always renders menu content', () => {
    render(
      <Dropdown>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>,
    );
    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('adds dropdown-open class on trigger click', () => {
    const { container } = render(
      <Dropdown>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>,
    );
    expect(container.firstChild).not.toHaveClass('dropdown-open');
    fireEvent.click(getTrigger());
    expect(container.firstChild).toHaveClass('dropdown-open');
  });

  it('removes dropdown-open class when clicking trigger again', () => {
    const { container } = render(
      <Dropdown>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>,
    );
    const trigger = getTrigger();
    fireEvent.click(trigger);
    expect(container.firstChild).toHaveClass('dropdown-open');
    fireEvent.click(trigger);
    expect(container.firstChild).not.toHaveClass('dropdown-open');
  });

  it('closes on outside click', () => {
    const { container } = render(
      <Dropdown>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>,
    );
    fireEvent.click(getTrigger());
    expect(container.firstChild).toHaveClass('dropdown-open');
    fireEvent.mouseDown(document.body);
    expect(container.firstChild).not.toHaveClass('dropdown-open');
  });

  it('calls onOpenChange callback', () => {
    const onOpenChange = vi.fn();
    render(
      <Dropdown onOpenChange={onOpenChange}>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>,
    );
    fireEvent.click(getTrigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('applies dropdown-end class', () => {
    const { container } = render(
      <Dropdown end>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>,
    );
    expect(container.firstChild).toHaveClass('dropdown-end');
  });

  it('applies dropdown-top class', () => {
    const { container } = render(
      <Dropdown top>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>,
    );
    expect(container.firstChild).toHaveClass('dropdown-top');
  });

  it('applies dropdown-hover class', () => {
    const { container } = render(
      <Dropdown hover>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>,
    );
    expect(container.firstChild).toHaveClass('dropdown-hover');
  });

  it('sets aria-haspopup on trigger', () => {
    render(
      <Dropdown>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>,
    );
    expect(getTrigger()).toHaveAttribute('aria-haspopup', 'true');
  });

  it('sets aria-expanded when open', () => {
    render(
      <Dropdown>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>,
    );
    const trigger = getTrigger();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <Dropdown ref={ref}>
        <DropdownItem>Item 1</DropdownItem>
      </Dropdown>,
    );
    expect(ref).toHaveBeenCalled();
  });
});

describe('DropdownItem', () => {
  it('renders children', () => {
    render(
      <Dropdown>
        <DropdownItem>Menu Item</DropdownItem>
      </Dropdown>,
    );
    expect(screen.getByText('Menu Item')).toBeInTheDocument();
  });

  it('has menuitem role', () => {
    render(
      <Dropdown>
        <DropdownItem>Item</DropdownItem>
      </Dropdown>,
    );
    expect(screen.getByRole('menuitem')).toBeInTheDocument();
  });

  it('applies disabled state', () => {
    render(
      <Dropdown>
        <DropdownItem disabled>Disabled Item</DropdownItem>
      </Dropdown>,
    );
    expect(screen.getByRole('menuitem')).toHaveAttribute('aria-disabled', 'true');
  });
});
