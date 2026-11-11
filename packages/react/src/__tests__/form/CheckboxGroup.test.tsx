import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  CheckboxGroup,
  type CheckboxGroupProps,
} from '../../components/form/CheckboxGroup/CheckboxGroup';

const declaredProps: (keyof CheckboxGroupProps)[] = [
  'options',
  'value',
  'defaultValue',
  'label',
  'hint',
  'error',
  'invalid',
  'disabled',
  'orientation',
  'variant',
  'columns',
  'selectAll',
  'selectAllLabel',
  'classes',
];
const declaredEvents: (keyof CheckboxGroupProps)[] = ['onValueChange'];

const topics = [
  { value: 'offers', label: 'Offers', description: 'Hourly' },
  { value: 'prices', label: 'Prices' },
  { value: 'news', label: 'News', disabled: true },
];

describe('CheckboxGroup', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(CheckboxGroup, 'CheckboxGroup', {
      declared: { props: declaredProps, events: declaredEvents },
      // The fixture sets value, which wins over defaultValue; covered below.
      ignoreEffects: ['defaultValue'],
    });
  });

  it('renders each option as a Checkbox in the items part', () => {
    const { container } = render(
      <CheckboxGroup label="Notify me" options={topics} columns={2} name="topics[]" />,
    );
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('FIELDSET');
    expect(root).toHaveAttribute('data-columns', '2');
    expect(root.querySelectorAll('[data-part="items"] > .apui-checkbox')).toHaveLength(3);
    expect(screen.getByLabelText('Offers')).toHaveAttribute('name', 'topics[]');
    expect(screen.getByLabelText('Offers')).toHaveAttribute('value', 'offers');
    expect(screen.getByLabelText('News')).toBeDisabled();
  });

  it('reports the checked values in option order', () => {
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup options={topics} defaultValue={['prices']} onValueChange={onValueChange} />,
    );
    fireEvent.click(screen.getByLabelText('Offers'));
    expect(onValueChange).toHaveBeenLastCalledWith(['offers', 'prices']);
    fireEvent.click(screen.getByLabelText('Prices'));
    expect(onValueChange).toHaveBeenLastCalledWith(['offers']);
  });

  it('select all is mixed while some are checked and toggles every enabled option', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <CheckboxGroup
        options={topics}
        selectAll
        defaultValue={['offers']}
        onValueChange={onValueChange}
      />,
    );
    const all = screen.getByLabelText('Select all') as HTMLInputElement;
    expect(container.querySelector('[data-part="select-all"] .apui-checkbox')).toHaveAttribute(
      'data-state',
      'indeterminate',
    );
    expect(all.indeterminate).toBe(true);
    fireEvent.click(all);
    expect(onValueChange).toHaveBeenLastCalledWith(['offers', 'prices']);
    expect(screen.getByLabelText('News')).not.toBeChecked();
  });

  it('keeps values that no option stands for', () => {
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        options={topics}
        value={['legacy', 'prices']}
        selectAll
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByLabelText('Offers'));
    expect(onValueChange).toHaveBeenLastCalledWith(['offers', 'prices', 'legacy']);
    fireEvent.click(screen.getByLabelText('Select all'));
    expect(onValueChange.mock.lastCall![0]).toContain('legacy');
  });

  it('translates the select-all label', () => {
    render(<CheckboxGroup options={['A']} selectAll selectAllLabel="Tout sélectionner" />);
    expect(screen.getByLabelText('Tout sélectionner')).toBeInTheDocument();
  });

  it('links the group error and marks every option invalid', () => {
    const { container } = render(<CheckboxGroup id="g" options={['A', 'B']} error="Pick one." />);
    expect(container.firstElementChild).toHaveAttribute('aria-describedby', 'g-error');
    expect(container.querySelectorAll('.apui-checkbox[data-invalid]')).toHaveLength(2);
  });
});
