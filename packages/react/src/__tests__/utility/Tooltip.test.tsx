import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tooltip } from '../../components/utility/Tooltip/Tooltip';

describe('Tooltip', () => {
  it('renders the trigger child', () => {
    render(
      <Tooltip tip="Help text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('has role="tooltip" on the accessible text element', () => {
    render(
      <Tooltip tip="Help text">
        <button>Hover me</button>
      </Tooltip>,
    );
    // Tooltip text is hidden until triggered
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Help text');
  });

  it('sets data-tip attribute on the wrapper', () => {
    const { container } = render(
      <Tooltip tip="Help text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(container.querySelector('.tooltip')).toHaveAttribute('data-tip', 'Help text');
  });

  it('applies position class', () => {
    const positions = ['top', 'bottom', 'left', 'right'] as const;
    positions.forEach((position) => {
      const { container, unmount } = render(
        <Tooltip tip="Help" position={position}>
          <button>Trigger</button>
        </Tooltip>,
      );
      expect(container.querySelector('.tooltip')).toHaveClass(`tooltip-${position}`);
      unmount();
    });
  });

  it('applies color class', () => {
    const { container } = render(
      <Tooltip tip="Info" color="primary">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(container.querySelector('.tooltip')).toHaveClass('tooltip-primary');
  });

  it('applies tooltip-open class when open prop is true', () => {
    const { container } = render(
      <Tooltip tip="Always visible" open>
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(container.querySelector('.tooltip')).toHaveClass('tooltip-open');
  });

  it('toggles tooltip-open class on hover', () => {
    const { container } = render(
      <Tooltip tip="Help text">
        <button>Hover me</button>
      </Tooltip>,
    );
    const wrapper = container.querySelector('.tooltip')!;
    const trigger = screen.getByText('Hover me');

    expect(wrapper).not.toHaveClass('tooltip-open');

    fireEvent.mouseEnter(trigger);
    expect(wrapper).toHaveClass('tooltip-open');

    fireEvent.mouseLeave(trigger);
    expect(wrapper).not.toHaveClass('tooltip-open');
  });

  it('toggles tooltip-open class on focus', () => {
    const { container } = render(
      <Tooltip tip="Help text">
        <button>Focus me</button>
      </Tooltip>,
    );
    const wrapper = container.querySelector('.tooltip')!;
    const trigger = screen.getByText('Focus me');

    expect(wrapper).not.toHaveClass('tooltip-open');

    fireEvent.focus(trigger);
    expect(wrapper).toHaveClass('tooltip-open');

    fireEvent.blur(trigger);
    expect(wrapper).not.toHaveClass('tooltip-open');
  });

  it('sets aria-describedby on child when hovered', () => {
    render(
      <Tooltip tip="Help text">
        <button>Hover me</button>
      </Tooltip>,
    );
    const trigger = screen.getByText('Hover me');
    expect(trigger).not.toHaveAttribute('aria-describedby');

    fireEvent.mouseEnter(trigger);
    expect(trigger).toHaveAttribute('aria-describedby');
  });

  it('removes aria-describedby on mouse leave', () => {
    render(
      <Tooltip tip="Help text">
        <button>Hover me</button>
      </Tooltip>,
    );
    const trigger = screen.getByText('Hover me');

    fireEvent.mouseEnter(trigger);
    expect(trigger).toHaveAttribute('aria-describedby');

    fireEvent.mouseLeave(trigger);
    expect(trigger).not.toHaveAttribute('aria-describedby');
  });

  it('sets aria-describedby on focus', () => {
    render(
      <Tooltip tip="Help text">
        <button>Focus me</button>
      </Tooltip>,
    );
    const trigger = screen.getByText('Focus me');

    fireEvent.focus(trigger);
    expect(trigger).toHaveAttribute('aria-describedby');
  });

  it('removes aria-describedby on blur', () => {
    render(
      <Tooltip tip="Help text">
        <button>Focus me</button>
      </Tooltip>,
    );
    const trigger = screen.getByText('Focus me');

    fireEvent.focus(trigger);
    fireEvent.blur(trigger);
    expect(trigger).not.toHaveAttribute('aria-describedby');
  });

  it('merges with existing aria-describedby on child', () => {
    render(
      <Tooltip tip="Extra info">
        <button aria-describedby="existing-id">Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByText('Trigger');

    fireEvent.mouseEnter(trigger);
    const describedBy = trigger.getAttribute('aria-describedby')!;
    expect(describedBy).toContain('existing-id');
    expect(describedBy.split(' ')).toHaveLength(2);
  });

  it('preserves existing aria-describedby when tooltip is hidden', () => {
    render(
      <Tooltip tip="Extra info">
        <button aria-describedby="existing-id">Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByText('Trigger');
    expect(trigger).toHaveAttribute('aria-describedby', 'existing-id');
  });

  it('aria-describedby references an element containing the tip text', () => {
    const { container } = render(
      <Tooltip tip="Accessible tip">
        <button>Trigger</button>
      </Tooltip>,
    );
    const trigger = screen.getByText('Trigger');

    fireEvent.mouseEnter(trigger);
    const describedById = trigger.getAttribute('aria-describedby')!;
    const tooltipEl = container.querySelector(`#${CSS.escape(describedById)}`);
    expect(tooltipEl).toBeInTheDocument();
    expect(tooltipEl).toHaveTextContent('Accessible tip');
  });

  it('calls existing event handlers on the child', () => {
    const onMouseEnter = vi.fn();
    render(
      <Tooltip tip="Help text">
        <button onMouseEnter={onMouseEnter}>Hover me</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByText('Hover me'));
    expect(onMouseEnter).toHaveBeenCalledOnce();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Tooltip tip="Help" className="custom">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(container.querySelector('.tooltip')).toHaveClass('custom');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Tooltip ref={ref} tip="Help">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('uses custom id when provided', () => {
    const { container } = render(
      <Tooltip tip="Help" id="custom-tooltip">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(container.querySelector('.tooltip')).toHaveAttribute('id', 'custom-tooltip');

    const trigger = screen.getByText('Trigger');
    fireEvent.mouseEnter(trigger);
    expect(trigger.getAttribute('aria-describedby')).toBe('custom-tooltip-tip');
  });
});
