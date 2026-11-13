import { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import { Clipboard, type ClipboardProps } from '../../components/utility/Clipboard/Clipboard';

const declaredProps: (keyof ClipboardProps)[] = [
  'value',
  'timeout',
  'variant',
  'size',
  'label',
  'copiedLabel',
  'copiedMessage',
  'errorMessage',
  'classes',
];

const URL = 'https://horizonhomes.com/l/grove-greenfield';

describe('Clipboard', () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('matches the design-system manifest', async () => {
    // The timeout and the copied and error strings only show after a click.
    await expectReactParity(Clipboard, 'Clipboard', {
      declared: { props: declaredProps, events: ['onCopied', 'onError'] },
      ignoreEffects: ['timeout', 'copiedLabel', 'copiedMessage', 'errorMessage'],
    });
  });

  it('renders an outline copy button with an empty live region', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(<Clipboard ref={ref} value={URL} />);
    const root = container.firstElementChild!;
    expect(ref.current).toBe(root);
    expect(root.tagName).toBe('SPAN');
    expect(root.className).toBe('apui-clipboard');
    expect(root.getAttribute('data-variant')).toBe('button');
    expect(root.getAttribute('data-size')).toBe('sm');
    expect(root.getAttribute('data-state')).toBe('idle');
    const button = screen.getByRole('button', { name: 'Copy' });
    expect(button.className).toBe('apui-button');
    expect(button.getAttribute('data-variant')).toBe('outline');
    expect(button.getAttribute('data-color')).toBe('neutral');
    expect(button.querySelector('[data-scope="button"][data-part="icon"] > svg')).not.toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it('copies, says Copied, announces it and goes back after the timeout', async () => {
    vi.useFakeTimers();
    const onCopied = vi.fn();
    const { container } = render(<Clipboard value={URL} timeout={1000} onCopied={onCopied} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(writeText).toHaveBeenCalledWith(URL);
    expect(onCopied).toHaveBeenCalledWith(URL);
    const root = container.firstElementChild!;
    expect(root.getAttribute('data-state')).toBe('copied');
    expect(screen.getByRole('button')).toHaveTextContent('Copied');
    expect(screen.getByRole('status')).toHaveTextContent('Copied to clipboard');
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(root.getAttribute('data-state')).toBe('idle');
    expect(screen.getByRole('button')).toHaveTextContent('Copy');
  });

  it('keeps the deprecated onCopy, which never sees a native copy event', async () => {
    const onCopy = vi.fn();
    const { container } = render(<Clipboard value={URL} variant="field" onCopy={onCopy} />);
    fireEvent.copy(container.querySelector('[data-part="value"]')!);
    expect(onCopy).not.toHaveBeenCalled();
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(onCopy).toHaveBeenCalledWith(URL);
  });

  it('clears a stale "Copied" when the value changes, even mid-copy', async () => {
    let release: () => void = () => {};
    writeText
      .mockResolvedValueOnce(undefined)
      .mockReturnValueOnce(new Promise<void>((resolve) => (release = resolve)));
    const onCopied = vi.fn();
    const { container, rerender } = render(<Clipboard value="A" onCopied={onCopied} />);
    const root = container.firstElementChild!;
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(root.getAttribute('data-state')).toBe('copied');
    rerender(<Clipboard value="B" onCopied={onCopied} />);
    expect(root.getAttribute('data-state')).toBe('idle');
    expect(screen.getByRole('button')).toHaveTextContent('Copy');

    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    rerender(<Clipboard value="C" onCopied={onCopied} />);
    await act(async () => {
      release();
    });
    expect(root.getAttribute('data-state')).toBe('idle');
    expect(onCopied).toHaveBeenCalledTimes(1);
  });

  it('still copies the deprecated 2.x text prop, with value winning', async () => {
    const onCopy = vi.fn();
    const { container, rerender } = render(
      <Clipboard text={URL} variant="field" onCopy={onCopy} />,
    );
    expect(container.firstElementChild!.hasAttribute('text')).toBe(false);
    expect(container.querySelector('[data-part="value"]')).toHaveTextContent(URL);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(writeText).toHaveBeenCalledWith(URL);
    expect(onCopy).toHaveBeenCalledWith(URL);
    rerender(<Clipboard text="old" value="new" />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(writeText).toHaveBeenLastCalledWith('new');
  });

  it('announces a failure instead of copying silently', async () => {
    writeText.mockRejectedValue(new Error('denied'));
    (document as unknown as { execCommand: unknown }).execCommand = () => false;
    const onError = vi.fn();
    const { container } = render(
      <Clipboard value={URL} errorMessage="No se pudo copiar." onError={onError} />,
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(onError).toHaveBeenCalled();
    expect(container.firstElementChild!.getAttribute('data-state')).toBe('failed');
    expect(screen.getByRole('status')).toHaveTextContent('No se pudo copiar.');
    expect(screen.getByRole('button')).toHaveTextContent('Copy');
  });

  it('shows and selects the value after a failure, so the button and icon variants can copy by hand', async () => {
    (document as unknown as { execCommand: unknown }).execCommand = () => false;
    for (const variant of ['button', 'icon'] as const) {
      writeText.mockRejectedValueOnce(new Error('denied'));
      const { container, rerender, unmount } = render(
        <Clipboard value="LST-4127" variant={variant} label="Copy reference" />,
      );
      expect(container.querySelector('[data-part="field"]')).toBeNull();
      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });
      const value = container.querySelector('[data-part="field"] > [data-part="value"]');
      expect(value).toHaveTextContent('LST-4127');
      expect(window.getSelection()?.toString()).toBe('LST-4127');
      // A copy that works hides it again; so does a new value.
      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });
      expect(container.querySelector('[data-part="field"]')).toBeNull();
      writeText.mockRejectedValueOnce(new Error('denied'));
      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });
      expect(container.querySelector('[data-part="field"]')).not.toBeNull();
      rerender(<Clipboard value="LST-9" variant={variant} label="Copy reference" />);
      expect(container.querySelector('[data-part="field"]')).toBeNull();
      unmount();
    }
  });

  it('names the icon button and shows its confirmation as the tooltip', async () => {
    render(<Clipboard value="LST-4127" variant="icon" label="Copy reference" copiedLabel="Done" />);
    const button = screen.getByRole('button', { name: 'Copy reference' });
    expect(button.getAttribute('data-variant')).toBe('ghost');
    expect(button.hasAttribute('data-icon-only')).toBe(true);
    expect(button.querySelector('[data-part="label"]')).toBeNull();
    await act(async () => {
      fireEvent.click(button);
    });
    expect(button).toHaveAccessibleName('Done');
    expect(screen.getByRole('status').querySelector('svg')).not.toBeNull();
  });

  it('shows the value in a field joined to the button', () => {
    const { container } = render(<Clipboard value={URL} variant="field" size="md" />);
    const root = container.firstElementChild!;
    expect(root.tagName).toBe('DIV');
    expect(root.getAttribute('data-size')).toBe('md');
    expect(root.querySelector('[data-part="field"] > [data-part="value"]')).toHaveTextContent(URL);
    expect(screen.getByRole('button').getAttribute('data-size')).toBe('md');
  });
});
