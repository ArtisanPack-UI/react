import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Radio } from '../../components/form/Radio/Radio';

const options = [
  { id: '1', name: 'Option A', hint: 'The first' },
  { id: '2', name: 'Option B' },
  { id: '3', name: 'Option C', disabled: true },
];

describe('Radio (deprecated alias of RadioGroup)', () => {
  it('renders a RadioGroup and warns once', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Radio label="Select one" options={options} />);
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('FIELDSET');
    expect(root).toHaveClass('apui-radio-group');
    expect(root).toHaveAttribute('data-variant', 'default');
    expect(root).toHaveAttribute('data-orientation', 'vertical');
    expect(container.querySelector('.fieldset, .radio, .fieldset-legend')).toBeNull();
    expect(screen.getByRole('group', { name: 'Select one' })).toBe(root);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Radio is deprecated; use RadioGroup.'),
    );
    warn.mockRestore();
  });

  it('reads the options through the default keys, with the hint as the description', () => {
    render(<Radio label="Select" options={options} />);
    const radios = screen.getAllByRole('radio');
    expect(radios.map((radio) => (radio as HTMLInputElement).value)).toEqual(['1', '2', '3']);
    expect(screen.getByRole('radio', { name: /^Option A/ })).toHaveAccessibleDescription(
      'The first',
    );
    expect(radios[2]).toBeDisabled();
  });

  it('reads the options through optionValue, optionLabel and optionHint', () => {
    render(
      <Radio
        label="Plan"
        optionValue="slug"
        optionLabel="title"
        optionHint="about"
        options={[{ slug: 'pro', title: 'Pro', about: 'For teams' }]}
      />,
    );
    const radio = screen.getByRole('radio', { name: /^Pro/ }) as HTMLInputElement;
    expect(radio.value).toBe('pro');
    expect(radio).toHaveAccessibleDescription('For teams');
  });

  it('maps inline, card and cardClass, and ignores color', () => {
    const { container } = render(
      <Radio label="Select" options={options} inline card cardClass="my-card" color="primary" />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-orientation', 'horizontal');
    expect(root).toHaveAttribute('data-variant', 'cards');
    expect(root).not.toHaveAttribute('color');
    container
      .querySelectorAll('[data-part="item"]')
      .forEach((item) => expect(item).toHaveClass('my-card'));
  });

  it('fires a native onChange and onValueChange with the chosen value', () => {
    const onChange = vi.fn();
    const onValueChange = vi.fn();
    render(
      <Radio
        label="Select"
        options={[
          { id: 1, name: 'One' },
          { id: 2, name: 'Two' },
        ]}
        onChange={onChange}
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Two' }));
    expect(onValueChange).toHaveBeenCalledWith(2);
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange.mock.calls[0][0].target.value).toBe('2');
  });

  it('shares the name, and shows the hint and error', () => {
    render(
      <Radio label="Select" name="choice" options={options} hint="Pick one" error="Required" />,
    );
    screen
      .getAllByRole('radio')
      .forEach((radio) => expect(radio).toHaveAttribute('name', 'choice'));
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')[0]).toHaveAttribute('aria-invalid', 'true');
  });
});
