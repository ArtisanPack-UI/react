import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';

function Box({ color = '#6366f1', label }: { color?: string; label: string }) {
  return (
    <div
      className="rounded-lg p-4 text-white text-center font-semibold"
      style={{ backgroundColor: color, minWidth: 80 }}
    >
      {label}
    </div>
  );
}

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Vertical: Story = {
  args: {
    direction: 'vertical',
  },
  render: (args) => (
    <Stack {...args}>
      <Box label="First" color="#6366f1" />
      <Box label="Second" color="#8b5cf6" />
      <Box label="Third" color="#a78bfa" />
    </Stack>
  ),
};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
  },
  render: (args) => (
    <Stack {...args}>
      <Box label="Left" color="#6366f1" />
      <Box label="Center" color="#8b5cf6" />
      <Box label="Right" color="#a78bfa" />
    </Stack>
  ),
};

export const WithGap: Story = {
  args: {
    direction: 'horizontal',
    gap: 6,
  },
  render: (args) => (
    <Stack {...args}>
      <Box label="A" color="#6366f1" />
      <Box label="B" color="#8b5cf6" />
      <Box label="C" color="#a78bfa" />
    </Stack>
  ),
};

export const Alignment: Story = {
  args: {
    direction: 'horizontal',
    align: 'center',
    justify: 'between',
  },
  render: (args) => (
    <Stack {...args} style={{ width: '100%' }}>
      <Box label="Start" color="#6366f1" />
      <Box label="Middle" color="#8b5cf6" />
      <Box label="End" color="#a78bfa" />
    </Stack>
  ),
};

export const Wrapped: Story = {
  args: {
    direction: 'horizontal',
    wrap: true,
    gap: 4,
  },
  render: (args) => (
    <Stack {...args} style={{ maxWidth: 300 }}>
      <Box label="One" color="#6366f1" />
      <Box label="Two" color="#8b5cf6" />
      <Box label="Three" color="#a78bfa" />
      <Box label="Four" color="#c4b5fd" />
      <Box label="Five" color="#6366f1" />
      <Box label="Six" color="#8b5cf6" />
    </Stack>
  ),
};
