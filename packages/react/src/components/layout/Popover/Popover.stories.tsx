import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../form/Button/Button';
import { Input } from '../../form/Input/Input';
import { Popover } from './Popover';

const meta: Meta<typeof Popover> = {
  title: 'Layout/Popover',
  component: Popover,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An anchored, non-modal panel for a short task tied to one control. Focus moves in when it opens and returns to the trigger when it closes; Escape and an outside click close it.',
      },
    },
  },
  argTypes: {
    placement: { control: 'select', options: ['top', 'bottom', 'start', 'end'] },
  },
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    trigger: 'Share',
    title: 'Share report',
    actions: (
      <Button size="sm" leadingIcon="copy">
        Copy link
      </Button>
    ),
    children: <Input label="Link" readOnly value="horizon.app/r/q4-income" />,
  },
};

export const OwnTrigger: Story = {
  args: {
    placement: 'top',
    title: 'What counts as a visit?',
    trigger: (
      <Button
        variant="ghost"
        color="neutral"
        size="sm"
        iconOnly
        leadingIcon="info"
        aria-label="About visits"
      />
    ),
    children: (
      <p>A unique person who opened the listing for at least 5 seconds, counted once a day.</p>
    ),
  },
};
