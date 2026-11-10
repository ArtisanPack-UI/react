import { createRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Input, type InputProps } from '../../components/form/Input/Input';

const declaredProps: (keyof InputProps)[] = [
  'size',
  'type',
  'label',
  'hint',
  'error',
  'invalid',
  'disabled',
  'readonly',
  'required',
  'placeholder',
  'value',
  'defaultValue',
  'prefix',
  'suffix',
  'leadingIcon',
  'trailingIcon',
  'classes',
];
const declaredEvents: (keyof InputProps)[] = ['onValueChange'];

const part = (root: Element, name: string) =>
  root.querySelector(`[data-scope="input"][data-part="${name}"]`);

describe('Input', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Input, 'Input', {
      declared: { props: declaredProps, events: declaredEvents },
    });
  });

  it('renders the contract anatomy with every part in order', () => {
    const { container } = render(
      <Input
        label="Email"
        placeholder="you@example.com"
        required
        hint="We never share it."
        error="Enter a valid email address."
        prefix="to:"
        suffix="@work"
        leadingIcon="mail"
        trailingIcon="search"
      />,
    );
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('apui-input');
    expect(root).toHaveAttribute('data-size', 'md');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'label',
      'box',
      'hint',
      'error',
    ]);
    expect([...part(root, 'box')!.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'prefix',
      'control',
      'suffix',
      'iconEnd',
    ]);
    const label = part(root, 'label')!;
    expect(label.innerHTML).toMatch(/^Email<span[^>]*>\*<\/span>$/);
    expect(part(label, 'required')).toHaveAttribute('aria-hidden', 'true');
    const error = part(root, 'error')!;
    expect(error.firstElementChild!.tagName.toLowerCase()).toBe('svg');
    expect(error).toHaveTextContent('Enter a valid email address.');
  });

  it('renders only the box and control by default', () => {
    const { container } = render(<Input aria-label="Search" />);
    const root = container.firstElementChild!;
    expect(root.querySelectorAll('[data-part]')).toHaveLength(2);
    const control = screen.getByRole('textbox');
    expect(control).toHaveAttribute('type', 'text');
    expect(control).not.toHaveAttribute('aria-invalid');
    expect(control).not.toHaveAttribute('aria-describedby');
    expect(root).not.toHaveAttribute('data-invalid');
  });

  it('links the label with a generated id', () => {
    render(<Input label="Name" />);
    const control = screen.getByLabelText('Name');
    expect(control.id).not.toBe('');
    expect(control).toHaveAttribute('data-part', 'control');
  });

  it('uses an explicit id and derives the hint and error ids from it', () => {
    render(<Input id="email" label="Email" hint="Hint" error="Bad" />);
    const control = screen.getByLabelText('Email');
    expect(control.id).toBe('email');
    expect(control).toHaveAttribute('aria-describedby', 'email-hint email-error');
    expect(document.getElementById('email-hint')).toHaveTextContent('Hint');
    expect(document.getElementById('email-error')).toHaveTextContent('Bad');
  });

  it('lists only the rendered help ids in aria-describedby', () => {
    render(<Input id="a" label="A" hint="Hint" />);
    expect(screen.getByLabelText('A')).toHaveAttribute('aria-describedby', 'a-hint');
  });

  it('keeps a caller aria-describedby after its own ids', () => {
    render(<Input id="b" label="B" error="Bad" aria-describedby="extra" />);
    expect(screen.getByLabelText('B')).toHaveAttribute('aria-describedby', 'b-error extra');
  });

  it('marks the field invalid from error or invalid', () => {
    const { container, rerender } = render(<Input label="A" invalid />);
    expect(container.firstElementChild).toHaveAttribute('data-invalid', '');
    expect(screen.getByLabelText('A')).toHaveAttribute('aria-invalid', 'true');
    expect(part(container, 'error')).toBeNull();
    rerender(<Input label="A" error="Bad" />);
    expect(container.firstElementChild).toHaveAttribute('data-invalid', '');
    expect(screen.getByLabelText('A')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets disabled, readonly and required on the control and the root flags', () => {
    const { container } = render(<Input label="A" disabled readonly required />);
    const control = screen.getByLabelText(/^A/);
    expect(control).toBeDisabled();
    expect(control).toHaveAttribute('readonly');
    expect(control).toBeRequired();
    expect(container.firstElementChild).toHaveAttribute('data-disabled', '');
    expect(container.firstElementChild).toHaveAttribute('data-readonly', '');
  });

  it('omits the required mark without a label', () => {
    const { container } = render(<Input aria-label="A" required />);
    expect(part(container, 'required')).toBeNull();
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('sends className to the root and other attributes to the control', () => {
    const { container } = render(
      <Input
        label="A"
        className="root-class"
        classes={{ root: 'r', control: 'c', box: 'b' }}
        name="email"
        autoComplete="email"
        data-testid="ctl"
      />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-input', 'root-class', 'r');
    expect(root).not.toHaveAttribute('name');
    const control = screen.getByTestId('ctl');
    expect(control).toHaveAttribute('name', 'email');
    expect(control).toHaveAttribute('autocomplete', 'email');
    expect(control).toHaveClass('c');
    expect(part(root, 'box')).toHaveClass('b');
  });

  it('renders icon nodes in place of names', () => {
    const { container } = render(
      <Input label="A" leadingIcon="mail" icon={<i data-testid="lead" />} iconEnd={<b />} />,
    );
    expect(part(container, 'icon')).toContainElement(screen.getByTestId('lead'));
    expect(part(container, 'iconEnd')!.querySelector('b')).not.toBeNull();
  });

  it('works uncontrolled with defaultValue and reports changes', () => {
    const onValueChange = vi.fn();
    const onChange = vi.fn();
    render(
      <Input label="A" defaultValue="jacob" onValueChange={onValueChange} onChange={onChange} />,
    );
    const control = screen.getByLabelText('A') as HTMLInputElement;
    expect(control.value).toBe('jacob');
    fireEvent.change(control, { target: { value: 'jacob m' } });
    expect(control.value).toBe('jacob m');
    expect(onValueChange).toHaveBeenCalledWith('jacob m');
    expect(onChange).toHaveBeenCalledOnce();
  });

  it('works controlled with value and onValueChange', () => {
    function Controlled() {
      const [value, setValue] = useState('');
      return (
        <>
          <Input label="A" value={value} onValueChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    fireEvent.change(screen.getByLabelText('A'), { target: { value: 'hello' } });
    expect(screen.getByRole('status')).toHaveTextContent('hello');
  });

  it('stays at the controlled value when the owner ignores changes', () => {
    render(<Input label="A" value="fixed" onValueChange={() => {}} />);
    const control = screen.getByLabelText('A') as HTMLInputElement;
    fireEvent.change(control, { target: { value: 'other' } });
    expect(control.value).toBe('fixed');
  });

  it('forwards the ref to the native input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} label="A" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByLabelText('A'));
  });

  it('renders on the server', () => {
    const html = renderToString(<Input id="e" label="Email" hint="Hint" error="Bad" />);
    expect(html).toContain('class="apui-input"');
    expect(html).toContain('aria-describedby="e-hint e-error"');
    expect(html).toContain('data-part="error"');
  });
});
