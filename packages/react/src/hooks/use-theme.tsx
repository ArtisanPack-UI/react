/**
 * @module use-theme
 *
 * Provides a React context and hook for managing application color
 * scheme (light, dark, or system). The {@link ThemeProvider} tracks the
 * operating system's color scheme preference in real time using
 * `useSyncExternalStore` and exposes both the raw preference and the
 * resolved value through {@link useTheme}.
 *
 * @packageDocumentation
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

/**
 * Supported color scheme modes.
 *
 * - `'light'` -- Force light mode.
 * - `'dark'` -- Force dark mode.
 * - `'system'` -- Follow the operating system preference.
 */
export type ColorScheme = 'light' | 'dark' | 'system';

/**
 * Values exposed by the theme context via {@link useTheme}.
 */
export interface ThemeContextValue {
  /** The current user-selected color scheme preference (`'light'`, `'dark'`, or `'system'`). */
  colorScheme: ColorScheme;
  /** The resolved mode after evaluating a `'system'` preference against the OS setting. Always `'light'` or `'dark'`. */
  resolvedColorScheme: 'light' | 'dark';
  /** Update the color scheme preference. Accepts `'light'`, `'dark'`, or `'system'`. */
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Reads the current OS-level color scheme preference.
 * Returns `'light'` on the server (SSR) or when `window` is unavailable.
 */
function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Props for the {@link ThemeProvider} component.
 */
interface ThemeProviderProps {
  /** Initial color scheme preference. Defaults to `'system'`. */
  defaultColorScheme?: ColorScheme;
  /** Child elements that will have access to the theme context. */
  children: ReactNode;
}

/**
 * Provides theme context to the component tree.
 *
 * Tracks the operating system's `prefers-color-scheme` media query in
 * real time and allows manual override via {@link useTheme}'s
 * `setColorScheme` method.
 *
 * @example
 * ```tsx
 * <ThemeProvider defaultColorScheme="system">
 *   <App />
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({ defaultColorScheme = 'system', children }: ThemeProviderProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme);

  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof window === 'undefined') return () => {};
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => onStoreChange();
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const getSnapshot = useCallback(() => getSystemPreference(), []);
  const getServerSnapshot = useCallback((): 'light' | 'dark' => 'light', []);

  const systemPreference = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const resolvedColorScheme = colorScheme === 'system' ? systemPreference : colorScheme;

  const value = useMemo<ThemeContextValue>(
    () => ({
      colorScheme,
      resolvedColorScheme,
      setColorScheme,
    }),
    [colorScheme, resolvedColorScheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Hook that returns the current theme context value.
 *
 * Provides the raw `colorScheme` preference, the `resolvedColorScheme`
 * (always `'light'` or `'dark'`), and a `setColorScheme` setter.
 *
 * Must be called within a {@link ThemeProvider}.
 *
 * @returns The current {@link ThemeContextValue}.
 *
 * @throws Error if called outside a `ThemeProvider`.
 *
 * @example
 * ```tsx
 * function Header() {
 *   const { resolvedColorScheme, setColorScheme } = useTheme();
 *
 *   return (
 *     <header data-theme={resolvedColorScheme}>
 *       <button onClick={() => setColorScheme('dark')}>Dark</button>
 *     </header>
 *   );
 * }
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
