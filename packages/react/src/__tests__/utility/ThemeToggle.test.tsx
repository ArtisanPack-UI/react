import { createRef, Suspense, use, useState, useTransition } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { themeScript } from '@artisanpack-ui/behavior';
import { expectReactParity } from '@artisanpack-ui/testing/react';
import {
  ThemeToggle,
  type ThemeToggleProps,
} from '../../components/utility/ThemeToggle/ThemeToggle';
import { ThemeScript } from '../../components/utility/ThemeToggle/ThemeScript';
import { ThemeProvider, useTheme } from '../../hooks/use-theme';

const declaredProps: (keyof ThemeToggleProps)[] = [
  'value',
  'defaultValue',
  'variant',
  'size',
  'choices',
  'iconOnly',
  'label',
  'lightLabel',
  'darkLabel',
  'highContrastLabel',
  'systemLabel',
  'matchSystemLabel',
  'switchToLightLabel',
  'switchToDarkLabel',
  'persist',
  'storageKey',
  'classes',
];

let dark = false;
const listeners = new Set<() => void>();

beforeEach(() => {
  dark = false;
  listeners.clear();
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-theme-choice');
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      get matches() {
        return dark;
      },
      addEventListener: (_: string, listener: () => void) => listeners.add(listener),
      removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

/** Shows a 2.x provider's scheme and sets it from outside the toggle. */
function Probe() {
  const { colorScheme, setColorScheme } = useTheme();
  return (
    <button
      type="button"
      data-testid="probe"
      data-scheme={colorScheme}
      onClick={() => setColorScheme('dark')}
    >
      Set dark
    </button>
  );
}
const scheme = () => screen.getByTestId('probe').getAttribute('data-scheme');

const radios = () => screen.getAllByRole('radio');
const checked = () => radios().find((radio) => radio.getAttribute('aria-checked') === 'true');

describe('ThemeToggle', () => {
  it('matches the design-system manifest', async () => {
    await expectReactParity(ThemeToggle, 'ThemeToggle', {
      declared: { props: declaredProps, events: ['onValueChange'] },
      ignoreEffects: [
        'defaultValue',
        'matchSystemLabel',
        'switchToLightLabel',
        'switchToDarkLabel',
        'storageKey',
      ],
    });
  });

  it('renders a radio group on the segmented tabs track, system checked by default', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<ThemeToggle ref={ref} persist={false} />);
    const root = container.firstElementChild as HTMLElement;
    expect(ref.current).toBe(root);
    expect(root).toHaveClass('apui-theme-toggle', 'apui-tabs');
    expect(root).toHaveAttribute('data-variant', 'segmented');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(screen.getByRole('radiogroup')).toHaveAccessibleName('Theme');
    expect(radios().map((radio) => radio.textContent)).toEqual([
      'Light',
      'Dark',
      'High contrast',
      'System',
    ]);
    expect(checked()).toHaveAttribute('data-value', 'system');
    expect(radios().filter((radio) => radio.tabIndex === 0)).toHaveLength(1);
  });

  it('server-renders the same markup the client starts from', () => {
    const html = renderToStaticMarkup(<ThemeToggle value="dark" choices={['light', 'dark']} />);
    expect(html).toContain('role="radiogroup"');
    expect(html).toContain('aria-checked="true" tabindex="0"');
  });

  it('applies, stores and reports a choice, and checks it when uncontrolled', () => {
    const onValueChange = vi.fn();
    render(<ThemeToggle onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'High contrast' }));
    expect(onValueChange).toHaveBeenCalledWith('high-contrast');
    expect(checked()).toHaveAttribute('data-value', 'high-contrast');
    expect(document.documentElement).toHaveAttribute('data-theme', 'high-contrast');
    expect(localStorage.getItem('apui-theme')).toBe('high-contrast');
  });

  it('shows the stored choice and resolves system against the OS', () => {
    localStorage.setItem('site-theme', 'system');
    dark = true;
    render(<ThemeToggle storageKey="site-theme" />);
    expect(checked()).toHaveAttribute('data-value', 'system');
    fireEvent.click(screen.getByRole('radio', { name: 'System' }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('follows the OS live while it is system', () => {
    render(<ThemeToggle value="system" persist={false} />);
    dark = true;
    act(() => listeners.forEach((listener) => listener()));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('keeps a controlled value until the parent changes it, and skips storage', () => {
    const onValueChange = vi.fn();
    render(<ThemeToggle value="light" persist={false} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(onValueChange).toHaveBeenCalledWith('dark');
    expect(checked()).toHaveAttribute('data-value', 'light');
    expect(localStorage.getItem('apui-theme')).toBeNull();
  });

  it('only reports a controlled pick; the parent accepting it applies it', () => {
    localStorage.setItem('apui-theme', 'high-contrast');
    function Parent({ accept }: { accept: boolean }) {
      const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast' | 'system'>('light');
      return (
        <ThemeProvider defaultColorScheme="light">
          <Probe />
          <ThemeToggle value={theme} onValueChange={(next) => accept && setTheme(next)} />
        </ThemeProvider>
      );
    }
    const { unmount } = render(<Parent accept={false} />);
    // The value it mounts with isn't applied, so the stored choice stays.
    expect(document.documentElement).not.toHaveAttribute('data-theme');
    fireEvent.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(checked()).toHaveAttribute('data-value', 'light');
    expect(document.documentElement).not.toHaveAttribute('data-theme');
    expect(localStorage.getItem('apui-theme')).toBe('high-contrast');
    expect(scheme()).toBe('light');
    unmount();

    render(<Parent accept />);
    fireEvent.click(screen.getByRole('radio', { name: 'Dark' }));
    expect(checked()).toHaveAttribute('data-value', 'dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('apui-theme')).toBe('dark');
    expect(scheme()).toBe('dark');
  });

  it('applies a controlled value the parent changes on its own', () => {
    const { rerender } = render(<ThemeToggle value="light" onValueChange={() => {}} />);
    expect(document.documentElement).not.toHaveAttribute('data-theme');
    rerender(<ThemeToggle value="high-contrast" onValueChange={() => {}} />);
    expect(document.documentElement).toHaveAttribute('data-theme', 'high-contrast');
    expect(localStorage.getItem('apui-theme')).toBe('high-contrast');
  });

  it('starts on the choice ThemeScript applied when nothing is stored', () => {
    // What `themeScript({ defaultValue: 'dark' })` leaves on <html>.
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.setAttribute('data-theme-choice', 'dark');
    render(<ThemeToggle />);
    expect(checked()).toHaveAttribute('data-value', 'dark');
  });

  it('applies its default to a page without a theme, but never over one', () => {
    const { unmount } = render(<ThemeToggle defaultValue="high-contrast" />);
    expect(checked()).toHaveAttribute('data-value', 'high-contrast');
    expect(document.documentElement).toHaveAttribute('data-theme', 'high-contrast');
    expect(localStorage.getItem('apui-theme')).toBeNull();
    unmount();

    document.documentElement.removeAttribute('data-theme-choice');
    document.documentElement.setAttribute('data-theme', 'light');
    render(<ThemeToggle defaultValue="dark" />);
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });

  it("ignores another tab's stored choice when controlled or unpersisted", () => {
    const storageEvent = () =>
      act(() => {
        window.dispatchEvent(new StorageEvent('storage', { key: 'apui-theme', newValue: 'dark' }));
      });
    const { unmount } = render(
      <>
        <ThemeToggle value="light" onValueChange={() => {}} />
        <ThemeToggle defaultValue="light" persist={false} />
      </>,
    );
    const theme = () => document.documentElement.getAttribute('data-theme');
    const before = theme();
    storageEvent();
    expect(
      screen.getAllByRole('radiogroup').map((group) => group.parentElement!.dataset.value),
    ).toEqual(['light', 'light']);
    expect(theme()).toBe(before);
    unmount();

    // A toggle that reads storage follows it, and the page with it.
    render(<ThemeToggle />);
    storageEvent();
    expect(checked()).toHaveAttribute('data-value', 'dark');
    expect(theme()).toBe('dark');
  });

  it('reads only committed values when the OS scheme changes', async () => {
    let release!: () => void;
    const pending = new Promise<void>((resolve) => (release = resolve));
    function Wait({ on }: { on: boolean }) {
      if (on) use(pending);
      return null;
    }
    function Parent() {
      const [theme, setTheme] = useState<'system' | 'dark'>('system');
      const [, startTransition] = useTransition();
      return (
        <>
          <button type="button" onClick={() => startTransition(() => setTheme('dark'))}>
            Pick dark
          </button>
          <ThemeToggle value={theme} persist={false} onValueChange={() => {}} />
          <Suspense fallback={null}>
            <Wait on={theme === 'dark'} />
          </Suspense>
        </>
      );
    }
    render(<Parent />);
    // A transition renders the toggle with `dark`, then suspends without committing it.
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Pick dark' })));
    expect(checked()).toHaveAttribute('data-value', 'system');
    dark = true;
    act(() => listeners.forEach((listener) => listener()));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    await act(async () => release());
  });

  it('moves, checks and focuses with the arrow keys, following the text direction', () => {
    render(<ThemeToggle value="light" onValueChange={() => {}} />);
    const group = screen.getByRole('radiogroup');
    fireEvent.keyDown(group, { key: 'ArrowRight' });
    expect(document.activeElement).toHaveAttribute('data-value', 'dark');
    fireEvent.keyDown(group, { key: 'End' });
    expect(document.activeElement).toHaveAttribute('data-value', 'system');

    // jsdom doesn't inherit direction from dir, so the group computes it itself.
    group.style.direction = 'rtl';
    fireEvent.keyDown(group, { key: 'ArrowLeft' });
    expect(document.activeElement).toHaveAttribute('data-value', 'dark');
  });

  it('keeps the names when only icons show', () => {
    const { container } = render(<ThemeToggle iconOnly size="sm" />);
    expect(container.firstElementChild).toHaveAttribute('data-icon-only', '');
    expect(screen.getByRole('radio', { name: 'High contrast' })).toBeInTheDocument();
    expect(container.querySelectorAll('.apui-sr-only')).toHaveLength(4);
  });

  it('is an icon button that switches light and dark', () => {
    render(<ThemeToggle variant="icon" defaultValue="light" persist={false} />);
    const button = screen.getByRole('button', { name: 'Switch to dark theme' });
    expect(button).toHaveAttribute('data-variant', 'ghost');
    expect(button).toHaveAttribute('data-icon-only', '');
    fireEvent.click(button);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
  });

  it('opens a menu of radio items with system last', async () => {
    const onValueChange = vi.fn();
    render(<ThemeToggle variant="menu" size="sm" value="dark" onValueChange={onValueChange} />);
    const trigger = screen.getByRole('button', { name: 'Theme' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('data-size', 'sm');
    await act(async () => {
      fireEvent.click(trigger);
    });
    const items = screen.getAllByRole('menuitemradio');
    expect(items.map((item) => item.textContent)).toEqual([
      'Light',
      'Dark',
      'High contrast',
      'Match system',
    ]);
    expect(items[1]).toHaveAttribute('aria-checked', 'true');
    expect(items[3].previousElementSibling).toHaveAttribute('data-part', 'separator');
    await act(async () => {
      fireEvent.click(items[2]!);
    });
    expect(onValueChange).toHaveBeenCalledWith('high-contrast');
  });

  it('drives a 2.x ThemeProvider: seeds from it, sets it on a pick, follows it', () => {
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Probe />
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(checked()).toHaveAttribute('data-value', 'dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    fireEvent.click(screen.getByRole('radio', { name: 'System' }));
    expect(scheme()).toBe('system');

    // High contrast is a light theme to a provider that only knows light and dark.
    fireEvent.click(screen.getByRole('radio', { name: 'High contrast' }));
    expect(scheme()).toBe('light');
    expect(checked()).toHaveAttribute('data-value', 'high-contrast');

    fireEvent.click(screen.getByTestId('probe'));
    expect(checked()).toHaveAttribute('data-value', 'dark');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(localStorage.getItem('apui-theme')).toBe('dark');
  });

  it('pushes a stored choice into the provider', () => {
    localStorage.setItem('apui-theme', 'light');
    render(
      <ThemeProvider defaultColorScheme="dark">
        <Probe />
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(checked()).toHaveAttribute('data-value', 'light');
    expect(scheme()).toBe('light');
  });

  it('works without a provider', () => {
    expect(() => render(<ThemeToggle variant="icon" />)).not.toThrow();
  });

  it('takes translated labels', () => {
    render(<ThemeToggle label="Tema" lightLabel="Claro" systemLabel="Sistema" />);
    expect(screen.getByRole('radiogroup')).toHaveAccessibleName('Tema');
    expect(screen.getByRole('radio', { name: 'Claro' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Sistema' })).toBeInTheDocument();
  });
});

describe('ThemeScript', () => {
  it('renders the blocking head snippet', () => {
    const html = renderToStaticMarkup(
      <ThemeScript storageKey="site-theme" defaultValue="dark" nonce="abc" />,
    );
    expect(html).toBe(
      `<script nonce="abc">${themeScript({ storageKey: 'site-theme', defaultValue: 'dark' })}</script>`,
    );
  });

  it('applies the stored choice on mount when client-rendered and nothing set data-theme', () => {
    localStorage.setItem('site-theme', 'high-contrast');
    render(<ThemeScript storageKey="site-theme" />);
    expect(document.documentElement).toHaveAttribute('data-theme', 'high-contrast');
  });

  it('falls back to the default choice when nothing is stored', () => {
    dark = true;
    render(<ThemeScript defaultValue="system" />);
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('hands its default to the toggles when client-rendered', () => {
    render(
      <>
        <ThemeScript defaultValue="dark" />
        <ThemeToggle />
      </>,
    );
    expect(document.documentElement).toHaveAttribute('data-theme-choice', 'dark');
    expect(checked()).toHaveAttribute('data-value', 'dark');
  });

  it('never overrides a data-theme the head script already set', () => {
    localStorage.setItem('apui-theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'light');
    render(<ThemeScript />);
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });
});
