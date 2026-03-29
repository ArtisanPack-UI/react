import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Code } from '../../components/data/Code/Code';

describe('Code', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders code content', () => {
    render(<Code code="const x = 1;" />);
    expect(screen.getByText('const x = 1;')).toBeInTheDocument();
  });

  it('renders language label', () => {
    render(<Code code="const x = 1;" language="javascript" />);
    expect(screen.getByText('javascript')).toBeInTheDocument();
  });

  it('renders custom label', () => {
    render(<Code code="const x = 1;" label="Example" />);
    expect(screen.getByText('Example')).toBeInTheDocument();
  });

  it('renders line numbers when enabled', () => {
    render(<Code code={'line 1\nline 2\nline 3'} showLineNumbers />);
    expect(screen.getByText('line 1')).toBeInTheDocument();
    expect(screen.getByText('line 2')).toBeInTheDocument();
    expect(screen.getByText('line 3')).toBeInTheDocument();
  });

  it('renders copy button by default', () => {
    render(<Code code="test" language="js" />);
    expect(screen.getByLabelText('Copy code')).toBeInTheDocument();
  });

  it('hides copy button when copyable is false', () => {
    render(<Code code="test" language="js" copyable={false} />);
    expect(screen.queryByLabelText('Copy code')).not.toBeInTheDocument();
  });

  it('copies code to clipboard', async () => {
    render(<Code code="hello world" language="js" />);
    fireEvent.click(screen.getByLabelText('Copy code'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hello world');
  });

  it('renders hint text', () => {
    render(<Code code="test" hint="This is a hint" />);
    expect(screen.getByText('This is a hint')).toBeInTheDocument();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Code ref={ref} code="test" />);
    expect(ref).toHaveBeenCalled();
  });
});
