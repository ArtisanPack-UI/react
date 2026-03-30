import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './Grid';

function Box({ color = '#6366f1', label }: { color?: string; label: string }) {
  return (
    <div
      className="rounded-lg p-4 text-white text-center font-semibold"
      style={{ backgroundColor: color }}
    >
      {label}
    </div>
  );
}

const meta: Meta<typeof Grid> = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const Default: Story = {
  args: {
    cols: 3,
  },
  render: (args) => (
    <Grid {...args}>
      <Box label="1" color="#6366f1" />
      <Box label="2" color="#8b5cf6" />
      <Box label="3" color="#a78bfa" />
      <Box label="4" color="#6366f1" />
      <Box label="5" color="#8b5cf6" />
      <Box label="6" color="#a78bfa" />
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
      <Box label="1" color="#6366f1" />
      <Box label="2" color="#8b5cf6" />
      <Box label="3" color="#a78bfa" />
      <Box label="4" color="#c4b5fd" />
      <Box label="5" color="#6366f1" />
      <Box label="6" color="#8b5cf6" />
      <Box label="7" color="#a78bfa" />
      <Box label="8" color="#c4b5fd" />
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
      <Box label="1" color="#6366f1" />
      <Box label="2" color="#8b5cf6" />
      <Box label="3" color="#a78bfa" />
      <Box label="4" color="#6366f1" />
      <Box label="5" color="#8b5cf6" />
      <Box label="6" color="#a78bfa" />
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
      <Box label="1" color="#6366f1" />
      <Box label="2" color="#8b5cf6" />
      <Box label="3" color="#a78bfa" />
      <Box label="4" color="#6366f1" />
      <Box label="5" color="#8b5cf6" />
      <Box label="6" color="#a78bfa" />
    </Grid>
  ),
};

export const TwoColumns: Story = {
  args: {
    cols: 2,
  },
  render: (args) => (
    <Grid {...args}>
      <Box label="Left" color="#6366f1" />
      <Box label="Right" color="#8b5cf6" />
      <Box label="Left" color="#a78bfa" />
      <Box label="Right" color="#c4b5fd" />
    </Grid>
  ),
};
