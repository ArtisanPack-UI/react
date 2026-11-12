import { createRef, useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderMarkdown } from '@artisanpack-ui/behavior';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Markdown, type MarkdownProps } from '../../components/utility/Markdown/Markdown';

const declaredProps: (keyof MarkdownProps)[] = [
  'source',
  'mode',
  'sanitize',
  'tabsLabel',
  'writeLabel',
  'previewLabel',
  'splitLabel',
  'editorLabel',
  'outputLabel',
  'classes',
];

const SOURCE = `## Viewing checklist

Bring **photo ID** and proof of income.

- [x] Confirm time with agent
- [ ] Measure the living room

> Viewings run 30 minutes.

| Unit | Rent |
|---|---:|
| 2B | $1,400 |
`;

/** The HTML as the DOM serializes it, so `<br />` compares with `<br>`. */
const serialized = (html: string) => {
  const host = document.createElement('div');
  host.innerHTML = html;
  return host.innerHTML;
};

describe('Markdown', () => {
  it('matches the design-system manifest', async () => {
    // sanitize only changes raw HTML, which the fixture source has none of.
    await expectReactParity(Markdown, 'Markdown', {
      declared: { props: declaredProps, events: ['onSourceChange'] },
      ignoreEffects: ['sanitize'],
    });
  });

  it('renders the shared HTML in the prose root', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Markdown ref={ref} source={SOURCE} className="extra" />);
    const root = container.firstElementChild as HTMLElement;
    expect(ref.current).toBe(root);
    expect(root.className).toBe('apui-markdown apui-prose extra');
    expect(root.getAttribute('data-mode')).toBe('preview');
    expect(root.innerHTML).toBe(serialized(renderMarkdown(SOURCE)));
    expect(root.querySelector('h2')!.textContent).toBe('Viewing checklist');
    expect(root.querySelector('th[data-align="end"]')!.textContent).toBe('Rent');
  });

  it('renders task items as disabled, labelled checkboxes', () => {
    render(<Markdown source={SOURCE} />);
    const done = screen.getByRole('checkbox', { name: 'Confirm time with agent' });
    expect(done).toBeDisabled();
    expect(done).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Measure the living room' })).not.toBeChecked();
    expect(done.closest('li')!.getAttribute('data-part')).toBe('task');
  });

  it('escapes raw HTML and drops unsafe URLs, and filters it with sanitize off', () => {
    const source = '<b onclick="x()">b</b> <script>alert(1)</script> [x](javascript:alert(1))';
    const { container: safe } = render(<Markdown source={source} />);
    expect(safe.querySelector('b, script, a')).toBeNull();
    expect(safe.textContent).toContain('<b onclick="x()">b</b>');
    const { container: raw } = render(<Markdown source={source} sanitize={false} />);
    const bold = raw.querySelector('b')!;
    expect(bold.attributes).toHaveLength(0);
    expect(raw.querySelector('script, a')).toBeNull();
  });

  it('opens split mode on the split tab with one Textarea beside the preview', () => {
    const { container } = render(<Markdown source={SOURCE} mode="split" />);
    const root = container.firstElementChild!;
    expect(root.className).toBe('apui-markdown');
    expect(root.getAttribute('data-mode')).toBe('split');
    expect(screen.getByRole('tablist', { name: 'Markdown mode' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Split' })).toHaveAttribute('aria-selected', 'true');
    expect(container.querySelectorAll('textarea')).toHaveLength(1);
    const split = root.querySelector('[data-scope="markdown"][data-part="split"]')!;
    expect(split.querySelector('[data-part="editor"] textarea')).toHaveValue(SOURCE);
    const preview = screen.getByRole('region', { name: 'Rendered preview' });
    expect(preview.className).toBe('apui-prose');
    expect(preview.querySelector('h2')).not.toBeNull();
    expect(screen.getByRole('textbox', { name: 'Markdown source' })).toBeInTheDocument();
  });

  it('switches tabs and keeps the draft', async () => {
    render(<Markdown source="# One" mode="write" />);
    const textarea = screen.getByRole('textbox', { name: 'Markdown source' });
    fireEvent.change(textarea, { target: { value: '# Two' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('tab', { name: 'Preview' }));
    });
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(screen.getByRole('region', { name: 'Rendered preview' }).innerHTML).toBe(
      '<h1>Two</h1>\n',
    );
  });

  it('reports edits with onSourceChange and follows a controlled source', () => {
    const onSourceChange = vi.fn();
    function Controlled() {
      const [source, setSource] = useState('a');
      return (
        <Markdown
          source={source}
          mode="split"
          onSourceChange={(next) => {
            onSourceChange(next);
            setSource(next.toUpperCase());
          }}
        />
      );
    }
    render(<Controlled />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'b' } });
    expect(onSourceChange).toHaveBeenCalledWith('b');
    expect(screen.getByRole('textbox')).toHaveValue('B');
    expect(screen.getByRole('region').innerHTML).toBe('<p>B</p>\n');
  });

  it('takes translated labels and per-part classes', () => {
    const { container } = render(
      <Markdown
        source="x"
        mode="split"
        tabsLabel="Modo"
        writeLabel="Escribir"
        previewLabel="Vista previa"
        splitLabel="Dividir"
        editorLabel="Fuente"
        outputLabel="Vista"
        classes={{ root: 'r', editor: 'e', preview: 'p', split: 's' }}
      />,
    );
    expect(screen.getByRole('tablist', { name: 'Modo' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Escribir',
      'Vista previa',
      'Dividir',
    ]);
    expect(screen.getByRole('textbox', { name: 'Fuente' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Vista' }).className).toBe('apui-prose p');
    expect(container.firstElementChild!.className).toBe('apui-markdown r');
    expect(container.querySelector('[data-part="editor"]')!.className).toBe('e');
    expect(container.querySelector('[data-part="split"]')!.className).toBe('s');
  });

  it('renders nothing inside for an empty source', () => {
    const { container } = render(<Markdown />);
    expect(container.firstElementChild!.innerHTML).toBe('');
  });
});
