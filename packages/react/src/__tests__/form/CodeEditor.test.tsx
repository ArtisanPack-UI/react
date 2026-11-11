import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { CodeEditor, type CodeEditorProps } from '../../components/form/CodeEditor/CodeEditor';

const declaredProps: (keyof CodeEditorProps)[] = [
  'language',
  'languages',
  'tabs',
  'tab',
  'diagnostics',
  'tabSize',
  'rows',
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
  'tabsLabel',
  'languageLabel',
  'positionLabel',
  'spacesLabel',
  'errorCountLabel',
  'errorsCountLabel',
  'warningCountLabel',
  'warningsCountLabel',
  'problemsLabel',
  'lineLabel',
  'severityErrorLabel',
  'severityWarningLabel',
  'severityInfoLabel',
  'instructionsLabel',
  'classes',
];
const declaredEvents: (keyof CodeEditorProps)[] = [
  'onValueChange',
  'onTabChange',
  'onLanguageChange',
];

const part = (root: Element, name: string) =>
  root.querySelector(`[data-scope="code-editor"][data-part="${name}"]`);

describe('CodeEditor', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(CodeEditor, 'CodeEditor', {
      declared: { props: declaredProps, events: declaredEvents },
      // Shown only after an action, or only with optional parts.
      ignoreEffects: [
        'languageLabel',
        'errorCountLabel',
        'errorsCountLabel',
        'warningCountLabel',
        'warningsCountLabel',
        'problemsLabel',
        'lineLabel',
        'severityErrorLabel',
        'severityWarningLabel',
        'severityInfoLabel',
      ],
    });
  });

  it('renders the contract anatomy', () => {
    const { container } = render(
      <CodeEditor
        id="code"
        label="Source"
        required
        hint="Two spaces."
        error="Fix it."
        rows={3}
        tabs={['a.ts', 'b.ts']}
        languages={[{ value: 'ts', label: 'TypeScript' }]}
        language="ts"
        diagnostics={[{ line: 2, message: 'Bad type.' }]}
      />,
    );
    const root = container.firstElementChild!;
    expect(root).toHaveClass('apui-code-editor');
    const parts = [
      ...new Set(
        [...root.querySelectorAll('[data-scope="code-editor"]')].map((el) =>
          el.getAttribute('data-part'),
        ),
      ),
    ];
    expect(parts).toEqual([
      'label',
      'required',
      'box',
      'header',
      'tabs',
      'tab',
      'languageSelect',
      'body',
      'gutter',
      'line',
      'control',
      'diagnostics',
      'diagnostic',
      'status',
      'instructions',
      'hint',
      'error',
    ]);
    const control = screen.getByLabelText(/Source/);
    expect(control.tagName).toBe('TEXTAREA');
    expect(control).toHaveAttribute('aria-describedby', 'code-hint code-error code-instructions');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(part(root, 'body')).toHaveAttribute('dir', 'ltr');
    expect(part(root, 'body')).toHaveAttribute('role', 'tabpanel');
    expect(root.querySelectorAll('[data-part="line"]')).toHaveLength(3);
    expect(root.querySelector('[data-part="line"][data-severity="error"]')).toHaveTextContent('2');
    expect(part(root, 'diagnostic')).toHaveTextContent('Line 2');
    expect(part(root, 'status')).toHaveTextContent('1 error');
    expect(part(root, 'status')).toHaveTextContent('TypeScript');
    expect(part(root, 'status')).toHaveTextContent('Spaces: 2');
  });

  it('indents with Tab and reports the value', () => {
    const onValueChange = vi.fn();
    render(<CodeEditor aria-label="Code" defaultValue="" onValueChange={onValueChange} />);
    const control = screen.getByRole('textbox') as HTMLTextAreaElement;
    control.focus();
    fireEvent.keyDown(control, { key: 'Tab' });
    expect(control.value).toBe('  ');
    expect(onValueChange).toHaveBeenLastCalledWith('  ');
  });

  it('grows the gutter with the code and tracks the caret', () => {
    const { container } = render(
      <CodeEditor aria-label="Code" rows={2} defaultValue={'a\nb\nc'} />,
    );
    expect(container.querySelectorAll('[data-part="line"]')).toHaveLength(3);
    const control = screen.getByRole('textbox') as HTMLTextAreaElement;
    control.setSelectionRange(4, 4);
    fireEvent.select(control);
    expect(container.querySelector('[data-part="line"][data-active]')).toHaveTextContent('3');
    expect(part(container, 'status')).toHaveTextContent('Ln 3, Col 1');
  });

  it('selects tabs and languages', () => {
    const onTabChange = vi.fn();
    const onLanguageChange = vi.fn();
    render(
      <CodeEditor
        aria-label="Code"
        tabs={['a', { value: 'b', label: 'B file' }]}
        onTabChange={onTabChange}
        languages={['ts', 'php']}
        language="ts"
        onLanguageChange={onLanguageChange}
      />,
    );
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('tabindex', '-1');
    fireEvent.click(tabs[1]!);
    expect(onTabChange).toHaveBeenCalledWith('b');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(tabs[1]!, { key: 'Home' });
    expect(onTabChange).toHaveBeenLastCalledWith('a');
    fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), {
      target: { value: 'php' },
    });
    expect(onLanguageChange).toHaveBeenCalledWith('php');
  });

  it('translates the built-in strings', () => {
    const { container } = render(
      <CodeEditor
        aria-label="Code"
        tabs={['a']}
        tabsLabel="Files"
        positionLabel="L :line C :column"
      />,
    );
    expect(screen.getByRole('tablist', { name: 'Files' })).toBeInTheDocument();
    expect(part(container, 'status')).toHaveTextContent('L 1 C 1');
    expect(part(container, 'instructions')).toHaveTextContent('press Escape, then Tab');
  });

  it('routes attributes to the textarea and forwards the ref', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const { container } = render(
      <CodeEditor ref={ref} name="css" className="mt-3" readonly disabled aria-label="Code" />,
    );
    expect(ref.current).toHaveAttribute('name', 'css');
    expect(ref.current).toHaveAttribute('readonly');
    expect(ref.current).toBeDisabled();
    expect(container.firstElementChild).toHaveClass('apui-code-editor', 'mt-3');
    expect(container.firstElementChild).toHaveAttribute('data-readonly', '');
  });
});
