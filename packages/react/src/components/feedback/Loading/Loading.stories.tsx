import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loading } from './Loading';

const meta: Meta<typeof Loading> = {
  title: 'Feedback/Loading',
  component: Loading,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Shows that work is in progress: a spinner or three dots in a status region, inline or as an overlay. It waits delay ms before showing, so fast loads do not flash.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['spinner', 'dots'] },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'accent', 'neutral', 'success', 'warning', 'error', 'info'],
    },
  },
  args: { delay: 0 },
};

export default meta;
type Story = StoryObj<typeof Loading>;

export const Default: Story = {};

export const Dots: Story = { args: { variant: 'dots' } };

export const WithText: Story = { args: { size: 'sm', children: 'Saving changes…' } };

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Loading key={size} size={size} delay={0} />
      ))}
    </div>
  ),
};

export const Overlay: Story = {
  render: () => (
    <div aria-busy="true" style={{ position: 'relative', height: 160, maxWidth: 520 }}>
      <Loading overlay size="lg" delay={0}>
        Loading revenue…
      </Loading>
    </div>
  ),
};
