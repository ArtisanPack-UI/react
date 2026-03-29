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

  it('has role="tooltip"', () => {
    render(
      <Tooltip tip="Help text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('sets data-tip attribute', () => {
    render(
      <Tooltip tip="Help text">
        <button>Hover me</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toHaveAttribute('data-tip', 'Help text');
  });

  it('applies position class', () => {
    const positions = ['top', 'bottom', 'left', 'right'] as const;
    positions.forEach((position) => {
      const { unmount } = render(
        <Tooltip tip="Help" position={position}>
          <button>Trigger</button>
        </Tooltip>,
      );
      expect(screen.getByRole('tooltip')).toHaveClass(`tooltip-${position}`);
      unmount();
    });
  });

  it('applies color class', () => {
    render(
      <Tooltip tip="Info" color="primary">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toHaveClass('tooltip-primary');
  });

  it('applies tooltip-open class when open prop is true', () => {
    render(
      <Tooltip tip="Always visible" open>
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toHaveClass('tooltip-open');
  });

  it('toggles tooltip-open class on hover', () => {
    render(
      <Tooltip tip="Help text">
        <button>Hover me</button>
      </Tooltip>,
    );
    const tooltip = screen.getByRole('tooltip');
    const trigger = screen.getByText('Hover me');

    expect(tooltip).not.toHaveClass('tooltip-open');

    fireEvent.mouseEnter(trigger);
    expect(tooltip).toHaveClass('tooltip-open');

    fireEvent.mouseLeave(trigger);
    expect(tooltip).not.toHaveClass('tooltip-open');
  });

  it('toggles tooltip-open class on focus', () => {
    render(
      <Tooltip tip="Help text">
        <button>Focus me</button>
      </Tooltip>,
    );
    const tooltip = screen.getByRole('tooltip');
    const trigger = screen.getByText('Focus me');

    expect(tooltip).not.toHaveClass('tooltip-open');

    fireEvent.focus(trigger);
    expect(tooltip).toHaveClass('tooltip-open');

    fireEvent.blur(trigger);
    expect(tooltip).not.toHaveClass('tooltip-open');
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
    render(
      <Tooltip tip="Help" className="custom">
        <button>Trigger</button>
      </Tooltip>,
    );
    expect(screen.getByRole('tooltip')).toHaveClass('custom');
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
});
