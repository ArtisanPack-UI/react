import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Accordion } from '../../components/layout/Accordion/Accordion';
import { Collapse } from '../../components/layout/Collapse/Collapse';

describe('Accordion', () => {
  it('renders collapse children', () => {
    render(
      <Accordion>
        <Collapse title="Panel 1">Content 1</Collapse>
        <Collapse title="Panel 2">Content 2</Collapse>
      </Accordion>,
    );
    expect(screen.getByText('Panel 1')).toBeInTheDocument();
    expect(screen.getByText('Panel 2')).toBeInTheDocument();
  });

  it('applies join classes by default', () => {
    const { container } = render(
      <Accordion>
        <Collapse title="Panel 1">Content 1</Collapse>
      </Accordion>,
    );
    expect(container.firstChild).toHaveClass('join', 'join-vertical');
  });

  it('opens default panels', () => {
    const { container } = render(
      <Accordion defaultOpenIndices={[0]}>
        <Collapse title="Panel 1">Content 1</Collapse>
        <Collapse title="Panel 2">Content 2</Collapse>
      </Accordion>,
    );
    const collapses = container.querySelectorAll('.collapse');
    expect(collapses[0]).toHaveClass('collapse-open');
    expect(collapses[1]).toHaveClass('collapse-close');
  });

  it('calls onOpenChange when toggling', () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Accordion onOpenChange={onOpenChange}>
        <Collapse title="Panel 1">Content 1</Collapse>
        <Collapse title="Panel 2">Content 2</Collapse>
      </Accordion>,
    );
    const inputs = container.querySelectorAll('input');
    fireEvent.click(inputs[0]);
    expect(onOpenChange).toHaveBeenCalledWith([0]);
  });

  it('single mode closes other panels when opening one', () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Accordion defaultOpenIndices={[0]} onOpenChange={onOpenChange}>
        <Collapse title="Panel 1">Content 1</Collapse>
        <Collapse title="Panel 2">Content 2</Collapse>
      </Accordion>,
    );
    const inputs = container.querySelectorAll('input');
    fireEvent.click(inputs[1]);
    expect(onOpenChange).toHaveBeenCalledWith([1]);
  });

  it('multiple mode keeps other panels open', () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Accordion multiple defaultOpenIndices={[0]} onOpenChange={onOpenChange}>
        <Collapse title="Panel 1">Content 1</Collapse>
        <Collapse title="Panel 2">Content 2</Collapse>
      </Accordion>,
    );
    const inputs = container.querySelectorAll('input');
    fireEvent.click(inputs[1]);
    expect(onOpenChange).toHaveBeenCalledWith([0, 1]);
  });

  it('removes join with join=false', () => {
    const { container } = render(
      <Accordion join={false}>
        <Collapse title="Panel 1">Content 1</Collapse>
      </Accordion>,
    );
    expect(container.firstChild).not.toHaveClass('join');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(
      <Accordion ref={ref}>
        <Collapse title="Panel 1">Content 1</Collapse>
      </Accordion>,
    );
    expect(ref).toHaveBeenCalled();
  });
});
