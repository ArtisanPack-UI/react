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
      declared: { props: declaredProps, events: ['onCopy', 'onError'] },
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
    const onCopy = vi.fn();
    const { container } = render(<Clipboard value={URL} timeout={1000} onCopy={onCopy} />);
    await act(async () => {
      fireEvent.click(screen.getByRole('button'));
    });
    expect(writeText).toHaveBeenCalledWith(URL);
    expect(onCopy).toHaveBeenCalledWith(URL);
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
