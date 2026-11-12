import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { EmptyState, type EmptyStateProps } from '../../components/feedback/EmptyState/EmptyState';

const declaredProps: (keyof EmptyStateProps)[] = [
  'variant',
  'size',
  'align',
  'icon',
  'title',
  'description',
  'actions',
  'headingLevel',
  'classes',
];

const part = (root: ParentNode, name: string) =>
  root.querySelector(`[data-scope="empty-state"][data-part="${name}"]`);

describe('EmptyState', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(EmptyState, 'EmptyState', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('renders the contract anatomy with a level-3 heading', () => {
    const { container } = render(
      <EmptyState title="No properties yet" description="Add one." actions="Add property" />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-empty-state');
    expect(root).toHaveAttribute('data-variant', 'first-use');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('data-align', 'center');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'icon',
      'title',
      'description',
      'actions',
    ]);
    expect(screen.getByRole('heading', { level: 3, name: 'No properties yet' })).toBeTruthy();
    expect(part(root, 'icon')).toHaveAttribute('aria-hidden', 'true');
  });

  it('changes the default icon with the variant, and clamps headingLevel', () => {
    const { container, rerender } = render(<EmptyState title="Empty" />);
    const icon = () => part(container, 'icon')!.innerHTML;
    const first = icon();
    rerender(<EmptyState variant="no-results" title="Empty" headingLevel={1} />);
    expect(icon()).not.toBe(first);
    expect(screen.getByRole('heading', { level: 2 })).toBeTruthy();
  });

  it('fills the description from children', () => {
    const { container } = render(<EmptyState title="Empty">Nothing yet.</EmptyState>);
    expect(part(container, 'description')).toHaveTextContent('Nothing yet.');
  });
});
