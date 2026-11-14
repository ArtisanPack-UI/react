import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../form/Button/Button';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Layout/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The default container: a surface with optional media, header (title, description, actions), body and footer.',
      },
    },
  },
  argTypes: {
    surface: { control: 'select', options: ['default', 'raised', 'sunken', 'glass'] },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Quarterly report',
    description: 'Updated 2 hours ago',
    children: 'Revenue grew 12% this quarter, led by renewals.',
    actions: (
      <Button variant="ghost" color="neutral" size="sm">
        Share
      </Button>
    ),
    footer: (
      <>
        <Button variant="outline" color="neutral">
          Dismiss
        </Button>
        <Button>Open report</Button>
      </>
    ),
  },
};

export const AsLink: Story = {
  args: {
    href: '#',
    title: 'Q3 report',
    description: 'Revenue, churn and pipeline',
    actions: (
      <Button
        variant="ghost"
        color="neutral"
        size="sm"
        iconOnly
        leadingIcon="download"
        aria-label="Download"
      />
    ),
  },
};

export const WithMedia: Story = {
  args: {
    media:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9'%3E%3Crect width='16' height='9' fill='%2394a3b8'/%3E%3C/svg%3E",
    title: '24 Harbor Street',
    description: '3 bedrooms · 2 baths',
    children: 'Listed this week. Open house on Saturday.',
  },
};

export const Surfaces: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
      <Card surface="default" title="Default" />
      <Card surface="raised" title="Raised" />
      <Card surface="sunken" title="Sunken" />
      <Card surface="glass" title="Glass" />
    </div>
  ),
};
