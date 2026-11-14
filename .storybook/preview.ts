import type { Preview } from '@storybook/react-vite';
import './storybook.css';

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
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';
      document.documentElement.setAttribute('data-theme', theme);
      return Story();
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
