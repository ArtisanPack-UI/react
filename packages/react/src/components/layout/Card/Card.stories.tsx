import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Button } from '../../form/Button/Button';

const meta: Meta<typeof Card> = {
  title: 'Layout/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    title: 'Card Title',
    subtitle: 'Card subtitle',
    children: <p>This is the card body content.</p>,
  },
};

export const WithFooter: Story = {
  args: {
    title: 'Actions Card',
    children: <p>Card with footer actions.</p>,
    footer: <Button label="Action" color="primary" />,
  },
};

export const WithFigure: Story = {
  args: {
    title: 'Image Card',
    children: <p>A card with a figure on top.</p>,
    figure: (
      <img
        src={
          'data:image/svg+xml,' +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="400" height="200" fill="#6366f1"/><text x="200" y="108" text-anchor="middle" fill="#fff" font-size="24" font-family="sans-serif">400 × 200</text></svg>',
          )
        }
        alt="Placeholder"
        style={{ width: '100%', height: 200, objectFit: 'cover' }}
      />
    ),
  },
};

export const Bordered: Story = {
  args: {
    title: 'Bordered',
    bordered: true,
    noShadow: true,
    children: <p>A card with border instead of shadow.</p>,
  },
};

export const Compact: Story = {
  args: {
    title: 'Compact Card',
    compact: true,
    children: <p>Reduced padding for denser layouts.</p>,
  },
};

export const Glass: Story = {
  args: {
    title: 'Glass Card',
    glass: true,
    children: <p>Glass morphism effect.</p>,
  },
  decorators: [
    (Story) => (
      <div
        className="p-8 rounded-lg"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

export const HorizontalFigure: Story = {
  name: 'Side Figure',
  args: {
    title: 'Horizontal Layout',
    figurePosition: 'left',
    figure: (
      <img
        src={
          'data:image/svg+xml,' +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#8b5cf6"/><text x="100" y="108" text-anchor="middle" fill="#fff" font-size="20" font-family="sans-serif">200 × 200</text></svg>',
          )
        }
        alt="Placeholder"
        style={{ width: 200, height: 200, objectFit: 'cover' }}
      />
    ),
    children: <p>Card with figure on the left side.</p>,
  },
};

export const WithMenu: Story = {
  args: {
    title: 'Card with Menu',
    menu: <button className="btn btn-ghost btn-sm" aria-label="More options">⋯</button>,
    children: <p>A card with a menu button in the header.</p>,
  },
};

export const AsLink: Story = {
  args: {
    title: 'Clickable Card',
    link: '#',
    children: <p>This entire card is a link.</p>,
  },
};

export const Composition: Story = {
  name: 'Card Grid',
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card title="Plan A" subtitle="Free">
        <p>Basic features included.</p>
        <div className="card-actions justify-end mt-2">
          <Button label="Select" color="primary" size="sm" />
        </div>
      </Card>
      <Card title="Plan B" subtitle="$9/mo" bordered>
        <p>All features unlocked.</p>
        <div className="card-actions justify-end mt-2">
          <Button label="Select" color="secondary" size="sm" />
        </div>
      </Card>
      <Card title="Plan C" subtitle="$29/mo" glass>
        <p>Enterprise support included.</p>
        <div className="card-actions justify-end mt-2">
          <Button label="Contact Us" color="accent" size="sm" />
        </div>
      </Card>
    </div>
  ),
};
