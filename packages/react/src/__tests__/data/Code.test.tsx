import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Code, type CodeProps } from '../../components/data/Code/Code';

const declaredProps: (keyof CodeProps)[] = [
  'code',
  'language',
  'fileName',
  'numbered',
  'highlight',
  'inline',
  'copyable',
  'label',
  'copyLabel',
  'copiedLabel',
  'copiedMessage',
  'errorMessage',
  'classes',
];

const SNIPPET = 'const a = 1;\n\n  return a;\n';

describe('Code', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('matches the design-system manifest', async () => {
    // The copied and error strings only show after a click.
    await expectReactParity(Code, 'Code', {
      declared: { props: declaredProps, events: [] },
      ignoreEffects: ['copiedLabel', 'copiedMessage', 'errorMessage'],
    });
  });

  it('renders the header, a labeled LTR region and one span per line', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(
      <Code
        ref={ref}
        code={SNIPPET}
        fileName="a.ts"
        language="TypeScript"
        numbered
        highlight={[3]}
      />,
    );
    const root = container.firstElementChild!;
    expect(ref.current).toBe(root);
    expect(root.className).toBe('apui-code');
    expect(root.hasAttribute('data-numbered')).toBe(true);
    const header = root.querySelector('[data-part="header"]')!;
    expect(header.querySelector('[data-part="file"]')).toHaveTextContent('a.ts');
    const badge = header.querySelector('[data-part="language"]')!;
    expect(badge.className).toBe('apui-badge');
    expect(badge.getAttribute('data-variant')).toBe('outline');
    const copy = header.querySelector('button[data-part="copy"]')!;
    expect(copy.getAttribute('data-size')).toBe('xs');
    expect(copy).toHaveTextContent('Copy');
    const pre = screen.getByRole('region', { name: 'a.ts' });
    expect(pre.tagName).toBe('PRE');
    expect(pre.getAttribute('tabindex')).toBe('0');
    const lines = [...pre.querySelectorAll('[data-part="line"]')];
    expect(lines.map((line) => line.textContent)).toEqual(['const a = 1;', '', '  return a;']);
    expect(lines.map((line) => line.getAttribute('data-n'))).toEqual(['1', '2', '3']);
    expect(lines.map((line) => line.hasAttribute('data-highlight'))).toEqual([false, false, true]);
    // Newlines separate the lines, empty ones included, so the pre reads line by line.
    expect(pre.textContent).toBe('const a = 1;\n\n  return a;');
  });

  it('copies the code without line numbers and announces it', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    render(
      <Code
        code={SNIPPET}
        numbered
        copiedLabel="Copiado"
        copiedMessage="Copiado al portapapeles"
      />,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    // The exact source, its final newline included.
    expect(writeText).toHaveBeenCalledWith(SNIPPET);
    expect(screen.getByRole('button')).toHaveTextContent('Copiado');
    expect(screen.getByRole('button').getAttribute('data-state')).toBe('copied');
    expect(screen.getByRole('status')).toHaveTextContent('Copiado al portapapeles');
  });

  it('clears a stale "Copied" when the code changes, even mid-copy', async () => {
    let release: () => void = () => {};
    const writeText = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockReturnValueOnce(new Promise<void>((resolve) => (release = resolve)));
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    const { rerender } = render(<Code code="a" />);
    const button = () => screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button());
    });
    expect(button().getAttribute('data-state')).toBe('copied');
    rerender(<Code code="b" />);
    expect(button().getAttribute('data-state')).toBe('idle');
    expect(button()).toHaveTextContent('Copy');

    await act(async () => {
      fireEvent.click(button());
    });
    rerender(<Code code="c" />);
    await act(async () => {
      release();
    });
    expect(button().getAttribute('data-state')).toBe('idle');
  });

  it('names the region by label, file name, language, then "Code"', () => {
    const name = (props: CodeProps) => {
      const { container, unmount } = render(<Code code="x" {...props} />);
      const value = container.querySelector('pre')!.getAttribute('aria-label');
      unmount();
      return value;
    };
    expect(name({ label: 'Example', fileName: 'a.ts' })).toBe('Example');
    expect(name({ language: 'Shell' })).toBe('Shell');
    expect(name({})).toBe('Code');
  });

  it('leaves the header out when there is nothing to show', () => {
    const { container } = render(<Code code="x" copyable={false} />);
    expect(container.querySelector('[data-part="header"]')).toBeNull();
    expect(container.querySelector('[data-part="status"]')).toBeNull();
  });

  it('renders inline code as a code element', () => {
    const { container } = render(<Code inline code='data-theme="dark"' />);
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('CODE');
    expect(root.className).toBe('apui-code');
    expect(root.hasAttribute('data-inline')).toBe(true);
    expect(root.textContent).toBe('data-theme="dark"');
  });
});
