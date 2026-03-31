import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Form/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Versatile button supporting DaisyUI color variants, sizes, loading state, icons, badges, tooltips, and link mode. Fully accessible with keyboard and screen-reader support.',
      },
    },
  },
  argTypes: {
    color: {
      control: 'select',
      options: [
        undefined,
        'primary',
        'secondary',
        'accent',
        'success',
        'warning',
        'error',
        'info',
        'neutral',
        'ghost',
        'outline',
      ],
    },
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg'],
    },
    tooltipPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    label: 'Button',
  },
};

export const Primary: Story = {
  args: {
    label: 'Primary',
    color: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary',
    color: 'secondary',
  },
};

export const AllColors: Story = {
  name: 'Color Variants',
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button label="Default" />
      <Button label="Primary" color="primary" />
      <Button label="Secondary" color="secondary" />
      <Button label="Accent" color="accent" />
      <Button label="Success" color="success" />
      <Button label="Warning" color="warning" />
      <Button label="Error" color="error" />
      <Button label="Info" color="info" />
      <Button label="Neutral" color="neutral" />
      <Button label="Ghost" color="ghost" />
      <Button label="Outline" color="outline" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button label="Extra Small" size="xs" color="primary" />
      <Button label="Small" size="sm" color="primary" />
      <Button label="Medium" size="md" color="primary" />
      <Button label="Large" size="lg" color="primary" />
    </div>
  ),
};

export const Loading: Story = {
  args: {
    label: 'Loading',
    loading: true,
    color: 'primary',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    disabled: true,
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Settings',
    color: 'primary',
    icon: <span>⚙️</span>,
  },
};

export const WithBadge: Story = {
  args: {
    label: 'Inbox',
    color: 'primary',
    badge: '99+',
    badgeClasses: 'badge-secondary',
  },
};

export const WithTooltip: Story = {
  args: {
    label: 'Hover me',
    color: 'primary',
    tooltip: 'This is a tooltip',
    tooltipPosition: 'top',
  },
};

export const AsLink: Story = {
  args: {
    label: 'Visit Link',
    color: 'primary',
    link: '#',
  },
};

export const Responsive: Story = {
  args: {
    label: 'Responsive',
    color: 'primary',
    icon: <span>📱</span>,
    responsive: true,
  },
};

export const Composition: Story = {
  name: 'Card with Buttons',
  render: () => (
    <div className="card bg-base-100 shadow-xl w-80">
      <div className="card-body">
        <h2 className="card-title">Confirm Action</h2>
        <p>Are you sure you want to proceed?</p>
        <div className="card-actions justify-end">
          <Button label="Cancel" color="ghost" />
          <Button label="Confirm" color="primary" />
        </div>
      </div>
    </div>
  ),
};
