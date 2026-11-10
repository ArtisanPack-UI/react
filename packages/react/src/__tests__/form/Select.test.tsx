import { createRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Select, type SelectProps } from '../../components/form/Select/Select';

const declaredProps: (keyof SelectProps)[] = [
  'size',
  'options',
  'label',
  'hint',
  'error',
  'invalid',
  'disabled',
  'required',
  'placeholder',
  'value',
  'defaultValue',
  'leadingIcon',
  'classes',
];
const declaredEvents: (keyof SelectProps)[] = ['onValueChange'];

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada', disabled: true },
];

const part = (root: Element, name: string) =>
  root.querySelector(`[data-scope="select"][data-part="${name}"]`);

const optionsOf = (select: HTMLElement) =>
  [...select.querySelectorAll('option')].map((option) => ({
    value: option.value,
    text: option.textContent,
    disabled: option.disabled,
  }));

describe('Select', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Select, 'Select', {
      declared: { props: declaredProps, events: declaredEvents },
    });
  });

  it('renders the contract anatomy in order', () => {
    const { container } = render(
      <Select
        label="Country"
        options={countries}
        required
        hint="Where the account is registered."
        error="Choose a country."
        leadingIcon="user"
      />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-select');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-invalid', '');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'label',
      'box',
      'hint',
      'error',
    ]);
    expect([...part(root, 'box')!.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'control',
      'indicator',
    ]);
    expect(part(root, 'label')!.innerHTML).toMatch(/^Country<span[^>]*>\*<\/span>$/);
    expect(part(root, 'indicator')!.querySelector('svg')).not.toBeNull();
    expect(part(root, 'indicator')).not.toHaveAttribute('data-mirror');
  });

  it('renders the placeholder, object options and children in order', () => {
    render(
      <Select label="Country" options={countries}>
        <option value="mx">Mexico</option>
      </Select>,
    );
    expect(optionsOf(screen.getByLabelText('Country'))).toEqual([
      { value: '', text: 'Select…', disabled: false },
      { value: 'us', text: 'United States', disabled: false },
      { value: 'ca', text: 'Canada', disabled: true },
      { value: 'mx', text: 'Mexico', disabled: false },
    ]);
  });

  it('renders string options with the value as the label', () => {
    render(<Select label="Zone" options={['UTC', 'Europe/Paris']} placeholder="Pick one" />);
    expect(optionsOf(screen.getByLabelText('Zone'))).toEqual([
      { value: '', text: 'Pick one', disabled: false },
      { value: 'UTC', text: 'UTC', disabled: false },
      { value: 'Europe/Paris', text: 'Europe/Paris', disabled: false },
    ]);
  });

  it('compares option values as strings', () => {
    render(<Select label="N" options={[{ value: 1, label: 'One' }]} defaultValue="1" />);
    expect((screen.getByLabelText('N') as HTMLSelectElement).value).toBe('1');
  });

  it('disables the placeholder when required and starts on it', () => {
    render(<Select label="Country" options={countries} required />);
    const select = screen.getByLabelText(/^Country/) as HTMLSelectElement;
    expect(select).toBeRequired();
    expect(select.options[0]).toBeDisabled();
    expect(select.value).toBe('');
    expect(select.selectedIndex).toBe(0);
  });

  it('renders no placeholder option for an empty placeholder', () => {
    render(<Select label="Country" options={countries} placeholder="" />);
    expect(optionsOf(screen.getByLabelText('Country'))[0]!.value).toBe('us');
  });

  it('wires ids and aria-describedby', () => {
    render(<Select id="c" label="Country" hint="Hint" error="Bad" options={countries} />);
    const select = screen.getByLabelText('Country');
    expect(select.id).toBe('c');
    expect(select).toHaveAttribute('aria-describedby', 'c-hint c-error');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('generates an id without one', () => {
    render(<Select label="Country" />);
    expect(screen.getByLabelText('Country').id).not.toBe('');
  });

  it('sends className to the root and other attributes to the control', () => {
    const { container } = render(
      <Select label="A" className="x" classes={{ root: 'y', control: 'z' }} name="country" />,
    );
    expect(container.firstElementChild).toHaveClass('apui-select', 'x', 'y');
    const select = screen.getByLabelText('A');
    expect(select).toHaveAttribute('name', 'country');
    expect(select).toHaveClass('z');
  });

  it('disables the control and flags the root', () => {
    const { container } = render(<Select label="A" disabled />);
    expect(screen.getByLabelText('A')).toBeDisabled();
    expect(container.firstElementChild).toHaveAttribute('data-disabled', '');
  });

  it('works uncontrolled and reports changes', () => {
    const onValueChange = vi.fn();
    render(<Select label="A" options={['x', 'y']} onValueChange={onValueChange} />);
    const select = screen.getByLabelText('A') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'y' } });
    expect(select.value).toBe('y');
    expect(onValueChange).toHaveBeenCalledWith('y');
  });

  it('works controlled', () => {
    function Controlled() {
      const [value, setValue] = useState('x');
      return (
        <>
          <Select label="A" options={['x', 'y']} value={value} onValueChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    expect((screen.getByLabelText('A') as HTMLSelectElement).value).toBe('x');
    fireEvent.change(screen.getByLabelText('A'), { target: { value: 'y' } });
    expect(screen.getByRole('status')).toHaveTextContent('y');
  });

  it('forwards the ref to the native select', () => {
    const ref = createRef<HTMLSelectElement>();
    render(<Select ref={ref} label="A" />);
    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it('renders on the server, starting on the placeholder', () => {
    const html = renderToString(<Select label="Country" options={countries} required />);
    expect(html).toContain('class="apui-select"');
    expect(html).toMatch(/<option value="" disabled="" selected="">Select…<\/option>/);
  });

  it('passes the matching option value with its original type', () => {
    const onValueChange = vi.fn();
    render(
      <Select
        label="N"
        options={[{ value: 1, label: 'One' }, { value: 2, label: 'Two' }, 'three']}
        onValueChange={onValueChange}
      >
        <option value="4">Four</option>
      </Select>,
    );
    const select = screen.getByLabelText('N');
    fireEvent.change(select, { target: { value: '2' } });
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    fireEvent.change(select, { target: { value: 'three' } });
    expect(onValueChange).toHaveBeenLastCalledWith('three');
    fireEvent.change(select, { target: { value: '4' } });
    expect(onValueChange).toHaveBeenLastCalledWith('4');
  });
});
