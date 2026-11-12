/**
 * @module ThemeScript
 *
 * The blocking head snippet for {@link ThemeToggle} (#65): applies the stored
 * theme choice to `<html data-theme>` before first paint, so the page never
 * flashes the wrong theme. The same bytes as Livewire's `@apuiThemeScript`.
 *
 * An inline script only runs when the browser parses it from HTML, so this
 * works in server-rendered `<head>`s (Next.js, Remix, Astro). React inserts
 * client-rendered scripts without running them, so in a single-page app the
 * component falls back to applying the stored choice once on mount, and only
 * while `<html>` has no `data-theme` yet (it never overrides the head
 * script). That fallback runs after the first paint: for no flash in an SPA,
 * inline `themeScript()`'s output in index.html's `<head>` instead.
 *
 * @packageDocumentation
 */

import {
  applyTheme,
  readThemeChoice,
  THEME_ATTRIBUTE,
  themeScript,
  toThemeChoice,
  type ThemeChoice,
} from '@artisanpack-ui/behavior';
import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Props for the {@link ThemeScript} component. */
export interface ThemeScriptProps {
  /** The localStorage key; the same one the toggles use. @defaultValue `'apui-theme'` */
  storageKey?: string;
  /** The choice without a stored one. @defaultValue `'system'` */
  defaultValue?: ThemeChoice;
  /** A CSP nonce for the inline script. */
  nonce?: string;
}

/**
 * An inline `<script>` that applies the stored theme. Render it in `<head>`,
 * before the stylesheets (in Next.js, in the root layout's `<head>`).
 *
 * Client-rendered (a Vite or CRA single-page app), the script doesn't run;
 * the component then applies the stored choice on mount when `<html>` has no
 * `data-theme` yet, after the first paint. For no flash in an SPA, put
 * `<script>${themeScript()}</script>` in index.html's `<head>` instead.
 *
 * @example
 * ```tsx
 * <head>
 *   <ThemeScript />
 * </head>
 * ```
 */
export function ThemeScript({ storageKey, defaultValue, nonce }: ThemeScriptProps) {
  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    if (root.hasAttribute(THEME_ATTRIBUTE)) return;
    applyTheme(readThemeChoice(storageKey) ?? toThemeChoice(defaultValue), {
      root,
      persist: false,
      broadcast: false,
    });
    // Once, on mount: the head script's job, done late.
  }, []);

  return (
    <script
      nonce={nonce}
      // The snippet is generated from fixed strings and JSON-encoded options.
      dangerouslySetInnerHTML={{ __html: themeScript({ storageKey, defaultValue }) }}
    />
  );
}
