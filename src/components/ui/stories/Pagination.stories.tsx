import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Pagination } from '../Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/ui/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    totalPages: { control: { type: 'number' } },
    currentPage: { control: { type: 'number' } },
  },
  args: {
    totalPages: 10,
    currentPage: 1,
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => <Pagination {...args} />,
};

export const Interactive = () => {
  const [page, setPage] = useState(1);
  return <Pagination totalPages={10} currentPage={page} onPageChange={setPage} />;
};
