import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RichTextEditor } from '../../components/form/RichTextEditor/RichTextEditor';

describe('RichTextEditor', () => {
  it('renders with label', () => {
    render(<RichTextEditor label="Content" />);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders contentEditable area', () => {
    render(<RichTextEditor label="Content" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('contenteditable', 'true');
  });

  it('renders toolbar', () => {
    render(
      <RichTextEditor
        label="Content"
        toolbar={<button data-testid="bold-btn">B</button>}
      />,
    );
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
