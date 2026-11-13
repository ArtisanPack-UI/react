import { createRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Checkbox, type CheckboxProps } from '../../components/form/Checkbox/Checkbox';

const declaredProps: (keyof CheckboxProps)[] = [
  'checked',
  'defaultChecked',
  'indeterminate',
  'label',
  'description',
  'error',
  'invalid',
  'disabled',
  'required',
  'classes',
];
const declaredEvents: (keyof CheckboxProps)[] = ['onCheckedChange'];

const part = (root: Element, name: string) =>
  root.querySelector(`[data-scope="checkbox"][data-part="${name}"]`);

describe('Checkbox', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Checkbox, 'Checkbox', {
      declared: { props: declaredProps, events: declaredEvents },
    });
  });

  it('renders the contract anatomy in order', () => {
    const { container } = render(
      <Checkbox label="Email me" description="At most once a day." error="Required." />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-checkbox');
    expect(root).toHaveAttribute('data-state', 'unchecked');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'box',
      'label',
      'description',
      'error',
    ]);
    expect([...part(root, 'box')!.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'control',
      'indicator',
    ]);
    expect(part(root, 'indicator')).toHaveAttribute('aria-hidden', 'true');
    const glyphs = [...part(root, 'indicator')!.querySelectorAll(':scope > svg')];
    expect(glyphs.map((svg) => svg.getAttribute('data-icon'))).toEqual(['check', 'minus']);
  });

  it('renders no required mark, only the native attribute', () => {
    const { container } = render(<Checkbox label="Agree" required />);
    expect(container.querySelector('[data-part="required"]')).toBeNull();
    expect(screen.getByLabelText('Agree')).toBeRequired();
  });

  it('wires ids and aria-describedby to description then error', () => {
    render(<Checkbox id="t" label="Terms" description="D" error="E" />);
    const control = screen.getByLabelText('Terms');
    expect(control.id).toBe('t');
    expect(control).toHaveAttribute('aria-describedby', 't-description t-error');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(document.getElementById('t-description')).toHaveTextContent('D');
    expect(document.getElementById('t-error')!.querySelector('svg')).not.toBeNull();
  });

  it('generates an id without one', () => {
    render(<Checkbox label="Terms" />);
    expect(screen.getByLabelText('Terms').id).not.toBe('');
  });

  it('works uncontrolled with defaultChecked and updates data-state', () => {
    const onCheckedChange = vi.fn();
    const { container } = render(
      <Checkbox label="A" defaultChecked onCheckedChange={onCheckedChange} />,
    );
    const control = screen.getByLabelText('A') as HTMLInputElement;
    expect(control.checked).toBe(true);
    expect(container.firstElementChild).toHaveAttribute('data-state', 'checked');
    fireEvent.click(control);
    expect(control.checked).toBe(false);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(container.firstElementChild).toHaveAttribute('data-state', 'unchecked');
  });

  it('works controlled with checked and onCheckedChange', () => {
    function Controlled() {
      const [checked, setChecked] = useState(false);
      return <Checkbox label="A" checked={checked} onCheckedChange={setChecked} />;
    }
    const { container } = render(<Controlled />);
    fireEvent.click(screen.getByLabelText('A'));
    expect((screen.getByLabelText('A') as HTMLInputElement).checked).toBe(true);
    expect(container.firstElementChild).toHaveAttribute('data-state', 'checked');
  });

  it('stays at the controlled state when the owner ignores changes', () => {
    const onChange = vi.fn();
    render(<Checkbox label="A" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('A'));
    expect(onChange).toHaveBeenCalledOnce();
    expect((screen.getByLabelText('A') as HTMLInputElement).checked).toBe(false);
  });

  it('sets the native indeterminate property and the state', () => {
    const { container, rerender } = render(<Checkbox label="All" indeterminate />);
    const control = screen.getByLabelText('All') as HTMLInputElement;
    const root = container.firstElementChild!;
    expect(control.indeterminate).toBe(true);
    expect(root).toHaveAttribute('data-state', 'indeterminate');
    rerender(<Checkbox label="All" indeterminate={false} />);
    expect(control.indeterminate).toBe(false);
    expect(root).toHaveAttribute('data-state', 'unchecked');
  });

  it('keeps the native indeterminate property after a click when the owner keeps its state', () => {
    const onCheckedChange = vi.fn();
    render(
      <Checkbox label="All" checked={false} indeterminate onCheckedChange={onCheckedChange} />,
    );
    const control = screen.getByLabelText('All') as HTMLInputElement;
    fireEvent.click(control);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(control.indeterminate).toBe(true);
  });

  it('re-asserts the native indeterminate property on every render', () => {
    const { rerender } = render(<Checkbox label="All" indeterminate />);
    const control = screen.getByLabelText('All') as HTMLInputElement;
    control.indeterminate = false;
    rerender(<Checkbox label="All" indeterminate description="Changed" />);
    expect(control.indeterminate).toBe(true);
  });

  it('lets indeterminate win over checked', () => {
    const { container } = render(<Checkbox label="All" checked indeterminate readOnly />);
    expect(container.firstElementChild).toHaveAttribute('data-state', 'indeterminate');
  });

  it('flags disabled and invalid on the root', () => {
    const { container } = render(<Checkbox label="A" disabled invalid />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-disabled', '');
    expect(root).toHaveAttribute('data-invalid', '');
    expect(screen.getByLabelText('A')).toBeDisabled();
    expect(part(root, 'error')).toBeNull();
  });

  it('sends className to the root and other attributes to the control', () => {
    const { container } = render(
      <Checkbox label="A" className="x" classes={{ root: 'y', box: 'z' }} name="terms" value="1" />,
    );
    expect(container.firstElementChild).toHaveClass('apui-checkbox', 'x', 'y');
    expect(part(container, 'box')).toHaveClass('z');
    const control = screen.getByLabelText('A');
    expect(control).toHaveAttribute('name', 'terms');
    expect(control).toHaveAttribute('value', '1');
  });

  it('forwards the ref (object and callback) to the native input', () => {
    const ref = createRef<HTMLInputElement>();
    const callback = vi.fn();
    render(
      <>
        <Checkbox ref={ref} label="A" />
        <Checkbox ref={callback} label="B" />
      </>,
    );
    expect(ref.current).toBe(screen.getByLabelText('A'));
    expect(callback).toHaveBeenCalledWith(screen.getByLabelText('B'));
  });

  it('resyncs an uncontrolled checkbox when its form resets', async () => {
    const { container } = render(
      <form>
        <Checkbox label="A" defaultChecked />
      </form>,
    );
    const control = screen.getByLabelText('A') as HTMLInputElement;
    const root = container.querySelector('.apui-checkbox')!;
    fireEvent.click(control);
    expect(root).toHaveAttribute('data-state', 'unchecked');
    await act(async () => {
      container.querySelector('form')!.reset();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(control.checked).toBe(true);
    expect(root).toHaveAttribute('data-state', 'checked');
  });

  it('resyncs when a native reset button resets the form', async () => {
    const { container } = render(
      <form>
        <Checkbox label="A" />
        <button type="reset">Reset</button>
      </form>,
    );
    const control = screen.getByLabelText('A') as HTMLInputElement;
    const root = container.querySelector('.apui-checkbox')!;
    fireEvent.click(control);
    expect(root).toHaveAttribute('data-state', 'checked');
    await act(async () => {
      screen.getByRole('button', { name: 'Reset' }).click();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(control.checked).toBe(false);
    expect(root).toHaveAttribute('data-state', 'unchecked');
  });

  it('renders on the server', () => {
    const html = renderToString(<Checkbox label="All" defaultChecked indeterminate />);
    expect(html).toContain('class="apui-checkbox"');
    expect(html).toContain('data-state="indeterminate"');
    expect(html).toContain('data-icon="check"');
    expect(html).toContain('data-icon="minus"');
  });
});
