import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { List, ListItem, type ListItemProps } from '../../components/layout/ListItem/ListItem';

const declaredProps: (keyof ListItemProps)[] = [
  'title',
  'description',
  'href',
  'interactive',
  'selected',
  'disabled',
  'leadingIcon',
  'trailing',
  'classes',
];

describe('ListItem', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(ListItem, 'ListItem', {
      declared: { props: declaredProps, events: [] },
      ignoreDeclared: ['leading'],
    });
  });

  it('renders a div row on its own and li rows in a List', () => {
    const { container } = render(
      <>
        <ListItem title="Alone" description="olivia@company.com" />
        <List variant="bordered">
          <ListItem title="A" />
          <ListItem title="B" />
        </List>
      </>,
    );
    expect(container.querySelector('div.apui-list-item')).toHaveTextContent('Alone');
    expect(
      container.querySelectorAll('ul.apui-list[data-variant="bordered"] > li.apui-list-item'),
    ).toHaveLength(2);
    expect(container.querySelector('[data-part="description"]')).toHaveTextContent(
      'olivia@company.com',
    );
  });

  it('makes the title a link covering the row, with aria-current when selected', () => {
    const { container } = render(<ListItem title="Olivia" href="/members/1" selected />);
    const link = screen.getByRole('link', { name: 'Olivia' });
    expect(link).toHaveAttribute('href', '/members/1');
    expect(link).toHaveAttribute('aria-current', 'true');
    expect(link).toHaveAttribute('data-part', 'title');
    const root = container.querySelector('.apui-list-item')!;
    expect(root).toHaveAttribute('data-interactive', '');
    expect(root).toHaveAttribute('data-selected', '');
  });

  it('makes the title a button for interactive rows, and the row hears the click', async () => {
    const onClick = vi.fn();
    render(<ListItem title="Offer" interactive onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Offer' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disables the control of a disabled row and drops unsafe hrefs', () => {
    const { container, rerender } = render(<ListItem title="A" interactive disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(container.querySelector('.apui-list-item')).toHaveAttribute('data-disabled', '');
    rerender(<ListItem title="A" href="/a" disabled />);
    expect(container.querySelector('a')).not.toHaveAttribute('href');
    expect(container.querySelector('a')).toHaveAttribute('aria-disabled', 'true');
    rerender(<ListItem title="A" href="javascript:alert(1)" />);
    expect(container.querySelector('a')).toBeNull();
  });

  it('renders leading and trailing content', () => {
    const { container, rerender } = render(<ListItem title="A" leadingIcon="mail" trailing="2m" />);
    expect(container.querySelector('[data-part="leading"] svg')).not.toBeNull();
    expect(container.querySelector('[data-part="trailing"]')).toHaveTextContent('2m');
    rerender(<ListItem title="A" leading={<i>L</i>} trailing={<b>T</b>} />);
    expect(container.querySelector('[data-part="leading"] i')).not.toBeNull();
    expect(container.querySelector('[data-part="trailing"] b')).not.toBeNull();
  });
});
