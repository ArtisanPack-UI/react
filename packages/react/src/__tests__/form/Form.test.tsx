import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Form, type FormProps } from '../../components/form/Form/Form';

const declaredProps: (keyof FormProps)[] = ['actions', 'divided', 'classes'];

describe('Form', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Form, 'Form', { declared: { props: declaredProps, events: [] } });
  });

  it('renders a native form with the actions row last', () => {
    const { container } = render(
      <Form aria-label="Invite" divided actions={<button type="submit">Send</button>}>
        <input aria-label="Email" />
      </Form>,
    );
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('FORM');
    expect(root).toHaveClass('apui-form');
    expect(root).toHaveAttribute('data-divided', '');
    expect(root.lastElementChild).toHaveAttribute('data-part', 'actions');
    expect(screen.getByRole('form', { name: 'Invite' })).toBe(root);
  });

  it('submits through the native event', () => {
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <Form aria-label="A" onSubmit={onSubmit} actions={<button type="submit">Go</button>}>
        <input aria-label="X" />
      </Form>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('omits the actions row without actions', () => {
    const { container } = render(<Form>Body</Form>);
    expect(container.querySelector('[data-part="actions"]')).toBeNull();
  });
});
