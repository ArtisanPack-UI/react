import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Button } from '../../form/Button/Button';

function svgPlaceholder(width: number, height: number, text: string, fill = '#6366f1') {
  return (
    'data:image/svg+xml,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="${fill}"/><text x="${width / 2}" y="${height / 2 + 8}" text-anchor="middle" fill="#fff" font-size="${Math.min(width, height) * 0.12}" font-family="sans-serif">${text}</text></svg>`,
    )
  );
}

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
        src={svgPlaceholder(400, 200, '400 × 200')}
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
        src={svgPlaceholder(200, 200, '200 × 200', '#8b5cf6')}
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
    link: '/products/widget-pro',
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
      <Card title="Plan C" subtitle="$29/mo" bordered>
        <p>Enterprise support included.</p>
        <div className="card-actions justify-end mt-2">
          <Button label="Contact Us" color="accent" size="sm" />
        </div>
      </Card>
    </div>
  ),
};
