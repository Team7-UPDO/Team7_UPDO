import type { Meta, StoryObj } from '@storybook/react';

import { IconButton } from '../IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Components/ui/Button/IconButton',
  component: IconButton,
  parameters: { layout: 'centered' },
  argTypes: {
    label: { control: 'text' },
  },
  args: {
    label: '모임 만들기',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
