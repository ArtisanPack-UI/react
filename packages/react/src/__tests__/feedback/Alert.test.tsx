import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Alert, type AlertProps } from '../../components/feedback/Alert/Alert';

const declaredProps: (keyof AlertProps)[] = [
  'title',
  'description',
  'color',
  'variant',
  'surface',
  'icon',
  'actions',
  'dismissible',
  'closeLabel',
  'classes',
];

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="alert"][data-part="${name}"]`);

describe('Alert', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Alert, 'Alert', {
      declared: { props: declaredProps, events: ['onOpenChange'] },
    });
  });

  it('renders the contract anatomy in order', () => {
    const { container } = render(
      <Alert title="Listing published" description="Live in search." actions="Undo" dismissible />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-alert');
    expect(root).toHaveAttribute('role', 'status');
    expect(root).toHaveAttribute('data-color', 'neutral');
    expect(root).toHaveAttribute('data-variant', 'soft');
    expect(root).toHaveAttribute('data-surface', 'default');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'title',
      'description',
      'actions',
      'close-trigger',
    ]);
    expect(part(root, 'title')!.tagName).toBe('P');
    expect(part(root, 'description')!.tagName).toBe('DIV');
    expect(part(root, 'icon')).toHaveAttribute('aria-hidden', 'true');
    const close = screen.getByRole('button', { name: 'Dismiss' });
    expect(close).toHaveAttribute('data-variant', 'ghost');
    expect(close).toHaveAttribute('data-size', 'xs');
  });

  it('is an alert for errors and a status otherwise', () => {
    render(<Alert color="error" title="Payment failed" />);
    expect(screen.getByRole('alert')).toHaveAttribute('data-color', 'error');
  });

  it("shows the color's status icon, a named icon, or a node", () => {
    const { container, rerender } = render(<Alert color="success" title="Saved" />);
    const svg = () => part(container, 'icon')!.querySelector('svg')!.innerHTML;
    const success = svg();
    rerender(<Alert color="info" title="Saved" />);
    expect(svg()).not.toBe(success);
    rerender(<Alert icon={<i data-testid="custom" />} title="Saved" />);
    expect(part(container, 'icon')).toContainElement(screen.getByTestId('custom'));
  });

  it('fills the description from children', () => {
    const { container } = render(
      <Alert title="Payment failed" description="ignored">
        <ul>
          <li>Update the card</li>
        </ul>
      </Alert>,
    );
    expect(part(container, 'description')!.querySelector('li')).toHaveTextContent(
      'Update the card',
    );
  });

  it('hides itself and reports open-change false when dismissed', () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Alert title="Saved" dismissible closeLabel="Fermer" onOpenChange={onOpenChange} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Fermer' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(container.firstElementChild).toHaveAttribute('hidden');
  });

  it('applies classes, className and native attributes to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Alert
        ref={ref}
        title="Saved"
        className="extra"
        classes={{ root: 'r', title: 't' }}
        data-testid="alert"
      />,
    );
    const root = screen.getByTestId('alert');
    expect(ref.current).toBe(root);
    expect(root).toHaveClass('apui-alert', 'r', 'extra');
    expect(part(root, 'title')).toHaveClass('t');
  });
});
