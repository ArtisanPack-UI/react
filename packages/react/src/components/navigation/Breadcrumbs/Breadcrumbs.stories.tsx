import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumbs, BreadcrumbsItem } from './Breadcrumbs';

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Shows where the current page sits in the hierarchy. The last item is the current page; past maxItems the middle collapses behind a button that reveals it.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Dashboard', href: '#' },
      { label: 'Properties', href: '#' },
      { label: 'Lakeview Lofts' },
    ],
  },
};

export const HomeIconAndOverflow: Story = {
  args: {
    items: [
      { label: 'Home', href: '#', icon: 'house', hideLabel: true },
      { label: 'Properties', href: '#' },
      { label: 'Lakeview Lofts', href: '#' },
      { label: 'Analytics', href: '#' },
      { label: 'Visitor' },
    ],
  },
};

export const Composed: Story = {
  render: () => (
    <Breadcrumbs>
      <BreadcrumbsItem label="All media" href="#" onClick={(event) => event.preventDefault()} />
      <BreadcrumbsItem label="Invoices" />
    </Breadcrumbs>
  ),
};
