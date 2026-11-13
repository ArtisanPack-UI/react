import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { RadioGroup, type RadioGroupProps } from '../../components/form/RadioGroup/RadioGroup';

const declaredProps: (keyof RadioGroupProps)[] = [
  'options',
  'value',
  'defaultValue',
  'label',
  'hint',
  'error',
  'invalid',
  'disabled',
  'required',
  'orientation',
  'variant',
  'classes',
];
const declaredEvents: (keyof RadioGroupProps)[] = ['onValueChange'];

const plans = [
  { value: 'starter', label: 'Starter', description: 'Up to 5', meta: '$0' },
  { value: 'growth', label: 'Growth' },
  { value: 'team', label: 'Team', disabled: true },
];

describe('RadioGroup', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(RadioGroup, 'RadioGroup', {
      declared: { props: declaredProps, events: declaredEvents },
      // The fixture sets value, which wins over defaultValue; covered below.
      ignoreEffects: ['defaultValue'],
    });
  });

  it('renders a fieldset with the legend, items, hint and error', () => {
    const { container } = render(
      <RadioGroup id="p" label="Plan" hint="H" error="E" required options={plans} />,
    );
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('FIELDSET');
    expect(root).toHaveClass('apui-radio-group');
    expect(root).toHaveAttribute('data-orientation', 'vertical');
    expect(root).toHaveAttribute('data-variant', 'default');
    expect(root).toHaveAttribute('aria-describedby', 'p-hint p-error');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'label',
      'items',
      'hint',
      'error',
    ]);
    expect(screen.getByRole('group', { name: /Plan/ })).toBe(root);
  });

  it('gives every radio one name and links descriptions', () => {
    render(<RadioGroup id="p" options={plans} />);
    const radios = screen.getAllByRole('radio') as HTMLInputElement[];
    expect(new Set(radios.map((radio) => radio.name)).size).toBe(1);
    expect(radios[0]).toHaveAttribute('aria-describedby', 'p-0-description');
    expect(radios[2]).toBeDisabled();
    expect(screen.getByText('$0')).toHaveAttribute('data-part', 'item-meta');
  });

  it('works uncontrolled and reports the value with its type', () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        options={[
          { value: 1, label: 'One' },
          { value: 2, label: 'Two' },
        ]}
        defaultValue={1}
        onValueChange={onValueChange}
      />,
    );
    expect(screen.getByLabelText('One')).toBeChecked();
    fireEvent.click(screen.getByLabelText('Two'));
    expect(onValueChange).toHaveBeenCalledWith(2);
    expect(screen.getByLabelText('Two')).toBeChecked();
  });

  it('follows a controlled value', () => {
    function Controlled() {
      const [value, setValue] = useState<string | number>('growth');
      return (
        <>
          <RadioGroup options={plans} value={value} onValueChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    expect(screen.getByLabelText(/Growth/)).toBeChecked();
    fireEvent.click(screen.getByLabelText(/Starter/));
    expect(screen.getByRole('status')).toHaveTextContent('starter');
  });

  it('marks every radio invalid with an error', () => {
    render(<RadioGroup options={['A', 'B']} error="Pick one." />);
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toHaveAttribute('aria-invalid', 'true');
    }
  });

  it('renders no description or meta in segments', () => {
    const { container } = render(<RadioGroup variant="segmented" options={plans} />);
    expect(container.querySelector('[data-part="item-description"]')).toBeNull();
    expect(container.querySelector('[data-part="item-meta"]')).toBeNull();
    expect(screen.getAllByRole('radio')[0]).not.toHaveAttribute('aria-describedby');
  });

  it('emits the variant and orientation', () => {
    const { container } = render(
      <RadioGroup options={['A']} variant="segmented" orientation="horizontal" />,
    );
    expect(container.firstElementChild).toHaveAttribute('data-variant', 'segmented');
    expect(container.firstElementChild).toHaveAttribute('data-orientation', 'horizontal');
  });
});
