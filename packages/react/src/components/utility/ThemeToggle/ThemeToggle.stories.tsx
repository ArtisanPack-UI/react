import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ThemeToggle, type ThemeChoice } from './ThemeToggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Utility/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lets people choose light, dark, high contrast or system. The choice sets data-theme on the document, persists, and follows the OS while it is System. Render ThemeScript in <head> so it applies before first paint.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['segmented', 'icon', 'menu'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
  args: { persist: false },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Segmented: Story = {};

export const IconsOnly: Story = {
  args: { iconOnly: true, choices: ['light', 'dark', 'system'] },
};

export const IconButton: Story = {
  args: { variant: 'icon' },
};

export const Menu: Story = {
  render: (args) => {
    const [theme, setTheme] = useState<ThemeChoice>('dark');
    return (
      <ThemeToggle {...args} variant="menu" size="sm" value={theme} onValueChange={setTheme} />
    );
  },
};

export const Translated: Story = {
  args: {
    label: 'Tema',
    lightLabel: 'Claro',
    darkLabel: 'Oscuro',
    highContrastLabel: 'Alto contraste',
    systemLabel: 'Sistema',
  },
};
