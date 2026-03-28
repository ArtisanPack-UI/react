import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Collapse } from '../../components/layout/Collapse/Collapse';

describe('Collapse', () => {
  it('renders title', () => {
    render(<Collapse title="Click me">Content</Collapse>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders content', () => {
    render(<Collapse title="Title">Hidden content</Collapse>);
    expect(screen.getByText('Hidden content')).toBeInTheDocument();
  });

  it('defaults to closed state', () => {
    const { container } = render(<Collapse title="Title">Content</Collapse>);
    expect(container.firstChild).toHaveClass('collapse-close');
  });

  it('opens when defaultOpen is true', () => {
    const { container } = render(
      <Collapse title="Title" defaultOpen>Content</Collapse>,
    );
    expect(container.firstChild).toHaveClass('collapse-open');
  });

  it('toggles on checkbox click (uncontrolled)', () => {
    const { container } = render(<Collapse title="Title">Content</Collapse>);
    const checkbox = container.querySelector('input[type="checkbox"]');
    expect(checkbox).not.toBeNull();
    fireEvent.click(checkbox!);
    expect(container.firstChild).toHaveClass('collapse-open');
  });

  it('sets aria-expanded on title', () => {
    const { container } = render(<Collapse title="Title" defaultOpen>Content</Collapse>);
    expect(screen.getByText('Title')).toHaveAttribute('aria-expanded', 'true');
  });

  it('calls onOpenChange callback', () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Collapse title="Title" onOpenChange={onOpenChange}>Content</Collapse>,
    );
    const checkbox = container.querySelector('input[type="checkbox"]')!;
    fireEvent.click(checkbox);
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('respects controlled open prop', () => {
    const { container } = render(
      <Collapse title="Title" open={true}>Content</Collapse>,
    );
    expect(container.firstChild).toHaveClass('collapse-open');
  });

  it('applies arrow icon class by default', () => {
    const { container } = render(<Collapse title="Title">Content</Collapse>);
    expect(container.firstChild).toHaveClass('collapse-arrow');
  });

  it('applies plus icon class', () => {
    const { container } = render(
      <Collapse title="Title" icon="plus">Content</Collapse>,
    );
    expect(container.firstChild).toHaveClass('collapse-plus');
  });

  it('applies border when bordered', () => {
    const { container } = render(
      <Collapse title="Title" bordered>Content</Collapse>,
    );
    expect(container.firstChild).toHaveClass('border');
  });

  it('renders radio input when name is provided', () => {
    const { container } = render(
      <Collapse title="Title" name="group">Content</Collapse>,
    );
    expect(container.querySelector('input[type="radio"]')).toBeInTheDocument();
  });

  it('applies disabled styling', () => {
    const { container } = render(
      <Collapse title="Title" disabled>Content</Collapse>,
    );
    expect(container.firstChild).toHaveClass('opacity-50');
    expect(container.querySelector('input')).toBeDisabled();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Collapse ref={ref} title="Title">Content</Collapse>);
    expect(ref).toHaveBeenCalled();
  });
});
