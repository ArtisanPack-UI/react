import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionItem } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Layout/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Stacked sections that expand and collapse: each item is a heading holding a button that shows or hides its panel. One item open at a time, or several with multiple.',
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['default', 'separated', 'flush'] },
    headingLevel: { control: 'select', options: [2, 3, 4, 5, 6] },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const ITEMS = [
  {
    value: 'live',
    title: 'How long does a listing stay live?',
    content:
      'Listings stay live until you archive them or mark them as sold. Drafts are kept for 90 days.',
  },
  {
    value: 'owners',
    title: 'Can co-owners edit a listing?',
    content: "Yes. Invite them from the listing's Sharing tab.",
  },
  {
    value: 'files',
    title: 'Which file types can I upload?',
    content: 'Images, PDFs and floor plans up to 20 MB each.',
  },
];

export const Default: Story = {
  args: { items: ITEMS, defaultValue: ['live'] },
};

export const Separated: Story = {
  args: { items: ITEMS, variant: 'separated', defaultValue: ['live'] },
};

export const Flush: Story = {
  args: { items: ITEMS, variant: 'flush', multiple: true },
};

export const Composed: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState<string[]>(['live']);
    return (
      <Accordion {...args} value={open} onValueChange={setOpen}>
        <AccordionItem value="live" title="How long does a listing stay live?">
          Listings stay live until you archive them or mark them as sold.
        </AccordionItem>
        <AccordionItem value="owners" title="Can co-owners edit a listing?">
          Yes. Invite them from the listing&apos;s Sharing tab.
        </AccordionItem>
        <AccordionItem value="archived" title="Archived listings" disabled>
          Archived listings can&apos;t be edited.
        </AccordionItem>
      </Accordion>
    );
  },
};
