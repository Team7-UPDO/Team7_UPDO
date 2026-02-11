import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import ReviewScore from '../ReviewScore';

const meta = {
  title: 'components/ui/ReviewScore',
  component: ReviewScore,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      table: { disable: true },
    },
    onChange: {
      table: { disable: true },
    },
    className: {
      table: { disable: true },
    },
    label: {
      table: { disable: true },
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof ReviewScore>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
  },
  render: args => {
    const [score, setScore] = useState(0);
    return (
      <ReviewScore
        {...args}
        value={score}
        onChange={setScore}
        label="만족스러운 경험이었나요?"
        className="items-center"
      />
    );
  },
};
