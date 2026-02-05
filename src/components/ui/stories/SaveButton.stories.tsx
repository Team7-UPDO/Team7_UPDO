import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import SaveButton from '../SaveButton';

const meta: Meta<typeof SaveButton> = {
  title: 'components/ui/SaveButton',
  component: SaveButton,
  parameters: {
    layout: 'centered',
    controls: { disable: true },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      {[40, 48, 60].map(size => (
        <SaveButtonExample key={size} size={size} />
      ))}
    </div>
  ),
};

function SaveButtonExample({ size }: { size: number }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex flex-col items-center gap-2">
      <SaveButton isSaved={saved} onToggle={() => setSaved(!saved)} size={size} />
      <p className="text-sm text-[var(--color-gray-500)]">{size}px</p>
    </div>
  );
}
