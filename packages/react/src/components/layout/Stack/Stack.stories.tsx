import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';

const toneMap = {
  primary: 'bg-primary text-primary-content',
  secondary: 'bg-secondary text-secondary-content',
  accent: 'bg-accent text-accent-content',
  neutral: 'bg-neutral text-neutral-content',
} as const;

type Tone = keyof typeof toneMap;

function Box({ tone = 'primary', label }: { tone?: Tone; label: string }) {
  return (
    <div
      className={`rounded-lg p-4 text-center font-semibold min-w-20 ${toneMap[tone] ?? toneMap.primary}`}
    >
      {label}
    </div>
  );
}

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Flexbox layout helper for vertical or horizontal stacking with configurable gap, alignment, justification, and wrapping.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Vertical: Story = {
  args: {
    direction: 'vertical',
  },
  render: (args) => (
    <Stack {...args}>
      <Box label="First" tone="primary" />
      <Box label="Second" tone="secondary" />
      <Box label="Third" tone="accent" />
    </Stack>
  ),
};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
  },
  render: (args) => (
    <Stack {...args}>
      <Box label="Left" tone="primary" />
      <Box label="Center" tone="secondary" />
      <Box label="Right" tone="accent" />
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
      <Box label="A" tone="primary" />
      <Box label="B" tone="secondary" />
      <Box label="C" tone="accent" />
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
      <Box label="Start" tone="primary" />
      <Box label="Middle" tone="secondary" />
      <Box label="End" tone="accent" />
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
      <Box label="One" tone="primary" />
      <Box label="Two" tone="secondary" />
      <Box label="Three" tone="accent" />
      <Box label="Four" tone="neutral" />
      <Box label="Five" tone="primary" />
      <Box label="Six" tone="secondary" />
    </Stack>
  ),
};
