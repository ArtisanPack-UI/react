import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RichTextEditor } from '../../components/form/RichTextEditor/RichTextEditor';

describe('RichTextEditor', () => {
  it('renders with label', () => {
    render(<RichTextEditor label="Content" />);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('does not wrap the editor in a fieldset/legend', () => {
    const { container } = render(<RichTextEditor label="Content" />);
    expect(container.querySelector('fieldset')).not.toBeInTheDocument();
    expect(container.querySelector('legend')).not.toBeInTheDocument();
  });

  it('associates the visible label with the contenteditable region via aria-labelledby', () => {
    render(<RichTextEditor id="content-editor" label="Content" />);
    const editor = screen.getByLabelText('Content');
    expect(editor).toHaveAttribute('id', 'content-editor');
    expect(editor).toHaveAttribute('aria-labelledby', 'content-editor-label');
  });

  it('renders contentEditable area', () => {
    render(<RichTextEditor label="Content" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('contenteditable', 'true');
  });

  it('renders toolbar', () => {
    render(<RichTextEditor label="Content" toolbar={<button data-testid="bold-btn">B</button>} />);
    expect(screen.getByTestId('bold-btn')).toBeInTheDocument();
  });

  it('renders error', () => {
    render(<RichTextEditor label="Content" error="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders hint', () => {
    render(<RichTextEditor label="Content" hint="Write something" />);
    expect(screen.getByText('Write something')).toBeInTheDocument();
  });

  it('renders initial value', () => {
    render(<RichTextEditor label="Content" value="<p>Hello</p>" />);
    expect(screen.getByRole('textbox')).toHaveTextContent('Hello');
  });

  it('sets aria-multiline', () => {
    render(<RichTextEditor label="Content" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-multiline', 'true');
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<RichTextEditor ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });
});
