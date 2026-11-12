import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from './Badge';

const COLORS = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'success',
  'warning',
  'error',
  'info',
] as const;

const meta: Meta<typeof Badge> = {
  title: 'Data/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A small, non-interactive label for a status, category or count. The text is always there; a dot or an icon can lead it.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['solid', 'soft', 'outline', 'ghost'] },
    color: { control: 'select', options: COLORS },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { children: 'Active' },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const Matrix: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      {(['solid', 'soft', 'outline', 'ghost'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {COLORS.map((color) => (
            <Badge key={color} variant={variant} color={color} dot={variant === 'ghost'}>
              {color}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const DotIconAndSize: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Badge color="primary" size="sm">
        Small
      </Badge>
      <Badge color="success" dot>
        Active
      </Badge>
      <Badge color="success" leadingIcon="arrow-right">
        +11.01%
      </Badge>
      <Badge color="info" variant="solid" size="lg">
        New
      </Badge>
    </div>
  ),
};
