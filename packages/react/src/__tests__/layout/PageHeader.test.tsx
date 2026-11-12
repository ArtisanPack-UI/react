import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { PageHeader, type PageHeaderProps } from '../../components/layout/PageHeader/PageHeader';

const declaredProps: (keyof PageHeaderProps)[] = [
  'title',
  'description',
  'level',
  'breadcrumbs',
  'meta',
  'actions',
  'tabs',
  'classes',
];

describe('PageHeader', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(PageHeader, 'PageHeader', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('renders the title as the page h1, with every part in order', () => {
    const { container } = render(
      <PageHeader
        title="Dashboard"
        description="Income and profit."
        breadcrumbs="Crumbs"
        meta="Draft"
        actions={<button type="button">Share</button>}
        tabs="Tabs"
      />,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'Dashboard' }).getAttribute('data-part'),
    ).toBe('title');
    const parts = [...container.querySelectorAll('[data-scope="page-header"]')].map((el) =>
      el.getAttribute('data-part'),
    );
    expect(parts).toEqual([
      'breadcrumbs',
      'row',
      'meta',
      'title',
      'description',
      'actions',
      'tabs',
    ]);
  });

  it('renders only the parts it has, and lowers the level', () => {
    const { container } = render(<PageHeader title="Settings" level={2} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeTruthy();
    expect(container.querySelector('[data-part="actions"]')).toBeNull();
    expect(container.querySelector('[data-part="description"]')).toBeNull();
  });

  it('forwards the ref and classes', () => {
    const ref = createRef<HTMLDivElement>();
    render(<PageHeader ref={ref} title="T" classes={{ root: 'r', title: 't' }} />);
    expect(ref.current?.className).toBe('apui-page-header r');
    expect(screen.getByRole('heading').className).toBe('t');
  });
});
