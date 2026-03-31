import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './Grid';

const toneMap = {
  primary: 'bg-primary text-primary-content',
  secondary: 'bg-secondary text-secondary-content',
  accent: 'bg-accent text-accent-content',
  neutral: 'bg-neutral text-neutral-content',
} as const;

type Tone = keyof typeof toneMap;

function Box({ tone = 'primary', label }: { tone?: Tone; label: string }) {
  return (
    <div className={`rounded-lg p-4 text-center font-semibold ${toneMap[tone] ?? toneMap.primary}`}>
      {label}
    </div>
  );
}

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'CSS Grid wrapper with responsive column counts and configurable row/column gap. Simplifies common grid layouts without manual Tailwind classes.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Default: Story = {
  args: {
    cols: 3,
  },
  render: (args) => (
    <Grid {...args}>
      <Box label="1" tone="primary" />
      <Box label="2" tone="secondary" />
      <Box label="3" tone="accent" />
      <Box label="4" tone="primary" />
      <Box label="5" tone="secondary" />
      <Box label="6" tone="accent" />
    </Grid>
  ),
};

export const Responsive: Story = {
  args: {
    cols: 1,
    colsSm: 2,
    colsMd: 3,
    colsLg: 4,
  },
  render: (args) => (
    <Grid {...args}>
      <Box label="1" tone="primary" />
      <Box label="2" tone="secondary" />
      <Box label="3" tone="accent" />
      <Box label="4" tone="neutral" />
      <Box label="5" tone="primary" />
      <Box label="6" tone="secondary" />
      <Box label="7" tone="accent" />
      <Box label="8" tone="neutral" />
    </Grid>
  ),
};

export const CustomGap: Story = {
  args: {
    cols: 3,
    gap: 8,
  },
  render: (args) => (
    <Grid {...args}>
      <Box label="1" tone="primary" />
      <Box label="2" tone="secondary" />
      <Box label="3" tone="accent" />
      <Box label="4" tone="primary" />
      <Box label="5" tone="secondary" />
      <Box label="6" tone="accent" />
    </Grid>
  ),
};

export const DifferentGaps: Story = {
  name: 'Different X/Y Gaps',
  args: {
    cols: 3,
    gapX: 4,
    gapY: 8,
  },
  render: (args) => (
    <Grid {...args}>
      <Box label="1" tone="primary" />
      <Box label="2" tone="secondary" />
      <Box label="3" tone="accent" />
      <Box label="4" tone="primary" />
      <Box label="5" tone="secondary" />
      <Box label="6" tone="accent" />
    </Grid>
  ),
};

export const TwoColumns: Story = {
  args: {
    cols: 2,
  },
  render: (args) => (
    <Grid {...args}>
      <Box label="Left" tone="primary" />
      <Box label="Right" tone="secondary" />
      <Box label="Left" tone="accent" />
      <Box label="Right" tone="neutral" />
    </Grid>
  ),
};
