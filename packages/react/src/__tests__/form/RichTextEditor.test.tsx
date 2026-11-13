import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  RichTextEditor,
  type RichTextEditorProps,
} from '../../components/form/RichTextEditor/RichTextEditor';

const declaredProps: (keyof RichTextEditorProps)[] = [
  'toolbar',
  'output',
  'maxLength',
  'counter',
  'label',
  'hint',
  'error',
  'invalid',
  'disabled',
  'readonly',
  'required',
  'placeholder',
  'value',
  'defaultValue',
  'toolbarLabel',
  'boldLabel',
  'italicLabel',
  'underlineLabel',
  'strikeLabel',
  'heading2Label',
  'heading3Label',
  'bulletListLabel',
  'orderedListLabel',
  'quoteLabel',
  'codeLabel',
  'linkLabel',
  'imageLabel',
  'undoLabel',
  'redoLabel',
  'linkPromptLabel',
  'imagePromptLabel',
  'imageAltPromptLabel',
  'shortcutsLabel',
  'wordLabel',
  'wordsLabel',
  'characterLabel',
  'charactersLabel',
  'limitLabel',
  'classes',
];
const declaredEvents: (keyof RichTextEditorProps)[] = ['onValueChange'];

const part = (root: Element, name: string) =>
  root.querySelector(`[data-scope="rich-text-editor"][data-part="${name}"]`);

describe('RichTextEditor', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(RichTextEditor, 'RichTextEditor', {
      declared: { props: declaredProps, events: declaredEvents },
      // Shown only after an action, or only with optional parts.
      ignoreEffects: [
        'linkPromptLabel',
        'imagePromptLabel',
        'imageAltPromptLabel',
        'shortcutsLabel',
        'wordLabel',
        'wordsLabel',
        'characterLabel',
        'charactersLabel',
        'limitLabel',
      ],
    });
  });

  it('renders the contract anatomy', () => {
    const { container } = render(
      <RichTextEditor
        label="Description"
        required
        hint="Shown on the listing."
        error="Too short."
        counter
        placeholder="Write…"
      />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-rich-text-editor');
    expect(root).toHaveAttribute('data-output', 'html');
    expect(root).toHaveAttribute('data-invalid', '');
    const parts = [
      ...new Set(
        [...root.querySelectorAll('[data-scope="rich-text-editor"]')].map((el) =>
          el.getAttribute('data-part'),
        ),
      ),
    ];
    expect(parts).toEqual([
      'label',
      'required',
      'box',
      'toolbar',
      'button',
      'divider',
      'content',
      'placeholder',
      'footer',
      'count',
      'hint',
      'error',
    ]);
    const content = screen.getByRole('textbox', { name: 'Description' });
    expect(content).toHaveAttribute('aria-multiline', 'true');
    expect(content).toHaveAttribute('aria-invalid', 'true');
    expect(content).toHaveAttribute('aria-required', 'true');
    expect(content).toHaveAttribute('contenteditable', 'true');
    expect(screen.getByRole('toolbar', { name: 'Formatting' })).toBeInTheDocument();
    expect(part(root, 'count')).toHaveTextContent('0 words · 0 characters');
    expect(part(root, 'placeholder')).not.toHaveAttribute('hidden');
  });

  it('renders the toolbar with one tab stop and toggles with aria-pressed', () => {
    const { container } = render(<RichTextEditor aria-label="Body" />);
    const buttons = [...container.querySelectorAll('[data-part="button"]')];
    expect(buttons.map((b) => b.getAttribute('data-command'))).toEqual([
      'bold',
      'italic',
      'underline',
      'strike',
      'heading2',
      'heading3',
      'bulletList',
      'orderedList',
      'quote',
      'code',
      'link',
      'image',
      'undo',
      'redo',
    ]);
    expect(buttons.filter((b) => b.getAttribute('tabindex') === '0')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Undo' })).not.toHaveAttribute('aria-pressed');
  });

  it('follows presets, lists and the output', () => {
    const { container, rerender } = render(<RichTextEditor toolbar="compact" />);
    expect(container.querySelectorAll('[data-part="button"]')).toHaveLength(4);
    rerender(<RichTextEditor toolbar={['bold', 'underline']} output="markdown" />);
    expect(container.querySelectorAll('[data-part="button"]')).toHaveLength(1);
    expect(container.firstElementChild).toHaveAttribute('data-output', 'markdown');
  });

  it('shows the value sanitized and reads Markdown', () => {
    const { container, rerender } = render(
      <RichTextEditor value={'<p onclick="x()">Hi <b>there</b><script>alert(1)</script></p>'} />,
    );
    expect(part(container, 'content')!.innerHTML).toBe('<p>Hi <strong>there</strong></p>');
    rerender(<RichTextEditor output="markdown" value={'## Title\n\n- **one**'} />);
    expect(part(container, 'content')!.innerHTML).toBe(
      '<h2>Title</h2><ul><li><strong>one</strong></li></ul>',
    );
  });

  it('reports edits in the output format', () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <RichTextEditor output="markdown" onValueChange={onValueChange} />,
    );
    const content = part(container, 'content') as HTMLElement;
    content.innerHTML = '<p>Hello <strong>world</strong></p>';
    fireEvent.input(content);
    expect(onValueChange).toHaveBeenLastCalledWith('Hello **world**');
  });

  it('stops editing when disabled or read-only', () => {
    const { container, rerender } = render(<RichTextEditor disabled aria-label="Body" />);
    expect(part(container, 'content')).toHaveAttribute('contenteditable', 'false');
    for (const button of container.querySelectorAll('[data-part="button"]')) {
      expect(button).toBeDisabled();
    }
    rerender(<RichTextEditor readonly aria-label="Body" />);
    expect(part(container, 'content')).toHaveAttribute('aria-readonly', 'true');
    expect(container.firstElementChild).toHaveAttribute('data-readonly', '');
  });

  it('translates the built-in strings and keeps name on the hidden input', () => {
    const { container } = render(
      <RichTextEditor name="body" defaultValue="<p>Hi</p>" boldLabel="Strong" />,
    );
    expect(screen.getByRole('button', { name: 'Strong' })).toBeInTheDocument();
    const hidden = container.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden.name).toBe('body');
    expect(hidden.value).toBe('<p>Hi</p>');
  });

  it('runs Mod+K with the current props, not the first render', () => {
    const prompt = vi.spyOn(window, 'prompt').mockReturnValue(null);
    const { container, rerender } = render(<RichTextEditor aria-label="Body" />);
    rerender(<RichTextEditor aria-label="Body" readonly />);
    fireEvent.keyDown(part(container, 'content')!, { key: 'k', ctrlKey: true });
    expect(prompt).not.toHaveBeenCalled();
    rerender(<RichTextEditor aria-label="Body" />);
    fireEvent.keyDown(part(container, 'content')!, { key: 'k', ctrlKey: true });
    expect(prompt).toHaveBeenCalledTimes(1);
    prompt.mockRestore();
  });

  it('forwards the ref to the root', () => {
    const ref = createRef<HTMLDivElement>();
    render(<RichTextEditor ref={ref} />);
    expect(ref.current).toHaveClass('apui-rich-text-editor');
  });
});
