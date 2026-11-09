import type { StorybookConfig } from '@storybook/react-vite';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';

function getAbsolutePath(value: string) {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

const config: StorybookConfig = {
  stories: ['../packages/react/src/**/*.stories.@(ts|tsx)'],
  addons: [
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@chromatic-com/storybook'),
  ],
  framework: getAbsolutePath('@storybook/react-vite'),
  viteFinal: async (config) => {
    return {
      ...config,
      plugins: [...(config.plugins ?? []), tailwindcss()],
    };
  },
};

export default config;
