import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Card, type CardProps } from '../../components/layout/Card/Card';

const declaredProps: (keyof CardProps)[] = [
  'surface',
  'interactive',
  'href',
  'title',
  'description',
  'actions',
  'footer',
  'media',
  'mediaAlt',
  'classes',
];

const part = (root: Element, name: string) =>
  root.querySelector(`[data-scope="card"][data-part="${name}"]`);

describe('Card', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Card, 'Card', {
      declared: { props: declaredProps, events: [] },
    });
  });

  it('renders the contract anatomy in order', () => {
    const { container } = render(
      <Card
        media="/a.png"
        title="Quarterly report"
        description="Updated"
        actions="Share"
        footer="3 comments"
      >
        Revenue grew.
      </Card>,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-card');
    expect(root).toHaveAttribute('data-surface', 'default');
    expect(root).not.toHaveAttribute('data-interactive');
    expect([...root.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'media',
      'header',
      'body',
      'footer',
    ]);
    const header = part(root, 'header')!;
    const [wrapper, actions] = [...header.children];
    expect(wrapper!.tagName).toBe('DIV');
    expect(wrapper).not.toHaveAttribute('data-part');
    expect([...wrapper!.children].map((el) => el.getAttribute('data-part'))).toEqual([
      'title',
      'description',
    ]);
    expect(part(root, 'title')!.tagName).toBe('H3');
    expect(part(root, 'description')!.tagName).toBe('P');
    expect(actions).toHaveAttribute('data-part', 'actions');
    expect(part(root, 'body')).toHaveTextContent('Revenue grew.');
  });

  it('renders an image with empty alt by default, and mediaAlt when given', () => {
    const { container, rerender } = render(<Card media="/a.png" />);
    const img = part(container, 'media')!;
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/a.png');
    expect(img).toHaveAttribute('alt', '');
    rerender(<Card media="/a.png" mediaAlt="A house" />);
    expect(part(container, 'media')).toHaveAttribute('alt', 'A house');
  });

  it('wraps a media node in a div part', () => {
    const { container } = render(<Card media={<video data-testid="v" />} />);
    const media = part(container, 'media')!;
    expect(media.tagName).toBe('DIV');
    expect(media).toContainElement(screen.getByTestId('v'));
  });

  it('omits every optional part when empty', () => {
    const { container } = render(<Card />);
    expect(container.firstElementChild!.children).toHaveLength(0);
  });

  it('renders the header for actions alone, without the title wrapper', () => {
    const { container } = render(<Card actions="Share" />);
    const header = part(container, 'header')!;
    expect(header.children).toHaveLength(1);
    expect(header.firstElementChild).toHaveAttribute('data-part', 'actions');
  });

  it('puts the link inside the title and implies data-interactive with href', () => {
    const { container } = render(<Card href="/reports" title="Q3" />);
    const link = screen.getByRole('link', { name: 'Q3' });
    expect(link).toHaveAttribute('href', '/reports');
    expect(link.parentElement).toBe(part(container, 'title'));
    expect(container.firstElementChild).toHaveAttribute('data-interactive', '');
  });

  it('adds data-interactive and data-surface from props', () => {
    const { container } = render(<Card interactive surface="glass" />);
    expect(container.firstElementChild).toHaveAttribute('data-interactive', '');
    expect(container.firstElementChild).toHaveAttribute('data-surface', 'glass');
  });

  it('accepts nodes for title, description, actions and footer', () => {
    render(
      <Card
        title={<span data-testid="t" />}
        description={<em data-testid="d" />}
        actions={<button type="button">Share</button>}
        footer={<button type="button">Open</button>}
      />,
    );
    expect(screen.getByTestId('t')).toBeInTheDocument();
    expect(screen.getByTestId('d')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Share' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
  });

  it('merges className and classes, and passes attributes to the root', () => {
    const { container } = render(
      <Card className="x" classes={{ root: 'y', body: 'z' }} data-testid="card" id="c">
        Body
      </Card>,
    );
    const root = screen.getByTestId('card');
    expect(root).toHaveClass('apui-card', 'x', 'y');
    expect(root).toHaveAttribute('id', 'c');
    expect(part(container, 'body')).toHaveClass('z');
  });

  it('forwards the ref to the root div', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Card ref={ref}>Body</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass('apui-card');
  });

  it('ignores href without a title, warns once, and adds no data-interactive', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(
      <>
        <Card href="/a" description="No title" />
        <Card href="/b" description="No title either" />
      </>,
    );
    expect(container.querySelector('a')).toBeNull();
    for (const card of container.querySelectorAll('.apui-card')) {
      expect(card).not.toHaveAttribute('data-interactive');
    }
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it.each(['javascript:alert(1)', '\u0001 VBScript:x', 'DATA:text/html,x'])(
    'ignores the unsafe href %j',
    (href) => {
      const { container } = render(<Card href={href} title="T" />);
      expect(container.querySelector('a')).toBeNull();
      expect(container.firstElementChild).not.toHaveAttribute('data-interactive');
    },
  );

  it('rejects javascript: and vbscript: media but keeps data: images', () => {
    const { container, rerender } = render(<Card media="javascript:alert(1)" title="T" />);
    expect(part(container, 'media')).toBeNull();
    rerender(<Card media=" vbscript:x" title="T" />);
    expect(part(container, 'media')).toBeNull();
    rerender(<Card media="data:image/svg+xml,%3Csvg/%3E" title="T" />);
    expect(part(container, 'media')).toHaveAttribute('src', 'data:image/svg+xml,%3Csvg/%3E');
  });

  it('renders on the server', () => {
    const html = renderToString(
      <Card href="/r" title="Report" footer="3 comments">
        Body
      </Card>,
    );
    expect(html).toContain('class="apui-card"');
    expect(html).toContain('data-interactive=""');
    expect(html).toContain('<a href="/r">Report</a>');
  });
});
