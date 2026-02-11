import { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import Selectbox from '../Selectbox';

const meta: Meta<typeof Selectbox> = {
  title: 'components/ui/Selectbox',
  component: Selectbox,
};

export default meta;

type Story = StoryObj<typeof Selectbox>;

export const Board: Story = {
  render: () => {
    const options = [
      { title: '성장', subtitle: '스킬업' },
      { title: '성장', subtitle: '챌린지' },
      { title: '네트워킹' },
    ];
    const [selectedIdx, setSelectedIdx] = useState<number | null>(0);

    return (
      <div className="flex gap-4">
        {options.map(({ title, subtitle }, idx) => (
          <Selectbox
            key={idx}
            title={title}
            subtitle={subtitle ?? ''}
            isSelected={selectedIdx === idx}
            onSelect={() => setSelectedIdx(idx)}
          />
        ))}
      </div>
    );
  },
};
