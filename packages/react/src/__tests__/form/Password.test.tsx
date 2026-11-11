import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  Password,
  passwordStrength,
  type PasswordProps,
} from '../../components/form/Password/Password';

const declaredProps: (keyof PasswordProps)[] = [
  'size',
  'autocomplete',
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
  'leadingIcon',
  'strengthMeter',
  'requirements',
  'revealLabel',
  'labels',
  'classes',
];
const declaredEvents: (keyof PasswordProps)[] = ['onValueChange'];

const part = (root: Element, name: string) =>
  root.querySelector(`[data-scope="password"][data-part="${name}"]`);

describe('Password', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Password, 'Password', {
      declared: { props: declaredProps, events: declaredEvents },
      // The labels show only with strengthMeter or requirements.
      ignoreEffects: ['labels'],
    });
  });

  it('renders the contract anatomy in order', () => {
    const { container } = render(
      <Password
        id="p"
        label="Password"
        required
        leadingIcon="lock"
        hint="Hint"
        error="Bad"
        strengthMeter
        requirements={[{ label: 'One number', pattern: '\\d' }]}
      />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-password');
    expect(root).toHaveAttribute('data-size', 'md');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'label',
      'box',
      'strength',
      'strengthLabel',
      'requirements',
      'hint',
      'error',
    ]);
    expect([...part(root, 'box')!.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'control',
      'reveal',
    ]);
    const control = screen.getByLabelText(/^Password/);
    expect(control).toHaveAttribute('type', 'password');
    expect(control).toHaveAttribute('autocomplete', 'current-password');
    expect(control).toHaveAttribute('aria-describedby', 'p-hint p-requirements p-error');
    expect(part(root, 'strength')).toHaveAttribute('aria-hidden', 'true');
    expect(part(root, 'strength')!.children).toHaveLength(4);
  });

  it('reveals the value with aria-pressed and one fixed name', () => {
    render(<Password label="Password" />);
    const control = screen.getByLabelText('Password');
    const reveal = screen.getByRole('button', { name: 'Show password' });
    expect(reveal).toHaveAttribute('aria-pressed', 'false');
    expect(reveal).toHaveAttribute('aria-controls', control.id);
    fireEvent.click(reveal);
    expect(control).toHaveAttribute('type', 'text');
    expect(reveal).toHaveAttribute('aria-pressed', 'true');
    expect(reveal).toHaveAccessibleName('Show password');
    fireEvent.click(reveal);
    expect(control).toHaveAttribute('type', 'password');
  });

  it('disables the reveal button with the field', () => {
    render(<Password label="Password" disabled revealLabel="Mostrar" />);
    expect(screen.getByRole('button', { name: 'Mostrar' })).toBeDisabled();
  });

  it('scores strength the same way as the other stacks', () => {
    expect(passwordStrength('')).toBe(0);
    expect(passwordStrength('abc')).toBe(1);
    expect(passwordStrength('password1')).toBe(1);
    expect(passwordStrength('Password1')).toBe(2);
    expect(passwordStrength('Password1!')).toBe(3);
    expect(passwordStrength('Password12345!')).toBe(4);
  });

  it('updates the meter, its live label and the requirements as people type', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Password
        label="New"
        strengthMeter
        labels={{ fair: 'Regular', met: 'OK' }}
        requirements={[
          { label: 'At least 12 characters', pattern: '.{12,}' },
          { label: 'One number', pattern: '\\d' },
          { label: 'Broken', pattern: '(' },
        ]}
        onValueChange={onValueChange}
      />,
    );
    const live = container.querySelector('[aria-live="polite"]')!;
    expect(part(container, 'strength')).toHaveAttribute('data-level', '0');
    expect(live).toHaveTextContent('');
    fireEvent.change(screen.getByLabelText('New'), { target: { value: 'Password1' } });
    expect(onValueChange).toHaveBeenCalledWith('Password1');
    expect(part(container, 'strength')).toHaveAttribute('data-level', '2');
    expect(live).toHaveTextContent('Regular');
    const items = container.querySelectorAll('[data-part="requirement"]');
    expect(items[0]).not.toHaveAttribute('data-met');
    expect(items[0]).toHaveTextContent('(Not met)');
    expect(items[1]).toHaveAttribute('data-met', '');
    expect(items[1]).toHaveTextContent('(OK)');
    expect(items[2]).not.toHaveAttribute('data-met');
  });

  it('takes autocomplete in both spellings', () => {
    const { rerender } = render(<Password label="A" autocomplete="new-password" />);
    expect(screen.getByLabelText('A')).toHaveAttribute('autocomplete', 'new-password');
    rerender(<Password label="A" autoComplete="new-password" />);
    expect(screen.getByLabelText('A')).toHaveAttribute('autocomplete', 'new-password');
  });

  it('forwards the ref and renders on the server', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Password ref={ref} label="A" />);
    expect(ref.current).toBe(screen.getByLabelText('A'));
    expect(renderToString(<Password label="B" />)).toContain('class="apui-password"');
  });
});
