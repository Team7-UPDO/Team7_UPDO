import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Category from '../Category';

const meta: Meta<typeof Category> = {
  title: 'components/ui/Category',
  component: Category,
  parameters: {
    layout: 'padded',
    controls: { disable: true },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

function CategoryDemo({ main }: { main: string }) {
  const [activeId, setActiveId] = useState('전체');

  const handleChange = (id: string, apiType: string) => {
    console.log(`선택됨: ${id} (${apiType})`);
    setActiveId(id);
  };

  return (
    <div className="flex flex-col gap-6">
      <Category mainCategory={main} activeId={activeId} onChange={handleChange} />
    </div>
  );
}

export const Preview: Story = {
  render: () => <CategoryDemo main="성장" />,
};
