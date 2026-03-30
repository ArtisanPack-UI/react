import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../../../hooks/use-theme';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Utility/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Theme toggle button that cycles through light, dark, and system color schemes. Must be used within a ThemeProvider.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  render: () => (
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  ),
};

export const Sizes: Story = {
  render: () => (
    <ThemeProvider>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <ThemeToggle size="xs" />
          <span className="text-xs">xs</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ThemeToggle size="sm" />
          <span className="text-xs">sm</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ThemeToggle size="md" />
          <span className="text-xs">md</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <ThemeToggle size="lg" />
          <span className="text-xs">lg</span>
        </div>
      </div>
    </ThemeProvider>
  ),
};

export const LightDarkOnly: Story = {
  render: () => (
    <ThemeProvider>
      <ThemeToggle modes={['light', 'dark']} />
    </ThemeProvider>
  ),
};

export const Disabled: Story = {
  render: () => (
    <ThemeProvider>
      <ThemeToggle disabled />
    </ThemeProvider>
  ),
};
