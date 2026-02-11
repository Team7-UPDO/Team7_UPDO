import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import Badge from '../Badge';

export default {
  title: 'components/ui/Badge',
  component: Badge,
  parameters: { layout: 'padded' },
  argTypes: {
    value: { control: { type: 'number', min: 0 } },
    max: { table: { disable: true } },
    size: { control: { type: 'radio' }, options: ['sm', 'lg'] },
    ariaLive: { control: false, table: { disable: true } },
    as: { control: false, table: { disable: true } },
    className: { control: false, table: { disable: true } },
    formatter: { control: false, table: { disable: true } },
  },
  args: {
    size: 'responsive',
    value: 1,
    max: 99,
  },
} as Meta<typeof Badge>;

type Story = StoryObj<typeof Badge>;

export const Playground: Story = {};
