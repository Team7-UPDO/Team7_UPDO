import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

const meta: Meta<typeof Button> = {
  title: 'Components/ui/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large', 'xlarge'],
    },
    disabled: {
      control: 'boolean',
    },
    children: {
      control: 'text',
    },
  },

  args: {
    variant: 'primary',
    size: 'medium',
    children: '참여하기',
    disabled: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: '참여하기',
    disabled: false,
  },
  argTypes: {
    variant: { table: { disable: true } },
  },
};
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'secondary',
    children: '삭제하기',
  },
  argTypes: {
    variant: { table: { disable: true } },
    disabled: { table: { disable: true } },
    size: {
      control: false,
    },
  },
};

export const CalendarButtons: Story = {
  render: args => (
    <div className="flex gap-4">
      <Button variant="calendarOutline" size="calendar" disabled={args.disabled}>
        초기화
      </Button>
      <Button variant="calendarSolid" size="calendar" disabled={args.disabled}>
        적용
      </Button>
    </div>
  ),
  argTypes: {
    variant: { table: { disable: true } },
    size: { table: { disable: true } },
    children: { table: { disable: true } },
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
};
