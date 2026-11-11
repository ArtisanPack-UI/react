import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  Breadcrumbs,
  BreadcrumbsItem,
  type BreadcrumbItem,
  type BreadcrumbsProps,
} from '../../components/navigation/Breadcrumbs/Breadcrumbs';

const declaredProps: (keyof BreadcrumbsProps)[] = [
  'items',
  'maxItems',
  'label',
  'overflowLabel',
  'classes',
];

const trail: BreadcrumbItem[] = [
  { label: 'Home', href: '/', icon: 'house', hideLabel: true },
  { label: 'Properties', href: '/properties' },
  { label: 'Lakeview Lofts', href: '/properties/1' },
  { label: 'Analytics', href: '/properties/1/analytics' },
  { label: 'Visitor', href: '/ignored' },
];

describe('Breadcrumbs', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Breadcrumbs, 'Breadcrumbs', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('renders a named nav landmark with an ordered list', () => {
    const { container } = render(<Breadcrumbs items={trail} maxItems={0} />);
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });
    expect(nav).toHaveClass('apui-breadcrumbs');
    expect(container.querySelectorAll('ol[data-part="list"] > li[data-part="item"]')).toHaveLength(
      5,
    );
    expect(container.querySelector('[data-part="overflow"]')).toBeNull();
  });

  it('makes the last item the current page, never a link', () => {
    const { container } = render(<Breadcrumbs items={trail} maxItems={0} />);
    const current = container.querySelector('[data-part="current"]')!;
    expect(current.tagName).toBe('SPAN');
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(current).toHaveTextContent('Visitor');
    expect(container.querySelector('a[href="/ignored"]')).toBeNull();
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });

  it('hides and mirrors the separators, after the first level only', () => {
    const { container } = render(<Breadcrumbs items={trail} maxItems={0} />);
    const separators = container.querySelectorAll('[data-part="separator"]');
    expect(separators).toHaveLength(4);
    expect(container.querySelector('li:first-child [data-part="separator"]')).toBeNull();
    separators.forEach((separator) => {
      expect(separator).toHaveAttribute('aria-hidden', 'true');
      expect(separator).toHaveAttribute('data-mirror', '');
    });
  });

  it('keeps a hidden label for screen readers', () => {
    render(<Breadcrumbs items={trail} maxItems={0} />);
    const home = screen.getByRole('link', { name: 'Home' });
    expect(home.querySelector('svg')).not.toBeNull();
    expect(home.querySelector('.apui-sr-only')).toHaveTextContent('Home');
  });

  it('collapses the middle and reveals it, moving focus', async () => {
    const { container } = render(<Breadcrumbs items={trail} />);
    const overflow = screen.getByRole('button', { name: 'Show 2 more levels' });
    expect(overflow).toHaveAttribute('aria-expanded', 'false');
    expect(container.querySelectorAll('li[hidden]')).toHaveLength(2);

    await userEvent.click(overflow);
    expect(container.querySelectorAll('li[hidden]')).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'Properties' })).toHaveFocus();
  });

  it('takes translated labels', () => {
    render(<Breadcrumbs items={trail} label="Fil d'Ariane" overflowLabel="Afficher {count}" />);
    expect(screen.getByRole('navigation', { name: "Fil d'Ariane" })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Afficher 2' })).toBeInTheDocument();
  });

  it('renders router links through renderLink', () => {
    render(
      <Breadcrumbs
        items={[
          {
            label: 'Home',
            href: '/',
            renderLink: (props) => <a {...props} href="/routed" data-router="" />,
          },
          { label: 'Here' },
        ]}
      />,
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/routed');
    expect(link).toHaveAttribute('data-part', 'link');
  });

  it('composes BreadcrumbsItem children after items', async () => {
    const onClick = vi.fn((event: { preventDefault: () => void }) => event.preventDefault());
    const { container } = render(
      <Breadcrumbs items={[{ label: 'Home', href: '/' }]}>
        <BreadcrumbsItem label="Properties" href="/properties" onClick={onClick} />
        <BreadcrumbsItem label="ignored" href="/1">
          <strong>Lakeview</strong> Lofts
        </BreadcrumbsItem>
        <BreadcrumbsItem label="Visitor" href="/ignored" />
      </Breadcrumbs>,
    );
    expect([...container.querySelectorAll('li')].map((li) => li.textContent)).toEqual([
      'Home',
      'Properties',
      'Lakeview Lofts',
      'Visitor',
    ]);
    expect(container.querySelectorAll('[data-part="separator"]')).toHaveLength(3);
    expect(container.querySelector('[data-part="current"]')).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(container.querySelector('a[href="/ignored"]')).toBeNull();
    await userEvent.click(screen.getByRole('link', { name: 'Properties' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('collapses composed children like items', () => {
    const { container } = render(
      <Breadcrumbs>
        {['A', 'B', 'C', 'D', 'E'].map((label) => (
          <BreadcrumbsItem key={label} label={label} href={`/${label}`} />
        ))}
      </Breadcrumbs>,
    );
    expect(screen.getByRole('button', { name: 'Show 2 more levels' })).toBeInTheDocument();
    expect(container.querySelectorAll('li[hidden]')).toHaveLength(2);
  });

  it('forwards the ref to the nav', () => {
    const ref = createRef<HTMLElement>();
    render(<Breadcrumbs ref={ref} items={trail} />);
    expect(ref.current?.tagName).toBe('NAV');
  });
});
