import type { Preview } from '@storybook/react-vite';
import { createElement } from 'react';

import { TranslationProvider } from '../packages/react/src/i18n/translator';
import './storybook.css';

// The shipped catalogues, for the Locale toolbar. Arabic also sets dir="rtl".
const CATALOGUES = import.meta.glob<Record<string, string>>('../packages/react/lang/*.json', {
  import: 'default',
  eager: true,
});
const LOCALES = Object.keys(CATALOGUES)
  .map((path) => path.replace(/^.*\/(.+)\.json$/, '$1'))
  .sort((a, b) => (a === 'en' ? -1 : b === 'en' ? 1 : a.localeCompare(b)));
const RTL_LOCALES = ['ar'];

// The design-system themes, applied the way ThemeScript applies them: as
// `data-theme` on <html>, styled by @artisanpack-ui/css.
const THEMES = ['light', 'dark', 'high-contrast'];

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Design-system theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: THEMES.map((t) => ({ value: t, title: t })),
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Locale for the built-in text',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: LOCALES.map((locale) => ({ value: locale, title: locale })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
    locale: 'en',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';
      document.documentElement.setAttribute('data-theme', theme);
      return Story();
    },
    (Story, context) => {
      const locale: string = context.globals.locale || 'en';
      document.documentElement.setAttribute('lang', locale.replace('_', '-'));
      document.documentElement.setAttribute('dir', RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr');
      return createElement(
        TranslationProvider,
        { locale, messages: CATALOGUES[`../packages/react/lang/${locale}.json`] },
        createElement(Story),
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
