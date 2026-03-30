import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';

/** Supported color scheme modes */
export type ColorScheme = 'light' | 'dark' | 'system';

/** Values exposed by the theme context */
export interface ThemeContextValue {
  /** The current color scheme preference */
  colorScheme: ColorScheme;
  /** The resolved mode after evaluating 'system' preference */
  resolvedColorScheme: 'light' | 'dark';
  /** Update the color scheme preference */
  setColorScheme: (scheme: ColorScheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

interface ThemeProviderProps {
  /** Initial color scheme preference (defaults to 'system') */
  defaultColorScheme?: ColorScheme;
  children: ReactNode;
}

/**
 * Provides theme context to the component tree.
 * Tracks system color scheme preference and allows manual override.
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
 * Access the current theme context.
 * Must be used within a ThemeProvider.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
