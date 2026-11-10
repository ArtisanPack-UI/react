import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Button, type ButtonProps } from '../../components/form/Button/Button';

const declaredProps: (keyof ButtonProps)[] = [
  'variant',
  'color',
  'size',
  'iconOnly',
  'loading',
  'disabled',
  'href',
  'leadingIcon',
  'trailingIcon',
  'type',
  'classes',
];

const part = (root: Element, name: string) =>
  root.querySelector(`[data-scope="button"][data-part="${name}"]`);

describe('Button', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(Button, 'Button', { declared: { props: declaredProps, events: [] } });
  });

  it('renders the contract root with default data attributes', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('apui-button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('data-variant', 'solid');
    expect(button).toHaveAttribute('data-color', 'primary');
    expect(button).toHaveAttribute('data-size', 'md');
    expect(button).not.toHaveAttribute('data-icon-only');
    expect(button).not.toHaveAttribute('data-disabled');
    expect(button).not.toHaveAttribute('aria-busy');
    expect(part(button, 'label')).toHaveTextContent('Save');
    expect(button.querySelectorAll('[data-part]')).toHaveLength(1);
  });

  it('emits variant, color, size and type', () => {
    render(
      <Button variant="outline" color="error" size="xl" type="submit">
        Go
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-color', 'error');
    expect(button).toHaveAttribute('data-size', 'xl');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('merges className and classes.root on the root, and classes per part', () => {
    render(
      <Button className="a" classes={{ root: 'b', label: 'c', icon: 'd' }} leadingIcon="plus">
        Go
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('apui-button', 'a', 'b');
    expect(part(button, 'label')).toHaveClass('c');
    expect(part(button, 'icon')).toHaveClass('d');
  });

  it('resolves named icons through the registry in the contract order', () => {
    render(
      <Button leadingIcon="plus" trailingIcon="arrow-right">
        Next
      </Button>,
    );
    const button = screen.getByRole('button');
    const parts = [...button.querySelectorAll('[data-part]')].map((el) =>
      el.getAttribute('data-part'),
    );
    expect(parts).toEqual(['icon', 'label', 'iconEnd']);
    const svg = part(button, 'icon')!.querySelector('svg')!;
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.getAttribute('stroke-width')).toBe('1.5');
    expect(svg.getAttribute('stroke-linecap')).toBe('round');
    expect(svg.getAttribute('stroke-linejoin')).toBe('round');
    expect(svg.getAttribute('fill')).toBe('none');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
    expect(svg.innerHTML).not.toBe('');
    expect(part(button, 'icon')).toHaveAttribute('aria-hidden', 'true');
    expect(part(button, 'icon')).not.toHaveAttribute('data-mirror');
    expect(part(button, 'iconEnd')).toHaveAttribute('data-mirror', '');
  });

  it('lets icon nodes override the names', () => {
    render(
      <Button
        leadingIcon="plus"
        icon={<i data-testid="lead" />}
        trailingIcon="arrow-right"
        iconEnd={<i data-testid="trail" />}
      >
        Go
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(part(button, 'icon')).toContainElement(screen.getByTestId('lead'));
    expect(part(button, 'icon')!.querySelector('svg')).toBeNull();
    expect(part(button, 'iconEnd')).toContainElement(screen.getByTestId('trail'));
    expect(part(button, 'iconEnd')).not.toHaveAttribute('data-mirror');
  });

  it('keeps the icon part but renders no svg for an unknown name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<Button leadingIcon="not-a-registered-icon">Go</Button>);
    const icon = part(screen.getByRole('button'), 'icon');
    expect(icon).toBeInTheDocument();
    expect(icon!.querySelector('svg')).toBeNull();
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it('renders only the icon when iconOnly', () => {
    render(<Button iconOnly leadingIcon="trash" aria-label="Delete" />);
    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveAttribute('data-icon-only', '');
    expect(part(button, 'label')).toBeNull();
    expect(part(button, 'icon')).toBeInTheDocument();
  });

  it('omits the label part without children', () => {
    render(<Button leadingIcon="plus" aria-label="Add" />);
    expect(part(screen.getByRole('button'), 'label')).toBeNull();
  });

  it('shows the spinner, sets aria-busy and keeps the label while loading', () => {
    render(<Button loading>Saving</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).not.toBeDisabled();
    expect(part(button, 'label')).toHaveTextContent('Saving');
    expect(part(button, 'spinner')).toHaveAttribute('aria-hidden', 'true');
  });

  it('calls onClick normally', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('ignores clicks while loading', () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Go
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('ignores clicks on a loading anchor and prevents navigation', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Button href="/next" loading onClick={onClick}>
        Go
      </Button>,
    );
    const link = container.querySelector('a')!;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('disables the native button', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Go
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-disabled', '');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders an anchor with href and no type', () => {
    render(
      <Button href="/docs" target="_blank" rel="noopener">
        Docs
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveClass('apui-button');
    expect(link).toHaveAttribute('href', '/docs');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener');
    expect(link).not.toHaveAttribute('type');
    expect(link).toHaveAttribute('data-variant', 'solid');
  });

  it('renders a disabled anchor without href, with aria-disabled and no tabindex', () => {
    const onClick = vi.fn();
    const { container } = render(
      <Button href="/docs" disabled onClick={onClick}>
        Docs
      </Button>,
    );
    const anchor = container.querySelector('a')!;
    expect(anchor).not.toHaveAttribute('href');
    expect(anchor).toHaveAttribute('aria-disabled', 'true');
    expect(anchor).toHaveAttribute('data-disabled', '');
    expect(anchor).not.toHaveAttribute('tabindex');
    expect(anchor).not.toHaveAttribute('disabled');
    fireEvent.click(anchor);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('passes native attributes to the root', () => {
    render(
      <Button aria-label="Close" data-testid="b" name="action" value="close">
        x
      </Button>,
    );
    const button = screen.getByTestId('b');
    expect(button).toHaveAttribute('aria-label', 'Close');
    expect(button).toHaveAttribute('name', 'action');
  });

  it('forwards the ref to the button, or the anchor with href', () => {
    const buttonRef = createRef<HTMLButtonElement | HTMLAnchorElement>();
    const anchorRef = createRef<HTMLButtonElement | HTMLAnchorElement>();
    render(
      <>
        <Button ref={buttonRef}>One</Button>
        <Button ref={anchorRef} href="/two">
          Two
        </Button>
      </>,
    );
    expect(buttonRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(anchorRef.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('renders on the server', () => {
    const html = renderToString(
      <Button leadingIcon="plus" loading>
        Save
      </Button>,
    );
    expect(html).toContain('class="apui-button"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('data-part="spinner"');
  });

  it('renders a loading link without href, with aria-disabled and aria-busy but no data-disabled', () => {
    const { container } = render(
      <Button href="/next" loading>
        Go
      </Button>,
    );
    const anchor = container.querySelector('a')!;
    expect(anchor).not.toHaveAttribute('href');
    expect(anchor).toHaveAttribute('aria-disabled', 'true');
    expect(anchor).toHaveAttribute('aria-busy', 'true');
    expect(anchor).not.toHaveAttribute('data-disabled');
  });

  it('blocks auxiliary clicks on an inactive link and passes them through otherwise', () => {
    const onAuxClick = vi.fn();
    const { container, rerender } = render(
      <Button href="/next" disabled onAuxClick={onAuxClick}>
        Go
      </Button>,
    );
    const middle = () => new MouseEvent('auxclick', { bubbles: true, cancelable: true, button: 1 });
    const blocked = middle();
    container.querySelector('a')!.dispatchEvent(blocked);
    expect(blocked.defaultPrevented).toBe(true);
    expect(onAuxClick).not.toHaveBeenCalled();
    rerender(
      <Button href="/next" onAuxClick={onAuxClick}>
        Go
      </Button>,
    );
    const allowed = middle();
    container.querySelector('a')!.dispatchEvent(allowed);
    expect(allowed.defaultPrevented).toBe(false);
    expect(onAuxClick).toHaveBeenCalledOnce();
  });

  it('does not put button-only attributes on the anchor', () => {
    const { container } = render(
      <Button
        href="/next"
        type="submit"
        name="action"
        value="go"
        form="f"
        formAction="/x"
        formMethod="post"
        formNoValidate
        formTarget="_blank"
        formEncType="text/plain"
      >
        Go
      </Button>,
    );
    const anchor = container.querySelector('a')!;
    for (const attribute of [
      'type',
      'name',
      'value',
      'form',
      'formaction',
      'formmethod',
      'formnovalidate',
      'formtarget',
      'formenctype',
    ]) {
      expect(anchor).not.toHaveAttribute(attribute);
    }
  });

  it.each(['javascript:alert(1)', ' JaVa\tScRiPt:alert(1)', 'vbscript:x', 'data:text/html,x'])(
    'ignores the unsafe href %j and renders a button',
    (href) => {
      const { container } = render(<Button href={href}>Go</Button>);
      expect(container.querySelector('a')).toBeNull();
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    },
  );

  it('keeps safe hrefs', () => {
    render(<Button href="mailto:a@b.co">Mail</Button>);
    expect(screen.getByRole('link')).toHaveAttribute('href', 'mailto:a@b.co');
  });
});
