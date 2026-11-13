import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Pin, sanitizePin, type PinProps } from '../../components/form/Pin/Pin';

const declaredProps: (keyof PinProps)[] = [
  'length',
  'type',
  'mask',
  'groupSize',
  'size',
  'label',
  'hint',
  'error',
  'invalid',
  'disabled',
  'required',
  'value',
  'defaultValue',
  'classes',
];
const declaredEvents: (keyof PinProps)[] = ['onValueChange', 'onComplete'];

const parts = (root: Element) =>
  [...root.querySelectorAll('[data-scope="pin"][data-part]')].map((el) =>
    el.getAttribute('data-part'),
  );

describe('Pin', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Pin, 'Pin', {
      declared: { props: declaredProps, events: declaredEvents },
    });
  });

  it('renders one control over the cells, with separators between groups', () => {
    const { container } = render(
      <Pin id="c" label="Code" length={6} groupSize={3} hint="Hint" error="Bad" required />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-pin');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(parts(root)).toEqual([
      'label',
      'required',
      'cells',
      'control',
      'cell',
      'cell',
      'cell',
      'separator',
      'cell',
      'cell',
      'cell',
      'hint',
      'error',
    ]);
    const control = screen.getByLabelText(/Code/);
    expect(control).toHaveAttribute('autocomplete', 'one-time-code');
    expect(control).toHaveAttribute('inputmode', 'numeric');
    expect(control).toHaveAttribute('maxlength', '6');
    expect(control).toHaveAttribute('aria-describedby', 'c-hint c-error');
    expect(root.querySelectorAll('[data-part="cell"][aria-hidden="true"]')).toHaveLength(6);
  });

  it('mirrors the value in the cells and marks the active cell', () => {
    const { container } = render(<Pin label="Code" length={4} defaultValue="12" />);
    const cells = container.querySelectorAll('[data-part="cell"]');
    expect(cells[0]).toHaveTextContent('1');
    expect(cells[0]).toHaveAttribute('data-filled', '');
    expect(cells[2]).not.toHaveAttribute('data-filled');
    expect(cells[2]).toHaveAttribute('data-active', '');
  });

  it('masks the cells and the control', () => {
    const { container } = render(<Pin label="PIN" length={4} mask defaultValue="12" />);
    expect(screen.getByLabelText('PIN')).toHaveAttribute('type', 'password');
    expect(container.querySelector('[data-part="cell"]')).toHaveTextContent('•');
  });

  it('drops characters the type does not allow', () => {
    expect(sanitizePin('12a-3 4', 'numeric', 6)).toBe('1234');
    expect(sanitizePin('ab-12cd34', 'alphanumeric', 6)).toBe('ab12cd');
    const onValueChange = vi.fn();
    render(<Pin label="Code" length={4} onValueChange={onValueChange} />);
    const control = screen.getByLabelText('Code') as HTMLInputElement;
    fireEvent.change(control, { target: { value: '1a2' } });
    expect(onValueChange).toHaveBeenLastCalledWith('12');
    expect(control.value).toBe('12');
  });

  it('distributes a paste over the cells and fires complete', () => {
    const onComplete = vi.fn();
    const { container } = render(<Pin label="Code" length={6} onComplete={onComplete} />);
    const control = screen.getByLabelText('Code');
    fireEvent.paste(control, { clipboardData: { getData: () => '123 456 789' } });
    expect(onComplete).toHaveBeenCalledWith('123456');
    expect([...container.querySelectorAll('[data-part="cell"]')].map((c) => c.textContent)).toEqual(
      ['1', '2', '3', '4', '5', '6'],
    );
  });

  it('fires complete when the last character is typed', () => {
    const onComplete = vi.fn();
    render(<Pin label="Code" length={3} onComplete={onComplete} />);
    fireEvent.change(screen.getByLabelText('Code'), { target: { value: '12' } });
    expect(onComplete).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('Code'), { target: { value: '123' } });
    expect(onComplete).toHaveBeenCalledWith('123');
  });

  it('forwards the ref and renders on the server', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Pin ref={ref} label="A" />);
    expect(ref.current).toBe(screen.getByLabelText('A'));
    expect(renderToString(<Pin label="B" />)).toContain('class="apui-pin"');
  });

  it('resyncs the cells of an uncontrolled pin when its form resets', async () => {
    const { container } = render(
      <form>
        <Pin label="Code" length={4} defaultValue="12" />
      </form>,
    );
    const control = screen.getByLabelText('Code') as HTMLInputElement;
    fireEvent.change(control, { target: { value: '1234' } });
    const cells = () =>
      [...container.querySelectorAll('[data-part="cell"]')].map((cell) => cell.textContent);
    expect(cells()).toEqual(['1', '2', '3', '4']);
    await act(async () => {
      container.querySelector('form')!.reset();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(control.value).toBe('12');
    expect(cells()).toEqual(['1', '2', '', '']);
  });
});
