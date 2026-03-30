import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from './Accordion';
import { Collapse } from '../Collapse/Collapse';

const meta: Meta<typeof Accordion> = {
  title: 'Layout/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  render: () => (
    <Accordion>
      <Collapse title="What is ArtisanPack UI?">
        <p>
          ArtisanPack UI is a comprehensive component library for React, styled with DaisyUI and
          Tailwind CSS.
        </p>
      </Collapse>
      <Collapse title="How do I install it?">
        <p>Install via npm: npm install @artisanpack-ui/react</p>
      </Collapse>
      <Collapse title="Is it accessible?">
        <p>Yes! All components follow WAI-ARIA guidelines and support keyboard navigation.</p>
      </Collapse>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion multiple>
      <Collapse title="Section 1">
        <p>Content for section 1. Multiple sections can be open at once.</p>
      </Collapse>
      <Collapse title="Section 2">
        <p>Content for section 2.</p>
      </Collapse>
      <Collapse title="Section 3">
        <p>Content for section 3.</p>
      </Collapse>
    </Accordion>
  ),
};

export const Joined: Story = {
  render: () => (
    <Accordion join>
      <Collapse title="First Item">
        <p>Joined accordion items have connected borders.</p>
      </Collapse>
      <Collapse title="Second Item">
        <p>They appear as a single unified group.</p>
      </Collapse>
      <Collapse title="Third Item">
        <p>Great for FAQ sections.</p>
      </Collapse>
    </Accordion>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <Accordion defaultOpenIndices={[0]}>
      <Collapse title="Open by Default">
        <p>This section starts open.</p>
      </Collapse>
      <Collapse title="Closed by Default">
        <p>This section starts closed.</p>
      </Collapse>
    </Accordion>
  ),
};
