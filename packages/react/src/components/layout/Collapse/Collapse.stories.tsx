import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapse } from './Collapse';

const meta: Meta<typeof Collapse> = {
  title: 'Layout/Collapse',
  component: Collapse,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Single collapsible section with arrow or plus icon toggle, bordered variant, default-open state, disabled mode, and accordion grouping via shared name.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Collapse>;

export const Default: Story = {
  args: {
    title: 'Click to expand',
    children: <p>This is the collapsible content that can be toggled open and closed.</p>,
  },
};

export const ArrowIcon: Story = {
  args: {
    title: 'Arrow indicator',
    icon: 'arrow',
    children: <p>This collapse uses the arrow icon indicator.</p>,
  },
};

export const PlusIcon: Story = {
  args: {
    title: 'Plus indicator',
    icon: 'plus',
    children: <p>This collapse uses the plus/minus icon indicator.</p>,
  },
};

export const Bordered: Story = {
  args: {
    title: 'Bordered collapse',
    bordered: true,
    children: <p>This collapse has a visible border around it.</p>,
  },
};

export const DefaultOpen: Story = {
  args: {
    title: 'Starts open',
    defaultOpen: true,
    children: <p>This collapse is open by default when the page loads.</p>,
  },
};

export const Disabled: Story = {
  args: {
    title: 'Disabled collapse',
    disabled: true,
    children: <p>This content cannot be toggled.</p>,
  },
};

export const Accordion: Story = {
  render: () => {
    const AccordionDemo = () => {
      const [openId, setOpenId] = useState<string | null>('one');
      return (
        <div className="space-y-0">
          <Collapse
            title="Section One"
            bordered
            open={openId === 'one'}
            onOpenChange={(isOpen) => setOpenId(isOpen ? 'one' : null)}
          >
            <p>Content for section one. Opening another section will close this one.</p>
          </Collapse>
          <Collapse
            title="Section Two"
            bordered
            open={openId === 'two'}
            onOpenChange={(isOpen) => setOpenId(isOpen ? 'two' : null)}
          >
            <p>Content for section two. Only one section can be open at a time.</p>
          </Collapse>
          <Collapse
            title="Section Three"
            bordered
            open={openId === 'three'}
            onOpenChange={(isOpen) => setOpenId(isOpen ? 'three' : null)}
          >
            <p>Content for section three. This behaves like an accordion.</p>
          </Collapse>
        </div>
      );
    };
    return <AccordionDemo />;
  },
};
