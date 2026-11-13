import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../form/Button/Button';
import { Breadcrumbs } from '../../navigation/Breadcrumbs/Breadcrumbs';
import { Tab, Tabs } from '../Tabs/Tabs';
import { PageHeader } from './PageHeader';

const meta: Meta<typeof PageHeader> = {
  title: 'Layout/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The title block at the top of a page: breadcrumbs, then the title with its description and meta beside the actions, then tabs.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: 'Dashboard',
    description: 'Income, profit and transactions across all stores.',
    breadcrumbs: <Breadcrumbs items={[{ label: 'Apexify', href: '#' }, { label: 'Dashboard' }]} />,
    actions: (
      <>
        <Button variant="outline" color="neutral" size="sm">
          Filter
        </Button>
        <Button size="sm">Share</Button>
      </>
    ),
    tabs: (
      <Tabs variant="underline">
        <Tab value="overview" label="Overview" />
        <Tab value="history" label="Trade history" />
      </Tabs>
    ),
  },
};

export const WithMeta: Story = {
  args: {
    title: 'The Grove at Greenfield',
    meta: 'Draft · Edited 20 min ago',
    actions: <Button size="sm">Publish</Button>,
  },
};
