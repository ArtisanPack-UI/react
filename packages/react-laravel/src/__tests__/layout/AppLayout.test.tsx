import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppLayout, createLayout } from '../../layout/AppLayout';

vi.mock('@inertiajs/react', () => ({
  Head: vi.fn(({ title }: { title: string }) => <title>{title}</title>),
}));

describe('AppLayout', () => {
  it('renders children in a main element', () => {
    render(
      <AppLayout>
        <p>Page content</p>
      </AppLayout>,
    );

    expect(screen.getByRole('main')).toHaveTextContent('Page content');
  });

  it('renders Head with title when provided', () => {
    render(
      <AppLayout title="Dashboard">
        <p>Content</p>
      </AppLayout>,
    );

    expect(document.querySelector('title')).toHaveTextContent('Dashboard');
  });

  it('renders header slot', () => {
    render(
      <AppLayout header={<header data-testid="header">Header</header>}>
        <p>Content</p>
      </AppLayout>,
    );

    expect(screen.getByTestId('header')).toHaveTextContent('Header');
  });

  it('renders footer slot', () => {
    render(
      <AppLayout footer={<footer data-testid="footer">Footer</footer>}>
        <p>Content</p>
      </AppLayout>,
    );

    expect(screen.getByTestId('footer')).toHaveTextContent('Footer');
  });

  it('applies className to main element', () => {
    render(
      <AppLayout className="container mx-auto">
        <p>Content</p>
      </AppLayout>,
    );

    expect(screen.getByRole('main')).toHaveClass('container', 'mx-auto');
  });
});

describe('createLayout', () => {
  it('creates a layout function that wraps content', () => {
    function TestLayout({ children }: { children: React.ReactNode }) {
      return <div data-testid="layout">{children}</div>;
    }
    TestLayout.displayName = 'TestLayout';

    const layout = createLayout(TestLayout);
    const result = layout(<p>Page</p>);

    render(<>{result}</>);

    expect(screen.getByTestId('layout')).toHaveTextContent('Page');
  });

  it('passes props to the layout component', () => {
    function TestLayout({ title, children }: { title: string; children: React.ReactNode }) {
      return (
        <div data-testid="layout">
          <h1>{title}</h1>
          {children}
        </div>
      );
    }
    TestLayout.displayName = 'TestLayout';

    const layout = createLayout(TestLayout, { title: 'Admin' });
    const result = layout(<p>Content</p>);

    render(<>{result}</>);

    expect(screen.getByRole('heading')).toHaveTextContent('Admin');
  });

  it('sets displayName on the layout wrapper', () => {
    function MyLayout({ children }: { children: React.ReactNode }) {
      return <div>{children}</div>;
    }
    MyLayout.displayName = 'MyLayout';

    const layout = createLayout(MyLayout);
    expect(layout.displayName).toBe('createLayout(MyLayout)');
  });
});
