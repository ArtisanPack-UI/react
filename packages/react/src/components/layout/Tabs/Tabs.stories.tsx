import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Layout/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tabbed content switcher with bordered, lifted, and boxed style variants, multiple sizes, and per-tab disabled state.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [undefined, 'bordered', 'lifted', 'boxed'],
    },
    size: {
      control: 'select',
      options: [undefined, 'xs', 'sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: [undefined, 'primary', 'secondary', 'accent', 'success', 'warning', 'error', 'info'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const sampleTabs = [
  { name: 'tab1', label: 'Overview', content: <p>Overview content goes here.</p> },
  { name: 'tab2', label: 'Features', content: <p>Features content goes here.</p> },
  { name: 'tab3', label: 'Pricing', content: <p>Pricing content goes here.</p> },
];

export const Default: Story = {
  args: {
    tabs: sampleTabs,
    defaultTab: 'tab1',
  },
};

export const Bordered: Story = {
  args: {
    tabs: sampleTabs,
    defaultTab: 'tab1',
    variant: 'bordered',
  },
};

export const Lifted: Story = {
  args: {
    tabs: sampleTabs,
    defaultTab: 'tab1',
    variant: 'lifted',
  },
};

export const Boxed: Story = {
  args: {
    tabs: sampleTabs,
    defaultTab: 'tab1',
    variant: 'boxed',
  },
};

export const WithDisabled: Story = {
  args: {
    tabs: [
      ...sampleTabs,
      { name: 'tab4', label: 'Admin', content: <p>Admin only.</p>, disabled: true },
    ],
    defaultTab: 'tab1',
    variant: 'bordered',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Tabs tabs={sampleTabs} defaultTab="tab1" size="xs" variant="bordered" />
      <Tabs tabs={sampleTabs} defaultTab="tab1" size="sm" variant="bordered" />
      <Tabs tabs={sampleTabs} defaultTab="tab1" size="md" variant="bordered" />
      <Tabs tabs={sampleTabs} defaultTab="tab1" size="lg" variant="bordered" />
    </div>
  ),
};
