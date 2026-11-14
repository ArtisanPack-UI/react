import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Editor } from '../../components/form/Editor/Editor';

describe('Editor (deprecated alias of CodeEditor)', () => {
  it('renders a CodeEditor and warns once', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Editor label="Code" />);
    expect(container.firstElementChild).toHaveClass('apui-code-editor');
    expect(container.querySelector('.fieldset, .textarea, .font-mono')).toBeNull();
    expect(screen.getByRole('textbox', { name: 'Code' })).toBeInTheDocument();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Editor is deprecated; use CodeEditor.'),
    );
    warn.mockRestore();
  });

  it('carries over the hint, error and required', () => {
    render(<Editor label="Code" hint="Enter your code" error="Required" required />);
    const textarea = screen.getByRole('textbox', { name: /Code/ });
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toBeRequired();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('fires the native onChange and forwards the ref to the textarea', () => {
    const onChange = vi.fn();
    const ref = createRef<HTMLTextAreaElement>();
    render(<Editor ref={ref} label="Code" defaultValue="" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox', { name: 'Code' }), { target: { value: 'x' } });
    expect(onChange).toHaveBeenCalledOnce();
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('keeps the native readOnly', () => {
    render(<Editor label="Code" readOnly />);
    expect(screen.getByRole('textbox', { name: 'Code' })).toHaveAttribute('readonly');
  });
});
