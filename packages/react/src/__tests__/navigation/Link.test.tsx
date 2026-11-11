import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Link, type LinkProps } from '../../components/navigation/Link/Link';

const declaredProps: (keyof LinkProps)[] = [
  'href',
  'tone',
  'standalone',
  'external',
  'externalLabel',
  'leadingIcon',
  'trailingIcon',
  'classes',
];

describe('Link', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Link, 'Link', { declared: { props: declaredProps, events: [] } });
  });

  it('renders an anchor with the tone', () => {
    render(<Link href="/terms">Listing terms</Link>);
    const link = screen.getByRole('link', { name: 'Listing terms' });
    expect(link).toHaveClass('apui-link');
    expect(link).toHaveAttribute('href', '/terms');
    expect(link).toHaveAttribute('data-tone', 'primary');
    expect(link).not.toHaveAttribute('data-standalone');
    expect(link).not.toHaveAttribute('target');
  });

  it('renders a button without an href, or with an unsafe one', async () => {
    const onClick = vi.fn();
    const { rerender } = render(<Link onClick={onClick}>Log out</Link>);
    const button = screen.getByRole('button', { name: 'Log out' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('apui-link');
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();

    rerender(<Link href="javascript:alert(1)">Bad</Link>);
    expect(screen.getByRole('button', { name: 'Bad' })).not.toHaveAttribute('href');
  });

  it('emits tone and standalone', () => {
    render(
      <Link href="/" tone="muted" standalone>
        Privacy
      </Link>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('data-tone', 'muted');
    expect(link).toHaveAttribute('data-standalone', '');
  });

  it('opens external links in a new tab and announces it', () => {
    const { container } = render(
      <Link href="https://example.com" external externalLabel="(neuer Tab)">
        Docs
      </Link>,
    );
    const link = screen.getByRole('link', { name: /Docs ?\(neuer Tab\)/ });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(container.querySelector('[data-part="iconEnd"] svg')).not.toBeNull();
  });

  it('renders icon parts and mirrors arrows', () => {
    const { container } = render(
      <Link href="/all" standalone leadingIcon="download" trailingIcon="arrow-right">
        View all
      </Link>,
    );
    const icon = container.querySelector('[data-scope="link"][data-part="icon"]')!;
    const iconEnd = container.querySelector('[data-scope="link"][data-part="iconEnd"]')!;
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).not.toHaveAttribute('data-mirror');
    expect(iconEnd).toHaveAttribute('data-mirror', '');
  });

  it('lets icon nodes override the names', () => {
    const { container } = render(
      <Link href="/" external iconEnd={<i>X</i>}>
        Home
      </Link>,
    );
    expect(container.querySelector('[data-part="iconEnd"]')!.innerHTML).toBe('<i>X</i>');
  });

  it('merges classes and forwards the ref', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Link ref={ref} href="/" className="extra" classes={{ root: 'r' }}>
        A
      </Link>,
    );
    expect(ref.current).toHaveClass('apui-link', 'r', 'extra');
  });
});
