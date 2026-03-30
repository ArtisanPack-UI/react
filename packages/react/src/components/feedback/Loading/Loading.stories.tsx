import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading } from './Loading';

const meta: Meta<typeof Loading> = {
  title: 'Feedback/Loading',
  component: Loading,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['spinner', 'dots', 'ring', 'ball', 'bars', 'infinity'],
    },
    color: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'],
    },
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {
  args: {
    color: 'primary',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-1">
        <Loading variant="spinner" color="primary" size="lg" />
        <span className="text-xs">spinner</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Loading variant="dots" color="secondary" size="lg" />
        <span className="text-xs">dots</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Loading variant="ring" color="accent" size="lg" />
        <span className="text-xs">ring</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Loading variant="ball" color="success" size="lg" />
        <span className="text-xs">ball</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Loading variant="bars" color="warning" size="lg" />
        <span className="text-xs">bars</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <Loading variant="infinity" color="error" size="lg" />
        <span className="text-xs">infinity</span>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Loading color="primary" size="xs" />
      <Loading color="primary" size="sm" />
      <Loading color="primary" size="md" />
      <Loading color="primary" size="lg" />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Loading color="primary" size="md" />
      <Loading color="secondary" size="md" />
      <Loading color="accent" size="md" />
      <Loading color="success" size="md" />
      <Loading color="warning" size="md" />
      <Loading color="error" size="md" />
      <Loading color="info" size="md" />
    </div>
  ),
};
