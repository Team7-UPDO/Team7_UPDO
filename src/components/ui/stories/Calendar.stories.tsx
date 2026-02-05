import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Calendar } from '../Calendar';

const meta = {
  title: 'components/ui/Calendar',
  component: Calendar,
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Date: Story = {
  args: {
    value: undefined,
    onCancel: () => {},
    onConfirm: () => {},
    variant: 'date',
  },
  render: args => {
    const [value, setValue] = useState<Date | undefined>(args.value);
    return (
      <div className="inline-block">
        <Calendar {...args} value={value} onConfirm={(date: Date | undefined) => setValue(date)} />
      </div>
    );
  },
};

export const Datetime: Story = {
  args: {
    value: undefined,
    onCancel: () => {},
    onConfirm: () => {},
    variant: 'datetime',
  },
  render: args => {
    const [value, setValue] = useState<Date | undefined>(args.value);

    return (
      <div className="inline-block">
        <Calendar
          {...args}
          variant="datetime"
          value={value}
          onConfirm={(date: Date | undefined) => setValue(date)}
          onCancel={() => {}}
        />
      </div>
    );
  },
};
