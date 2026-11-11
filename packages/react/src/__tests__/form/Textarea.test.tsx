import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { act, render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  Textarea,
  textareaAnnouncement,
  type TextareaProps,
} from '../../components/form/Textarea/Textarea';

const declaredProps: (keyof TextareaProps)[] = [
  'rows',
  'maxLength',
  'autoResize',
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
  'remainingLabel',
  'classes',
];
const declaredEvents: (keyof TextareaProps)[] = ['onValueChange'];

const part = (root: Element, name: string) =>
  root.querySelector(`[data-scope="textarea"][data-part="${name}"]`);

describe('Textarea', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Textarea, 'Textarea', {
      declared: { props: declaredProps, events: declaredEvents },
      // The announcement is empty until the value nears the limit.
      ignoreEffects: ['remainingLabel'],
    });
  });

  it('renders the contract anatomy in order', () => {
    const { container } = render(
      <Textarea
        id="d"
        label="Description"
        required
        hint="Shown."
        error="Too short."
        maxLength={500}
      />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-textarea');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'label',
      'box',
      'hint',
      'error',
    ]);
    const box = part(root, 'box')!;
    expect(
      [...box.querySelectorAll('[data-part]')].map((el) => el.getAttribute('data-part')),
    ).toEqual(['control', 'count']);
    const control = screen.getByLabelText(/Description/);
    expect(control.tagName).toBe('TEXTAREA');
    expect(control).toHaveAttribute('rows', '4');
    expect(control).toHaveAttribute('maxlength', '500');
    expect(control).toHaveAttribute('aria-describedby', 'd-hint d-error');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(part(root, 'count')).toHaveTextContent('0 / 500');
    expect(part(root, 'count')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders no counter without maxLength', () => {
    const { container } = render(<Textarea aria-label="Notes" />);
    expect(part(container, 'count')).toBeNull();
    expect(container.querySelector('[aria-live]')).toBeNull();
  });

  it('announces the characters left only near the limit', () => {
    expect(textareaAnnouncement(0, 500)).toBe('');
    expect(textareaAnnouncement(449, 500)).toBe('');
    expect(textareaAnnouncement(450, 500)).toBe('Characters left: 50');
    expect(textareaAnnouncement(15, 20)).toBe('Characters left: 5');
    expect(textareaAnnouncement(10, 20, 'Quedan {count}')).toBe('Quedan 10');

    const { container } = render(
      <Textarea label="A" maxLength={20} remainingLabel="Left: {count}" />,
    );
    const live = container.querySelector('[aria-live="polite"]')!;
    expect(live).toHaveTextContent('');
    fireEvent.change(screen.getByLabelText('A'), { target: { value: 'hello world!' } });
    expect(live).toHaveTextContent('Left: 8');
    expect(part(container, 'count')).toHaveTextContent('12 / 20');
  });

  it('marks autoResize, disabled and readonly on the root', () => {
    const { container } = render(<Textarea label="A" autoResize disabled readonly />);
    const root = container.firstElementChild!;
    expect(root).toHaveAttribute('data-auto-resize', '');
    expect(root).toHaveAttribute('data-disabled', '');
    expect(root).toHaveAttribute('data-readonly', '');
    expect(screen.getByLabelText('A')).toBeDisabled();
  });

  it('works uncontrolled and reports changes', () => {
    const onValueChange = vi.fn();
    render(<Textarea label="A" defaultValue="hi" onValueChange={onValueChange} />);
    const control = screen.getByLabelText('A') as HTMLTextAreaElement;
    expect(control.value).toBe('hi');
    fireEvent.change(control, { target: { value: 'hi there' } });
    expect(onValueChange).toHaveBeenCalledWith('hi there');
  });

  it('sends className to the root and other attributes to the control', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const { container } = render(
      <Textarea ref={ref} label="A" className="r" name="notes" classes={{ control: 'c' }} />,
    );
    expect(container.firstElementChild).toHaveClass('apui-textarea', 'r');
    expect(ref.current).toHaveAttribute('name', 'notes');
    expect(ref.current).toHaveClass('c');
  });

  it('renders on the server', () => {
    const html = renderToString(<Textarea id="n" label="Notes" maxLength={10} />);
    expect(html).toContain('class="apui-textarea"');
    expect(html).toContain('0 / 10');
  });

  it('resyncs the counter of an uncontrolled textarea when its form resets', async () => {
    const { container } = render(
      <form>
        <Textarea label="Notes" maxLength={20} defaultValue="abc" />
      </form>,
    );
    const control = screen.getByLabelText('Notes') as HTMLTextAreaElement;
    const count = container.querySelector('[data-part="count"]')!;
    fireEvent.change(control, { target: { value: 'abcdefgh' } });
    expect(count).toHaveTextContent('8 / 20');
    await act(async () => {
      container.querySelector('form')!.reset();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(control.value).toBe('abc');
    expect(count).toHaveTextContent('3 / 20');
  });
});
