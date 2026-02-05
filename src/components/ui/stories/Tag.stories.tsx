import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Tag } from '../Tag';

const meta: Meta<typeof Tag> = {
  title: 'components/ui/Tag',
  component: Tag,
  parameters: { layout: 'padded' },
  argTypes: {
    topic: {
      control: 'radio',
      options: ['default', 'growth', 'learn', 'challenge', 'connect'],
      description: '키워드 주제 색상',
    },
    label: {
      control: 'text',
      description: '표시할 키워드 텍스트',
    },
    className: {
      table: { disable: true },
    },
  },
  args: {
    topic: 'default',
    label: '기본',
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const Playground: Story = {};

export const Gallery: Story = {
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Tag topic="default" label="기본" />
      <Tag topic="growth" label="성장" />
      <Tag topic="learn" label="학습" />
      <Tag topic="challenge" label="도전" />
      <Tag topic="connect" label="연결" />
    </div>
  ),
};
