import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Navigation/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Navigates somewhere. Inline links stay underlined; standalone links drop the underline until hover. Without href it renders a button styled as a link.',
      },
    },
  },
  argTypes: {
    tone: { control: 'select', options: ['primary', 'muted'] },
  },
  args: { href: '#', children: 'listing terms' },
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Inline: Story = {
  render: (args) => (
    <p>
      Read the <Link {...args} /> or{' '}
      <Link href="#" tone="muted">
        privacy policy
      </Link>
      .
    </p>
  ),
};

export const Standalone: Story = {
  args: { standalone: true, trailingIcon: 'arrow-right', children: 'View all properties' },
};

export const External: Story = {
  args: { standalone: true, external: true, children: 'Documentation' },
};

export const WithLeadingIcon: Story = {
  args: { standalone: true, leadingIcon: 'download', children: 'Download PDF' },
};

export const AsButton: Story = {
  args: { href: undefined, children: 'Log out' },
};
