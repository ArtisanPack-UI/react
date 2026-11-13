import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../form/Button/Button';
import { ErrorState } from './ErrorState';

const meta: Meta<typeof ErrorState> = {
  title: 'Feedback/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Explains what failed, what's safe and how to recover, in place of content that couldn't load. Announced as an alert; focusTitle moves focus to the title on full-page errors.",
      },
    },
  },
  argTypes: {
    variant: { control: 'select', options: ['request', 'offline', 'not-found', 'forbidden'] },
    size: { control: 'select', options: ['sm', 'md'] },
    align: { control: 'select', options: ['center', 'start'] },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Request: Story = {
  args: {
    title: 'Couldn’t load transactions',
    description: 'The payments service didn’t respond. Your data is safe; try again in a moment.',
    code: 'Error 503 · req_8f2c91',
    actions: <Button leadingIcon="refresh-cw">Try again</Button>,
  },
};

export const Offline: Story = {
  args: {
    variant: 'offline',
    title: 'You’re offline',
    description: 'Changes are saved on this device and will sync when you reconnect.',
  },
};

export const NotFound: Story = {
  args: {
    variant: 'not-found',
    headingLevel: 1,
    title: 'This page doesn’t exist',
    description: 'The listing may have been archived, or the link is mistyped.',
    actions: <Button>Go to dashboard</Button>,
  },
};
